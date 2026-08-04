---
name: flux3-keyframes-continuation
description: Use when animating keyframes or continuing FLUX 3 video. Covers start/end frames, timing, and continuity.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, i2v, v2v, keyframes, continuation
---

# FLUX 3 Keyframes and Continuation

Control what a FLUX 3 video begins from, passes through, ends on, or continues from. Treat source media as temporal anchors with explicit roles and invariants.

## When to Use

- Animating one source image
- Bridging exact opening and closing frames
- Choreographing 3–10 untimed keyframes or timestamped anchors
- Continuing from an existing MP4's ending
- Diagnosing morphs, identity drift, resets, or broken transitions

When available, use `flux3-cinematic-video` for prompt-only generation and `flux3-prompt-doctor` first when the relationship between the source and desired result is unclear.

## Choose the Conditioning Plan

| Required relationship | Mode and input |
| --- | --- |
| Exact opening frame | `i2v` with one keyframe image |
| Exact opening and closing frames | `i2v` with two keyframe images |
| Ordered visual waypoints | `i2v` with 3–10 keyframe images |
| Waypoints at specific times | `i2v` with 1–10 time-ordered `[seconds, image]` pairs |
| Continue an existing ending | `v2v` with one `start_video` MP4 |

A source used only as inspiration does not need conditioning. Describe it and use `t2v` unless its pixels, composition, or ending must survive.

Complete when every source has one declared temporal job.

## Workflow

### 1. Inventory sources and invariants

For each source, record:

- temporal role: opening, closing, waypoint, or continuation seed;
- subject identities and geometry that must survive;
- wardrobe, palette, environment, camera, and motion continuity;
- allowed changes between anchors;
- discontinuities the transition must solve.

Complete when the prompt can distinguish protected invariants from intended change.

### 2. Design a plausible path

#### One image

The image is the opening frame. Prompt what begins moving, how the camera behaves, and what remains stable. Spend prompt words on change rather than redescribing visible pixels.

#### Two images

The images pin both ends. Keep subject, scene, and camera setup related enough for a plausible path. Large changes in viewpoint, identity, geometry, lighting, or location increase transition freedom and drift.

#### Three to ten keyframes

Treat frames as an ordered timeline. Keep identity, environment, palette, and viewpoint coherent unless a change is intentional. Untimed keyframes are distributed across the clip; 3–10 untimed frames require an explicit duration.

#### Video continuation

Write from the source clip's ending, not its beginning. Describe what happens next and which momentum, framing, subjects, sound, and atmosphere carry forward. Do not recap completed action.

Complete when the desired motion connects the anchors rather than fighting them.

### 3. Set timing deliberately

Timestamped keyframes use `[seconds, image]` pairs. Times must be non-negative, increasing, and at least 1/24 second apart.

- With explicit duration, every timestamp must fall within it.
- With `duration: "auto"`, the clip runs to the final timestamp and rounds up to a whole second.
- Untimed sets of 3–10 images require explicit duration.

Use timestamps only when placement matters. Extra anchors spend control budget and can create stiff motion or transition pressure.

Complete when each timestamp has a narrative reason and the sequence fits the duration.

### 4. Write between and after the media

Prompt:

- motion between anchors;
- camera behavior across the path;
- physical continuity and environmental response;
- what remains unchanged;
- what carries through a continuation boundary.

Avoid exhaustive visual restatement. The media already supplies appearance; the prompt supplies motion, continuity, and causal intent.

Example for two frames:

```text
The camera continues a slow push-in as the closed flower opens naturally into the final bloom. The stem remains fixed in place, the same soft morning light holds across the shot, and a light breeze moves the surrounding leaves without changing the composition.
```

Example for continuation:

```text
Continue from the rider's existing forward momentum. The camera keeps the same low trailing angle as the horse crests the hill and enters dense fog; hoofbeats and wind carry across the boundary without a reset.
```

### 5. Plan continuation chains

For clips longer than one generation:

1. preserve a clean final frame and stable motion vector;
2. continue from the actual ending artifact;
3. restate only the invariants and next action;
4. review the seam before extending again;
5. change one continuity variable at a time when repairing drift.

Complete when each segment has a usable ending and the next prompt begins from that observed ending.

## Output Contract

Return:

1. **Conditioning plan** — mode, source order, and temporal role;
2. **Invariant ledger** — protected and allowed-to-change details;
3. **Final prompt** — motion between or after sources;
4. **Timing map** — only for timestamped anchors;
5. **Payload notes** — keyframe shape or `start_video` requirement;
6. **Transition risks** — likely morphs, drift, resets, or deterministic alternatives.

## Common Pitfalls

1. **Conditioning on an inspiration image.** Use media only when the frame must survive.
2. **Redescribing the source.** Prompt the change, camera, and continuity.
3. **Bridging unrelated frames without acknowledging the jump.** Simplify or add a plausible waypoint.
4. **Recapping a source video.** Continue from its ending.
5. **Using too many anchors.** Keep only frames that control a meaningful beat.
6. **Ignoring the seam.** Review every continuation boundary before chaining again.

## Verification Checklist

- [ ] Every source has one temporal role
- [ ] Mode and input shape match the relationship
- [ ] Protected invariants and intended changes are explicit
- [ ] Anchor sequence is visually plausible
- [ ] Timestamp rules and duration are valid
- [ ] Prompt describes motion between or after sources
- [ ] Continuation begins from the observed ending
- [ ] Transition risks are named

## Public References

- [Image-to-video prompting](https://docs.bfl.ai/guides/prompting_video_image_to_video)
- [FLUX 3 video prompting overview](https://docs.bfl.ai/guides/prompting_video_overview)
- [FLUX 3 API reference](https://docs.bfl.ai/api-reference/flux3)
