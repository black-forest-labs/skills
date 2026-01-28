---
name: image-enhance
description: Enhance images professionally using BFL FLUX image-to-image editing. Adjust lighting and studio setups, create professional product photography, zoom on subjects, colorize black-and-white photos, or change camera angles and perspectives. Use when users want practical image improvements or professional-quality enhancements.
metadata:
  author: playground
  version: "1.0"
  tags: flux, bfl, image-editing, enhancement, lighting, product-photo, i2i
---

# Professional Image Enhancement

Guide for crafting prompts to achieve professional image enhancements using BFL FLUX image-to-image editing.

## Model Selection

Use FLUX.2 models with `input_image` parameter for enhancement tasks:
- **FLUX.2 [pro]** - Recommended for most enhancement tasks
- **FLUX.2 [max]** - Best quality for detailed relighting and product photography

For API integration details, see the **bfl-api** skill. For general prompting best practices, see **flux-best-practices**.

## How to Use

Pass the source image URL to `input_image` and describe the desired enhancement in the prompt.

## Enhancement Types

### Relight

**Goal:** Change the lighting setup to transform mood, quality, or atmosphere.

**Prompt principles:**
- Describe specific lighting equipment and positions (softbox, spotlight, reflector)
- Specify light direction (from left, overhead, backlit, etc.)
- Include shadow characteristics (soft, harsh, dappled)
- Mention color temperature or mood (warm golden, cool blue, neutral)

**Example prompts:**
```
Adjust the lighting to simulate late afternoon sunlight streaming through a forest, with dappled shadows and a warm, golden glow.
```
```
Change the lighting to a dramatic, low-key studio setup with a single spotlight from below, casting intense shadows and highlighting facial contours.
```
```
Set the lighting to mimic soft, diffused light from a cloudy day, with a large softbox overhead and a reflector below to brighten the face evenly.
```
```
Create a moody, cinematic atmosphere with a single, strong backlight and a dark, diffused fill light, emphasizing the subject's silhouette and adding depth.
```
```
Adjust the lighting to simulate soft, natural light from a large window to the left, with a reflector on the right to gently fill in shadows, creating a balanced, professional portrait look.
```
```
Change the lighting to a dramatic, high-contrast setup with a single, strong light source from the top right, casting deep shadows and emphasizing facial features.
```
```
Set the lighting to mimic soft, even light from a large octagonal softbox directly in front, with a smaller fill light from below to lift the chin and create a flattering, diffused effect.
```
```
The subject is now in a futuristic, high-fashion scene with bright, cool blue LED lights from above and below, casting sharp, angular shadows and a modern, edgy atmosphere.
```

**Lighting scenarios to consider:**
- Natural: window light, golden hour, overcast, forest dappled
- Studio: softbox, key+fill+rim, high-key, low-key, Rembrandt
- Dramatic: single source, colored gels, backlighting, silhouette
- Atmospheric: fog, neon, candlelight, firelight

---

### Product Photo

**Goal:** Transform into professional product/catalog photography style.

**Prompt principles:**
- Describe the scene type: simple packshot OR product-in-use
- Specify lighting setup for professional look
- Include camera angle and framing details
- Suggest at least one "item being used" scenario

**Example prompts:**
```
Turn the photo into a professional product photo
```
```
Transform into a clean product packshot: white seamless background, soft even lighting from multiple angles, slight shadow beneath for depth, centered composition
```
```
Create a lifestyle product photo showing the item in use, natural lighting, shallow depth of field, aspirational setting
```
```
Professional catalog shot: neutral gray background, studio lighting with soft shadows, multiple angles showing product details, commercial quality
```

**Variations to offer:**
- Clean packshot (white/neutral background)
- Lifestyle/in-use scenario
- Detail/macro shots
- Multiple angle coverage
- Different lighting moods (bright/airy vs dramatic)

---

### Zoom

**Goal:** Zoom in on a specific subject or area within the image.

**Prompt principles:**
- Specify what to zoom on (or default to main subject)
- Indicate zoom level (slight, moderate, close-up, extreme/macro)
- Maintain image quality and detail

**User input:** Optional `SUBJECT` parameter - what to zoom on

**Example prompts:**
```
Zoom on the subject
```
```
Zoom in closely on the face, showing fine details
```
```
Moderate zoom on the product, filling most of the frame
```
```
Extreme close-up / macro view of the texture details
```
```
Zoom on [SPECIFIC SUBJECT] in the image
```

**Zoom levels:**
- Slight zoom: subject fills ~50% more of frame
- Moderate zoom: subject is primary focus, some context remains
- Close-up: subject fills frame, minimal background
- Macro/extreme: fine details visible, abstract quality possible

---

### Move Camera

**Goal:** Change the camera angle and perspective to reveal new aspects of the scene.

**Prompt principles:**
- Describe specific camera position changes
- Use cinematographic terminology
- Consider what new information each angle reveals

**Example prompts:**
```
Zoom out to a bird's-eye view, capturing the entire room
```
```
Move the camera to a low angle, looking up at the subject from the floor
```
```
Rotate the camera to a side portrait view
```
```
Zoom the camera very far from the subject to reveal the surroundings
```
```
Show a macro view of the subject
```
```
Randomly move the camera to a new position
```

**Camera movements to consider:**
- **Vertical:** bird's-eye (top-down), high angle, eye-level, low angle, worm's-eye (ground up)
- **Horizontal:** front, 3/4 view, profile/side, rear
- **Distance:** extreme wide, wide, medium, close-up, extreme close-up
- **Special:** Dutch angle (tilted), over-the-shoulder, POV

---

### Colorize

**Goal:** Add color to black-and-white or desaturated images.

**Prompt principles:**
- Specify colorization style or era accuracy
- Mention key elements that need specific colors
- Can suggest mood through color choices

**Example prompts:**
```
Colorize the image
```
```
Colorize this black and white photo with historically accurate colors for the era
```
```
Add vibrant, saturated colors with a warm vintage tone
```
```
Colorize with natural, realistic skin tones and period-appropriate clothing colors
```
```
Restore color with a cool, desaturated film look
```

**Colorization approaches:**
- Historically accurate (research era-appropriate colors)
- Vibrant/saturated (modern, punchy)
- Vintage film look (specific decade aesthetics)
- Natural/realistic (true-to-life tones)
- Artistic interpretation (mood-driven color choices)

## General Prompt Guidelines

1. **Be technically specific** - Use photography/cinematography terminology
2. **Describe the desired outcome** - What should the final image look like?
3. **Include relevant details** - Lighting direction, camera position, style references
4. **Maintain professionalism** - These are enhancement tools, not artistic transformations

## Parameters Summary

| Enhancement | aspect_ratio | Notes |
|------------|--------------|-------|
| Relight | (preserve original) | Describe lighting setup precisely |
| Product Photo | (preserve original) | Include scene type + lighting |
| Zoom | (preserve original) | Specify subject + zoom level |
| Move Camera | (preserve original) | Use cinematographic terms |
| Colorize | (preserve original) | Specify style/era/mood |

## Related Skills

- **bfl-api** - API endpoints, authentication, polling patterns
- **flux-best-practices** - General prompting principles, lighting terminology
