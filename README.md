# BFL Skills

Official skills from Black Forest Labs for FLUX image and video generation models. These skills provide prompting guidelines and API integration patterns following the [agentskills.io](https://agentskills.io) specification.

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

# FLUX 3 video router
npx skills add black-forest-labs/skills --skill flux3-video

# FLUX 3 specialist skills
npx skills add black-forest-labs/skills --skill flux3-prompt-doctor
npx skills add black-forest-labs/skills --skill flux3-cinematic-video
npx skills add black-forest-labs/skills --skill flux3-keyframes-continuation
npx skills add black-forest-labs/skills --skill flux3-audio-dialogue
npx skills add black-forest-labs/skills --skill flux3-generate
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

### 3. flux3-video

Thin router for general FLUX 3 video requests:

- **Intent Routing** - Select only the specialist skills required for the request
- **Handoff Contract** - Preserve attached input, action, sources, invariants, delivery, audio, text, and risks
- **Minimal Context** - Avoid loading unrelated video guidance

### 4. flux3-prompt-doctor

Pre-generation diagnosis and readiness gate:

- **Requirements Triage** - Separate explicit facts, assumptions, and blocking questions
- **Input Routing** - Decide which single input, if any, the media belongs in based on what must survive
- **Feasibility Review** - Resolve contradictory camera, timing, source, audio, and text requirements
- **Verdicts** - Return `READY`, `NEEDS INFO`, or `REVISE` with a concrete next action

### 5. flux3-cinematic-video

Shot direction and motion-first prompting:

- **Shot Contracts** - Define one required action, opening, payoff, and delivery
- **Motion Hierarchy** - Coordinate subject, camera, environment, and secondary motion
- **Camera Direction** - Align framing, angle, movement, focus, and perspective
- **Controlled Variants** - Change one consequential dimension per trial

### 6. flux3-keyframes-continuation

Source-conditioned video control:

- **Keyframes** - Put images on screen at chosen frame positions, or bridge two exact endpoints
- **Reference Images and Video** - Carry a subject or cast into a new scene without showing the source
- **Video Continuation** - Continue from the observed ending of an existing clip
- **Invariant Ledgers** - Preserve identity, geometry, environment, camera, and momentum

### 7. flux3-audio-dialogue

Synchronized sound direction:

- **Dialogue and Voiceover** - Assign exact lines, visible speakers, and delivery anchors
- **Ambience and Effects** - Tie sound to locations, objects, and visible actions
- **Mix Hierarchy** - Protect foreground speech from competing layers
- **Finishing Plan** - Reserve exact sync and final mixing for deterministic post

### 8. flux3-generate

API execution and result validation:

- **Request Construction** - Build a strict request around a single attached input, validated against the live reference
- **Submission and Polling** - Track real task IDs through documented terminal states
- **Draft Enhancement** - Preserve and enhance the selected draft cache
- **Download and Validation** - Save expiring artifacts, inspect media streams, and package review evidence

## Quick Reference

### FLUX 3 Skill Routing

| Request | Skill |
| --- | --- |
| Diagnose or repair a brief | `flux3-prompt-doctor` |
| Direct a new shot from an idea | `flux3-cinematic-video` |
| Build from supplied images or video | `flux3-keyframes-continuation` |
| Direct speech, ambience, effects, or music | `flux3-audio-dialogue` |
| Submit, poll, enhance, download, or technically validate | `flux3-generate` |
| Route a general FLUX 3 video request | `flux3-video` |

### FLUX 3 Inputs

A request is a prompt plus **at most one** input field. The field you attach is the instruction — there is no generation `mode`.

| Attach | What the model does |
| --- | --- |
| *(nothing)* | Generates the clip from your text alone |
| `keyframes` | Puts your images on screen at frame positions you choose |
| `reference_images` | Keeps the subject recognizable in a new scene; the images never appear on screen |
| `reference_video` | Builds a new clip with the subjects from yours |
| `start_video` | Continues from the final frames of your clip |

`draft_enhance` is a separate mode that replays a cached draft at full quality. See [docs.bfl.ai](https://docs.bfl.ai) for current fields, limits, and endpoints.

### Model Selection

| Model          | Best For                          | Pricing               |
| -------------- | --------------------------------- | --------------------- |
| FLUX.2 [klein] | Fastest generation, real-time     | from $0.014/image     |
| FLUX.2 [pro]   | Production balanced               | from $0.03/MP         |
| FLUX.2 [flex]  | Typography/text                   | from $0.06/MP         |
| FLUX.2 [max]   | Highest quality, grounding search | from $0.07/MP         |
| FLUX.2 [dev]   | Local development                 | Free (non-commercial) |

_All FLUX.2 models support both text-to-image and image editing natively—no need for separate models. FLUX.1 models are also available._

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
