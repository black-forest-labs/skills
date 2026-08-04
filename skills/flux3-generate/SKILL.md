---
name: flux3-generate
description: Use when submitting or polling a FLUX 3 video API job. Also covers drafts, downloads, and technical validation.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video-api, generation, polling, drafts, qc
---

# FLUX 3 Generate

Execute a ready FLUX 3 video plan through the public asynchronous API, preserve expiring artifacts, and verify the returned MP4.

## When to Use

- Constructing a FLUX 3 video API payload
- Submitting and polling a generation
- Exploring draft batches and enhancing a selected draft
- Downloading expiring MP4 or draft-cache artifacts
- Diagnosing API states or technically reviewing the result

Use a creative specialist first when the prompt, source relationship, audio, or success condition is not ready.

## Preconditions

Before a generation or draft-exploration request, require:

- a `READY` brief or equivalent explicit plan;
- selected mode and matching input;
- a final prompt;
- duration, aspect ratio, resolution, and audio behavior either chosen explicitly or intentionally left at documented defaults;
- downloaded or accessible source media when the mode uses it;
- a named output path and review criterion.

Before `draft_enhance`, require only the selected `draft_cache`, its inherited request metadata for traceability, a named output path, and a review criterion. Do not ask for or resend the original generation settings.

Check that `BFL_API_KEY` exists without printing its value. Never place credentials in prompts, logs, source files, examples, or responses.

Complete when the request can be built without inventing a creative or production choice.

## Endpoint and Modes

```text
POST https://api.bfl.ai/v1/flux-3-video
```

Authenticate with the `x-key` header.

| Mode | Required generation input |
| --- | --- |
| `t2v` | `prompt` |
| `i2v` | `prompt` and `keyframes` |
| `v2v` | `prompt` and `start_video` |
| `draft_enhance` | `draft_cache` only |

The spelled-out aliases `text-to-video`, `image-continuation`, `video-continuation`, and `draft-enhance` are accepted. Normalize aliases to the canonical mode tokens in the table before validation and recordkeeping.

The schema is strict. Send only documented fields for the selected mode. Read [references/api-quick-reference.md](references/api-quick-reference.md) before constructing nontrivial keyframe, continuation, draft, or polling code.

## Execution Workflow

### 1. Build and inspect the request

Branch validation by mode.

For `draft_enhance`, require `mode` plus one valid `draft_cache` only. The cache may be a signed URL or inline base64 up to 128 MB. Reject original prompt, settings, media, `draft`, and `batch` fields because the cache already carries them.

For `t2v`, `i2v`, and `v2v`, validate:

- duration is `auto` or a whole number from 5 through 20 when supplied;
- aspect ratio and resolution use documented values when supplied;
- `generate_audio` reflects the audio plan when supplied, or its default is intentionally accepted;
- mode-specific fields do not leak into another mode;
- draft requests use HD;
- `batch` is 1–4 and appears only with `draft: true`;
- image and video inputs meet documented type and size limits.

Save the request body without secrets when reproducibility matters.

Complete when the serialized payload matches the intended mode exactly.

### 2. Submit once

The response returns a task `id` and `polling_url`. Persist both with the secret-free request metadata.

A submit failure is not a successful job. Surface the HTTP status and response body without exposing authentication headers.

Complete when a real task ID and polling URL are recorded.

### 3. Poll to a terminal state

Poll the returned URL every few seconds. Follow redirects.

- Success: `Ready`
- Stop failures: `Error`, `Request Moderated`, `Content Moderated`, `Task not found`

Do not resubmit merely because a task is still pending. Handle `429` by waiting for active work to finish; handle temporary `503` capacity with bounded backoff.

Complete when the original task reaches one documented terminal state.

### 4. Download artifacts immediately

On `Ready`, download the MP4 instead of storing only the signed result URL. Download the selected `draft_cache` when draft enhancement may follow. Signed artifacts expire.

Record the local path, request metadata, task ID, and final status. Do not publish or upload the result unless the user explicitly requests that separate action.

Complete when the expected files exist locally and are non-empty.

### 5. Explore drafts without losing causality

Draft mode can return up to four variants of one plan. Compare variants against the same success criterion, preserve the chosen cache, then send only that cache through `draft_enhance`.

Between prompt reruns, change one consequential dimension at a time. After two structurally similar misses, return to `flux3-prompt-doctor`, `flux3-cinematic-video`, or `flux3-keyframes-continuation` when available instead of accumulating adjectives.

Complete when the selected full-quality render descends from its own chosen draft cache.

### 6. Run technical validation

Verify with media-inspection tooling when available:

- container opens without errors;
- video stream exists and duration matches intent;
- resolution and aspect are expected;
- audio stream exists when requested and is absent when disabled;
- file size is non-zero and the full clip decodes.

Technical validity does not imply creative success.

### 7. Package evidence for creative review

Preserve the secret-free request, task ID, downloaded artifacts, stream facts, and any frame or audio inspection outputs. Record observed defects without turning technical validity into creative approval.

Hand creative review to the relevant installed specialist: `flux3-cinematic-video` for action and camera, `flux3-keyframes-continuation` for source continuity, and `flux3-audio-dialogue` for speech and sound. If those skills are unavailable, return the evidence with a self-contained review handoff instead of impersonating their criteria.

Complete when the technical verdict and review evidence are recorded.

## Common Pitfalls

1. **Submitting an unresolved brief.** Return to the specialist that owns the missing decision.
2. **Mixing fields across modes.** Build from the selected mode's schema.
3. **Polling forever.** Stop on every documented terminal state.
4. **Saving only result URLs.** Download MP4 and draft cache immediately.
5. **Enhancing the wrong draft.** Preserve variant-to-cache identity.
6. **Calling a decodable file creatively approved.** Technical validation and creative review are separate gates.
7. **Leaking API keys.** Keep authentication in environment variables and headers only.

## Verification Checklist

- [ ] Preconditions are explicit and ready
- [ ] Payload matches one mode and passes documented constraints
- [ ] Task ID and polling URL come from a real submission
- [ ] Polling ends only on a documented terminal state
- [ ] MP4 and selected draft cache are downloaded before expiry
- [ ] Draft enhancement uses the chosen cache
- [ ] Container, streams, duration, resolution, and audio are checked
- [ ] Technical verdict and creative-review handoff are recorded
- [ ] Credentials never appear in artifacts or output

## Public References

- [FLUX 3 API reference](https://docs.bfl.ai/api-reference/flux3)
- [FLUX 3 video overview](https://docs.bfl.ai/flux_3/flux3_video)
- [FLUX 3 video prompting overview](https://docs.bfl.ai/guides/prompting_video_overview)
