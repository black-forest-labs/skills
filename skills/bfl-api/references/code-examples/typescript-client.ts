/**
 * BFL FLUX API TypeScript Client
 *
 * A complete, production-ready TypeScript client for the BFL FLUX API.
 * Includes rate limiting, retry logic, webhook support, and async operations.
 *
 * Usage:
 *   import { BFLClient } from './bfl-client';
 *
 *   const client = new BFLClient('your-api-key');
 *   const result = await client.generate('flux-2-pro', 'A beautiful sunset');
 *   console.log(`Image URL: ${result.url}`);
 */

import * as crypto from "crypto";

// --- Types ---

export interface GenerationResult {
  id: string;
  url: string;
  width: number;
  height: number;
  raw: Record<string, unknown>;
}

export interface GenerateOptions {
  width?: number;
  height?: number;
  seed?: number;
  safetyTolerance?: number;
  outputFormat?: "png" | "jpeg";
  webhookUrl?: string;
  webhookSecret?: string;
  timeout?: number;
  steps?: number; // For flex model
  guidance?: number; // For flex model
}

export interface I2IOptions extends GenerateOptions {
  additionalImages?: string[];
}

export type Region = "global" | "eu" | "us";

// --- Errors ---

export class BFLError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = "BFLError";
  }
}

export class AuthenticationError extends BFLError {
  constructor(message: string) {
    super(message, 401, "authentication_error");
    this.name = "AuthenticationError";
  }
}

export class InsufficientCreditsError extends BFLError {
  constructor(message: string) {
    super(message, 402, "insufficient_credits");
    this.name = "InsufficientCreditsError";
  }
}

export class RateLimitError extends BFLError {
  constructor(
    message: string,
    public retryAfter: number = 5
  ) {
    super(message, 429, "rate_limit_exceeded");
    this.name = "RateLimitError";
  }
}

export class ValidationError extends BFLError {
  constructor(message: string) {
    super(message, 400, "validation_error");
    this.name = "ValidationError";
  }
}

export class GenerationError extends BFLError {
  constructor(message: string) {
    super(message, undefined, "generation_error");
    this.name = "GenerationError";
  }
}

// --- Rate Limiter ---

class Semaphore {
  private permits: number;
  private waiting: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      next?.();
    } else {
      this.permits++;
    }
  }
}

// --- Client ---

export class BFLClient {
  private static readonly BASE_URLS: Record<Region, string> = {
    global: "https://api.bfl.ai",
    eu: "https://api.eu.bfl.ai",
    us: "https://api.us.bfl.ai",
  };

  private static readonly RATE_LIMITS: Record<string, number> = {
    default: 24,
    "flux-kontext-max": 6,
  };

  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly timeout: number;
  private readonly semaphore: Semaphore;

  /**
   * Create a new BFL client.
   *
   * @param apiKey - Your BFL API key
   * @param region - API region ("global", "eu", "us")
   * @param maxConcurrent - Max concurrent requests (default: 24)
   * @param timeout - Default polling timeout in milliseconds
   */
  constructor(
    private readonly apiKey: string,
    region: Region = "global",
    maxConcurrent: number = 24,
    timeout: number = 120000
  ) {
    this.baseUrl = BFLClient.BASE_URLS[region];
    this.timeout = timeout;
    this.semaphore = new Semaphore(maxConcurrent);

    this.headers = {
      "x-key": apiKey,
      "Content-Type": "application/json",
    };
  }

  /**
   * Generate an image from a text prompt.
   */
  async generate(
    model: string,
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<GenerationResult> {
    const {
      width = 1024,
      height = 1024,
      seed,
      safetyTolerance = 2,
      outputFormat = "png",
      webhookUrl,
      webhookSecret,
      timeout = this.timeout,
      steps,
      guidance,
    } = options;

    // Validate dimensions
    this.validateDimensions(width, height);

    // Build payload
    const payload: Record<string, unknown> = {
      prompt,
      width,
      height,
      safety_tolerance: safetyTolerance,
      output_format: outputFormat,
    };

    if (seed !== undefined) payload.seed = seed;
    if (webhookUrl) payload.webhook_url = webhookUrl;
    if (webhookSecret) payload.webhook_secret = webhookSecret;
    if (steps !== undefined) payload.steps = steps;
    if (guidance !== undefined) payload.guidance = guidance;

    // Rate-limited request
    await this.semaphore.acquire();
    try {
      return await this.submitAndPoll(model, payload, timeout);
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Generate an image from another image (image-to-image).
   */
  async generateI2I(
    model: string,
    prompt: string,
    inputImage: string,
    options: I2IOptions = {}
  ): Promise<GenerationResult> {
    const { additionalImages = [], ...rest } = options;

    const payload: Record<string, unknown> = {
      prompt,
      input_image: inputImage,
    };

    // Add additional images
    additionalImages.slice(0, 7).forEach((img, i) => {
      payload[`input_image_${i + 2}`] = img;
    });

    await this.semaphore.acquire();
    try {
      return await this.submitAndPoll(model, payload, rest.timeout ?? this.timeout);
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Generate multiple images concurrently.
   */
  async generateBatch(
    model: string,
    prompts: string[],
    options: GenerateOptions = {}
  ): Promise<Array<GenerationResult | Error>> {
    const tasks = prompts.map((prompt) =>
      this.generate(model, prompt, options).catch((e) => e)
    );

    return Promise.all(tasks);
  }

  /**
   * Download a generated image.
   */
  async download(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new BFLError(`Failed to download: ${response.status}`);
    }
    return response.arrayBuffer();
  }

  private async submitAndPoll(
    model: string,
    payload: Record<string, unknown>,
    timeout: number
  ): Promise<GenerationResult> {
    const endpoint = `${this.baseUrl}/v1/${model}`;

    // Submit request
    const submitResponse = await this.requestWithRetry("POST", endpoint, payload);

    const pollingUrl = submitResponse.polling_url as string;
    const generationId =
      (submitResponse.id as string) ?? pollingUrl.split("=").pop() ?? "unknown";

    // Poll for result
    const result = await this.poll(pollingUrl, timeout);

    return {
      id: generationId,
      url: result.sample as string,
      width: (result.width as number) ?? (payload.width as number),
      height: (result.height as number) ?? (payload.height as number),
      raw: result,
    };
  }

  private async poll(
    pollingUrl: string,
    timeout: number
  ): Promise<Record<string, unknown>> {
    const startTime = Date.now();
    let delay = 1000;

    while (Date.now() - startTime < timeout) {
      const response = await this.requestWithRetry("GET", pollingUrl);

      const status = response.status as string;
      if (status === "Ready") {
        return (response.result as Record<string, unknown>) ?? response;
      } else if (status === "Error") {
        throw new GenerationError((response.error as string) ?? "Generation failed");
      }

      // Exponential backoff (cap at 5 seconds)
      await this.sleep(delay);
      delay = Math.min(delay * 1.5, 5000);
    }

    throw new Error(`Generation timed out after ${timeout}ms`);
  }

  private async requestWithRetry(
    method: string,
    url: string,
    body?: Record<string, unknown>,
    maxRetries: number = 3
  ): Promise<Record<string, unknown>> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: this.headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        return await this.handleResponse(response);
      } catch (e) {
        if (e instanceof RateLimitError) {
          console.warn(`Rate limited, waiting ${e.retryAfter}s`);
          await this.sleep(e.retryAfter * 1000 * (attempt + 1));
          lastError = e;
        } else if (e instanceof BFLError && e.statusCode && e.statusCode >= 500) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(`Server error, retrying in ${waitTime}ms`);
          await this.sleep(waitTime);
          lastError = e;
        } else {
          throw e;
        }
      }
    }

    throw lastError ?? new Error("Max retries exceeded");
  }

  private async handleResponse(response: Response): Promise<Record<string, unknown>> {
    if (response.ok) {
      return response.json();
    }

    let errorData: Record<string, unknown>;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: await response.text() };
    }

    const errorCode = (errorData.error as string) ?? "unknown";
    const message = (errorData.message as string) ?? "Unknown error";

    switch (response.status) {
      case 401:
        throw new AuthenticationError(message);
      case 402:
        throw new InsufficientCreditsError(message);
      case 429:
        const retryAfter = parseInt(response.headers.get("Retry-After") ?? "5", 10);
        throw new RateLimitError(message, retryAfter);
      case 400:
        throw new ValidationError(message);
      default:
        throw new BFLError(message, response.status, errorCode);
    }
  }

  private validateDimensions(width: number, height: number): void {
    if (width % 16 !== 0) {
      throw new ValidationError(`Width ${width} must be a multiple of 16`);
    }
    if (height % 16 !== 0) {
      throw new ValidationError(`Height ${height} must be a multiple of 16`);
    }
    if (width * height > 4_000_000) {
      throw new ValidationError(`Total pixels (${width}x${height}) exceeds 4MP limit`);
    }
    if (width < 64 || height < 64) {
      throw new ValidationError("Minimum dimension is 64 pixels");
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// --- Webhook Verification ---

/**
 * Verify a webhook signature from BFL.
 *
 * @param payload - Raw request body as string
 * @param signature - X-BFL-Signature header value
 * @param secret - Your webhook secret
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !signature.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const providedSignature = signature.slice(7); // Remove 'sha256=' prefix

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(providedSignature)
  );
}

// --- Example Usage ---

async function main() {
  const apiKey = process.env.BFL_API_KEY;
  if (!apiKey) {
    console.error("Set BFL_API_KEY environment variable");
    process.exit(1);
  }

  const client = new BFLClient(apiKey);

  console.log("Generating image...");
  const result = await client.generate("flux-2-pro", "A serene mountain landscape at golden hour", {
    width: 1024,
    height: 1024,
  });

  console.log(`Generated: ${result.url}`);
  console.log(`Image ID: ${result.id}`);
}

// Run if executed directly
main().catch(console.error);
