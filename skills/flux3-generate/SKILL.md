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

There is no generation `mode`. A request is a prompt plus **at most one** input field,
and the field is the instruction:

| Input | What the model does |
| --- | --- |
| *(none)* | Generates the clip from your text alone |
| `keyframes` | Puts your images on screen, pixel for pixel, at frame positions you choose |
| `reference_images` | Keeps the subject recognizable in a new scene; the images never appear on screen |
| `reference_video` | Builds a new clip with the subjects from yours |
| `start_video` | Continues from the final frames of your clip |

- Two input fields, or any field the API does not know: `422`. `prompt` is the only
  required field; everything else has a working default.
- Error messages label behaviors with short codes (`t2v`, `i2v`, `k2v`, `ir2v`, `vr2v`,
  `f2v`): diagnostics, not request parameters.
- `draft_enhance` is the one real mode: it replays a cached draft at full quality and
  takes no other generation fields.
- The faster text-only endpoint rejects input fields; pick the endpoint by whether
  media is attached.
- Constraints couple (a video input at higher resolution may cap duration): read the
  constraints section rather than assuming fields are independent.
- A two-image morph needs an explicit whole-number `duration`, or the frames read as a
  storyboard. Media travels as a public URL or inline base64. Record `seed` when the
  run must be reproducible.

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
   follow), plus task ID, seed, and status.
4. **Validate**: container decodes, duration/resolution/aspect match intent, audio
   present exactly when requested. Technical validity is not creative approval; hand
   review to the specialist that owns it.

## Drafts

Add `draft: true` while a concept is unproven: a fast low-step preview plus a
`draft_cache` costs far less than a full render. Judge a draft on event legibility,
composition, and continuity; softness is the low-step trade and resolves at full
quality. Enhance only the chosen cache (it replays the same prompt, seed, and settings,
so preserve draft-to-cache identity when several are in play). Draft coverage varies by
input field; the reference says which, and a `422` will tell you otherwise.

Between reruns change one consequential dimension. After two structurally similar
misses, return to the creative skill instead of accumulating adjectives.

## References

- [references/api-quick-reference.md](references/api-quick-reference.md)
