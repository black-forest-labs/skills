---
name: flux3-keyframes-continuation
description: Use when a FLUX 3 video must be built from supplied images or video. Covers keyframes, reference images, reference video, and continuation.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, keyframes, reference-images, reference-video, continuation
---

# FLUX 3 Keyframes and Continuation

Every supplied source gets one declared job, or is dropped. There is no generation
`mode`: a request carries a prompt plus **at most one** input field, and sending two is
an error.

| Required relationship | Attach |
| --- | --- |
| These exact pixels appear on screen | `keyframes` |
| Exact opening and closing frames, filled in between | `keyframes`: two images plus an explicit whole-number duration |
| An ordered storyboard the model connects | `keyframes`: several images |
| This subject stays recognizable in a scene you have not shot | `reference_images` |
| Keep the cast from this clip, build a new shot | `reference_video` |
| Keep going from where this clip ends | `start_video` |

The distinction that matters most: **`keyframes` put your image on screen;
`reference_images` never appear on screen.** A source used only as inspiration needs no
field at all. Media is a public URL or inline base64; counts, formats, and size limits:
[API reference](https://docs.bfl.ai).

## Prompting each shape

- **One keyframe:** the image opens the clip. Prompt what moves; redescribing visible
  pixels invites re-imagination.
- **Two keyframes as a morph:** requires an explicit whole-number `duration`, or the
  images read as a storyboard (the most common surprise). Keep the two ends related
  enough for a plausible path; large jumps invite drift.
- **Storyboard:** frames become ordered waypoints. Keep identity, palette, and
  viewpoint coherent unless a change is intentional.
- **Reference images:** the subject carries, the pictures do not. Describe the new
  scene fully (camera, action, environment, light); do not redescribe the subject.
- **Reference video:** the cast carries. Write the new shot, not a recap.
- **Continuation:** write from the ending. Say what happens next and which momentum,
  framing, subjects, and sound carry across the boundary.

Keyframes address **frames, not seconds**, on a 24 fps timebase: a beat two seconds in
sits at index 48; the final frame of a five-second clip is index 119. Indices are
unique and inside the clip. Anchor only what matters; extra anchors stiffen motion.

```text
The camera continues a slow push-in as the closed flower opens naturally into the final
bloom. The stem remains fixed in place, the same soft morning light holds across the
shot, and a light breeze moves the surrounding leaves without changing the composition.
```

```text
Continue from the rider's existing forward momentum. The camera keeps the same low
trailing angle as the horse crests the hill and enters dense fog; hoofbeats and wind
carry across the boundary without a reset.
```

```text
The subject from the reference images walks through a sunlit greenhouse, camera
tracking alongside, shallow depth of field, birdsong and soft footsteps on gravel.
```

## Chains

For clips longer than one generation: preserve a clean ending and record the subject's
direction, speed, and camera relationship; continue from the actual ending artifact;
restate only invariants and the next action; review each seam before extending; change
one continuity variable at a time when repairing drift. A video input at higher
resolution may cap duration below the general maximum, which changes segment planning.

Return the conditioning plan (which field and why), the invariants that must survive,
the final prompt, and any frame map or transition risks.
