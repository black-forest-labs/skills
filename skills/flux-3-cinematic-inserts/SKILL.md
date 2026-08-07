---
name: flux-3-cinematic-inserts
description: Use when writing a FLUX 3 text-to-video prompt for a standalone shot. Covers shot craft, reliable concept patterns, camera, continuity, and review.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, text-to-video, cinematic, b-roll, prompting
---

# FLUX 3 Cinematic Inserts

Build one standalone shot around **one motivated physical or atmospheric event**: B-roll,
a bridge, a material detail, a capability test. Reroute when success requires supplied
media (`flux-3-keyframes-continuation`), exact typography, frame-accurate sync, a
multi-step mechanism, close human performance, or finished ad copy; those need
conditioning or post, not a text-only generation.

Before writing, settle the contract in one sentence: the visible cause, the physical
response, and the payoff. Then pick a proven lane from
[references/field-guide.md](references/field-guide.md) (atmospheric light in a medium,
wet reflections, viscous macro, tactile contact and ignition, restrained noir); treat
anything it marks experimental or parked as a test, not a promise.

Write the shot in this order:

1. **Opening frame**: composition, subject, setting, light.
2. **Visible cause**: source and contact point in the same frame as the response.
3. **Physical response**: direction, material behavior, restraint.
4. **Payoff**: one final state that works as an edit point or a still.
5. **Continuity contract**: same set and geometry; no cuts, transitions, frozen or
   repeated frames, or resets.
6. **Audio intent**: name material textures; route critical sync and mixing to post.

Camera is one physical contract: framing, angle, movement, focus. A locked-off camera
cannot track; an extreme close-up cannot establish. Locked and deliberate by default;
move only when it serves the event.

Style must be visible: "tense" becomes rigid posture, shallow breathing, and a slow
push-in; "vintage" becomes a named capture format, grain structure, and practical
light. No unmotivated sparks, bells, or effects.

Draft first (`draft: true`) while the concept is unproven, and judge the draft on event
legibility, composition, camera, and continuity; softness is the low-step trade and
resolves at full quality. Iterate as a ladder, one consequential change per variant:
event geometry, then material or light, then composition, then duration. After two
structurally similar misses, change the concept or the production method, not the
adjectives. Review the result with
[references/review-scorecard.md](references/review-scorecard.md): a technically valid
clip still has to be useful, physically legible, deliberate, and interesting.

Hand the finished prompt to `flux-3-generate` as a text-only request, with the risks and
anything post must own.
