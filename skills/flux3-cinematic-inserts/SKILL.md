---
name: flux3-cinematic-inserts
description: Use when writing a FLUX 3 text-to-video prompt for a standalone shot. Covers shot craft, proven concept lanes, camera, continuity, and review.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, text-to-video, cinematic, b-roll, prompting
---

# FLUX 3 Cinematic Inserts

Build one premium standalone shot around **one motivated physical or atmospheric event**. The unit is an insert: B-roll, a visual bridge, a hero texture shot, or a capability probe — not a finished commercial or a deterministic animation.

Your prompt is interpreted and expanded before generation, so plain language works. Write as you would brief a colleague. The rewriting preserves what you specify, so precision buys control: every choice you state stays yours, and everything you leave out becomes the model's.

## When to Use

- Writing or repairing a text-to-video prompt for a single shot
- Directing camera, light, material behavior, and physical response
- Choosing a concept that this model actually renders well
- Reviewing a returned clip as an editor rather than as a technician

Use `flux3-keyframes-continuation` instead when supplied images or video must appear, carry a subject, or continue. Use `flux3-prompt-doctor` first when consequential choices remain unresolved, and `flux3-generate` to submit, poll, and validate.

## Workflow

### 1. Gate the deliverable

Proceed when the unit is a standalone shot with one visible event. Route elsewhere when success requires:

- stable product or character identity from supplied media;
- exact typography or sequential lettering;
- frame-accurate audiovisual synchronization or complete foley;
- a multi-step mechanism or a guaranteed state sequence;
- precise voiceover, copy, a call to action, or a finished ad;
- close human performance;
- a long, timing-critical narrative.

Complete when the request is honestly supportable as a text-only generation, or has been rerouted before generation.

### 2. Lock the creative contract

Resolve these before expanding into prose:

- **Use:** where the shot sits in the edit.
- **Frame:** subject, setting, time, composition, and aspect ratio.
- **Event:** one cause, one visible response, one payoff.
- **Camera:** locked and deliberate by default; movement only when it serves the event.
- **Light and material:** the surface or medium that reveals the event.
- **Continuity:** one set, stable geometry, continuous real time.
- **Audio:** generated texture, silence, or deterministic post.
- **Duration:** enough for setup, action, and payoff. Timing language in a prompt guides emphasis; it does not guarantee timing.

Use [templates/brief.json](templates/brief.json) as the handoff shape, and `flux3-prompt-doctor` when a decision is missing.

Complete when one sentence states the shot's visible cause, response, and payoff.

### 3. Choose a proven lane

Prefer:

- atmospheric light through fog, rain, steam, glass, or darkness;
- wet surfaces and reflections that visibly distort and settle;
- viscous or liquid macro with constrained geometry;
- tactile materials with one legible contact event;
- simple ignition or practical-light changes with a visible source;
- restrained noir or near-monochrome environments.

Read [references/field-guide.md](references/field-guide.md) before settling on a concept. Treat anything it marks experimental or parked as a capability probe, not a production promise.

Complete when the concept maps to one proven lane and has one heightened but motivated moment.

### 4. Write the shot as a causal chain

Use this order:

1. **Opening frame:** composition, subject, setting, light.
2. **Visible cause:** source and contact point in the same frame.
3. **Physical response:** direction, material behavior, and restraint.
4. **Payoff:** one final visual state that works as an edit point or a still.
5. **Camera and continuity contract:** same set and geometry; no cuts, transitions, frozen or repeated frames, teleportation, or resets.
6. **Audio intent:** name useful material textures, but route critical sync and mixing to post.

Keep cause and effect spatially close. Use concrete geometry for pours and contact events. Avoid decorative sparks, bells, clicks, or effects with no visible reason.

Complete when another reader can point to the cause, response, payoff, and continuity contract without inferring them.

### 5. Direct the camera as one contract

Name only terms that change the shot:

- **Framing:** extreme close-up, close-up, medium, wide, establishing
- **Angle:** eye level, low angle, high angle, overhead
- **Movement:** locked-off, push-in, pull-back, pan, tilt, lateral tracking, orbit, handheld follow
- **Focus:** deep focus, shallow focus, rack focus, fixed focal plane

Keep the contract physically consistent. A locked-off camera cannot track; an extreme close-up cannot establish a full environment at the same moment.

Complete when framing, movement, focus, and subject action describe one physical camera setup.

### 6. Make style visible

Translate tone into evidence: lighting source, direction, contrast, and color; palette and material response; weather, atmosphere, grain, or texture.

`Tense` becomes rigid posture, shallow breathing, and a slow push-in. `Vintage` becomes a named capture format, grain structure, and practical-light treatment.

Complete when every style phrase changes something visible or audible.

### 7. Draft first, then commit

Hand the finished prompt to `flux3-generate` as a text-only request — no input field attached.

Default to `draft: true` for anything unproven. A draft is a fast, low-step preview that costs less and returns sooner than a full render, which takes several minutes. It answers the question you actually have early on — does this concept work? — and it hands back a `draft_cache` you can replay at full quality later without rewriting anything.

Ask which question you are asking:

- **Exploring** — is the concept right, does the event read, is the composition working? Draft.
- **Committing** — the concept is settled and you need the deliverable. Render at full quality, or enhance the draft you already chose.

Skip drafting when the concept is one you have shipped before and you only need the asset.

**Judge a draft on concept, not on finish.** Low-step previews look rougher than the final: fine material detail, texture, and grain will be worse. Read a draft for event legibility, composition, camera behavior, and continuity. Rejecting a strong concept because the preview looks soft is the fastest way to throw away a good shot.

Because `draft_enhance` replays the same prompt, seed, and settings, the full-quality render is the same shot you approved — not a fresh roll of the dice.

### 8. Iterate with a variation ladder

For a new concept, generate one pilot or a small ladder in which each variant changes only one consequential dimension:

1. event geometry;
2. material or light behavior;
3. composition or aspect ratio;
4. duration or payoff.

Run the ladder as drafts. Cheap variants are what make a controlled ladder worth running at all — at full-render cost the temptation is to change several things at once and lose the causal signal.

After two structurally similar misses, stop rerolling. Change the concept, the conditioning approach, or the production method. Do not spend retries trying to make a text-only generation deterministic.

Complete when every rerun tests a named hypothesis, and none exists only because the previous clip was close.

### 9. Review as an editor

Apply every item in [references/review-scorecard.md](references/review-scorecard.md). A technically valid clip is not enough: it must be useful, physically legible, compositionally deliberate, and interesting.

Complete when the verdict is recorded with its physical and editorial reason.

## Output Contract

Return:

1. **Creative contract** — event, camera, duration, and continuity;
2. **Final prompt** — ready for a text-only request;
3. **Lane and rationale** — which proven pattern the concept sits in;
4. **Audio and text handoff** — what another skill or post must own;
5. **Risks** — likely failure modes or deterministic finishing needs;
6. **Variants** — only when requested, one controlled change each.

## Common Pitfalls

1. **Appending "cinematic video" to an image prompt.** Direct motion, camera, and physical response.
2. **Staging an event with no visible cause.** Keep source, contact, and response in one frame.
3. **Overloading a short clip.** One event, made premium, beats three events rendered thinly.
4. **Using incompatible camera terms.** Write one physical camera contract.
5. **Spending words on invisible mood labels.** Convert style into visible evidence.
6. **Adding unmotivated spectacle.** Sparks, bells, and effects need a reason on screen.
7. **Burning full renders on an unproven concept.** Draft first; a full generation takes minutes.
8. **Rejecting a draft because it looks rough.** Low-step previews are meant to look rough. Judge the concept.
9. **Changing several variables between trials.** Preserve causal learning with controlled variants.
10. **Treating generated audio as an edit clock.** It is texture; sync belongs in post.
11. **Promising exact typography or edit timing.** Plan deterministic post.

## Verification Checklist

- [ ] The deliverable is honestly a standalone single-event shot
- [ ] Cause, response, and payoff are each explicit
- [ ] The concept sits in a proven lane
- [ ] Camera terms are physically compatible
- [ ] The continuity contract rules out cuts, resets, and frozen frames
- [ ] Style is expressed through visible or audible evidence
- [ ] Audio and text have clear owners
- [ ] An unproven concept was drafted before a full render
- [ ] Drafts were judged on concept and legibility, not on finish
- [ ] Each variant changes one named dimension
- [ ] The clip is reviewed as an editor would, not only as a technician

## Positioning Boundary

This skill creates evocative standalone footage, not finished communication. Generated sound can be excellent texture but is not an edit clock. Physically correct can still be boring. The winning unit is one simple event made premium through composition, motivated light, material response, and a clean payoff.

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for prompting guidance and generation settings
