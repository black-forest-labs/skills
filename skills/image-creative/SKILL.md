---
name: image-creative
description: Create artistic image transformations using BFL's Flux Kontext API. Teleport subjects to new locations/styles, convert to cartoon/manga, create movie posters, exaggerate muscles, or change hairstyles. Use when users want fun, artistic, or dramatic visual transformations of their images.
metadata:
  author: playground
  version: "1.0"
  category: image-editing
---

# Creative Image Transformations

Guide for crafting prompts to achieve creative image transformations using Black Forest Labs' Flux Kontext API.

## API Endpoint

Use the Flux Kontext image-to-image endpoint. Pass the source image and a transformation prompt.

## Transformation Types

### Teleport / Re-contextualize

**Goal:** Place the subject in unexpected locations, scenarios, or styles while preserving their identity.

**Prompt principles:**
- NEVER instruct to replace or transform the subject itself
- ONLY change: context, scenario, style, clothes, accessories, background
- The subject's pose, facial features, and body position must be preserved

**Example prompts:**
```
Teleport the subject to a random location with a random style
```
```
Place the person in a cyberpunk Tokyo street scene at night, neon lights reflecting off wet pavement, wearing futuristic streetwear
```
```
Transport the subject to a medieval castle throne room, dressed in royal attire, dramatic torchlight
```

---

### Cartoonify

**Goal:** Convert the photo into cartoon, manga, or illustration style.

**Prompt principles:**
- Always specify a style reference (culture, era, or technique)
- Be specific about line weight, coloring style, and artistic influence

**Style references to include:**
- "90s manga style"
- "thick black outlines, cel-shaded"
- "3D Pixar/Disney style"
- "anime style with soft shading"
- "comic book style with halftone dots"
- "watercolor illustration"
- "sketch/pencil drawing"

**Example prompts:**
```
Turn the photo into a cartoon
```
```
Convert to 90s anime style with bold outlines and cel shading
```
```
Transform into a 3D Pixar-style character render with soft lighting
```
```
Render as a thick-lined cartoon in the style of modern Western animation
```

---

### Movie Poster

**Goal:** Transform the image into a cinematic movie poster composition.

**API parameters:**
```json
{
  "aspect_ratio": "3:4"
}
```

**Prompt principles:**
- Pick a genre (action, comedy, horror, thriller, romance, sci-fi, etc.)
- Include a stylized title (user-provided or invented based on image)
- Add taglines and typical movie poster text elements
- Include quotes, credits, and release date styling

**Example prompts:**
```
Turn the photo into a movie poster with the title "TITLE_HERE"
```
```
Create an action movie poster featuring the subjects as heroes. Title: "THE LAST STAND". Add dramatic tagline, stylized title text, and typical movie poster elements like quotes and credits.
```
```
Transform into a horror movie poster. Invent a title based on the scene. Add eerie tagline, scratchy title font, and "Coming Soon" text.
```

**User input:** If user provides a movie title, incorporate it. Otherwise, invent one based on image content.

---

### Bodybuilder

**Goal:** Humorously exaggerate the subject's musculature while preserving pose and context.

**Prompt principles:**
- Keep the same pose and setting
- Dramatically increase muscle definition: biceps, triceps, abdominals, pectorals, deltoids
- May adjust clothing to reveal the exaggerated physique
- Maintain comedic/over-the-top tone

**Example prompts:**
```
Turn the photo into a bodybuilder
```
```
Dramatically increase the subject's muscles to bodybuilder proportions. Exaggerate biceps, triceps, and abdominals while keeping the same pose. Adjust clothing to reveal the overmuscled physique.
```
```
Transform the subject into an extremely muscular bodybuilder with comically large muscles, same pose and background, clothing stretched or torn to show the exaggerated physique.
```

---

### Haircut / Hairstyle Change

**Goal:** Change the subject's hairstyle naturally.

**Prompt principles:**
- Suggest specific haircut styles, lengths, and colors
- Adapt suggestions to the subject's characteristics for natural appearance
- Describe the visual edit clearly

**Example prompts:**
```
Change the haircut of the subject
```
```
Give the subject a short pixie cut with platinum blonde highlights, styled with texture and volume
```
```
Change to long flowing curly hair in a deep auburn color, natural and voluminous
```
```
Edit the hair to a modern fade haircut with textured top, keeping the natural hair color
```

## General Prompt Guidelines

1. **Be concise but specific** - Include key details without over-explaining
2. **Use action verbs** - "Transform", "Convert", "Place", "Change", "Edit"
3. **Preserve subject identity** - Unless explicitly changing appearance (like bodybuilder/haircut), keep the subject recognizable
4. **Specify style references** - For artistic transformations, name specific styles, eras, or influences

## Parameters Summary

| Transformation | aspect_ratio | Notes |
|---------------|--------------|-------|
| Teleport | (preserve original) | Change only context |
| Cartoonify | (preserve original) | Specify art style |
| Movie Poster | `3:4` | Include title + text |
| Bodybuilder | (preserve original) | Keep pose, exaggerate muscles |
| Haircut | (preserve original) | Adapt to subject |
