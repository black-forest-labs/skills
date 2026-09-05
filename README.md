<h1 align="center">BFL Skills</h1>

<h4 align="center">Official <a href="https://blackforestlabs.ai">Black Forest Labs</a> skills for FLUX image and video generation.</h4>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#whats-inside">What's inside</a> •
  <a href="#flux-3-quick-reference">FLUX 3 reference</a> •
  <a href="#flux-image-quick-reference">Image reference</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#license">License</a>
</p>

---

Each skill teaches your coding agent how to prompt a FLUX model well and drive the [BFL API](https://docs.bfl.ai) correctly, following the [agentskills.io](https://agentskills.io) specification.

Every clip in the reel below came out of FLUX 3 in one request, sound and all: a night-market conversation in Thai, a honey macro, a paper boat in stop motion, sparklers on Super 8, rain in a noir alley.

<p align="center">
  <a href="https://cdn.sanity.io/files/2gpum2i6/production/1e6e576489baa4e734bbae4cb62dcd383151e030.mp4"><img src="https://cdn.sanity.io/images/2gpum2i6/production/c7ef05daf120891bdc96e5e2a9c2b9947d206d65-1920x1088.jpg?w=600" alt="FLUX 3 style reel: five styles, one model, audio on every shot"></a>
</p>

## Installation

Everything at once:

```bash
npx skills add black-forest-labs/skills
```

Or start with one skill and add specialists as you need them:

```bash
# FLUX 3 video: the router pulls in the right specialist per request
npx skills add black-forest-labs/skills --skill flux-3-video

# General FLUX 3 prompt structure and mode guidance
npx skills add black-forest-labs/skills --skill flux-3-prompting

# Image prompting for every FLUX model
npx skills add black-forest-labs/skills --skill flux-image-best-practices

# BFL API integration (polling, webhooks, error handling)
npx skills add black-forest-labs/skills --skill bfl-api
```

<details>
<summary>Install individual FLUX 3 specialists</summary>

```bash
npx skills add black-forest-labs/skills --skill flux-3-prompt-doctor
npx skills add black-forest-labs/skills --skill flux-3-cinematic-inserts
npx skills add black-forest-labs/skills --skill flux-3-keyframes-continuation
npx skills add black-forest-labs/skills --skill flux-3-audio-dialogue
npx skills add black-forest-labs/skills --skill flux-3-generate
npx skills add black-forest-labs/skills --skill flux-3-archival-formats
npx skills add black-forest-labs/skills --skill flux-3-product-ads
```

</details>

### Claude Code plugin

```bash
/plugin marketplace add black-forest-labs/skills
# Image skills
/plugin install flux-image-best-practices@black-forest-labs
# FLUX 3 video suite
/plugin install flux-3-video@black-forest-labs
```

## What's inside

| Skill | What it teaches your agent |
| --- | --- |
| `flux-image-best-practices` | Prompting for every FLUX model: T2I and I2I patterns, JSON structured prompts, hex colors, typography, multi-reference editing, model selection |
| `bfl-api` | The BFL API end to end: endpoints, async polling, rate limits, error recovery, webhooks, Python and TypeScript clients |
| `flux-3-video` (suite, below) | Video generation with native audio, from a single shot to a finished product ad |

### The FLUX 3 video suite

Nine skills that hand off to each other. Install the router alone and it names the specialist a request needs; install only the skills you use.

| Skill | Use it to |
| --- | --- |
| `flux-3-video` | Route a general FLUX 3 request to the right specialist |
| `flux-3-prompting` | Choose a mode and write a clear general video prompt |
| `flux-3-prompt-doctor` | Get a readiness verdict (`READY` / `NEEDS INFO` / `REVISE`) before spending a generation |
| `flux-3-cinematic-inserts` | Write text-to-video prompts with real shot craft, from a field guide of proven concepts |
| `flux-3-keyframes-continuation` | Build from your own images (`i2v`) or continue a clip (`v2v`) |
| `flux-3-audio-dialogue` | Direct speech, voiceover, ambience, effects, and music |
| `flux-3-generate` | Construct requests, poll, download, and validate the result |
| `flux-3-archival-formats` | Give a shot a period look by naming the format: Super 8, VHS, 16mm, Hi8 |
| `flux-3-product-ads` | Assemble a finished product ad: voiceover, action-to-word sync, QC gates |

## FLUX 3 quick reference

### Modes

Every request names its `mode` and carries the matching media field:

| `mode` | Media field | What the model does |
| --- | --- | --- |
| `t2v` | none | Generates the clip from your text alone |
| `i2v` | `keyframes` | Puts your images on screen, pixel-exact, as pinned frames |
| `v2v` | `start_video` | Continues from the final frames of your clip |
| `draft_enhance` | `draft_cache` | Replays a chosen draft at full quality |

### Draft, then commit

A full render takes several minutes. Adding `draft: true` returns a fast, low-step preview plus a `draft_cache`, so you can settle concept and composition cheaply before paying for finish. `draft_enhance` then replays that cache at full quality with the same prompt and settings, so the final render is the shot you approved rather than a fresh attempt.

Judge a draft on event legibility, composition, and continuity. Softness and coarse texture are artifacts of low-step rendering and resolve at full quality.

## FLUX image quick reference

Four FLUX.2 [max] generations, one prompt each, no retries. Clockwise from top left: exact quoted typography, hex-specified colors (`#2F5D50`, `#E8A13D`, `#F2EDE4`), flat-vector illustration, photoreal macro detail.

<table>
  <tr>
    <td><img src="https://cdn.sanity.io/images/2gpum2i6/production/00787272007afd69df1dd1098ea898639e8d7171-1920x1088.jpg?w=800" alt="Letterpress storefront with exact quoted lettering: INK & QUARREL, EST. 1962 - FINE PRINTING"></td>
    <td><img src="https://cdn.sanity.io/images/2gpum2i6/production/4a4555f9ff1a03fea72d57b51ff0173554060a39-1920x1088.jpg?w=800" alt="Ceramic pour-over set with hex-specified green, amber, and off-white palette"></td>
  </tr>
  <tr>
    <td><img src="https://cdn.sanity.io/images/2gpum2i6/production/a642526cd6e434a09a014efafeb5e9e515057807-1920x1088.jpg?w=800" alt="Photoreal beekeeper close-up with bees in flight at golden hour"></td>
    <td><img src="https://cdn.sanity.io/images/2gpum2i6/production/921b94de38e77ef516f71442c1ccd245db9fb6a9-1920x1088.jpg?w=800" alt="Isometric flat-vector cutaway of a lighthouse interior"></td>
  </tr>
</table>

### Model selection

| Model          | Best for                          | Pricing               |
| -------------- | --------------------------------- | --------------------- |
| FLUX.2 [klein] | Fastest generation, real-time     | from $0.014/image     |
| FLUX.2 [pro]   | Production balanced               | from $0.03/MP         |
| FLUX.2 [flex]  | Typography/text                   | from $0.06/MP         |
| FLUX.2 [max]   | Highest quality, grounding search | from $0.07/MP         |
| FLUX.2 [dev]   | Local development                 | Free (non-commercial) |

All FLUX.2 models handle both text-to-image and image editing natively. FLUX.1 models are also available.

### Prompt structure

```
[Subject] + [Action] + [Style] + [Context] + [Lighting] + [Technical]
```

### Core rules

1. **No negative prompts.** FLUX doesn't support them; describe what you want instead.
2. **Be specific.** More detail yields better results.
3. **Use natural language.** Prose beats keyword lists.
4. **Specify lighting.** It has the biggest impact on quality.
5. **Quote text.** Use "quoted text" for typography.
6. **Hex colors.** Use #RRGGBB alongside color names.

### API quick start

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
