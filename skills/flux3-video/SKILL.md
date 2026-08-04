---
name: flux3-video
description: Create, animate, continue, and review FLUX 3 videos with a requirements gate, mode routing, motion-first prompts, synchronized audio direction, and production-safe iteration.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video-generation, t2v, i2v, v2v, audio, prompting
---

# FLUX 3 Video

Use this skill to turn a video idea or source asset into a clear FLUX 3 generation brief, select the right workflow, write a motion-first prompt, submit a valid request, and review the returned clip.

The core discipline is a **Prompt Doctor gate**: resolve the decisions the model should not invent before expanding the prompt or calling the API.

## When to Use

- Text-to-video generation from a written idea
- Animating one still, interpolating between frames, or choreographing keyframes
- Continuing an existing video from its final frames
- Directing synchronized ambience, effects, dialogue, or voiceover
- Iterating with FLUX 3 draft generations before a full-quality render
- Diagnosing why a generated clip missed its action, camera, continuity, text, or audio goal

For general BFL API polling, webhooks, and authentication patterns, also read **bfl-api**. For FLUX image generation, use **flux-best-practices**.

## Workflow

### 1. Choose the mode by what must survive

Route by the creator's actual requirement, not by whichever input happens to be available.

| Requirement | Mode | Input |
| --- | --- | --- |
| Generate the whole clip from words | `t2v` | `prompt` |
| Start on one exact image | `i2v` | one `keyframes` image |
| Control the opening and closing frames | `i2v` | two `keyframes` images |
| Pass through several visual waypoints | `i2v` | 3–10 keyframes, optionally timestamped |
| Continue from an existing clip's ending | `v2v` | `start_video` |
| Render an approved draft at full quality | `draft_enhance` | `draft_cache` |

A source image is not automatically the right input. Use it only when the shot must begin on, end on, or pass through that frame. Use `t2v` when the source is merely inspiration that can be described in words.

The route is complete when every supplied asset has one declared job and the selected mode directly supports it.

### 2. Run the Prompt Doctor gate

Before writing a long prompt, resolve:

1. **Outcome:** where the clip will be used and what visible fact makes it successful.
2. **Subject:** who or what must appear.
3. **Action:** the one non-negotiable movement, event, or state change.
4. **Source role:** what each image or video must contribute.
5. **Invariants:** identity, geometry, wardrobe, framing, motion, environment, or final composition that must remain stable.
6. **Delivery:** aspect ratio, duration, and HD or FHD.
7. **Shot structure:** one continuous shot or an intentional sequence of shots.
8. **Camera:** framing, angle, movement, and focus behavior.
9. **Audio:** ambience, effects, music, speech, or intentional silence.
10. **Text:** absent, spoken, physical in the scene, or added later in deterministic post.

Use [templates/brief.md](templates/brief.md) to capture the answers. Use [references/prompt-doctor.md](references/prompt-doctor.md) when the route is ambiguous or the request depends on exact timing, typography, or synchronization.

The gate passes when another person can identify the mode, required action, invariants, timing, camera, audio, and text strategy without guessing.

### 3. Build the prompt around motion

A useful default order is:

```text
[Tone or format]. [Camera and framing] of [subject] [clear action] in [environment].
[Environmental motion and physical response]. [Lighting and palette]. [Audio intent].
```

Prioritize observable nouns and verbs:

- `A cyclist pedals three times, brakes, and stops at the crosswalk`
- `Rainwater breaks the neon reflection and settles after the tire passes`
- `The camera tracks low beside the fox as branches whip past the frame`

Replace mood-only language with visible evidence. `Tense` is weak by itself; a rigid posture, shallow breathing, a locked door, and a slow push-in give the tension something to inhabit.

The prompt is ready when every phrase changes the subject, action, camera, environment, light, continuity, or sound.

### 4. Set a realistic action budget

For a short clip, favor one clear subject action and one clear camera move. Give motion a readable beginning, development, and payoff.

For timing-sensitive shots, use two or three achievable beats:

```text
0.0–1.5s — locked wide shot of a still harbor at dawn
1.5–3.0s — a slow push-in begins as gulls lift off the water
3.0–5.0s — sunlight breaks the horizon and the camera settles
```

A timeline is direction, not a frame-accurate contract. If a production depends on exact synchronization, lettering, or a mechanism landing on a specific frame, generate the source footage and finish that element in editing or compositing.

For multi-shot prompts, name each shot and mark the transition explicitly:

```text
SHOT ONE (0–3s): ...
HARD CUT
SHOT TWO (3–5s): ...
```

Use real contrast between consecutive shots—scale, angle, location, or palette—so they do not blend into an accidental morph.

The action budget is valid when every beat can plausibly complete within the chosen duration.

### 5. Direct the camera with intent

Name only camera terms that change the shot:

- **Framing:** close-up, medium, wide, establishing
- **Angle:** eye level, low angle, overhead
- **Movement:** locked-off, slow push-in, lateral tracking, handheld follow
- **Focus:** deep focus, shallow focus on the subject, rack focus
- **Perspective:** expansive wide-angle depth or compressed long-lens layers

Keep the camera contract internally consistent. A locked-off shot cannot also orbit the subject. An extreme close-up cannot establish a complete environment at the same moment.

For continuity-critical work, state that the shot unfolds in continuous real time and identify what must not cut, reset, teleport, or change geometry.

The camera direction is complete when framing, movement, focus, and subject action describe the same shot.

### 6. Use image and video inputs deliberately

#### One image

The image is the exact opening frame. Prompt what begins moving, how the camera behaves, and what should remain visually stable. Do not spend most of the prompt redescribing pixels already present.

#### Two images

The first and last frames define both ends of the motion. Keep subject, scene, and camera setup related enough for a plausible path between them. A large visual discontinuity gives the model more freedom and makes the transition less predictable.

#### Three to ten keyframes

Treat the images as an ordered timeline. Keep identity, scene, palette, and viewpoint coherent across the set. Use timestamps when a frame must land at a particular moment; otherwise FLUX 3 spreads the waypoints across the duration. Three or more untimed keyframes require an explicit duration.

#### Video continuation

Write from the source clip's ending, not from its beginning. Describe what happens next and which momentum, framing, subjects, and atmosphere should carry forward. Avoid recapping action that has already finished.

The conditioning setup is ready when the prompt describes motion between or after the supplied media rather than fighting the media itself.

### 7. Direct audio as part of the scene

FLUX 3 generates synchronized audio by default. Describe useful layers with concrete sources:

- **Speech:** speaker, exact words, and delivery
- **Ambience:** rain on an awning, crowd murmur, room tone, traffic
- **Effects:** sounds caused by visible actions
- **Music:** style, pace, and role under the scene

For dialogue, quote the exact line and identify the visible speaker. For off-screen speech, label it `voiceover` or `narration`. Keep important lines short enough to fit the clip and leave room for the line to start and finish.

Direct a voice with a few audible anchors: age range, accent when relevant, vocal register, recording distance, and social delivery. Reusing that direction can preserve a kind of voice, but it does not guarantee the same performer across generations.

Keep competing speech out of the background when one line matters. Generated sound is useful scene texture; final timing, ducking, fades, loudness, and production-critical synchronization belong in post.

Set `generate_audio: false` when the desired source clip should be silent.

The audio brief is complete when each requested sound has a source or narrative role and speech has a clear owner.

### 8. Submit through the public API

FLUX 3 video uses one asynchronous endpoint:

```text
POST https://api.bfl.ai/v1/flux-3-video
```

Minimal text-to-video request:

```bash
curl -X POST https://api.bfl.ai/v1/flux-3-video \
  -H "x-key: $BFL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "t2v",
    "prompt": "A fox sprints through wet forest brush while the camera tracks low beside it. Pine branches whip past the frame, dawn mist drifting through cool light.",
    "aspect_ratio": "16:9",
    "duration": 5,
    "resolution": "hd"
  }'
```

The response contains a task `id` and `polling_url`. Poll until `Ready`, stop on terminal failure states, and download the MP4 immediately because the signed result URL expires.

See [references/api-quick-reference.md](references/api-quick-reference.md) for mode-specific request shapes, draft enhancement, limits, and validation rules.

The request is complete when its fields match the selected mode and the result has been downloaded rather than leaving an expiring URL as the artifact.

### 9. Iterate with drafts and controlled changes

Use draft mode to compare concepts or prompt variants before committing to full quality. A draft batch can produce up to four variants of one plan. Preserve the selected `draft_cache`, then send it through `draft_enhance` to render that exact generation at full quality.

Between prompt iterations, change one consequential dimension at a time:

1. action geometry;
2. camera behavior;
3. duration or beat allocation;
4. light, atmosphere, or material response;
5. conditioning mode or source assignment.

After two structurally similar misses, revise the action, route, or production method instead of adding more adjectives.

Each rerun is valid when it tests a named hypothesis and preserves the parts that already worked.

### 10. Review the returned video

Watch the whole clip with sound, then inspect it frame by frame where needed.

Check:

- the required action completes and reads without explanation;
- the camera follows the stated contract;
- subjects, geometry, and environment remain continuous;
- contact, weight, reflections, fluids, and other physics look plausible;
- keyframes land without a distracting morph or identity break;
- speech is complete, attributed correctly, and understandable;
- effects and ambience belong to visible or implied sources;
- generated text is correct, or the planned post-production text area is usable;
- the opening and closing frames provide clean edit points;
- the MP4 is downloaded and technically valid.

Classify the result as **approved**, **usable with a known defect**, **experimental**, or **reject**. State the visual or editorial reason rather than grading the prompt prose.

## Common Pitfalls

1. **Writing an image prompt with “cinematic video” appended.** Describe subject motion, camera behavior, and environmental response.
2. **Letting the model choose the workflow.** Pick `t2v`, `i2v`, `v2v`, or `draft_enhance` from the required input relationship.
3. **Overloading five seconds.** Reduce the number of actions or increase duration.
4. **Redescribing a source frame instead of animating it.** Use the prompt for change, continuity, and camera intent.
5. **Mixing incompatible camera directions.** Make framing, movement, focus, and action agree.
6. **Treating generated audio as an edit clock.** Use it for coherent texture; finish exact sync and mixing in post.
7. **Assuming repeated voice direction fixes speaker identity.** Audition and compare takes by ear.
8. **Relying on generated typography for production-critical copy.** Reserve space and add exact copy deterministically when lettering must be guaranteed.
9. **Polling forever after a terminal state.** Stop on `Error`, `Request Moderated`, or `Content Moderated`.
10. **Saving only the result URL.** Download the MP4 and any draft cache before signed URLs expire.

## Verification Checklist

- [ ] Mode matches the creator's input intent
- [ ] One required action or state change is explicit
- [ ] Source roles and invariants are documented
- [ ] Aspect ratio, duration, resolution, and shot structure are intentional
- [ ] Camera direction is internally consistent
- [ ] Audio and text strategies are explicit
- [ ] Request fields are valid for the selected mode
- [ ] Draft winner is enhanced from its own `draft_cache`
- [ ] Returned MP4 is downloaded and technically valid
- [ ] Visual continuity, physics, text, and audio have been reviewed
- [ ] Each rerun tests one named change

## Public References

- [FLUX 3 video overview](https://docs.bfl.ai/flux_3/flux3_video)
- [FLUX 3 video prompting guide](https://docs.bfl.ai/guides/prompting_video_overview)
- [Text-to-video prompting](https://docs.bfl.ai/guides/prompting_video_text_to_video)
- [Image-to-video prompting](https://docs.bfl.ai/guides/prompting_video_image_to_video)
- [Audio and speech prompting](https://docs.bfl.ai/guides/prompting_video_audio)
- [FLUX 3 API reference](https://docs.bfl.ai/api-reference/flux3)
