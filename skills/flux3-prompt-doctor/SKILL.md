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

Do not use this skill to write the final cinematic prompt or call the API. When available, hand a `READY` brief to `flux3-cinematic-inserts` for text-only shots, `flux3-keyframes-continuation` for source-conditioned shots, `flux3-audio-dialogue` when sound needs specialist direction, and `flux3-generate` for execution. Otherwise, return a self-contained handoff naming the specialist needed.

## Readiness Contract

A brief is ready only when it answers:

| Decision | Question |
| --- | --- |
| Outcome | Where will the clip be used, and what visible fact makes it successful? |
| Subject | Who or what must appear? |
| Action | What single movement, event, or state change is non-negotiable? |
| Input intent | Generate from text alone, or attach one input — exact frames, subject references, a cast video, or a clip to continue? |
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

A request carries a prompt plus **at most one** attached input, and that field is the instruction. There is no `mode` to choose for generation — routing means picking which field, if any, the media belongs in.

| Requirement | Attach |
| --- | --- |
| Generate the whole clip from words | nothing |
| An image must appear on screen exactly as shot | `keyframes` |
| Bridge an exact opening and closing frame | `keyframes`, two images plus an explicit duration |
| Pass through visual waypoints | `keyframes`, as a storyboard |
| Only the subject needs to carry over into a new scene | `reference_images` |
| Keep the cast from a clip, build a new shot | `reference_video` |
| Continue from an existing ending | `start_video` |
| Render an approved draft without replanning | `draft_cache` with `mode: "draft_enhance"` |

Ask about the relationship to a source, not merely whether a source exists. Three questions separate the image routes:

- Must these exact pixels be on screen? → `keyframes`
- Must this person or object stay recognizable in a scene you have not shot? → `reference_images`
- Can the source simply be described? → attach nothing

Inspiration that can be described does not require conditioning. Sending two input fields is a request error, so a brief that wants both exact frames and carried-over identity needs a decision, not both.

Complete when every source has one declared job and one home, or is dropped.

### 3. Check the action budget

For a short clip, prefer one subject action and one camera move. Keep only beats that can plausibly begin, develop, and resolve within the selected duration.

Mark a brief for revision when it demands many sequential actions, multiple locations, exact mechanisms, or several complete lines of dialogue in a short clip.

Complete when the required action remains observable without depending on explanation.

### 4. Decide shot structure

One generation can hold either a single unbroken take or several shots with real cuts. Decide which, and make the brief say so.

For one take, ask for `one continuous unbroken shot`. Hand it to `flux3-cinematic-inserts`.

For a sequence, label the shots and mark each transition:

```text
SHOT ONE: wide aerial of a desert highway at dawn, a single red car speeding through.
HARD CUT. SHOT TWO: interior close-up, the driver's hands drumming the wheel to the radio.
HARD CUT. SHOT THREE: from the roadside, the car shrinking into the heat haze.
Warm engine hum under one continuous music bed across all three shots.
```

Two constraints make a sequence work:

- **Consecutive shots must contrast strongly** in scale, location, or color. Near-identical coverage blends into a continuous take instead of reading as a cut.
- **Each shot still needs its own action budget.** Three shots in a short clip means three beats, not three complete scenes.

Audio can run across the cuts — one music bed under a whole sequence holds together.

Mark a brief for revision when it wants many shots inside a short duration, or when the cuts it describes are between near-identical framings.

Complete when the brief states one continuous take or an explicit shot count, and a sequence contrasts enough to read.

### 5. Resolve contradictions

Call out incompatible requirements such as:

- locked-off camera plus orbit or tracking;
- extreme close-up plus simultaneous establishing view;
- exact source-frame preservation plus a major geometric transformation;
- one continuous shot plus hard cuts;
- production-critical generated typography with no post fallback;
- exact cross-clip speaker identity without an audition or finishing plan.

Offer the smallest concrete revision that preserves the user's outcome.

Complete when framing, motion, timing, source roles, audio, and text describe one feasible production method.

### 6. Assign deterministic finishing

Reserve these for post when exactness is a success condition:

- typography, subtitles, logos, and legal copy;
- frame-accurate audiovisual synchronization;
- final sound mixing, ducking, fades, and loudness;
- precise mechanisms or many tightly timed actions;
- guaranteed speaker identity across separate generations.

Generation can create source footage and causal timing intent; it is not a deterministic compositor, edit timeline, or final mix.

### 7. Validate request intent

Check intent, not schema. `flux3-generate` validates fields against the live reference; this step confirms the plan produces a coherent request at all:

- the brief names exactly one attached input, or a deliberate text-only request;
- that input matches what must survive — on-screen pixels, subject identity, cast, or a continuing ending;
- a start-and-end morph carries an explicit whole-number duration, otherwise the frames read as a storyboard;
- duration, aspect ratio, and resolution are either chosen or knowingly left on `auto`;
- a draft replay carries only its cache, with no prompt or media resent;
- reproducibility needs are stated, so a seed gets recorded.

Field names, enum values, and numeric limits belong to the [API reference](https://docs.bfl.ai), not to this brief. Flag intent conflicts and leave schema validation to execution.

Complete when the plan maps to one request carrying one intent.

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
- [ ] Every source has one role, and at most one input is attached
- [ ] The attached field matches what must survive
- [ ] One required action fits the duration
- [ ] Shot structure is stated, and any sequence contrasts enough to read as cuts
- [ ] Camera and shot structure are internally consistent
- [ ] Audio and text strategies are explicit
- [ ] Deterministic finishing is assigned where exactness matters
- [ ] Output is `READY`, `NEEDS INFO`, or `REVISE` with a concrete reason

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for input fields, settings, limits, and prompting guidance
