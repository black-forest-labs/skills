---
name: flux3-cinematic-video
description: Use when writing a cinematic FLUX 3 video prompt. Covers shot plans, camera direction, timing, and variants.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, cinematic-video, t2v, prompting, camera
---

# FLUX 3 Cinematic Video

Direct one strong FLUX 3 shot by default from an idea, script, or treatment. Use a multi-shot structure only when explicitly requested. Build the prompt around observable motion, camera intent, physical response, and a readable payoff.

Your prompt is interpreted and expanded before generation, so plain language works — write as you would brief a colleague. The rewriting preserves what you specify, so precision buys control: every choice you state explicitly stays yours, and everything you leave out becomes the model's call.

## When to Use

- Writing or repairing a text-to-video prompt
- Converting a script beat or treatment into a shot plan
- Directing camera, lens, blocking, motion, lighting, and pacing
- Creating controlled variants of one visual plan

When available, use `flux3-keyframes-continuation` instead when supplied images or video must constrain the result, and use `flux3-prompt-doctor` first when consequential choices remain unresolved.

## Workflow

### 1. Lock the shot contract

Capture:

- subject and one required action;
- environment and visible physical response;
- opening state and payoff;
- framing, angle, movement, focus, and perspective;
- duration and aspect ratio;
- one continuous shot or an explicit sequence;
- audio and text handoffs.

Complete when the shot can be described in one sentence without relying on mood words alone.

### 2. Set the action budget

For a short clip, favor one subject action and one camera move. Give motion a beginning, development, and payoff.

```text
Opens on a locked wide shot of a still harbor at dawn. A slow push-in begins as gulls
lift off the water, and the shot settles as sunlight breaks the horizon.
```

Write beats as a described progression rather than a timecode list. A prompt timeline directs emphasis; it is not a frame-accurate contract, and numeric timings in prose do not bind the generator. Exact placement belongs to keyframes, which address frames rather than seconds — see `flux3-keyframes-continuation`. Move exact sync and production-critical lettering to deterministic post.

Complete when every beat can plausibly finish within the chosen duration.

### 3. Build a motion hierarchy

Direct motion in this order:

1. **Subject motion** — the required visible action;
2. **Camera motion** — how the viewer follows or observes it;
3. **Environmental response** — fabric, foliage, rain, dust, reflections, crowds, or debris reacting physically;
4. **Secondary motion** — details that add life without competing with the action.

Use concrete nouns and verbs:

- `A cyclist pedals three times, brakes, and stops at the crosswalk.`
- `Rainwater breaks the neon reflection and settles after the tire passes.`
- `The camera tracks low beside the fox as branches whip past the frame.`

Complete when each motion phrase has an observable subject and does not contradict another layer.

### 4. Direct the camera as one contract

Name only terms that change the shot:

- **Framing:** extreme close-up, close-up, medium, wide, establishing
- **Angle:** eye level, low angle, high angle, overhead
- **Movement:** locked-off, push-in, pull-back, pan, tilt, lateral tracking, orbit, handheld follow
- **Focus:** deep focus, shallow focus, rack focus, fixed focal plane
- **Perspective:** expansive wide-angle depth or compressed long-lens layers

Keep the contract internally consistent. A locked-off camera cannot track; an extreme close-up cannot establish a complete environment at the same moment.

Complete when framing, movement, focus, and subject action describe the same physical camera setup.

### 5. Make style visible

Translate tone into evidence:

- lighting source, direction, contrast, and color;
- palette and material response;
- weather, atmosphere, grain, halation, texture, or format;
- posture, rhythm, blocking, and environmental behavior.

`Tense` becomes rigid posture, shallow breathing, a locked door, and a slow push-in. `Vintage` becomes a named capture format, grain structure, color response, optical behavior, and practical-light treatment.

Complete when every style phrase changes something visible or audible.

### 6. Choose a prompt structure

Natural-language default:

```text
[Tone or format]. [Camera and framing] of [subject] [clear action] in [environment].
[Environmental motion and physical response]. [Lighting and palette]. [Audio handoff].
```

Use a described beat progression when timing has two or three meaningful moments. Use labeled fields when a long brief needs traceability.

For multiple shots inside one generation, name them explicitly and mark the transition:

```text
SHOT ONE: wide aerial of a desert highway at dawn, a single red car speeding through.
HARD CUT. SHOT TWO: interior close-up, the driver's hands drumming the wheel to the radio.
HARD CUT. SHOT THREE: from the roadside, the car shrinking into the heat haze.
Warm engine hum under one continuous music bed across all three shots.
```

This produces real cuts. Consecutive shots need strong contrast in scale, location, or color so they register as cuts — near-identical coverage blends into a continuous take instead. For an uncut take, ask for `one continuous unbroken shot`.

### 7. Produce controlled variants

Change one consequential dimension per variant:

- action geometry;
- camera behavior;
- duration or beat allocation;
- light, atmosphere, or material response.

Keep all accepted invariants unchanged. After two structurally similar misses, revise the action or route rather than adding adjectives.

Complete when each variant tests one named hypothesis.

## Output Contract

Return:

1. **Shot contract** — action, camera, duration, and invariants;
2. **Final prompt** — ready for a text-only request or creative review;
3. **Timing notes** — only when beats matter;
4. **Audio/text handoff** — what another skill or post must own;
5. **Risks** — likely failure modes or deterministic finishing needs;
6. **Variants** — only when requested, one controlled change each.

## Common Pitfalls

1. **Appending “cinematic video” to an image prompt.** Direct motion, camera, and environmental response.
2. **Overloading five seconds.** Reduce actions or increase duration.
3. **Using incompatible camera terms.** Write one physical camera contract.
4. **Spending words on invisible mood labels.** Convert style into visible evidence.
5. **Changing several variables between trials.** Preserve causal learning with controlled variants.
6. **Writing timecodes and expecting them to bind.** Prose timings guide emphasis; frame-exact placement needs keyframes.
7. **Cutting between near-identical shots.** Without strong contrast the cut reads as one continuous take.
8. **Promising exact typography or edit timing.** Plan deterministic post.

## Verification Checklist

- [ ] One required action is explicit
- [ ] Every beat fits the duration
- [ ] Subject, camera, environment, and secondary motion form a hierarchy
- [ ] Camera terms are physically compatible
- [ ] Style is expressed through visible or audible evidence
- [ ] Audio and text have clear owners
- [ ] Each variant changes one named dimension

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for prompting guidance, camera terms, and generation settings
