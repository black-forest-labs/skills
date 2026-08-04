---
name: cinematic-still
description: Create cinematic still images with FLUX by locking one readable moment, motivated light, depth, palette, and a controlled iteration ladder.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, bfl, image-generation, cinematic, film-still, t2i, i2i
---

# Cinematic Still

Use this skill to turn a visual idea into one intentional cinematic frame. The output is a still image—not a shot list, sequence, or motion prompt.

## When to Use

- Film-still, keyframe, campaign-frame, or editorial-cinematic imagery
- A single dramatic moment with deliberate composition and lighting
- Text-to-image exploration or image-to-image work with supplied references
- Iterating a still without changing the entire visual contract each generation

For general FLUX prompting, model selection, typography, or multi-reference mechanics, also read **flux-best-practices**. For request schemas and polling, read **bfl-api**.

## Workflow

### 1. Lock the frame brief

Resolve these decisions before writing prose:

- **Use:** where the still will appear and what it must communicate
- **Subject:** the visual anchor and its defining traits
- **Moment:** the exact instant shown
- **Environment:** place, time, weather, and useful background details
- **Composition:** aspect ratio, shot size, angle, subject placement, and negative space
- **Light:** visible or implied source, direction, quality, and what catches it
- **Palette:** dominant colors and one restrained accent when useful
- **Texture:** surfaces, atmosphere, grain, and finish
- **References:** identity, object, style, layout, or color information that must be retained

Use [templates/brief.md](templates/brief.md) when any item is missing. The brief is complete when another reader can sketch the frame without inventing its subject, light, or composition.

### 2. Choose the generation route

Use text-to-image when the concept can be defined entirely in words. Use image-to-image or multi-reference editing when success depends on a supplied person, product, location, wardrobe, layout, or visual language.

State what each reference contributes. Do not ask one image to supply identity, pose, composition, wardrobe, lighting, and style unless all of those should remain coupled.

The route is correct when every required visual fact has either a written description or a named reference source.

### 3. Describe one readable instant

Write the frame as a moment already in progress:

- a hand paused above a chess piece;
- rainwater catching a passing headlight;
- a train door open against predawn fog;
- a face turning toward an off-screen practical light.

Prefer posture, contact, gaze, weather, and displaced material over a sequence of events. If the concept needs “first,” “then,” or “finally,” choose the strongest instant and describe only that frame.

The moment is locked when it can be captured by one shutter press.

### 4. Build depth in three planes

Give the frame a foreground, subject plane, and background. Not every plane needs a new object; light, haze, reflections, or an occluding edge can create separation.

- **Foreground:** doorway edge, wet glass, fabric, foliage, flare, or shadow
- **Subject plane:** the person, object, vehicle, or action that carries the image
- **Background:** architecture, weather, practical lights, landscape, or controlled negative space

Name which plane stays sharp and which falls away. The composition is ready when the eye has a clear first stop and a legible path through the frame.

### 5. Motivate the light

Name a source and the surface or atmosphere that reveals it. Useful pairings include:

- sodium-vapor streetlight through rain;
- projector beam through dust;
- refrigerator light across a face in a dark kitchen;
- sunrise rim light caught by sea mist;
- dashboard glow reflected in wet leather.

Use contrast intentionally: key versus shadow, warm practicals against cool ambience, or a restrained rim against a near-monochrome frame. Lighting terms should agree with the visible environment.

The light is motivated when a viewer could point to its source or infer it from the scene.

### 6. Use camera language to control framing

Camera terms should express a visual decision rather than decorate the prompt.

- **Shot size** controls narrative distance: extreme close-up, close-up, medium, wide, establishing
- **Angle** controls power and orientation: eye level, low, high, overhead, canted
- **Perspective** controls spatial feel: intimate normal perspective, compressed long-lens layers, expansive wide-angle depth
- **Focus** controls hierarchy: shallow focus on the subject plane or deep focus across the environment
- **Aspect ratio** controls where negative space and visual weight can live

Avoid incompatible combinations such as an extreme close-up that must also show a complete environment. The camera contract is complete when shot size, angle, depth, and aspect ratio describe the same frame.

### 7. Write the prompt in visual priority order

Use this order:

1. subject and exact moment;
2. environment and time;
3. composition and depth planes;
4. motivated lighting;
5. materials, weather, and atmosphere;
6. palette and finish;
7. camera and lens character.

Write descriptive prose. Front-load the subject and the non-negotiable visual relationship. Describe the desired frame positively rather than appending a negative-prompt list.

### Example

```text
A lone night-shift projectionist pauses in the open doorway of an old coastal
cinema, one hand holding a dented metal film can at his side. Medium-wide frame
from inside the empty auditorium, dark seat backs forming the foreground and
the doorway placed on the right third. Wind-driven rain crosses the blue-hour
street outside. Warm tungsten lobby light rims his wet coat while the projector
beam catches dust behind him. Deep navy and tobacco palette with one faded red
exit sign, restrained contrast, natural film grain, compressed perspective.
```

The prompt is ready when every phrase changes the subject, moment, hierarchy, light, material, palette, or camera decision.

### 8. Iterate with a controlled ladder

Start with one pilot. Preserve the frame brief and change one consequential variable per iteration:

1. subject placement or shot size;
2. light source or contrast;
3. atmosphere or material response;
4. palette and finish;
5. route or reference assignment.

Keep a promising seed only when you also keep its prompt and parameters. After two similar misses, revise the frame contract or route rather than adding more adjectives.

Each rerun is valid when it tests one named hypothesis.

### 9. Review as a frame, not as a prompt

Apply [references/review-checklist.md](references/review-checklist.md). Reject technically polished images when the moment is unreadable, hierarchy is weak, lighting is unmotivated, or the frame has no useful crop.

A still is complete when it communicates the intended moment at thumbnail size, survives full-resolution inspection, and has a deliberate final crop.

## Common Pitfalls

1. **Writing a trailer instead of a frame.** Choose one instant and remove temporal sequencing.
2. **Using “cinematic” as the whole direction.** Specify the composition, source light, depth, palette, and material that create the look.
3. **Stacking camera jargon.** Keep only terms that agree on perspective and framing.
4. **Lighting by mood alone.** Pair the mood with a source and a surface or medium that catches it.
5. **Changing everything between generations.** Use the controlled ladder so each rerun teaches something.
6. **Relying on style names.** Describe observable visual qualities—color, contrast, texture, composition, and medium.
7. **Ignoring delivery shape.** Lock aspect ratio and crop intent before generation, not after selecting a favorite.
