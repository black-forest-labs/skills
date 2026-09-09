---
name: flux-3-prompt-doctor
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
call the API. On `READY`, name the next writer: `flux-3-prompting` for a general scene,
multi-shot prompt, or mode choice; `flux-3-cinematic-inserts` for one insert built on a
single motivated physical or atmospheric event from its field guide;
`flux-3-keyframes-continuation` when supplied media must appear;
`flux-3-audio-dialogue` when sound needs its own brief; `flux-3-archival-formats` for a
period look; `flux-3-product-ads` for a finished ad; `flux-3-generate` when the user
asked to run it.

## Route by what must survive

Every request names its `mode` and carries the matching media field:

| Requirement | Route |
| --- | --- |
| Generate the whole clip from words | `mode: "t2v"`, no media |
| An image must appear on screen exactly as shot | `mode: "i2v"`, `keyframes` |
| Bridge an exact opening and closing frame | `mode: "i2v"`, two keyframes |
| Pass through visual waypoints | `mode: "i2v"`, keyframes as a storyboard |
| Continue from an existing ending | `mode: "v2v"`, `start_video` |
| Render an approved draft without replanning | `mode: "draft_enhance"`, `draft_cache` |

Two questions separate the image routes: must these exact pixels be on screen
(`keyframes`)? Can the source simply be described (then attach nothing)? There is no
field that carries a subject's identity without putting the source on screen; a brief
that needs one either opens each shot from a keyframe containing the subject, or is a
`REVISE`.

## Feasibility

- **Action budget:** one subject action and one camera move is the reliable shape for a
  short clip. Many sequential actions, several locations, or multiple full dialogue
  lines are **Production risks**, not a `REVISE`: recommend a draft test, a split into
  shots or generations, or post. Reserve `REVISE` for a real contradiction and for
  exactness that generation cannot own.
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

- **READY**: route, assumptions, handoff, and the next skill, which must be one of
  `flux-3-prompting`, `flux-3-cinematic-inserts`, `flux-3-keyframes-continuation`,
  `flux-3-audio-dialogue`, `flux-3-archival-formats`, `flux-3-product-ads`, or
  `flux-3-generate`. Recommend a draft first when the concept is unproven.
- **NEEDS INFO**: only the blocking questions.
- **REVISE**: name the conflict and the minimum repair.

Non-blocking warnings go under **Production risks**, not a fourth state. Field names
and limits belong to the [API reference](https://docs.bfl.ai); flag intent conflicts
and leave schema validation to `flux-3-generate`.
