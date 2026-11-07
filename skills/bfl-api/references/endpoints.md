---
name: endpoints
description: Complete BFL API endpoint documentation
---

# BFL API Endpoints

Complete reference for all BFL FLUX API endpoints.

## Base URLs

| Region | Endpoint                | Use Case                           |
| ------ | ----------------------- | ---------------------------------- |
| Global | `https://api.bfl.ai`    | Default, automatic failover        |
| EU     | `https://api.eu.bfl.ai` | GDPR compliance, EU data residency |
| US     | `https://api.us.bfl.ai` | US data residency                  |

**Recommendation:** Use the global endpoint (`api.bfl.ai`) unless you have specific regional requirements.

## Authentication

All requests require the `x-key` header with your API key:

```bash
x-key: YOUR_API_KEY
```

## FLUX 3 Image Endpoints

One endpoint per model handles text-to-image, editing, and multi-reference composition: the prompt decides whether to generate or edit, and there is no `mode` field.

### FLUX 3 Image

```
POST /v1/flux-3-image
```

Maximum control: bounding boxes in the prompt to place elements, pixel-exact local edits, up to 10 references, up to 4K output.

### FLUX 3 Image Klein

```
POST /v1/flux-3-image-klein
```

5.6B open-weights version of FLUX 3 Image, designed for image editing. Fast and low-cost; Klein Base supports LoRA training.

### FLUX 3 Image Parameters

| Parameter          | Type            | Required | Description                                                                                       |
| ------------------ | --------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `prompt`           | string          | Yes      | Text description or edit instruction. Bounding boxes go as a JSON list at the end of the prompt   |
| `images`           | string or array | No       | 1 to 10 reference images, each an http(s) URL or base64. The first is the image being edited      |
| `aspect_ratio`     | string          | No       | `21:9` to `9:21` (15 ratios) or `auto` (default)                                                  |
| `resolution`       | string          | No       | `768sq`, `1k` (default for text-to-image), `1.5k`, `2k`, `4k`                                     |
| `width`, `height`  | integer         | No       | Exact output size; set both. Overrides `resolution` and `aspect_ratio`                            |
| `safety_tolerance` | integer         | No       | 0 (strict) to 7, default 2                                                                        |

**FLUX 3 Image only:**

| Parameter    | Type    | Default    | Description                                                                                  |
| ------------ | ------- | ---------- | -------------------------------------------------------------------------------------------- |
| `grounding`  | boolean | `true`     | Ground the prompt with web and image search. Set `false` for invented subjects or speed      |
| `resolution` | string  | -          | Also accepts `match_input` (edits only): output keeps the first reference's size, up to 4MP  |
| `version`    | string  | `"latest"` | Endpoint version                                                                             |

**FLUX 3 Image Klein only:**

| Parameter       | Type    | Default  | Description                     |
| --------------- | ------- | -------- | ------------------------------- |
| `seed`          | integer | random   | Seed for reproducibility        |
| `steps`         | integer | 16       | Denoising steps (1 to 16)       |
| `output_format` | string  | `"jpeg"` | `"jpeg"` or `"png"`             |

> **Klein is not a drop-in swap.** Both endpoints reject unknown fields, so a FLUX 3 Image payload that sets `grounding`, `version`, or `resolution: "match_input"` returns `422` on Klein, and `seed`, `steps`, or `output_format` return `422` on FLUX 3 Image. Neither accepts `webhook_url` or `webhook_secret`. Strip model-specific fields when switching endpoints.

### FLUX 3 Image Example

```bash
curl -X POST "https://api.bfl.ai/v1/flux-3-image-klein" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Make it a winter night: snow on the roof, the lake is frozen, warm light in the windows",
    "images": ["https://example.com/cabin.jpg"]
  }'
```

Response (`cost` is in credits, 1 credit = $0.01):

```json
{
  "id": "7c7a9564-...",
  "polling_url": "https://api.us7.bfl.ai/v1/get_result?id=7c7a9564-...",
  "cost": 0.9,
  "input_mp": null,
  "output_mp": null
}
```

The API rewrites the prompt before generating; the rewritten prompt is returned in `result.prompt`. FLUX 3 Image results do not include a `seed`; Klein results do.

## FLUX.2 Text-to-Image and Image-to-Image Endpoints

### FLUX.2 [klein] 4B

```
POST /v1/flux-2-klein-4b
```

Fastest generation, 4B parameters.

### FLUX.2 [klein] 9B

```
POST /v1/flux-2-klein-9b
```

Fast generation with better quality, 9B parameters.

### FLUX.2 [max]

```
POST /v1/flux-2-max
```

Highest quality, supports grounding search.

### FLUX.2 [pro]

```
POST /v1/flux-2-pro
```

Production balanced quality and speed.

### FLUX.2 [flex]

```
POST /v1/flux-2-flex
```

Typography optimized, adjustable steps/guidance.

## FLUX.1 Endpoints

### FLUX1.1 [pro]

```
POST /v1/flux-pro-1.1
```

Text-to-image generation.

### FLUX.1 Kontext

```
POST /v1/flux-kontext
```

### FLUX.1 Kontext Max

```
POST /v1/flux-kontext-max
```

### FLUX.1 Fill

```
POST /v1/flux-fill
```

Inpainting and object removal - you can achieve inpainting and object removal with specific prompting style with FLUX.2 models for better performance.

## Common Request Parameters

### Text-to-Image (T2I)

| Parameter          | Type    | Required | Description                                  |
| ------------------ | ------- | -------- | -------------------------------------------- |
| `prompt`           | string  | Yes      | Text description (up to 32K tokens)          |
| `width`            | integer | No       | Image width (multiple of 16, max 4MP total)  |
| `height`           | integer | No       | Image height (multiple of 16, max 4MP total) |
| `seed`             | integer | No       | Random seed for reproducibility              |
| `safety_tolerance` | integer | No       | 0 (strict) to 5 (permissive), default 2      |
| `output_format`    | string  | No       | "jpeg" or "png", default "jpeg"              |
| `webhook_url`      | string  | No       | URL for async notification                   |
| `webhook_secret`   | string  | No       | Secret for webhook signature                 |

### Image-to-Image (I2I)

> **Important:** All FLUX.2 models (klein, pro, max, flex) support image-to-image editing via the `input_image` parameter. FLUX.2 is recommended over FLUX.1 Kontext for editing.

> **Preferred: Use URLs directly** - The API fetches URLs automatically, which is simpler and more convenient than downloading and encoding to base64. Both URL and base64 work, but URLs are recommended when available.

| Parameter                         | Type    | Required | Description                                                    |
| --------------------------------- | ------- | -------- | -------------------------------------------------------------- |
| `prompt`                          | string  | Yes      | Edit instruction                                               |
| `input_image`                     | string  | Yes      | **URL (preferred)** or base64 - API fetches URLs automatically |
| `input_image_2` - `input_image_8` | string  | No       | Additional reference URLs or base64                            |
| `width`                           | integer | No       | Output width                                                   |
| `height`                          | integer | No       | Output height                                                  |

### FLUX.2 [flex] Specific

| Parameter  | Type    | Default | Description             |
| ---------- | ------- | ------- | ----------------------- |
| `steps`    | integer | 50      | Inference steps (1-50)  |
| `guidance` | float   | 4.5     | Guidance scale (1.5-10) |

## Resolution Constraints

- **Minimum:** 64x64 pixels
- **Maximum:** 4MP total (width x height)
- **Multiple of:** 16 (both dimensions)

### Common Resolutions

| Aspect Ratio    | Resolution | Megapixels |
| --------------- | ---------- | ---------- |
| 1:1 (Square)    | 1024x1024  | 1.05 MP    |
| 16:9 (Wide)     | 1920x1080  | 2.07 MP    |
| 9:16 (Portrait) | 1080x1920  | 2.07 MP    |
| 4:3 (Classic)   | 1536x1152  | 1.77 MP    |
| 2:1 (Panorama)  | 2048x1024  | 2.10 MP    |

## Example Requests

### Basic T2I Request

```bash
curl -X POST "https://api.bfl.ai/v1/flux-2-pro" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene mountain landscape at golden hour",
    "width": 1024,
    "height": 1024
  }'
```

### Response

```json
{
  "id": "gen_abc123xyz",
  "polling_url": "https://api.bfl.ai/v1/get_result?id=gen_abc123xyz"
}
```

### T2I with All Options

```bash
curl -X POST "https://api.bfl.ai/v1/flux-2-max" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional headshot of a business executive",
    "width": 1024,
    "height": 1280,
    "seed": 42,
    "safety_tolerance": 2,
    "output_format": "png",
    "webhook_url": "https://your-server.com/webhook",
    "webhook_secret": "your-secret-key"
  }'
```

### I2I Request (FLUX.2 - Recommended)

Edit images using any FLUX.2 model by passing the source image URL directly:

```bash
curl -X POST "https://api.bfl.ai/v1/flux-2-klein-9b" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Change the floor color to light blue",
    "input_image": "https://example.com/room-photo.jpg"
  }'
```

For higher quality edits, use FLUX.2 [pro] or [max]:

```bash
curl -X POST "https://api.bfl.ai/v1/flux-2-pro" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Change the background to a beach sunset",
    "input_image": "https://example.com/portrait.jpg"
  }'
```

### Multi-Reference I2I (FLUX.2)

```bash
curl -X POST "https://api.bfl.ai/v1/flux-2-max" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Person from image 1 wearing outfit from image 2 in setting from image 3",
    "input_image": "https://example.com/person.jpg",
    "input_image_2": "https://example.com/outfit.jpg",
    "input_image_3": "https://example.com/location.jpg"
  }'
```

### FLUX.2 [flex] with Custom Steps

```bash
curl -X POST "https://api.bfl.ai/v1/flux-2-flex" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A poster with text \"SUMMER SALE\" in bold typography",
    "steps": 50,
    "guidance": 7.0
  }'
```

## Polling Endpoint

### Get Result

```
GET /v1/get_result?id={generation_id}
```

### Response States

```json
// Pending
{ "status": "Pending" }

// Ready
{
  "status": "Ready",
  "result": {
    "sample": "https://bfldeliveryprod.blob.core.windows.net/results/...",
    "prompt": "...",
    "seed": 1234567890
  }
}

// Error
{
  "status": "Error",
  "error": "Error description"
}
```

## Error Responses

| Status Code | Meaning          | Action             |
| ----------- | ---------------- | ------------------ |
| 400         | Bad Request      | Check parameters   |
| 401         | Unauthorized     | Verify API key     |
| 402         | Payment Required | Add credits        |
| 429         | Rate Limited     | Implement backoff  |
| 500         | Server Error     | Retry with backoff |
