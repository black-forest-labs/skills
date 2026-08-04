---
name: flux3-prompt-doctor
description: Use when diagnosing a FLUX 3 brief before generation. Resolve missing, conflicting, or schema-changing requirements.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, prompt-doctor, validation, routing
---

# FLUX 3 Prompt Doctor

Protect decisions the model should not invent. Diagnose a FLUX 3 brief before expanding its prompt or constructing an API payload.

## When to Use

- A video idea is vague, contradictory, overloaded, or technically ambiguous
- The correct route between text, image, video, or draft inputs is unclear
- Exact timing, typography, speaker identity, or synchronization may exceed generation control
- A prompt or payload needs a readiness verdict before submission

Do not use this skill to write the final cinematic prompt or call the API. When available, hand a `READY` brief to `flux3-cinematic-video` for prompt-only shots, `flux3-keyframes-continuation` for source-conditioned shots, `flux3-audio-dialogue` when sound needs specialist direction, and `flux3-generate` for execution. Otherwise, return a self-contained handoff naming the specialist needed.

## Readiness Contract

A brief is ready only when it answers:

| Decision | Question |
| --- | --- |
| Outcome | Where will the clip be used, and what visible fact makes it successful? |
| Subject | Who or what must appear? |
| Action | What single movement, event, or state change is non-negotiable? |
| Input intent | Generate from text, animate frame(s), continue video, or enhance a draft? |
| Source roles | What must each image, video, or draft cache contribute? |
| Invariants | What identity, geometry, wardrobe, framing, motion, environment, or end state must survive? |
| Delivery | Which aspect ratio, duration, and resolution are intentional? |
| Shot structure | One continuous shot or an explicit sequence? |
| Camera | Which framing, angle, movement, and focus behavior matter? |
| Audio | Which speech, ambience, effects, music, or silence is required? |
| Text | Spoken, physical in-scene, generated, absent, or deterministic post? |

Use [templates/brief.md](templates/brief.md) when the answers need to become a reusable handoff.

## Diagnostic Sequence

### 1. Extract facts before expanding

Separate explicit requirements from decorative preferences and assumptions. Preserve the user's product names, exact copy, source roles, timings, and hard constraints verbatim.

Complete when every supplied requirement appears once in the brief and assumptions are labeled.

### 2. Route by what must survive

| Requirement | Route | Required input |
| --- | --- | --- |
| Generate the whole clip from words | `t2v` | `prompt` |
| Begin on one exact image | `i2v` | one keyframe image |
| Control opening and closing frames | `i2v` | two keyframe images |
| Pass through visual waypoints | `i2v` | 3–10 untimed keyframes or 1–10 timestamped pairs |
| Continue from an existing ending | `v2v` | `start_video` |
| Render an approved draft without replanning | `draft_enhance` | `draft_cache` |

Ask about the relationship to a source, not merely whether a source exists. Inspiration that can be described does not require conditioning; a frame that must literally appear does.

Complete when every source has one declared job and the route directly supports it.

### 3. Check the action budget

For a short clip, prefer one subject action and one camera move. Keep only beats that can plausibly begin, develop, and resolve within the selected duration.

Mark a brief for revision when it demands many sequential actions, multiple locations, exact mechanisms, or several complete lines of dialogue in a short clip.

Complete when the required action remains observable without depending on explanation.

### 4. Resolve contradictions

Call out incompatible requirements such as:

- locked-off camera plus orbit or tracking;
- extreme close-up plus simultaneous establishing view;
- exact source-frame preservation plus a major geometric transformation;
- one continuous shot plus hard cuts;
- production-critical generated typography with no post fallback;
- exact cross-clip speaker identity without an audition or finishing plan.

Offer the smallest concrete revision that preserves the user's outcome.

Complete when framing, motion, timing, source roles, audio, and text describe one feasible production method.

### 5. Assign deterministic finishing

Reserve these for post when exactness is a success condition:

- typography, subtitles, logos, and legal copy;
- frame-accurate audiovisual synchronization;
- final sound mixing, ducking, fades, and loudness;
- precise mechanisms or many tightly timed actions;
- guaranteed speaker identity across separate generations.

Generation can create source footage and causal timing intent; it is not a deterministic compositor, edit timeline, or final mix.

### 6. Validate payload intent

Before calling `flux3-generate`, normalize accepted aliases (`text-to-video`, `image-continuation`, `video-continuation`, and `draft-enhance`) to `t2v`, `i2v`, `v2v`, or `draft_enhance`, then branch validation by mode.

For `draft_enhance`, verify that `draft_cache` is the only generation input. Do not require or resend prompt, duration, keyframes, resolution, audio, `draft`, or `batch`; the cache carries the original generation settings.

For `t2v`, `i2v`, and `v2v`, verify:

- `prompt` is present;
- only the selected mode's input field is present;
- `keyframes` appears only for `i2v`;
- `start_video` appears only for `v2v`;
- duration is `auto` or a whole number from 5 through 20 when supplied;
- 3–10 untimed keyframes have an explicit duration;
- timestamped keyframes are non-negative, increase, and are at least 1/24 second apart;
- timestamped keyframes fall within an explicitly supplied duration;
- draft requests use HD;
- `batch` is 1–4 and appears only with `draft: true`.

Complete when the intended payload has no unknown or mode-incompatible fields.

## Output Contract

Return exactly one state with a reason and next action:

- **READY** — all consequential decisions are explicit. Include the route and compact handoff.
- **NEEDS INFO** — a missing human choice changes the route, payload, or production method. Ask only the blocking questions.
- **REVISE** — requirements conflict, exceed the action budget, or create an invalid payload. Name the conflict and propose the minimum repair.

Warnings that do not block generation belong under **Production risks**, not in a fourth state.

## Common Pitfalls

1. **Rewriting before diagnosis.** Preserve facts first; expand only after the route is stable.
2. **Asking decorative questions.** Stop only for choices that change execution.
3. **Treating a reference as mandatory conditioning.** Route by what must survive.
4. **Promising exact generative typography or sync.** Assign deterministic finishing.
5. **Returning a verdict without a handoff.** `READY` must contain enough structured context for the next skill.

## Verification Checklist

- [ ] Explicit facts, assumptions, and missing choices are separated
- [ ] Every source has one role
- [ ] Mode and payload intent match
- [ ] One required action fits the duration
- [ ] Camera and shot structure are internally consistent
- [ ] Audio and text strategies are explicit
- [ ] Deterministic finishing is assigned where exactness matters
- [ ] Output is `READY`, `NEEDS INFO`, or `REVISE` with a concrete reason

## Public References

- [FLUX 3 video prompting overview](https://docs.bfl.ai/guides/prompting_video_overview)
- [FLUX 3 API reference](https://docs.bfl.ai/api-reference/flux3)
