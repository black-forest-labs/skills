---
name: flux3-keyframes-continuation
description: Use when a FLUX 3 video must be built from supplied images or video. Covers keyframes, reference images, reference video, and continuation.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, keyframes, reference-images, reference-video, continuation
---

# FLUX 3 Keyframes and Continuation

Control what a FLUX 3 video begins from, passes through, ends on, carries forward, or continues from. Treat every supplied source as a specific job, not as generic context.

## When to Use

- Putting a supplied image on screen exactly as shot
- Bridging exact opening and closing frames
- Choreographing a storyboard of frames
- Keeping a person, product, or character recognizable in a new scene
- Building a new shot with the cast from an existing clip
- Continuing from an existing clip's ending
- Diagnosing morphs, identity drift, resets, or broken transitions

When available, use `flux3-cinematic-inserts` for text-only generation and `flux3-prompt-doctor` first when the relationship between the source and desired result is unclear.

## Pick the Field, Not a Mode

There is no `mode` for generation. A request carries a prompt plus **at most one** input field, and the field itself is the instruction. Sending two returns an error listing the alternatives.

| Required relationship | Attach |
| --- | --- |
| These exact pixels appear on screen | `keyframes` |
| Exact opening and closing frames, filled in between | `keyframes` — two images plus an explicit whole-number duration |
| An ordered storyboard the model connects | `keyframes` — several images |
| This subject stays recognizable in a scene you have not shot | `reference_images` |
| Keep the cast from this clip, build a new shot | `reference_video` |
| Keep going from where this clip ends | `start_video` |

The distinction that matters most: **`keyframes` put your image on screen; `reference_images` never appear on screen.** References control who or what shows up while the model builds a new scene around them. Choosing wrong is the difference between a shot that opens on your photograph and a shot that merely stars the person in it.

A source used only as inspiration needs no field at all. Describe it and send the prompt alone unless its pixels, cast, or ending must survive.

Confirm current counts, formats, and size limits in the [API reference](https://docs.bfl.ai) before building the request. Media is passed as a public URL or inline base64.

Complete when every source has one declared job and one home, or is dropped.

## Workflow

### 1. Inventory sources and invariants

For each source, record:

- its job: on-screen frame, subject reference, cast source, or continuation seed;
- subject identities and geometry that must survive;
- wardrobe, palette, environment, camera, and motion continuity;
- allowed changes between anchors;
- discontinuities the transition must solve.

When a brief wants both exact frames and carried-over identity, it needs a decision — one request cannot carry both.

Complete when the prompt can distinguish protected invariants from intended change.

### 2. Design a plausible path

#### One keyframe

The image opens the clip. Prompt what begins moving, how the camera behaves, and what stays stable. Spend words on change rather than redescribing visible pixels.

#### Two keyframes as a morph

The images pin both ends and the model fills the middle — but only with an explicit whole-number duration. Without one, two images are read as a storyboard instead of start and end, which is the most common surprise in this mode.

Keep subject, scene, and camera setup related enough for a plausible path. Large jumps in viewpoint, identity, geometry, lighting, or location widen transition freedom and invite drift.

#### A storyboard

Several frames become waypoints the model connects in order. Keep identity, environment, palette, and viewpoint coherent unless a change is intentional.

#### Reference images

The subject carries; the pictures do not. Describe the new scene fully — camera, action, environment, light — because none of it comes from the references. Redescribing the subject's appearance wastes words the model already has covered.

#### Reference video

The cast carries into a new clip. Write the new shot, not a recap of the source.

#### Continuation

Write from the source clip's ending, not its beginning. Describe what happens next and which momentum, framing, subjects, sound, and atmosphere carry across the boundary. Do not recap completed action.

Complete when the desired motion connects the anchors rather than fighting them.

### 3. Place keyframes deliberately

Keyframes address **frames, not seconds**, on a 24 fps timebase: one second is 24 frames. Each frame index must be unique and land inside the clip.

Converting intent to indices: a beat two seconds in sits at index 48; the final frame of a five-second clip is index 119.

Use explicit placement only when it matters. Extra anchors spend control budget and can produce stiff motion or transition pressure.

Complete when each index has a narrative reason and the sequence fits the duration.

### 4. Write between and after the media

Prompt:

- motion between anchors;
- camera behavior across the path;
- physical continuity and environmental response;
- what remains unchanged;
- what carries through a continuation boundary.

Avoid exhaustive visual restatement. The media supplies appearance; the prompt supplies motion, continuity, and causal intent.

Example for a two-frame morph:

```text
The camera continues a slow push-in as the closed flower opens naturally into the final bloom. The stem remains fixed in place, the same soft morning light holds across the shot, and a light breeze moves the surrounding leaves without changing the composition.
```

Example for continuation:

```text
Continue from the rider's existing forward momentum. The camera keeps the same low trailing angle as the horse crests the hill and enters dense fog; hoofbeats and wind carry across the boundary without a reset.
```

Example for reference images:

```text
The subject from the reference images walks through a sunlit greenhouse, camera tracking alongside, shallow depth of field, birdsong and soft footsteps on gravel.
```

### 5. Plan continuation chains

For clips longer than one generation:

1. preserve a clean final frame and stable motion vector;
2. continue from the actual ending artifact;
3. restate only the invariants and next action;
4. review the seam before extending again;
5. change one continuity variable at a time when repairing drift.

Watch for constraints that couple: a video input at higher resolution may cap duration below the general maximum, which changes how many segments a sequence needs. Check the reference before planning segment lengths.

Complete when each segment has a usable ending and the next prompt begins from that observed ending.

## Output Contract

Return:

1. **Conditioning plan** — which single field carries the media, and why;
2. **Invariant ledger** — protected and allowed-to-change details;
3. **Final prompt** — motion between, around, or after sources;
4. **Frame map** — only when keyframe indices are placed explicitly;
5. **Request notes** — keyframe shape, duration requirement, or media constraints;
6. **Transition risks** — likely morphs, drift, resets, or deterministic alternatives.

## Common Pitfalls

1. **Confusing `keyframes` with `reference_images`.** One puts the picture on screen; the other only keeps the subject recognizable.
2. **Attaching two input fields.** Pick the one that matches what must survive.
3. **Expecting a morph without an explicit duration.** Two images default to a storyboard reading.
4. **Timing keyframes in seconds.** Indices are frames at 24 fps.
5. **Conditioning on an inspiration image.** Attach media only when its pixels, cast, or ending must survive.
6. **Redescribing the source.** Prompt the change, camera, and continuity.
7. **Underwriting the scene with reference images.** The references carry identity only; everything else is on the prompt.
8. **Recapping a source video.** Continue from its ending.
9. **Ignoring the seam.** Review every continuation boundary before chaining again.

## Verification Checklist

- [ ] Exactly one input field carries the media, or none
- [ ] The field matches what must survive
- [ ] Protected invariants and intended changes are explicit
- [ ] A two-frame morph carries an explicit whole-number duration
- [ ] Frame indices are unique, in frames, and inside the clip
- [ ] Scene detail is supplied when references carry identity only
- [ ] Prompt describes motion between or after sources
- [ ] Continuation begins from the observed ending
- [ ] Transition risks are named

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for input fields, media limits, and keyframe rules
