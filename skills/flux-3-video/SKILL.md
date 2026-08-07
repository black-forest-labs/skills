---
name: flux-3-video
description: Use when routing a general FLUX 3 video request. Select only the specialists needed for diagnosis, direction, audio, or execution.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video-generation, routing
---

# FLUX 3 Video Router

Route a request to the smallest set of specialists that can complete it. When the request
already names one narrow job, use that specialist directly.

| User intent | Skill |
| --- | --- |
| Diagnose or repair a brief before generation | `flux-3-prompt-doctor` |
| Write a text-to-video prompt for a new shot | `flux-3-cinematic-inserts` |
| Build from supplied images or video | `flux-3-keyframes-continuation` |
| Direct dialogue, voiceover, ambience, effects, or music | `flux-3-audio-dialogue` |
| Submit, poll, enhance, download, or technically review | `flux-3-generate` |

Default sequence, skipping completed stages:

```text
Prompt Doctor (until READY; owns the shot-structure decision)
  → Cinematic Inserts OR Keyframes & Continuation (one, chosen by whether
    supplied media must constrain the result)
  → Audio & Dialogue (only when sound matters)
  → Generate (only when execution is requested)
```

Draft before committing anything unproven: a full render takes minutes, and the chosen
draft replays at full quality.

A handoff between skills carries: outcome, the route (`mode` plus its media field:
`t2v`, `i2v`/`keyframes`, `v2v`/`start_video`, or `draft_enhance`/`draft_cache`), the
one required action, source roles, invariants, delivery (duration, aspect, resolution,
shot structure), camera, audio, text strategy, and risks. It is complete when the
receiving skill can act without inventing a consequential choice.

Deterministic requirements (exact typography, frame-accurate sync, final mixing) need an
explicit post-production plan, not a generation attempt.

Reference: [docs.bfl.ai](https://docs.bfl.ai)
