---
name: bfl-api
description: BFL FLUX API integration guide covering endpoints, async polling patterns, rate limiting, error handling, webhooks, and regional endpoints with Python and TypeScript code examples.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, bfl, api, integration, webhooks, rate-limiting
---

# BFL API Integration Guide

Use this skill when integrating BFL FLUX APIs into applications for image generation, editing, and processing.

## When to Use

- Setting up BFL API client
- Implementing async polling patterns
- Handling rate limits and errors
- Configuring webhooks for production
- Selecting regional endpoints
- Building production-ready integrations

## Quick Reference

### Base Endpoints

| Region | Endpoint | Use Case |
|--------|----------|----------|
| Global | `https://api.bfl.ai` | Default, automatic failover |
| EU | `https://api.eu.bfl.ai` | GDPR compliance |
| US | `https://api.us.bfl.ai` | US data residency |

### Model Endpoints

| Model | Path |
|-------|------|
| FLUX.2 [klein] 4B | `/v1/flux-2-klein-4b` |
| FLUX.2 [klein] 9B | `/v1/flux-2-klein-9b` |
| FLUX.2 [max] | `/v1/flux-2-max` |
| FLUX.2 [pro] | `/v1/flux-2-pro` |
| FLUX.2 [flex] | `/v1/flux-2-flex` |
| FLUX.1 Kontext | `/v1/flux-kontext` |
| FLUX.1 Kontext Max | `/v1/flux-kontext-max` |

### Rate Limits

| Tier | Concurrent Requests |
|------|---------------------|
| Standard (most endpoints) | 24 |
| Kontext-max | 6 |

### Key Behaviors

- **Polling**: Response includes `polling_url` for async results
- **URL Expiration**: Result URLs expire after 10 minutes
- **Webhook Support**: Configure `webhook_url` for production workloads

## API Key Setup

**Required**: The `BFL_API_KEY` environment variable must be set before using the API.

### Quick Check

```bash
echo $BFL_API_KEY
```

### If Not Set

1. **Get a key**: Go to https://dashboard.bfl.ai/get-started → Click **"Create Key"** → Select organization
2. **Save to `.env`** (recommended for persistence):
   ```bash
   echo 'BFL_API_KEY=bfl_your_key_here' >> .env
   echo '.env' >> .gitignore  # Don't commit secrets
   ```

See [references/api-key-setup.md](references/api-key-setup.md) for detailed setup instructions.

## Authentication

```bash
x-key: YOUR_API_KEY
```

## Basic Request Flow

```
1. POST request to model endpoint
   └─> Response: { "polling_url": "..." }

2. GET polling_url (repeat until complete)
   └─> Response: { "status": "Pending" | "Ready" | "Error", ... }

3. When Ready, download result URL
   └─> URL expires in 10 minutes - download immediately
```

## References

- [references/api-key-setup.md](references/api-key-setup.md) - **API key creation and configuration**
- [references/endpoints.md](references/endpoints.md) - Complete endpoint documentation
- [references/polling-patterns.md](references/polling-patterns.md) - Async polling implementation
- [references/rate-limiting.md](references/rate-limiting.md) - Rate limit handling strategies
- [references/error-handling.md](references/error-handling.md) - Error codes and recovery
- [references/webhook-integration.md](references/webhook-integration.md) - Webhook setup and security

### Code Examples

> **Note:** cURL examples are preferred by default as they work universally without requiring Python or Node.js. Use language-specific clients when building production applications.

- [references/code-examples/curl-examples.sh](references/code-examples/curl-examples.sh) - **cURL examples (recommended)**
- [references/code-examples/python-client.py](references/code-examples/python-client.py) - Python client
- [references/code-examples/typescript-client.ts](references/code-examples/typescript-client.ts) - TypeScript client

## Quick Start Example

### 1. Submit Generation Request

```bash
curl -s -X POST "https://api.bfl.ai/v1/flux-2-pro" \
  -H "x-key: $BFL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A serene mountain landscape at sunset", "width": 1024, "height": 1024}'
```

Response:
```json
{"id": "abc123", "polling_url": "https://api.bfl.ai/v1/get_result?id=abc123"}
```

### 2. Poll for Result

```bash
curl -s "POLLING_URL" -H "x-key: $BFL_API_KEY"
```

Response when ready:
```json
{"status": "Ready", "result": {"sample": "https://...", "seed": 1234}}
```

### 3. Download Image

```bash
curl -s -o output.png "IMAGE_URL"
```

> **Tip:** Result URLs expire in 10 minutes. Download immediately after status becomes `Ready`.
