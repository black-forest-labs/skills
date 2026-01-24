# BFL Skills

Official skills from Black Forest Labs for FLUX image generation models. These skills provide prompting guidelines and API integration patterns following the [agentskills.io](https://agentskills.io) specification.

## Installation

```bash
npx skills add black-forest-labs/skills
```

Or install individual skills:

```bash
# FLUX best practices only
npx skills add black-forest-labs/skills --skill flux-best-practices

# API integration only
npx skills add black-forest-labs/skills --skill bfl-api
```

### Claude Code Plugin

You can also add this as a plugin marketplace in Claude Code:

```bash
/plugin marketplace add black-forest-labs/skills
/plugin install flux-best-practices@black-forest-labs
```

## Skills Included

### 1. flux-best-practices

Comprehensive guide for all FLUX models including:

- **Core Principles** - Universal prompting best practices
- **Model-Specific Guides** - FLUX.2 (klein, max, pro, flex, dev) and FLUX.1 (pro, Kontext, Fill)
- **T2I Prompting** - Text-to-image patterns and techniques
- **I2I Prompting** - Image-to-image editing with Kontext
- **JSON Structured Prompting** - Complex scene composition
- **Hex Color Prompting** - Precise color specification (#RRGGBB)
- **Typography** - Text rendering and font styles
- **Multi-Reference Editing** - Using multiple reference images
- **Negative Prompt Alternatives** - Positive replacements (FLUX doesn't support negatives)
- **Model Selection Guide** - Choosing the right model for your use case

### 2. bfl-api

API integration guide covering:

- **Endpoints** - Complete endpoint documentation for all models
- **Polling Patterns** - Async polling with exponential backoff
- **Rate Limiting** - Handling 24 concurrent (6 for Kontext Max)
- **Error Handling** - Error codes and recovery strategies
- **Webhook Integration** - Production webhook setup and verification
- **Code Examples** - Python and TypeScript clients

## Quick Reference

### Model Selection

| Use Case            | Recommended Model |
| ------------------- | ----------------- |
| Fastest generation  | FLUX.2 [klein]    |
| Highest quality     | FLUX.2 [max]      |
| Production balanced | FLUX.2 [pro]      |
| Typography/text     | FLUX.2 [flex]     |
| Image editing       | FLUX.1 Kontext    |
| Inpainting          | FLUX.1 Fill       |

### Prompt Structure

```
[Subject] + [Action] + [Style] + [Context] + [Lighting] + [Technical]
```

### Core Rules

1. **NO negative prompts** - FLUX doesn't support them; describe what you want
2. **Be specific** - More detail yields better results
3. **Use natural language** - Prose style works best
4. **Specify lighting** - Has the biggest impact on quality
5. **Quote text** - Use "quoted text" for typography
6. **Hex colors** - Use #RRGGBB with color names

### API Quick Start

```python
import requests
import time

API_KEY = "your-api-key"
BASE_URL = "https://api.bfl.ai"

# Submit request
response = requests.post(
    f"{BASE_URL}/v1/flux-2-pro",
    headers={"x-key": API_KEY},
    json={"prompt": "A serene mountain landscape"}
)
polling_url = response.json()["polling_url"]

# Poll for result
while True:
    result = requests.get(polling_url, headers={"x-key": API_KEY})
    data = result.json()
    if data["status"] == "completed":
        print(f"Image: {data['result']['url']}")  # Expires in 10 min
        break
    time.sleep(2)
```

## Documentation

- [BFL Documentation](https://docs.bfl.ai)
- [API Reference](https://docs.bfl.ai/api)
- [Prompting Guides](https://docs.bfl.ai/guides)

## License

MIT

## Author

[Black Forest Labs](https://blackforestlabs.ai)
