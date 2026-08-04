# FLUX 3 Prompt Doctor

Use this gate before expanding a prompt or calling the API. Its job is to protect decisions a model should not invent.

## Readiness contract

A brief is ready only when it answers:

| Decision | Question |
| --- | --- |
| Outcome | Where will the clip be used, and what visible fact makes it successful? |
| Subject | Who or what must appear? |
| Action | What single movement, event, or state change is non-negotiable? |
| Input intent | Generate from text, animate frame(s), continue video, or enhance a draft? |
| Invariants | What identity, geometry, wardrobe, framing, motion, environment, or end state must survive? |
| Delivery | What aspect ratio, duration, and resolution are intentional? |
| Shot structure | One continuous shot or an explicit sequence? |
| Camera | What framing, angle, movement, and focus behavior matter? |
| Audio | Which speech, ambience, effects, and music layers are wanted? |
| Text | Spoken, physical in-scene, generated graphic, absent, or deterministic post? |

If a missing answer changes the mode, payload, or production method, stop and get it. Decorative choices can remain open.

## Routing

- **Prompt only** → `t2v`
- **One exact opening frame** → `i2v` with one keyframe
- **Exact opening and closing frames** → `i2v` with two keyframes
- **Several visual waypoints** → `i2v` with ordered or timestamped keyframes
- **Continue an existing ending** → `v2v` with `start_video`
- **Render an approved draft without replanning** → `draft_enhance` with `draft_cache`

Ask about the relationship to the source rather than asking only “image-to-video or text-to-video?” A reference used for inspiration does not require image conditioning. A frame that must literally appear does.

## Feasibility cautions

Route the relevant layer to deterministic post when success depends on:

- exact typography or subtitles;
- frame-accurate audiovisual synchronization;
- a complete final sound mix;
- a precise multi-step mechanism;
- a guaranteed speaker identity across separate generations;
- many tightly timed actions in a short clip.

The prompt can state causal and timing intent, but it cannot turn generation into a deterministic compositor or edit timeline.

## Payload gate

Before submission, verify:

- `mode` is one of `t2v`, `i2v`, `v2v`, or `draft_enhance`;
- `prompt` is present except for `draft_enhance`;
- only the selected mode's input field is present;
- `keyframes` is present only for `i2v`;
- `start_video` is present only for `v2v`;
- `draft_cache` is the only generation input for `draft_enhance`;
- duration is `auto` or a whole number from 5 to 20;
- 3–10 untimed keyframes have an explicit duration;
- timestamped keyframes increase, stay within duration, and are at least 1/24 second apart;
- draft requests use HD;
- `batch` is 1–4 and appears only with `draft: true`;
- the payload has no invented fields, because the schema is strict.

## Output states

- **READY** — all consequential decisions are explicit.
- **NEEDS INPUT** — a missing choice changes routing or request construction.
- **CAUTION** — generation can attempt the request, but deterministic finishing is required for the stated success condition.
- **INVALID** — the API payload violates the mode or schema.

The gate is complete only when it produces one of these states with a concrete reason.
