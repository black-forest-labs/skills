---
name: flux3-video
description: Use when routing a general FLUX 3 video request. Select only the specialists needed for diagnosis, direction, audio, or execution.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, video-generation, routing
---

# FLUX 3 Video Router

Route a FLUX 3 video request to the smallest set of specialist skills that can complete it. This skill is an index and handoff contract, not an all-in-one prompting guide.

## When to Use

- The user asks generally to make, animate, continue, or troubleshoot a FLUX 3 video
- The request spans creative direction, conditioning media, audio, and API execution
- The correct specialist workflow is not yet clear

Use a specialist directly when the request already names one narrow job.

## Route by Job

| User intent | Primary skill |
| --- | --- |
| Diagnose or repair a brief before generation | `flux3-prompt-doctor` |
| Write a text-to-video prompt for a new shot | `flux3-cinematic-inserts` |
| Build from supplied images or video — frames, references, or continuation | `flux3-keyframes-continuation` |
| Direct dialogue, voiceover, ambience, effects, or music | `flux3-audio-dialogue` |
| Submit, poll, enhance, download, or technically review a job | `flux3-generate` |

## Composition Rules

1. **Start with diagnosis when consequential choices are missing.** Use `flux3-prompt-doctor` until the brief is `READY`. It also owns the shot-structure decision — one continuous take or an explicit multi-shot sequence.
2. **Choose one visual-direction skill.** Use `flux3-cinematic-inserts` for generation from an idea; use `flux3-keyframes-continuation` when supplied media must appear, carry a subject, or continue.
3. **Add audio only when sound matters.** Load `flux3-audio-dialogue` for speech, voice, ambience, effects, music, or deliberate silence.
4. **Generate only when execution is requested.** Use `flux3-generate` after the prompt and payload intent are ready.
5. **Draft before committing on anything unproven.** A full render takes several minutes; a low-step draft answers whether the concept works, and the chosen draft replays at full quality without replanning.

Do not load every specialist by default. Each additional skill must own a decision or deliverable in the current request.

## Shared Handoff Contract

Pass these fields between skills:

- **Outcome:** use, audience, and visible success condition
- **Attached input:** none, `keyframes`, `reference_images`, `reference_video`, or `start_video` — at most one
- **Subject and action:** the one required movement, event, or state change
- **Source roles:** what each image, video, or draft cache must contribute
- **Invariants:** identity, geometry, wardrobe, framing, environment, motion, or end state that must survive
- **Delivery:** duration, aspect ratio, resolution, and shot structure
- **Camera:** framing, angle, movement, and focus behavior
- **Audio:** speech, ambience, effects, music, or silence
- **Text:** spoken, physical in-scene, generated, absent, or deterministic post
- **Risks:** anything requiring deterministic finishing or a revised route

A handoff is complete when the receiving skill can act without inventing a consequential choice.

## Default Sequence

```text
Prompt Doctor → Cinematic Inserts OR Keyframes & Continuation
              → Audio & Dialogue when needed
              → Generate when execution is requested
```

Skip completed stages. A validated prompt that only needs submission goes straight to `flux3-generate`; an API-free prompt-writing request stops after creative direction.

## Common Pitfalls

1. **Treating the router as the workflow.** Route, then use the specialist that owns the work.
2. **Loading both visual skills without a reason.** Choose by whether supplied media must constrain the result.
3. **Calling the API before the brief is ready.** Resolve missing human choices first.
4. **Hiding deterministic requirements in generation.** Exact typography, frame-accurate sync, and final mixing need an explicit post-production plan.

## Verification Checklist

- [ ] Every requested deliverable has one owning skill
- [ ] Only relevant specialists are selected
- [ ] The handoff includes attached input, action, source roles, invariants, delivery, audio, text, and risks
- [ ] API execution occurs only when requested
- [ ] No consequential choice is silently invented

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for FLUX 3 endpoints, inputs, and prompting guidance
