---
name: endpoints
description: Complete BFL API endpoint documentation
---

# BFL API Endpoints

Complete reference for all BFL FLUX API endpoints.

## Base URLs

| Region | Endpoint | Use Case |
|--------|----------|----------|
| Global | `https://api.bfl.ai` | Default, automatic failover |
| EU | `https://api.eu.bfl.ai` | GDPR compliance, EU data residency |
| US | `https://api.us.bfl.ai` | US data residency |

**Recommendation:** Use the global endpoint (`api.bfl.ai`) unless you have specific regional requirements.

## Authentication

All requests require the `x-key` header with your API key:

```bash
x-key: YOUR_API_KEY
```

## FLUX.2 Text-to-Image Endpoints

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
Image-to-image editing.

### FLUX.1 Kontext Max
```
POST /v1/flux-kontext-max
```
Advanced multi-reference editing (rate limit: 6 concurrent).

### FLUX.1 Fill
```
POST /v1/flux-fill
```
Inpainting and object removal.

## Common Request Parameters

### Text-to-Image (T2I)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text description (up to 32K tokens) |
| `width` | integer | No | Image width (multiple of 16, max 4MP total) |
| `height` | integer | No | Image height (multiple of 16, max 4MP total) |
| `seed` | integer | No | Random seed for reproducibility |
| `safety_tolerance` | integer | No | 0 (strict) to 5 (permissive), default 2 |
| `output_format` | string | No | "jpeg" or "png", default "jpeg" |
| `webhook_url` | string | No | URL for async notification |
| `webhook_secret` | string | No | Secret for webhook signature |

### Image-to-Image (I2I)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Edit instruction |
| `input_image` | string | Yes | Base64 or URL |
| `input_image_2` - `input_image_8` | string | No | Additional references |
| `width` | integer | No | Output width |
| `height` | integer | No | Output height |

### FLUX.2 [flex] Specific

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `steps` | integer | 50 | Inference steps (1-50) |
| `guidance` | float | 4.5 | Guidance scale (1.5-10) |

## Resolution Constraints

- **Minimum:** 64x64 pixels
- **Maximum:** 4MP total (width x height)
- **Multiple of:** 16 (both dimensions)

### Common Resolutions

| Aspect Ratio | Resolution | Megapixels |
|--------------|------------|------------|
| 1:1 (Square) | 1024x1024 | 1.05 MP |
| 16:9 (Wide) | 1920x1080 | 2.07 MP |
| 9:16 (Portrait) | 1080x1920 | 2.07 MP |
| 4:3 (Classic) | 1536x1152 | 1.77 MP |
| 2:1 (Panorama) | 2048x1024 | 2.10 MP |

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

### I2I Request
```bash
curl -X POST "https://api.bfl.ai/v1/flux-kontext" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Change the background to a beach sunset",
    "input_image": "https://example.com/image.jpg"
  }'
```

### Multi-Reference I2I
```bash
curl -X POST "https://api.bfl.ai/v1/flux-kontext-max" \
  -H "x-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Person from image 1 wearing outfit from image 2 in setting from image 3",
    "input_image": "base64_or_url_1",
    "input_image_2": "base64_or_url_2",
    "input_image_3": "base64_or_url_3"
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

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Verify API key |
| 402 | Payment Required | Add credits |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Retry with backoff |
