# BFL Skills

Official skills from Black Forest Labs for FLUX image and video generation models. These skills provide prompting guidelines and API integration patterns following the [agentskills.io](https://agentskills.io) specification.

## Installation

```bash
npx skills add black-forest-labs/skills
```

Or install individual skills:

```bash
# FLUX best practices only
npx skills add black-forest-labs/skills --skill flux-image-best-practices

# API integration only
npx skills add black-forest-labs/skills --skill bfl-api

# FLUX 3 video router
npx skills add black-forest-labs/skills --skill flux-3-video

# FLUX 3 specialist skills
npx skills add black-forest-labs/skills --skill flux-3-prompt-doctor
npx skills add black-forest-labs/skills --skill flux-3-cinematic-inserts
npx skills add black-forest-labs/skills --skill flux-3-keyframes-continuation
npx skills add black-forest-labs/skills --skill flux-3-audio-dialogue
npx skills add black-forest-labs/skills --skill flux-3-generate
```

### Claude Code Plugin

You can also add this as a plugin marketplace in Claude Code:

```bash
/plugin marketplace add black-forest-labs/skills
# Image skills: bfl-api and flux-image-best-practices
/plugin install flux-image-best-practices@black-forest-labs
# FLUX 3 video skills
/plugin install flux-3-video@black-forest-labs
```

## Skills Included

### 1. flux-image-best-practices

Comprehensive guide for all FLUX models including:

- **Core Principles** - Universal prompting best practices
- **Model-Specific Guides** - FLUX.2 ([klein], [max], [pro], [flex], [dev]) and FLUX.1
- **T2I Prompting** - Text-to-image patterns and techniques
- **I2I Prompting** - Image-to-image editing with FLUX.2 reference images
- **JSON Structured Prompting** - Complex scene composition
- **Hex Color Prompting** - Precise color specification (#RRGGBB)
- **Typography** - Text rendering and font styles
- **Multi-Reference Editing** - Using multiple reference images
- **Negative Prompt Alternatives** - Positive replacements (FLUX doesn't support negatives)
- **Model Selection Guide** - Choosing the right model for your use case

### 2. bfl-api

API integration guide covering:

- **Endpoints** - Complete endpoint documentation for all FLUX.2 and FLUX.1 models
- **Polling Patterns** - Async polling with exponential backoff
- **Rate Limiting** - Handling 24 concurrent requests
- **Error Handling** - Error codes and recovery strategies
- **Webhook Integration** - Production webhook setup and verification
- **Code Examples** - Python and TypeScript clients

### 3. The FLUX 3 video suite

Six skills that hand off to each other; install only what you need:

- `flux-3-video` - thin router across the five specialists
- `flux-3-prompt-doctor` - readiness verdicts (`READY` / `NEEDS INFO` / `REVISE`) before generation
- `flux-3-cinematic-inserts` - shot craft for text-only generation, with a field guide of proven concepts
- `flux-3-keyframes-continuation` - keyframes (`i2v`) and video continuation (`v2v`)
- `flux-3-audio-dialogue` - dialogue, voiceover, ambience, effects, music
- `flux-3-generate` - request construction, polling, drafts, downloads, validation

## Quick Reference

### FLUX 3 Skill Routing

| Request | Skill |
| --- | --- |
| Diagnose or repair a brief | `flux-3-prompt-doctor` |
| Write a text-to-video prompt for a new shot | `flux-3-cinematic-inserts` |
| Build from supplied images or video | `flux-3-keyframes-continuation` |
| Direct speech, ambience, effects, or music | `flux-3-audio-dialogue` |
| Submit, poll, enhance, download, or technically validate | `flux-3-generate` |
| Route a general FLUX 3 video request | `flux-3-video` |

### FLUX 3 Modes

Every request names its `mode` and carries the matching media field:

| `mode` | Media field | What the model does |
| --- | --- | --- |
| `t2v` | none | Generates the clip from your text alone |
| `i2v` | `keyframes` | Puts your images on screen, pixel-exact, as pinned frames |
| `v2v` | `start_video` | Continues from the final frames of your clip |
| `draft_enhance` | `draft_cache` | Replays a chosen draft at full quality |

### Draft, then commit

A full render takes several minutes. Adding `draft: true` returns a fast, low-step preview plus a `draft_cache`, so you can settle concept and composition cheaply before paying for finish. `draft_enhance` then replays that cache at full quality (same prompt and settings), so the final render is the shot you approved rather than a fresh attempt.

Judge a draft on event legibility, composition, and continuity. Softness and coarse texture are artifacts of low-step rendering and resolve at full quality.

See [docs.bfl.ai](https://docs.bfl.ai) for current fields, limits, and endpoints.

### Model Selection

| Model          | Best For                          | Pricing               |
| -------------- | --------------------------------- | --------------------- |
| FLUX.2 [klein] | Fastest generation, real-time     | from $0.014/image     |
| FLUX.2 [pro]   | Production balanced               | from $0.03/MP         |
| FLUX.2 [flex]  | Typography/text                   | from $0.06/MP         |
| FLUX.2 [max]   | Highest quality, grounding search | from $0.07/MP         |
| FLUX.2 [dev]   | Local development                 | Free (non-commercial) |

_All FLUX.2 models support both text-to-image and image editing natively, no need for separate models. FLUX.1 models are also available._

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
    if data["status"] == "Ready":
        print(f"Result: {data['result']}")  # Expires in 10 min
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
