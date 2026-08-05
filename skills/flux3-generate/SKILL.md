---
name: flux3-generate
description: Use when submitting or polling a FLUX 3 video API job. Also covers drafts, downloads, and technical validation.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video-api, generation, polling, drafts, qc
---

# FLUX 3 Generate

Execute a ready plan through the asynchronous API, preserve expiring artifacts, and
verify the MP4. Read the [FLUX 3 API reference](https://docs.bfl.ai) before building a
request; it is authoritative wherever this skill disagrees. Authenticate with the
`x-key` header from `BFL_API_KEY`; check the variable exists without printing it, and
never put keys in prompts, logs, or saved request bodies.

## Request shape

Every request names its `mode` (required, exact strings) and carries the matching media
field:

| `mode` | Media field | What the model does |
| --- | --- | --- |
| `t2v` | none | Generates the clip from your text alone |
| `i2v` | `keyframes` (required) | Puts your images on screen, pixel for pixel, as pinned frames |
| `v2v` | `start_video` (required) | Continues from the final frames of your clip |
| `draft_enhance` | `draft_cache` (required) | Replays a cached draft at full quality; accepts no other fields, not even `prompt` |

- The schema is strict: any field it does not know returns a `422` naming it
  (`Extra inputs are not permitted`). A missing required field 422s the same way.
- Settings on the generating modes: `aspect_ratio` (`auto`, `21:9`, `2:1`, `16:9`,
  `4:3`, `1:1`, `3:4`, `9:16`), `duration` (integer 5-20 or `"auto"`), `resolution`
  (`hd` or `fhd`), `generate_audio` (bool), `draft` (bool), `version`.
- Constraints couple (a video input at higher resolution may cap duration): read the
  reference rather than assuming fields are independent.
- Three or more bare keyframes, and all `[seconds, image]` timestamped keyframes, need
  an integer `duration`. Media travels as a public URL or inline base64; keyframe
  images are at least 256x256.

## Run a job

1. **Submit once.** Persist the returned task `id` and `polling_url` with the
   secret-free request.
2. **Poll to a terminal state**, every few seconds, `x-key` header, following
   redirects. Planning time on a complex brief is normal, not a stall. Moderated,
   failed, and unknown tasks never later become ready; stop on any terminal state.
   `429` means your org's concurrency is full: wait for an active task, don't
   retry-loop. `503`: bounded backoff.
3. **Download immediately.** Signed result and `draft_cache` URLs expire a couple of
   hours after the result is ready. Save the MP4 (and the cache when enhancement may
   follow), plus task ID and status.
4. **Validate**: container decodes, duration/resolution/aspect match intent, audio
   present exactly when requested. Technical validity is not creative approval; hand
   review to the specialist that owns it.

## Drafts

Add `draft: true` while a concept is unproven: a fast low-step preview plus a
`draft_cache` costs far less than a full render. Judge a draft on event legibility,
composition, and continuity; softness is the low-step trade and resolves at full
quality. Enhance only the chosen cache (it replays the same generation, so preserve
draft-to-cache identity when several are in play).

Between reruns change one consequential dimension. After two structurally similar
misses, return to the creative skill instead of accumulating adjectives.

## References

- [references/api-quick-reference.md](references/api-quick-reference.md)
