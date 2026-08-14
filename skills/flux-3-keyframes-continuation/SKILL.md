---
name: flux-3-keyframes-continuation
description: Use when a FLUX 3 video must be built from supplied images or video. Covers keyframes (i2v) and continuation (v2v).
metadata:
  author: Black Forest Labs
  version: "1.1.0"
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

**A continuation returns less footage than you request.** Measured across six links,
every `i2v` and `t2v` job returned its requested duration to within a frame and every
`v2v` job came back short: 5.00s against a 6s request three times, and once 2.00s,
which is too little to cut from at all. Two controls asking for 10s returned 8.00s
from a 6.04s input and 9.00s from a 2.50s input, so a short input is not the cause.
Ask for more than you need, measure every returned link, and check the yield after
each one rather than planning a length budget from requested durations.

**Chains hold geometry and lose grade.** A three-link chain measured against link 1:

| link | luma drift | warmth drift | seam vs. within-link frame step |
| --- | --- | --- | --- |
| 2 | +2.0 | -3.7 | 16.9x |
| 3 | -1.8 | -7.3 | 9.7x |

Subject identity survived intact across all three links: same object, same materials,
same engraved wordmark. Luma did not drift. Colour temperature drifted hard, cooling
monotonically and visibly, and each seam measured several times an ordinary
frame-to-frame step, so the join is not invisible. Budget a colour-temperature match
per link, cut on the seam rather than through it, and stop trusting "locked camera"
past the first link: framing and subject pose creep slightly even when nothing in the
prompt asks them to.

Return the conditioning plan (which mode and shape, and why), the invariants that must
survive, the final prompt, and any pin map or transition risks.

Field limits and current constraints: [API reference](https://docs.bfl.ai)
