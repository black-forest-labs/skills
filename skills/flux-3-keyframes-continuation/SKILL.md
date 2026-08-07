---
name: flux-3-keyframes-continuation
description: Use when a FLUX 3 video must be built from supplied images or video. Covers keyframes (i2v) and continuation (v2v).
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, keyframes, continuation
---

# FLUX 3 Keyframes and Continuation

Every supplied source gets one declared job, or is dropped. Two modes condition on
media, and each carries exactly one media field:

| Required relationship | Request |
| --- | --- |
| These exact pixels open the clip (the stable path) | `mode: "i2v"`, `keyframes`: one image |
| Exact opening and closing frames, filled in between | `mode: "i2v"`, `keyframes`: two images |
| An ordered storyboard the model connects | `mode: "i2v"`, `keyframes`: 3-10 images plus an integer `duration` |
| Frames pinned at exact moments | `mode: "i2v"`, `keyframes`: `[seconds, image]` pairs, ascending, integer `duration` |
| Keep going from where this clip ends | `mode: "v2v"`, `start_video` (input max 15 s / 50 MB; output max 15 s) |

Keyframes appear **on screen, pixel-exact**. There is no field that carries a subject
without showing the source image; a source used only as inspiration is described in the
prompt instead. Media is a public URL or inline base64; keyframe images are at least
256x256.

## Prompting each shape

- **One keyframe:** the image opens the clip. Prompt what moves; redescribing visible
  pixels invites re-imagination.
- **Two keyframes:** opening and closing are pinned, so describe the stages of the
  change in order and hold the camera still. Keep the two ends related enough for a
  plausible path; large jumps invite drift.
- **Storyboard:** frames become ordered waypoints. Keep identity, palette, and
  viewpoint coherent unless a change is intentional.
- **Timestamped pins:** a mid-clip pin is a deadline; say what the remaining seconds
  are for, or they trail off. Pin only what matters; extra anchors stiffen motion.
- **Continuation:** write from the ending. Say what happens next and which momentum,
  framing, subjects, and sound carry across the boundary; do not recap completed
  action.

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

## Chains

For clips longer than one generation: preserve a clean ending and record the subject's
direction, speed, and camera relationship; continue from the actual ending artifact;
restate only invariants and the next action; review each seam before extending; change
one continuity variable at a time when repairing drift. A video input at higher
resolution may cap duration below the general maximum, which changes segment planning.

Return the conditioning plan (which mode and shape, and why), the invariants that must
survive, the final prompt, and any pin map or transition risks.

Field limits and current constraints: [API reference](https://docs.bfl.ai)
