---
name: flux3-prompt-doctor
description: Use when diagnosing a FLUX 3 brief before generation. Resolve missing, conflicting, or schema-changing requirements.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, prompt-doctor, validation, routing
---

# FLUX 3 Prompt Doctor

Resolve the decisions that change routing, payload, or production method before a brief
becomes a prompt. Ask only blocking questions; use documented defaults or label
assumptions for everything else. Preserve the user's product names, exact copy, source
roles, and hard constraints verbatim. This skill does not write the final prompt or
call the API.

## Route by what must survive

A request carries a prompt plus **at most one** input field; the field is the
instruction, and there is no generation `mode`:

| Requirement | Attach |
| --- | --- |
| Generate the whole clip from words | nothing |
| An image must appear on screen exactly as shot | `keyframes` |
| Bridge an exact opening and closing frame | `keyframes`, two images plus an explicit duration |
| Pass through visual waypoints | `keyframes`, as a storyboard |
| Only the subject carries into a new scene | `reference_images` |
| Keep the cast from a clip, build a new shot | `reference_video` |
| Continue from an existing ending | `start_video` |
| Render an approved draft without replanning | `draft_cache` with `mode: "draft_enhance"` |

Three questions separate the image routes: must these exact pixels be on screen
(`keyframes`)? Must the subject stay recognizable in a scene you have not shot
(`reference_images`)? Can the source simply be described (attach nothing)? A brief that
wants both exact frames and carried-over identity needs a decision, not both.

## Feasibility

- **Action budget:** one subject action and one camera move per short clip. Revise
  briefs demanding many sequential actions, several locations, exact mechanisms, or
  multiple full dialogue lines.
- **Shot structure:** state one continuous unbroken take, or an explicit sequence:

  ```text
  SHOT ONE: wide aerial of a desert highway at dawn, a single red car speeding through.
  HARD CUT. SHOT TWO: interior close-up, the driver's hands drumming the wheel to the radio.
  HARD CUT. SHOT THREE: from the roadside, the car shrinking into the heat haze.
  Warm engine hum under one continuous music bed across all three shots.
  ```

  Consecutive shots must contrast hard (scale, location, color) or the cut blends into
  a continuous take; each shot needs its own beat; one music bed can run across cuts.
- **Contradictions to catch:** locked-off camera plus tracking; extreme close-up plus
  establishing view; exact frame preservation plus major geometric change; one
  continuous shot plus hard cuts; production-critical generated typography with no
  post fallback; guaranteed speaker identity across separate generations.
- **Reserve for deterministic post** when exactness is a success condition:
  typography, subtitles, logos; frame-accurate sync; final mixing; precise mechanisms;
  cross-generation speaker identity. Generation creates footage and causal intent, not
  a compositor or final mix.

## Verdict

Return exactly one state, with a reason, next action, and a compact handoff
([templates/brief.md](templates/brief.md) when it should be reusable):

- **READY**: route, assumptions, handoff. Recommend a draft first when the concept is
  unproven.
- **NEEDS INFO**: only the blocking questions.
- **REVISE**: name the conflict and the minimum repair.

Non-blocking warnings go under **Production risks**, not a fourth state. Field names
and limits belong to the [API reference](https://docs.bfl.ai); flag intent conflicts
and leave schema validation to `flux3-generate`.
