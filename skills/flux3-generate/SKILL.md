---
name: flux3-generate
description: Use when submitting or polling a FLUX 3 video API job. Also covers drafts, downloads, and technical validation.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video-api, generation, polling, drafts, qc
---

# FLUX 3 Generate

Execute a ready FLUX 3 video plan through the asynchronous API, preserve expiring artifacts, and verify the returned MP4.

## When to Use

- Constructing a FLUX 3 video API request
- Submitting and polling a generation
- Exploring drafts and rendering a chosen draft at full quality
- Downloading expiring MP4 or draft-cache artifacts
- Diagnosing API states or technically reviewing the result

Use a creative specialist first when the prompt, source relationship, audio, or success condition is not ready.

## Read the Live Reference First

Endpoint paths, field names, enum values, and size limits move. Read the [FLUX 3 API reference](https://docs.bfl.ai) before constructing or validating a request, and treat it as authoritative wherever it disagrees with this skill.

This skill covers what holds steady: which input expresses which intent, and how to drive a job to a verified result.

## What You Attach Decides What Happens

There is no generation `mode` field. Every request is a prompt plus **at most one** input field, and the field you choose is the instruction:

| Input | What the model does |
| --- | --- |
| *(none)* | Generates the clip from your text alone |
| `keyframes` | Puts your images on screen, pixel for pixel, at frame positions you choose |
| `reference_images` | Keeps the subject recognizable in a new scene; the images never appear on screen |
| `reference_video` | Builds a new clip with the subjects from yours |
| `start_video` | Continues from the final frames of your clip |

Sending two input fields returns a `422` listing the alternatives. Error messages label these behaviors with short codes such as `t2v`, `i2v`, `k2v`, `ir2v`, `vr2v`, and `f2v` — diagnostic labels, not request parameters.

`draft_enhance` is the one real mode. It replays a cached draft at full quality and takes no other generation fields.

The schema is strict: any field the API does not recognize returns `422`. `prompt` is the only required field; everything else has a working default, so a bare prompt is a valid request.

## Choose the Endpoint

FLUX 3 exposes more than one endpoint, and they differ in what they accept — the faster checkpoint is text-only and rejects input fields. Confirm current paths and capabilities in the API reference, then pick by whether the request attaches media.

Authenticate with the `x-key` header. Check that `BFL_API_KEY` exists without printing its value. Never place credentials in prompts, logs, source files, examples, or responses.

## Preconditions

Before a generation or draft request, require:

- a `READY` brief or equivalent explicit plan;
- a final prompt;
- the chosen input field and its media, or a deliberate text-only request;
- duration, aspect ratio, resolution, and audio behavior either chosen explicitly or intentionally left at documented defaults;
- a named output path and review criterion.

Before `draft_enhance`, require only the selected `draft_cache`, a named output path, and a review criterion. Do not ask for or resend the original prompt or settings.

Complete when the request can be built without inventing a creative or production choice.

## Execution Workflow

### 1. Build and inspect the request

Validate against the live schema, not from memory. The checks that stay true:

- exactly zero or one input field is present;
- `duration` is `auto` or a whole number inside the documented range;
- `aspect_ratio` and `resolution` use documented values when supplied;
- `generate_audio` reflects the audio plan, or its default is intentionally accepted;
- media meets documented type and size limits, supplied as a public URL or inline base64;
- a two-image morph carries an explicit whole-number duration, or the images are treated as a storyboard instead;
- `seed` is recorded when the run must be reproducible.

Watch for constraints that couple fields — a video input at higher resolution may cap duration below the general maximum. Read the constraints section of the reference rather than assuming each field is independent.

Save the request body without secrets when reproducibility matters.

Complete when the serialized payload carries one intent and no unknown fields.

### 2. Submit once

The response returns a task `id` and `polling_url`. Persist both with the secret-free request metadata.

A submit failure is not a successful job. Surface the HTTP status and response body without exposing authentication headers.

Complete when a real task ID and polling URL are recorded.

### 3. Poll to a terminal state

Poll the returned URL every few seconds with the `x-key` header, and follow redirects — polling and download hosts may redirect to regional endpoints.

Status advances through a planning stage before generation starts. Time spent planning is normal on a complex brief, not a stall. Generations take several minutes; build the integration around polling or a `webhook_url` rather than blocking on the response.

Stop on any terminal state. Alongside success, a task can end moderated, failed, or unknown; none of those will later become ready. Do not resubmit merely because a task is still running.

Handle `429` by waiting for one of your active generations to finish — concurrency limits are per organization and per endpoint, so a retry loop only burns quota. Handle `503` capacity with bounded backoff.

Complete when the original task reaches one documented terminal state.

### 4. Download artifacts immediately

Signed result and draft-cache URLs expire a couple of hours after the result is ready, and results are not long-term storage. On success, download the MP4 rather than storing only the URL. Download the `draft_cache` when enhancement may follow.

Record the local path, request metadata, task ID, seed, and final status. Do not publish or upload the result unless the user explicitly requests that separate action.

Complete when the expected files exist locally and are non-empty.

### 5. Explore drafts without losing causality

Adding `draft: true` returns a fast low-step preview plus a `draft_cache`: an encrypted bundle pinning the final prompt, seed, and settings for that generation. Compare drafts against the same success criterion, preserve the chosen cache, then send only that cache through `draft_enhance` to render it at full quality without replanning.

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

Preserve the secret-free request, task ID, seed, downloaded artifacts, stream facts, and any frame or audio inspection outputs. Record observed defects without turning technical validity into creative approval.

Hand creative review to the relevant installed specialist: `flux3-cinematic-video` for action and camera, `flux3-keyframes-continuation` for source continuity, and `flux3-audio-dialogue` for speech and sound. If those skills are unavailable, return the evidence with a self-contained review handoff instead of impersonating their criteria.

Complete when the technical verdict and review evidence are recorded.

## Common Pitfalls

1. **Validating against remembered field names.** Read the live reference; the schema is strict and rejects anything it does not know.
2. **Inventing a `mode` for generation.** The attached input field carries the intent.
3. **Attaching more than one input.** Pick the field that matches what must survive.
4. **Submitting an unresolved brief.** Return to the specialist that owns the missing decision.
5. **Polling forever, or retrying a `429` in a loop.** Stop on terminal states; wait out concurrency limits.
6. **Saving only result URLs.** Download the MP4 and draft cache before they expire.
7. **Enhancing the wrong draft.** Preserve draft-to-cache identity.
8. **Calling a decodable file creatively approved.** Technical validation and creative review are separate gates.
9. **Leaking API keys.** Keep authentication in environment variables and headers only.

## Verification Checklist

- [ ] Live API reference consulted before building the payload
- [ ] Preconditions are explicit and ready
- [ ] Zero or one input field, and no unknown fields
- [ ] Coupled constraints checked, not assumed independent
- [ ] Task ID and polling URL come from a real submission
- [ ] Polling ends only on a documented terminal state
- [ ] MP4 and selected draft cache are downloaded before expiry
- [ ] Draft enhancement uses the chosen cache
- [ ] Container, streams, duration, resolution, and audio are checked
- [ ] Technical verdict and creative-review handoff are recorded
- [ ] Credentials never appear in artifacts or output

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for endpoints, fields, limits, and status values
- [references/api-quick-reference.md](references/api-quick-reference.md) — durable request shape and polling pattern
