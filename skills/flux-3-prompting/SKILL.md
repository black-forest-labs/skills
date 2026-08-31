---
name: flux-3-prompting
description: Use when writing or improving a general FLUX 3 video prompt. Choose the right mode, structure motion and sound, and keep the prompt practical.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video, prompting
---

# FLUX 3 prompting

Use the shortest prompt that controls the result. Start with a clear subject and
visible action, then add only the camera, timing, look, and sound details that
matter. FLUX 3 accepts short prompts, natural language, labeled fields, and
timecoded prompts.

## Choose the mode first

Every request uses one mode and its matching media field:

| Goal | Mode | Media |
| --- | --- | --- |
| Generate a clip from words | `t2v` | None |
| Animate pinned images | `i2v` | `keyframes` |
| Continue an existing clip | `v2v` | `start_video` |
| Finish a selected draft | `draft_enhance` | `draft_cache` |

Use `i2v` when an image must appear on screen. One keyframe pins the opening
frame. Two keyframes pin the opening and ending frames. Three or more keyframes,
or timestamped keyframes, define ordered waypoints. Describe the change between
the pinned images and keep related frames close enough for a plausible path.

Use `v2v` to continue from an existing ending. State the next action, subject
direction and speed, camera relationship, and any visual or audio elements that
must carry across the seam.

Use a draft while the concept is unproven. Review the fast preview, keep the
selected `draft_cache`, then if it's a winner use `draft_enhance` for the full-quality clip.
This keeps the approved composition instead of starting a new generation.

## Build the prompt

For a single shot, use this order:

1. **Camera**: framing, angle, movement, and focus.
2. **Subject and action**: who or what moves, and the visible cause and result.
3. **Environment**: setting, time, light, and depth of field.
4. **Timing**: one continuous take, or short beats with explicit hard cuts.
5. **Look**: realism, palette, texture, and capture format when relevant.
6. **Audio**: speech, effects, ambience, music, or deliberate silence.
7. **Continuity**: what stays fixed across the shot or across cuts.

Example:

```text
A low tracking shot follows a red fox sprinting through wet pine undergrowth at dawn. Mist drifts 
between the trees as the camera keeps pace beside it. Cool blue morning light, controlled motion, 
cinematic naturalism. Footsteps and wet branches are close and clear.
```

When several beats need control, use a compact timeline. Keep each beat
achievable and use two or three beats for a short clip:

```text
0.0-1.5s: locked wide of a still harbor at dawn.
1.5-3.0s: a slow push-in begins as gulls lift off the water.
3.0-5.0s: sunlight breaks the horizon and the camera settles.
```

For a multi-shot sequence, label the shots and mark each angle change:

```text
SHOT ONE: wide desert highway at dawn, a red car speeds through.
HARD CUT. SHOT TWO: interior close-up, the driver's hands drum on the wheel.
One low engine bed continues across both shots.
```

For dialogue, quote the exact line, name the visible speaker or label it as
voiceover, and say `no on-screen text, no subtitles` when text is unwanted.
Describe effects at their visible cause. For example: `As the cup hits the
tile, it cracks with one sharp ceramic snap.` Sound direction works best when
it is tied to visible action.

## Transferable craft

Other video-model guides point to three useful habits: give every reference one
job, use a timeline when several events must land, and direct sound as part of
the shot. These are prompting practices, not FLUX 3 features. Do not copy
another model's reference tags, endpoint names, or limits into a FLUX 3 request.

## Practical limits

- FLUX 3 Video currently has output up to 20
  seconds at FHD and 24 fps. Check the current API reference for coupled input,
  duration, resolution, and field limits.
- A short clip has a limited action budget. Prefer one clear subject action and
  one motivated camera move. Split complex mechanisms, many locations, or long
  dialogue into separate shots or a post-production step.
- A pinned keyframe is visible on screen. Use an attached image for exact visual
  conditioning; describe an inspiration-only reference in the prompt instead.
- FLUX 3 can render text in a scene, but use post-production when wording,
  placement, subtitles, logos, frame-accurate sync, speaker identity across
  generations, or final mixing must be exact.
- Prompt detail does not replace a suitable mode. Choose the mode by priority:
  descriptions alone (`t2v`), specific pixels (`i2v`), or continuity from an existing clip (`v2v`)

## Related skills

- `flux-3-prompt-doctor`: resolve mode, media, feasibility, and blocking conflicts.
- `flux-3-cinematic-inserts`: write a text-only standalone shot.
- `flux-3-keyframes-continuation`: plan keyframes and video continuation.
- `flux-3-audio-dialogue`: direct speech, ambience, effects, music, or silence.
- `flux-3-generate`: construct and run the request.
