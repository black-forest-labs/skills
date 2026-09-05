---
name: flux-3-prompting
description: Use when writing or improving a general FLUX 3 video prompt without running generation. Choose the mode and describe the scene, action, camera, and sound.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video, prompting
---

# FLUX 3 Prompting

Start with the subject and action. Add details for choices the model should not
make for you, such as the camera angle, setting, or spoken words. The
[BFL text-to-video guide](https://docs.bfl.ai/guides/prompting_video_text_to_video)
includes short prompts, natural language, labeled fields, and timelines with
clips for comparison. No single format is required.

## Choose the mode first

Match the user's starting material to the mode:

| Goal | Mode | Media field |
| --- | --- | --- |
| Generate a clip from words | `t2v` | None |
| Animate supplied images | `i2v` | `keyframes` |
| Continue an existing clip | `v2v` | `start_video` |
| Finish a selected draft | `draft_enhance` | `draft_cache` |

Use `i2v` when an image should become a frame in the video, not merely suggest
its style. One keyframe sets the opening frame; two set the opening and ending
frames. Timestamped keyframes specify when images appear. Describe the motion
between them. See the [image-to-video examples](https://docs.bfl.ai/guides/prompting_video_image_to_video).

Use `v2v` to continue after a clip's ending. Describe what happens next and any
visual or audio details that should continue across the join. See
[video continuation](https://docs.bfl.ai/flux_3/flux3_video#video-continuation).

If the user asks to generate a test, suggest a draft so they can review its
composition, action, and sound. To finish that draft, pass its `draft_cache` to
`draft_enhance`. See the [draft workflow](https://docs.bfl.ai/flux_3/flux3_overview#draft-mode)
for the request and comparison examples.

## Write the prompt

For one continuous shot, describe the subject's action, setting, camera, and
sound. Add timing, style, or continuity details when the brief needs them. The
order is optional. If the sequence needs several shots, describe each one
separately and mark the cuts.

This short prompt appears with its result in the
[text-to-video guide](https://docs.bfl.ai/guides/prompting_video_text_to_video#before-you-prompt):

```text
A red fox leaping through fresh snow, telephoto.
```

Use a timeline when the order of events matters. This five-second example is
copied from the guide's [timestep section](https://docs.bfl.ai/guides/prompting_video_text_to_video#timestep-prompting):

```text
0.0–1.5s — locked wide of a still harbor at dawn, boats motionless on glassy water
1.5–3.0s — a slow push-in begins as gulls lift off the water
3.0–5.0s — the sun breaks the horizon, warm light spreads and the camera settles
```

Treat timestamps as timing targets, not frame-exact controls. The
[audio guide](https://docs.bfl.ai/guides/prompting_video_audio) discusses this
limitation and shows timing examples.

For several shots, name each shot and mark each cut. The
[guide's car sequence](https://docs.bfl.ai/guides/prompting_video_text_to_video#before-you-prompt)
uses this prompt:

```text
SHOT ONE: wide aerial of a desert highway at dawn, a single red car speeding through. HARD CUT. SHOT TWO: interior close-up, the driver's hands drumming the wheel. HARD CUT. SHOT THREE: from the roadside, the car shrinks into the heat haze. One music bed across all three shots.
```

For dialogue, quote the line and name the visible speaker or identify it as
voiceover. For an effect, name the object or action that makes the sound. Use
`flux-3-audio-dialogue` for a detailed audio brief and the
[audio guide](https://docs.bfl.ai/guides/prompting_video_audio) for examples.

## Check limits and review the result

The [API reference](https://docs.bfl.ai/api-reference/utility/generate-a-video-with-flux-3)
specifies durations by mode: `t2v` and `i2v` accept 5 to 20 whole seconds;
`v2v` accepts 5 to 15. All three also accept `duration: "auto"` and offer `hd`
and `fhd`. Video is 24 fps; drafts render at `hd`.

For an initial short-shot test, start with one main action rather than a long
sequence. This is a way to reduce what needs reviewing, not a model limit.
Watch for omitted actions, unintended cuts, and truncated dialogue before
adding more to the prompt. If a result misses an important beat, compare it
with the brief before deciding whether to revise the prompt or split the scene.

When a deliverable requires exact typography, frame-exact timing, or final
mixing, include an editing step and a check of the finished output. Do not
promise that a prompt alone will meet those requirements.

## Return the prompt

For a prompt-only request, return the prompt and the selected mode, including
any supplied media it needs. State unresolved requirements that would change
the mode. Stop there. Use `flux-3-generate` only when the user asks to run it.

## Related skills

- `flux-3-prompt-doctor`: resolve conflicting requirements or an unclear mode.
- `flux-3-cinematic-inserts`: develop a standalone cinematic insert or B-roll shot.
- `flux-3-keyframes-continuation`: plan from supplied images or video.
- `flux-3-audio-dialogue`: direct speech, effects, ambience, or music.
- `flux-3-generate`: construct and run the request.
