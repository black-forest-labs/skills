---
name: flux-3-product-spot
description: Use when building a finished product ad from FLUX 3 - shot design, voiceover, action-to-word sync, evidence-gated copy, deterministic assembly, and QC gates that catch clipped audio and floating products.
metadata:
  author: Black Forest Labs
  version: "1.1.0"
  tags: flux, flux-3, bfl, product-ad, commercial, voiceover, assembly, copy, editing, qc
---

# FLUX 3 product spots

A finished spot is two jobs, not one. FLUX 3 generates picture and voice. A
deterministic pass cuts, times, captions and masters them. Keep the boundary
sharp: the model handles what only a model can, and everything a computer can
compute exactly stays out of the model's hands.

Route facts this skill depends on live in `flux-3-generate`. Read it first for
`/v1/flux-3-video`, polling and download behaviour.

## Shape of the work

1. Design shots that survive generation.
2. Generate picture plates and VO in the same round.
3. Screen VO by machine, then listen.
4. Derive timing from the audio.
5. Assemble deterministically.
6. Gate on measurements, including the failures that look like passes.

## 1. Shot design

Three cuts carry a 10-second spot: **reveal, proof, payoff**. Reveal
establishes the object, proof shows it doing the one thing the copy claims,
payoff lands the brand.

**Anchor motion at its endpoints.** A generated clip is trustworthy at its
first and last frame and inventive in between. Motion whose midpoint is implied
by its endpoints survives; motion that requires the model to invent geometry
does not.

Works: a highlight travelling across a surface, a collar rotating through a
short arc and stopping, a handle rising and stopping, a lid parting slightly.

Fails: multiple revolutions, travel combined with rotation, and anything that
passes behind the product. A crank asked for 2 to 3 full revolutions rotated
correctly to about 180 degrees, then deformed and vanished as the arm occluded
itself. The same product's collar rotation succeeded because it stayed in plane.

**Name the grounding in every prompt.** Say the product's contact shadow and
its reflection explicitly. A product can hold identity and motion perfectly and
still look pasted onto the frame because nothing defended its shadow. This
passes identity checks and reads as fake instantly to a human.

**Camera lock is advisory.** "Locked camera, no push-in, no pan, no zoom" still
permits parallax and drift. Design shots that tolerate a little movement rather
than expecting the prompt to forbid it.

## 2. Generate picture and VO together

Finished product ads carry voiceover. Budget it in the first generation round,
never bolt it on after picture lock: the VO determines the length of the spot,
so generating it last means re-cutting everything.

Get VO from audio-only jobs: a voice-booth scene whose picture is discarded and
whose audio is harvested. Generate at least two scripts against two speaker
profiles, because takes are not interchangeable and you want a real choice.

Do not use native picture audio in a finished spot. Generate picture silent.

## 3. Screen VO by machine, then listen

Transcribe each take and compute word error rate against the script. This
catches dropped and mangled lines cheaply.

**Invented brand names need phonetic matching, not exact matching.** ASR has
never seen your product name and will spell it plausibly wrong: "Ferrolane"
came back as "Feraline", "Feralaine" and "Fairlane". An exact-token check
rejected every correct take. Score brand names by phonetic similarity over a
sliding window and treat a close match as evidence the name was spoken.

Machine screening cannot approve a take. Pronunciation, cadence and synthetic
artefacts need a human ear. Mark every invented name unverified until someone
listens.

## 4. Derive timing from the audio

The VO is the master clock. Everything else is measured from it.

**Find the end of speech by energy, not by word timestamp.** A transcriber's
final word timestamp marks where a word stops being intelligible, not where its
energy reaches the noise floor. On a real stem the transcriber reported the last
word ending at 9.76s while audible decay continued to about 9.9s. Trimming
there clipped the final word off the master, and every duration and loudness
gate still passed.

Detect silence at a true noise floor instead, and **count only silence that
runs to end of file**. Taking the last silence region is a second, subtler bug:
on that same stem the final gap sat *before* the last word, so trusting it cut
the master even shorter than the timestamp did.

**Place cuts in measured gaps.** Candidates are pause centres, best first:
sentence pauses at a deep floor, then word gaps at a shallower one. Never cut
mid-word. If no placement fits, fail loudly and say why: the fix is a longer
plate, another shot or a shorter read, not a cut inside a word.

Score placements on gap quality **minus** pacing imbalance. Gap quality alone
picks the single best-hidden cut in the read and cheerfully produces a 1.6
second opening shot against a 4.9 second middle.

Every segment must fit the plate it comes from. Check it. A hand-measured cut
once demanded a 5.72s segment from a 5.04s plate.

**Slip each plate so its action lands on the word that names it.** This is the
single highest-leverage edit decision available, and taking the segment from the
middle of the plate throws it away.

Measure where the action is: `signalstats` YDIF gives a per-frame luma delta,
which smoothed over five frames is a usable proxy for when the thing happens.
Skip four frames at each end, or the decode boundary and the fade read as peaks.
Then declare, per shot, which spoken word the action is *about*, and choose the
in-point so the two coincide.

Measured on a real pair of spots before this existed: the shell finished opening
1.70s after the voice said "opens flat", the collar clicked 2.33s after "one
honest click", the handle rose 1.00s before its word. A viewer cannot articulate
that, but it is the difference between an ad and footage with narration on top.

Fold the anchor into the cut search too. A cut that hides beautifully but leaves
a shot no room to slip is worse than a slightly more visible one that lets the
picture and the voice say the same thing at once.

Gate the result. If an action lands more than ~0.6s from its word, fail. When
the plate physically cannot reach the word, say so with the reachable window:
the fix is regenerating with the action earlier or re-anchoring to a word the
plate can actually hit, and both are honest. Silently absorbing the miss is not.

Take a segment from the middle of its plate only when no anchor applies.
Generated clips are weakest in their first frames, where the image settles, and
in their last.

## 5. Assemble deterministically

No model call happens after generation. Same inputs, same master.

Drive it from a manifest that carries **content only**: which plates, which VO,
what the copy says. Cut points, spot length, loudness target and end-card
treatment are all derived from the media at build time. A per-product number in
a config file is a number someone has to re-measure by hand for the next
product.

**Decide the end card from measured luminance.** Sample the region the text will
occupy and add a scrim only when it is too bright for white copy. White text
over a light sand-coloured case was nearly unreadable while identical text on a
dark set needed nothing. Measuring separates those cases without a flag.

If you need a scrim, run the gradient to the frame edge. A floating band has two
visible edges to hide; an edge-anchored gradient has one.

**Target loudness the material can reach.** These stems are peak-limited, not
level-limited: one measured -21.3 LUFS integrated with true peak already at
-4.2 dBTP. Reaching -14 LUFS demands about +7 dB, which drives true peak well
past the ceiling, so the normaliser clamps and lands short no matter what you
ask for. Compression recovered 0.4 LU and damaged the approved read.

Use the normaliser's own first-pass report of what it can deliver under the
peak ceiling, and gate against that. Do not derive the ceiling from a single
transient sample peak, which is far too pessimistic. And do not lower a target
until a gate turns green; that is not a pass, it is a hidden failure.

## 6. Gate on measurements

Duration, resolution, frame rate, audio presence, loudness and true peak are
table stakes. They are also insufficient. Add the gates that catch failures
which look like passes:

- **Clipped tail.** Measure energy in the final quarter-second before the
  closing fade. Still-loud speech there means the master ends mid-word.
- **Black frames in the body.** A dropped plate or a bad transition offset
  shows as black that every other gate passes. Exclude the intended closing
  fade.
- **Grounding.** Crop and magnify the product base mid-shot. A missing contact
  shadow survives identity and motion checks.
- **Interior frames.** Sample at several points, not just first and last.
  Geometry decays in the middle, which is exactly where a first-versus-last
  comparison cannot see.

**Validate a gate against a known-bad file.** A gate that has never failed is a
guess. Hard-cut a master mid-word and confirm the gate fails it: on real
material the intact file measured -91 dB in that window and the broken one -34
dB, so a -30 dB threshold would have passed the broken file. Threshold chosen by
inspection, then confirmed against the control.

**Never weaken a gate to get a green run.** Fix the material or state the
failure. Watch for the softer version of this: when a check fires, the tempting
move is to trim whatever number it complained about until it stops. A collision
warning got answered by shortening callout holds to 0.5s, which cleared the
overlap and left the claims too brief to read. The gate went green and the ad
got worse. If a fix makes the check pass by making the work worse, it is not a
fix, and the gate is measuring the wrong thing.

**A warning nobody acts on is a bug in the gate.** "Callout outlives its shot"
sat at warning level while a render shipped with a label surviving across a cut,
pointing at a feature no longer on screen. If a condition means the output is
wrong, it is an error.

## Copy

On-screen copy invents claims faster than picture does, because writing a
plausible spec costs nothing.

**Require evidence for every line, and name which kind.** *Seen* means it is
visible in the plate the label points at. *Spec* means it is part of the
reference design. *Said* means the approved VO says it. A line with no evidence
does not ship.

Two labels failed this on real work: "TWO-STAGE LOCK" and "COLD-FORGED". Both
name mechanisms and processes that were never designed, generated or spoken.
They read as confident specifications and were simply invented, which in a piece
demonstrating a pipeline is worse than vague copy.

**Put the proof in the noun or the number.** "38 litres" beats "generous
capacity". Name the material and the part: *stainless body*, *walnut sleeve*,
*charcoal zip band*. Outcome adjectives (smooth, precise, effortless, honest)
assert something the plate cannot show, so they need the VO behind them or they
go.

**Name the part the way a person would.** "Telescoping stem" is nobody's word
for a handle.

## Editing

Three identical dissolves is not an edit, it is a default. It says the same
thing about every pair of shots when the relationships differ.

Keep the vocabulary small and give each treatment a job: a **hard cut** between
two views of the same object, where continuity is obvious and confidence is the
point; a short **dissolve** for a change of scale or subject; a two-frame
**flash** into the payoff, where the edit should feel like arrival. Sample the
flash colour from the plate's own highlights. White on a warm set looks like a
blown frame.

**Give the camera a move that finishes.** A push that runs at constant speed for
the whole shot reads as software. Ease it, arrive early, then hold: the hold is
what makes a move look intended.

**Add the imperfections generation leaves out.** Generated plates are optically
dead. Sub-pixel seeded noise on the transform (two octaves, roughly a pixel at
960px) reads as a rig rather than a weld, and light grain dithers the smooth
gradients that band after H.264. Both should be invisible and only missed when
absent. Seed them, so rebuilds stay byte-identical.

## Renderer choice

ffmpeg is enough for cuts, dissolves, captions, scrims, fades, loudness and
muxing, and it is already installed everywhere.

Remotion is worth it when the end card grows into real design: layout, web
fonts, data-driven variants, many sizes. It is React, so a gradient is one
CSS declaration rather than a generated alpha ramp overlaid at a computed
offset, and the studio gives you a scrubbable preview.

Two things to know before choosing it. Licensing: Remotion is free for
individuals and companies up to three people, and a company of four or more
needs a paid Company License. Audio: the browser plays a stem as it is, with no
loudness normalisation, so an unmastered take renders at its raw level. Master
audio with ffmpeg first and hand Remotion a finished stem.

Both renderers can consume the same derived timing. Keep the measurement in one
place and let the renderer be a choice rather than a rewrite. Matching them
exactly takes care: text placement differs because a caption filter positions
the glyph box while CSS includes the font's ascent leading, and a cross-dissolve
must start *at* the cut rather than finish there.

## Reference

`references/pipeline.md` documents a working implementation: manifest schema,
derived-timing export, both renderers, and the QC gate list with the measured
thresholds and negative control.
