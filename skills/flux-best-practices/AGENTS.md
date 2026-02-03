# FLUX Best Practices

**Version 1.0.0**  
Black Forest Labs  
January 2026

> **Note:**  
> This document is for AI agents and LLMs to follow when working with  
> FLUX image generation prompting and workflows. Humans may also find it useful,  
> but guidance here is optimized for automation and consistency.  

---

## Abstract

Comprehensive prompting and workflow guide for BFL FLUX image generation models. Covers all FLUX.2 and FLUX.1 models including text-to-image, image-to-image editing, JSON structured prompting, color specification, typography, and multi-reference editing. Each rule includes detailed explanations, examples of effective vs ineffective approaches, and model-specific guidance.

---

## Table of Contents

1. [Core Principles](#1-core-principles) - **CRITICAL**
   - 1.1 [Core FLUX Prompting Principles](#11-core-flux-prompting-principles)
2. [Model Selection](#2-model-selection) - **HIGH**
   - 2.1 [FLUX Model Selection Guide](#21-flux-model-selection-guide)
   - 2.2 [FLUX.1 Model Family](#22-flux1-model-family)
   - 2.3 [FLUX.2 Model Family](#23-flux2-model-family)
3. [Text-to-Image Prompting](#3-text-to-image-prompting) - **HIGH**
   - 3.1 [Text-to-Image (T2I) Prompting](#31-text-to-image-t2i-prompting)
4. [Image-to-Image Editing](#4-image-to-image-editing) - **HIGH**
   - 4.1 [Image-to-Image (I2I) Prompting](#41-image-to-image-i2i-prompting)
5. [JSON Structured Prompting](#5-json-structured-prompting) - **MEDIUM-HIGH**
   - 5.1 [JSON Structured Prompting](#51-json-structured-prompting)
6. [Color Specification](#6-color-specification) - **MEDIUM**
   - 6.1 [Hex Color Prompting](#61-hex-color-prompting)
7. [Typography and Text](#7-typography-and-text) - **MEDIUM**
   - 7.1 [Typography and Text Prompting](#71-typography-and-text-prompting)
8. [Multi-Reference Editing](#8-multi-reference-editing) - **MEDIUM**
   - 8.1 [Multi-Reference Image Editing](#81-multi-reference-image-editing)
9. [Positive Prompt Alternatives](#9-positive-prompt-alternatives) - **MEDIUM**
   - 9.1 [Negative Prompt Alternatives](#91-negative-prompt-alternatives)

---

## 1. Core Principles

**Impact: CRITICAL**

Universal prompting principles that apply to all FLUX models. Master these before diving into specific techniques.

### 1.1 Core FLUX Prompting Principles

**Impact: MEDIUM**

These principles apply to all FLUX models and form the foundation of effective prompting.

FLUX does NOT support negative prompts. Always describe what you WANT, not what you don't want.

Build prompts using this structure for consistent results:

**Wrong Approach:**

```text
a portrait of a woman, no glasses, no hat, no makeup
```

**Correct Approach:**

```text
a portrait of a woman with natural skin, clear face, bare head, visible eyes
```

**Example:**

```text
A young woman with flowing auburn hair (subject)
dancing gracefully in mid-leap (action)
in the style of classical oil painting (style)
in a moonlit garden with roses (context)
soft diffused moonlight with subtle rim lighting (lighting)
medium shot, shallow depth of field (technical)
```

More specific prompts yield dramatically better results.

**Vague: Poor Results**

```text
a cat sitting
```

**Specific: Excellent Results**

```text
A fluffy orange tabby cat with bright green eyes sitting regally on a vintage
velvet armchair, afternoon sunlight streaming through lace curtains, warm
golden hour lighting, shallow depth of field, shot on medium format film
```

Write prompts as descriptive prose rather than keyword lists.

**Keyword Style: Less Effective**

```text
woman, portrait, beautiful, blonde, studio, professional, 8k, detailed
```

**Prose Style: More Effective**

```text
A professional studio portrait of a beautiful blonde woman in her thirties,
captured with soft studio lighting that accentuates her features, rendered
in stunning detail with natural skin texture and subtle catchlights in her eyes
```

Always specify lighting - it has the single greatest impact on image quality.

**Natural Lighting:**

- Golden hour - warm, soft, directional

- Overcast - soft, diffused, even

- Harsh midday - high contrast, strong shadows

- Dappled forest light - specular, organic patterns

**Studio Lighting:**

- Softbox - even, professional

- Rim light - edge definition, separation

- Butterfly lighting - beauty, glamour

- Rembrandt lighting - dramatic, classic portraits

**Atmospheric Lighting:**

- Volumetric fog - depth, mystery

- God rays - dramatic, spiritual

- Neon glow - urban, cyberpunk

- Candlelight - warm, intimate

**Mood-Based Lighting:**

- Dramatic shadows - tension, noir

- High key - bright, airy, clean

- Low key - moody, mysterious

- Chiaroscuro - strong contrast, painterly

FLUX prioritizes elements that appear earlier in the prompt. Front-load important elements.

**Less Effective:**

```text
A forest background with soft lighting where a knight in shining armor stands
```

**More Effective:**

```text
A knight in shining armor stands in a forest, soft dappled lighting filtering
through the canopy
```

Optimal prompt length is typically 30-80 words (FLUX can handle up to 512 tokens).

- Too short: Lacks direction, generic results

- Too long: Can become unfocused

- Sweet spot: Enough detail to guide, not so much it confuses

Build prompts iteratively:

1. Start with core subject and action

2. Add style and medium

3. Specify lighting and atmosphere

4. Include technical details

5. Refine based on results

Change one element at a time to understand what affects your output.

Reference: [negative-prompt-alternatives.md](negative-prompt-alternatives.md)

---

## 2. Model Selection

**Impact: HIGH**

Choosing the right FLUX model for your use case. Covers both FLUX.2 (latest) and FLUX.1 (legacy) model families.

### 2.1 FLUX Model Selection Guide

**Impact: MEDIUM**

Decision guide for selecting the optimal FLUX model based on your requirements.

| Priority      | Recommended Model               |

| ------------- | ------------------------------- |

| Speed         | FLUX.2 [klein]                  |

| Quality       | FLUX.2 [max]                    |

| Balance       | FLUX.2 [pro]                    |

| Typography    | FLUX.2 [flex]                   |

| Image Editing | FLUX.2 [klein], [pro], or [max] |

| Local/Free    | FLUX.2 [dev]                    |

| Inpainting    | FLUX.1 Fill                     |

**Note:** All FLUX.2 models natively support image-to-image editing via reference images. Simply provide your source image(s) as references and describe the desired changes.

**By Speed:**

| Model             | Relative Speed | Best For                |

| ----------------- | -------------- | ----------------------- |

| FLUX.2 [klein] 4B | Fastest        | Rapid prototyping       |

| FLUX.2 [klein] 9B | Very Fast      | Better quality previews |

| FLUX.2 [pro]      | Medium         | Production workflows    |

| FLUX.2 [flex]     | Medium         | Typography tasks        |

| FLUX.2 [max]      | Slower         | Final hero images       |

**By Quality:**

| Model             | Quality Level | Trade-off                  |

| ----------------- | ------------- | -------------------------- |

| FLUX.2 [max]      | Highest       | Slowest, most expensive    |

| FLUX.2 [pro]      | High          | Good balance               |

| FLUX.2 [flex]     | High (text)   | Specialized for typography |

| FLUX.2 [klein] 9B | Good          | Fast, slightly less detail |

| FLUX.2 [klein] 4B | Moderate      | Fastest, preview quality   |

**By Cost:**

> **Credit pricing:** 1 credit = $0.01 USD. FLUX.2 uses megapixel-based pricing.

| Model             | 1st MP | +MP  | 1MP T2I | 1MP I2I | Volume Recommendation       |

| ----------------- | ------ | ---- | ------- | ------- | --------------------------- |

| FLUX.2 [klein] 4B | 1.4c   | 0.1c | $0.014  | $0.015  | High volume, previews       |

| FLUX.2 [klein] 9B | 1.5c   | 0.2c | $0.015  | $0.017  | High volume, better quality |

| FLUX.2 [pro]      | 3c     | 1.5c | $0.03   | $0.045  | Production workloads        |

| FLUX.2 [max]      | 7c     | 3c   | $0.07   | $0.10   | Hero images, premium        |

| FLUX.2 [flex]     | 6c     | 6c   | $0.06   | $0.12   | Typography                  |

| FLUX.2 [dev]      | -      | -    | Free    | Free    | Local dev (non-commercial)  |

> **Pricing formula:** `(firstMP + (outputMP-1) * mpPrice) + (inputMP * mpPrice)` in cents

| Model                | Price/Image | Use Case                |

| -------------------- | ----------- | ----------------------- |

| FLUX.1 Kontext [pro] | $0.04       | Context-aware editing   |

| FLUX.1 Kontext [max] | $0.08       | Max quality editing     |

| FLUX1.1 [pro]        | $0.04       | Standard T2I            |

| FLUX1.1 [pro] Ultra  | $0.06       | Ultra high-resolution   |

| FLUX1.1 [pro] Raw    | $0.06       | Candid photography feel |

| FLUX.1 Fill [pro]    | $0.05       | Inpainting              |

| FLUX.1 [pro]         | $0.05       | Original pro model      |

> Use [bfl.ai/pricing](https://bfl.ai/pricing) calculator for exact costs at different resolutions.

**Creative Exploration / Ideation:**

**Recommended: FLUX.2 [klein]**

- Fast iterations

- Quick concept testing

- Mood board generation

- Exploring prompt variations

**Production Marketing Assets:**

**Recommended: FLUX.2 [pro]**

- Consistent quality

- Reasonable speed

- Cost-effective at scale

- Reliable for automation

**Hero Images / Premium Content:**

**Recommended: FLUX.2 [max]**

- Maximum detail

- Best coherence

- Supports grounding search

- Worth the premium for key visuals

**Typography / Signage / Posters:**

**Recommended: FLUX.2 [flex]**

- Superior text rendering

- Adjustable quality settings

- Best for readable text

- UI mockups and infographics

**Character Consistency:**

**Recommended: FLUX.2 [max] or [pro]**

- Multi-reference support (up to 8-10 images)

- Best editing consistency

- Maintains identity across scenes

- Superior quality over FLUX.1 Kontext

**Photo Editing / Retouching:**

**Recommended: FLUX.2 [klein], [pro], or [max]**

- Native image-to-image support via references

- Style transfer

- Object modification

- Attribute changes

- Better results than FLUX.1 Kontext

**Real-Time Information:**

**Recommended: FLUX.2 [max]**

- Grounding search feature

- Current events

- Recent news visualization

- Weather/location data

**Local Development / Testing:**

**Recommended: FLUX.2 [dev]**

- No API costs

- Full control

- Fine-tuning experiments

- Offline capability

**Editorial with Typography:**

```text
1. FLUX.2 [max] - Generate base image (highest quality)
2. FLUX.2 [flex] - Add text overlay pass
```

**Character-Consistent Series:**

```text
1. FLUX.2 [max] - Create character reference
2. FLUX.2 [max]/[pro] - Generate consistent variations using reference images
3. FLUX.2 [klein] - Quick iteration on variations if needed
```

**E-commerce Product Pipeline:**

```text
1. FLUX.2 [pro] - Bulk product generations
2. FLUX.2 [pro]/[klein] - Product variations (colors, angles) using references
3. FLUX.2 [flex] - Add promotional text/pricing
```

**Limited Budget:**

- **High volume**: FLUX.2 [klein] 4B

- **Quality needed**: FLUX.2 [pro] (best value)

**Tight Deadline:**

- **Any task**: FLUX.2 [klein]

- **Quality matters**: FLUX.2 [pro]

**Maximum Quality Required:**

- **Always**: FLUX.2 [max]

**Text Must Be Readable:**

- **Always**: FLUX.2 [flex]

**Editing Existing Images:**

- **Fast edits**: FLUX.2 [klein] with reference images

- **Quality edits**: FLUX.2 [max] or [pro] with reference images

- **Alternative**: FLUX.1 Kontext (FLUX.2 preferred)

**Rate Limit Sensitivity:**

```text
Speed?      → FLUX.2 [klein]
Quality?    → FLUX.2 [max]
Balance?    → FLUX.2 [pro]
Text?       → FLUX.2 [flex]
Edit?       → FLUX.2 [klein/pro/max] with reference images
Free?       → FLUX.2 [dev]
```

- **Prefer**: FLUX.2 models (24 concurrent limit)

- **Avoid**: FLUX.1 Kontext Max (6 concurrent limit)

**Key insight:** All FLUX.2 models support image editing natively via reference images. FLUX.2 is recommended over FLUX.1 Kontext for editing tasks.

### 2.2 FLUX.1 Model Family

**Impact: MEDIUM**

> **Tip:** FLUX.2 models are the latest generation and recommended for most use cases. FLUX.1 models are still available for specific needs.

Guide to FLUX.1 models and their specialized capabilities.

| Model | Purpose | Notes |

|-------|---------|-------|

| FLUX1.1 [pro] | Text-to-image | FLUX.2 [pro] offers improved results |

| FLUX.1 Kontext | Image-to-image | FLUX.2 with references recommended |

| FLUX.1 Kontext Max | Image-to-image | FLUX.2 [max] with references recommended |

| FLUX.1 Fill | Inpainting | Useful for specific inpainting tasks |

Fast and reliable text-to-image generation.

**Characteristics:**

- Strong prompt adherence

- Production-grade architecture

- Consistent, reliable results

- Scalable for high-volume

- Pricing: $0.04 per image

**Prompting Style:**

Standard descriptive prompts with clear subject and style specification.

**Example Prompt:**

```text
A golden retriever puppy playing in autumn leaves, warm afternoon sunlight,
shallow depth of field with bokeh background, joyful expression, professional
pet photography style
```

> **Recommendation:** FLUX.2 models with reference images provide improved editing results.

Context-aware image-to-image editing model for transformations and modifications.

**Characteristics:**

- Understands image context

- Preserves unedited regions

- Style transfer capabilities

- Object modification

- Basic to complex transformations

**Prompting Strategies:**

```text
Add the text "OPEN" as a neon sign in the window, red glowing letters
with slight reflection on the glass, matching the nighttime atmosphere
```

Simple, direct instructions work best:

Be explicit about what to preserve:

For dramatic changes, be specific about preservation:

Reference specific artistic movements:

Describe text placement and integration:

**Tips for Kontext:**

- Be explicit about what should NOT change

- Start with simpler edits, build complexity

- Specify style preservation when needed

- Use for incremental refinement

Advanced multi-reference editing for complex compositions.

**Characteristics:**

- Handles up to 10 reference images

- Best editing consistency across references

- Complex scene composition

- Character consistency maintenance

- Rate limit: 6 concurrent requests

**Multi-Reference Prompting:**

```text
Replace the top half of the person in image 1 with the clothing
from image 2, maintaining the pose and background
```

Describe relationships between images naturally:

Reference images by number for precision:

**Tips for Kontext Max:**

- Plan your reference images carefully

- Use natural language for relationships

- Specify which elements come from which image

- Leverage for character consistency across scenes

Specialized tool for object removal and area completion.

**Characteristics:**

- Clean object removal

- Intelligent background completion

- Texture-aware filling

- Seamless blending

**Use Cases:**

- Remove unwanted objects from photos

- Complete partial images

- Replace specific regions

- Clean up image artifacts

**Prompting for Fill:**

```text
Complete with matching ocean waves and sandy beach
```

Describe what should fill the masked area:

**Tips for Fill:**

- Provide context about surrounding areas

- Specify texture and pattern continuation

- Describe lighting consistency

- Use for cleanup and removal tasks

### 2.3 FLUX.2 Model Family

**Impact: MEDIUM**

Complete guide to FLUX.2 variants and their optimal prompting strategies.

> **Key Feature:** All FLUX.2 models natively support both text-to-image generation AND image-to-image editing via reference images. There's no need to use legacy FLUX.1 Kontext models for editing tasks.

| Model | Parameters | Best For | Speed | Reference Images |

|-------|------------|----------|-------|------------------|

| [klein] | 4B/9B | Fast iterations, previews, quick edits | Fastest | Up to 4 |

| [max] | - | Highest quality generation & editing | Slowest | Up to 8-10 |

| [pro] | - | Production balanced | Medium | Up to 8 |

| [flex] | - | Typography, text rendering | Medium | Up to 8 |

| [dev] | - | Local development | Varies | Varies |

Best for rapid prototyping, previews, and high-volume generation.

**Characteristics:**

- 4B or 9B parameter versions available

- Sub-second generation times

- Optimized for speed over maximum detail

- **No prompt upsampling** - be descriptive yourself

- Supports up to 4 reference images

**Prompting Style: Narrative Prose:**

Klein responds best to descriptive, narrative-style prompts with emphasis on lighting and atmosphere.

**Example Prompt:**

```text
A cozy coffee shop interior bathed in warm afternoon light, steam rising lazily
from ceramic cups, worn leather armchairs arranged around small wooden tables,
bookshelves lining exposed brick walls, the soft atmosphere of a quiet afternoon
with dust motes floating in sunbeams through tall windows
```

**Tips for [klein]:**

- Write like a novelist describing a scene

- Front-load your subject (word order critical)

- Emphasize lighting descriptions heavily

- Keep prompts moderately detailed (40-70 words)

Premium model for final production assets and maximum detail.

**Characteristics:**

- Highest detail and coherence

- Best editing consistency

- Vast world knowledge

- Includes grounding search (real-time web data)

- Strongest prompt following

- Supports up to 8 reference images (API), 10 (playground)

**Prompting Style: Technical + Descriptive:**

[max] excels with detailed technical specifications combined with descriptive prose.

**Example Prompt:**

```text
Portrait of a weathered fisherman, age 70, deep wrinkles telling stories of
decades at sea, salt-and-pepper beard with streaks of white, wearing a navy
cable-knit sweater with visible wool texture. Shot on Hasselblad X2D with
90mm f/2.8 lens at f/4, golden hour natural light from the left creating
strong rim lighting, shallow depth of field with soft bokeh from harbor
lights behind, Kodak Portra 400 color science with natural grain
```

**Tips for [max]:**

- Include camera and lens specifications for photorealism

- Specify film stock or digital sensor characteristics

- Use technical photography terms (aperture, focal length)

- Leverage grounding search for current events: "news photo of [recent event]"

Optimal balance of quality and speed for production workflows.

**Characteristics:**

- Good quality-to-speed ratio

- Reliable, consistent output

- Suitable for batch processing

- Supports prompt upsampling

- Supports up to 8 reference images

**Prompting Style: Balanced Detail:**

Standard detailed prompts work well without excessive technical specification.

**Example Prompt:**

```text
A modern minimalist living room with floor-to-ceiling windows overlooking
a city skyline at dusk, clean white furniture with subtle textures, a single
statement plant in the corner, warm ambient lighting from hidden sources,
architectural photography style with clean lines and balanced composition
```

**Tips for [pro]:**

- Balance specificity with generation speed

- Good for template-based prompt systems

- Enable prompt upsampling for enhanced results

- Consistent quality for production pipelines

Optimized for text rendering and typographic content.

**Characteristics:**

- Superior text rendering quality

- Handles multiple text elements

- Adjustable steps (1-50) and guidance (1.5-10)

- Best for signage, posters, UI mockups

- Supports up to 8 reference images

**Prompting Style: Typography-Focused:**

Always quote text and specify font characteristics explicitly.

**Example Prompt:**

```text
A modern minimalist poster design with the headline "DESIGN SUMMIT 2025"
in bold condensed sans-serif typography centered in the upper third,
subtitle "Innovation Meets Creativity" in lighter weight below,
date "MARCH 15-17" in small caps at the bottom, all text in white
on a gradient background transitioning from deep purple #4A0080 to
coral #FF6B6B, clean geometric accent lines, professional print quality
```

**Tips for [flex]:**

- Always quote exact text: `"Your Text Here"`

- Specify font style: serif, sans-serif, script, display, monospace

- Describe text hierarchy: headline, subhead, body

- Include placement: centered, left-aligned, upper third

- Adjust steps (higher = better quality) and guidance (higher = stricter)

For local development, testing, and non-commercial use.

**Characteristics:**

- Open weights on Hugging Face

- Runs locally (~13GB VRAM recommended)

- Full customization available

- Free for non-commercial use

- Base variants available (undistilled) for fine-tuning

**Prompting Style: Standard:**

Same prompting patterns as [pro] work well.

**Tips for [dev]:**

- Use for development and testing before production

- Experiment with prompt variations

- Good for fine-tuning experiments

- Check license for commercial use restrictions

All FLUX.2 models support image editing via reference images. This replaces the need for legacy FLUX.1 Kontext models.

**How It Works:**

1. Provide your source image(s) as reference images

2. Describe the desired changes in your prompt

3. The model preserves context while applying edits

**Example: Style Transfer:**

```text
Reference: [your source image]
Prompt: Transform this image into a watercolor painting style,
maintaining the exact composition and subject positioning
```

**Example: Object Modification:**

```text
Reference: [your source image]
Prompt: Change the car color to red while keeping everything else identical
```

**Example: Character Consistency:**

```text
Reference: [character reference image]
Prompt: The same person from the reference image walking through
a busy Tokyo street at night, neon lights reflecting on wet pavement
```

**Model Selection for Editing:**

| Use Case | Recommended Model |

|----------|-------------------|

| Quick iterations/previews | FLUX.2 [klein] |

| Production quality edits | FLUX.2 [pro] |

| Maximum quality/complex edits | FLUX.2 [max] |

| Text/typography edits | FLUX.2 [flex] |

---

## 3. Text-to-Image Prompting

**Impact: HIGH**

Crafting effective prompts for generating images from text descriptions.

### 3.1 Text-to-Image (T2I) Prompting

**Impact: MEDIUM**

Comprehensive guide to crafting effective text-to-image prompts for FLUX models.

**Basic Formula:**

```text
[Subject] + [Action] + [Style] + [Context] + [Lighting] + [Technical]
```

**Expanded Framework:**

```text
[Main Subject] - who/what is the focus
[Attributes] - characteristics, details, clothing
[Action/Pose] - what they're doing
[Environment] - where, setting, background
[Style/Medium] - artistic approach
[Lighting] - light source, quality, mood
[Composition] - framing, camera angle
[Technical] - camera, lens, film stock
```

**People/Portraits:**

```text
A distinguished professor in his 60s with silver hair and round spectacles,
wearing a tweed jacket with leather elbow patches, deep-set thoughtful eyes,
slight smile suggesting hidden wisdom
```

**Animals:**

```text
A majestic snow leopard with piercing blue-grey eyes, thick spotted fur
dusted with snowflakes, powerful muscular build, alert posture on a
rocky outcrop
```

**Objects/Products:**

```text
A vintage Leica M3 camera with worn brass edges showing decades of use,
black leather covering with patina, sitting on weathered wooden table
```

**Landscapes:**

```text
A dramatic fjord at dawn, steep granite cliffs rising from mirror-still
water, wisps of morning mist, distant snow-capped peaks catching first
golden light
```

**Architecture:**

```text
A brutalist concrete apartment building in late afternoon light, geometric
shadows creating abstract patterns, warm sunlight contrasting with cool
grey concrete
```

**Photorealistic:**

```text
80s film photography, film grain, warm color cast, soft focus, nostalgic
```

**Artistic Styles:**

```text
anime style, large expressive eyes, clean linework, cel shading, vibrant palette
```

**Portrait Lighting:**

```text
Rembrandt lighting - 45 degree key light creating triangle shadow on cheek
Butterfly lighting - overhead key creating shadow under nose
Split lighting - 90 degree side light, half face in shadow
Loop lighting - slight angle creating small nose shadow
```

**Natural Lighting:**

```text
Golden hour - warm, soft, directional light 1 hour before sunset
Blue hour - cool, ambient light just after sunset
Overcast - soft, even, diffused lighting
Harsh midday - strong contrast, defined shadows
```

**Atmospheric:**

```text
Volumetric light - visible light rays through fog/dust
Rim lighting - backlight creating edge glow
Practical lighting - visible light sources in scene
Neon glow - colorful artificial urban lighting
```

**Camera Bodies:**

```text
Shot on Hasselblad X2D - medium format, exceptional detail
Shot on Canon 5D Mark IV - professional DSLR quality
Shot on Leica M10 - rangefinder character, smooth tonality
Shot on iPhone 15 Pro - computational photography look
```

**Lens Characteristics:**

```text
85mm f/1.4 - classic portrait, creamy bokeh
24mm f/2.8 - wide angle, environmental
50mm f/1.2 - natural perspective, shallow DOF
135mm f/2 - compressed perspective, smooth background
Macro lens - extreme close-up detail
Tilt-shift lens - miniature effect or architectural correction
```

**Technical Settings:**

```text
f/1.4 - extremely shallow depth of field
f/2.8 - moderate background blur
f/8 - sharp throughout, landscape
f/16 - maximum sharpness, long exposure
ISO 100 - clean, no noise
ISO 3200 - visible grain, low light
```

**Framing:**

```text
extreme close-up - filling frame with detail
close-up - head and shoulders
medium shot - waist up
full shot - entire body
wide shot - subject in environment
establishing shot - location focus
```

**Angles:**

```text
eye level - natural, relatable
low angle - powerful, imposing
high angle - diminished, overview
Dutch angle - tension, unease
bird's eye - pattern, layout
worm's eye - dramatic upward view
```

**Composition Rules:**

```text
rule of thirds - subject at intersection points
centered composition - symmetry, stability
leading lines - guiding eye to subject
frame within frame - natural framing elements
negative space - minimalist, breathing room
```

**Editorial Portrait:**

```text
A fashion editorial portrait of a young woman with striking features and
high cheekbones, wearing an avant-garde geometric collar in silver, dramatic
side lighting creating strong shadows, shot on Hasselblad with 100mm lens
at f/2.8, studio background with subtle gradient, high fashion magazine style
```

**Product Photography:**

```text
A premium wireless headphone product shot, matte black finish with rose gold
accents, floating at slight angle against pure white background, soft even
lighting eliminating harsh shadows, reflection visible on glossy surface below,
commercial catalog style, ultra sharp focus throughout
```

**Landscape:**

```text
A misty morning in ancient redwood forest, towering trees disappearing into
fog above, ferns covering forest floor in layers of green, single shaft of
golden sunlight breaking through canopy, shot on large format camera, rich
detail in bark textures, Ansel Adams inspired black and white with deep tones
```

**Architectural:**

```text
Modern minimalist beach house at golden hour, floor-to-ceiling glass walls
reflecting sunset colors, clean white concrete and natural wood, infinity
pool merging with ocean horizon, architectural photography style, wide angle
showing full structure, warm evening light
```

---

## 4. Image-to-Image Editing

**Impact: HIGH**

Techniques for editing and transforming existing images using FLUX.2 models.

### 4.1 Image-to-Image (I2I) Prompting

**Impact: MEDIUM**

Guide to effective image-to-image editing with FLUX models.

All FLUX.2 models support image-to-image editing via reference images:

- **FLUX.2 [klein]**: Up to 4 reference images - fast editing

- **FLUX.2 [pro]**: Up to 8 reference images - balanced quality/speed

- **FLUX.2 [max]**: Up to 8-10 reference images - highest quality editing

- **FLUX.2 [flex]**: Up to 8 reference images - best for typography edits

Simply provide your source image as a reference and describe the desired changes. The model understands image context and can modify specific elements while preserving others.

> **Note:** FLUX.2 models are recommended for image editing. They provide better results than the older FLUX.1 Kontext models.

**Preferred: Use URLs directly** - simpler and more convenient than base64.

When you have an image URL, pass it directly to `input_image`:

The API fetches URLs automatically. Both URL and base64 work, but URLs are recommended when available.

**Simple Modifications:**

```text
Add snow to the ground
```

Direct, single-change instructions:

**Attribute Changes:**

```text
Age the person to appear 20 years older
```

Modifying specific characteristics:

**Explicit Preservation:**

```text
Transform the daytime photo to nighttime, maintaining the exact
composition, colors of the subject's outfit, and lighting direction
```

When you need to keep specific elements unchanged:

**Style Preservation:**

```text
Add rain effects to the scene while preserving the painting's
impressionist brushwork and color palette
```

Preventing unwanted style shifts:

**Environmental Changes:**

```text
Change to spring with cherry blossoms, fresh green leaves,
soft warm lighting
```

**Style Transfer:**

```text
Transform into a watercolor painting with soft edges,
transparent washes, and paper texture visible
```

**Subject Modifications:**

```text
Make the subject appear younger, around 25 years old
```

**Object Editing:**

```text
Swap the coffee mug for an ornate teacup with floral pattern
```

**Adding Text:**

```text
Include a wooden sign with hand-painted text "Welcome Home"
mounted above the door
```

**Modifying Text:**

```text
Update the poster text to "SUMMER SALE 2025" maintaining the design
```

For dramatic transformations, consider breaking into steps:

**Step-by-Step Approach:**

```text
Transform this modern office into a Victorian library with completely
different furniture, add a fireplace, change the lighting to candlelit,
and age the photograph
```

Instead of:

Try sequential edits:

1. `Change the furniture style to Victorian antique pieces`

2. `Add a stone fireplace on the right wall`

3. `Transform lighting to warm candlelit atmosphere`

4. `Apply vintage photograph aesthetic with sepia tones`

**Avoid Vague Instructions:**

```text
Bad: Make it look better
Good: Increase contrast, add warm color grading, sharpen details
```

**Be Specific About Scope:**

```text
Bad: Change the background
Good: Replace the office background with a tropical beach at sunset,
      maintaining the subject's exact position and lighting direction
```

**Explicit Style Preservation:**

```text
Bad: Make it nighttime
Good: Transform to nighttime while maintaining the photorealistic style,
      add appropriate artificial lighting sources
```

1. **Start Simple** - Begin with single-element changes

2. **Be Explicit** - State what should change AND what should stay

3. **Reference Context** - Mention existing elements when relevant

4. **Iterate** - Refine through multiple small edits rather than one large one

5. **Preserve Deliberately** - Always specify style/composition preservation needs

---

## 5. JSON Structured Prompting

**Impact: MEDIUM-HIGH**

Using structured JSON for complex multi-element scene composition.

### 5.1 JSON Structured Prompting

**Impact: MEDIUM**

For complex scenes with multiple elements, spatial relationships, or production automation, use JSON-structured prompts.

- Multiple characters with distinct attributes

- Precise spatial positioning

- Complex scene composition

- Reproducible, template-based prompts

- Programmatic prompt generation

- Production workflows with variable substitution

Flatten your JSON into flowing prose for the actual prompt:

**From JSON:**

```json
{
  "subjects": [
    {
      "type": "person",
      "description": "elderly craftsman with weathered hands",
      "position": "seated at workbench",
      "action": "carefully carving wood"
    }
  ],
  "scene": { "setting": "traditional workshop", "time": "morning" },
  "technical": { "lighting": "natural window light from right" }
}
```

**To Prompt:**

```json
{
  "composition": {
    "layout": "triangular",
    "focal_point": "center-left intersection",
    "depth_layers": [
      {
        "layer": "foreground",
        "elements": ["flowers in vase"],
        "focus": "soft blur"
      },
      {
        "layer": "midground",
        "elements": ["main subject"],
        "focus": "sharp"
      },
      {
        "layer": "background",
        "elements": ["window", "garden view"],
        "focus": "soft blur"
      }
    ]
  }
}
```

Use JSON structure for template-based generation:

Define explicit spatial relationships:

1. **Use IDs for References** - Give subjects IDs when they interact

2. **Separate Concerns** - Keep scene, subjects, style, and technical distinct

3. **Be Consistent** - Use the same terminology throughout

4. **Include All Details** - Don't assume, specify everything

5. **Flatten for Execution** - Convert to natural language before sending to model

6. **Version Templates** - Track template versions for reproducibility

---

## 6. Color Specification

**Impact: MEDIUM**

Precise color control using hex codes for brand-accurate generations.

### 6.1 Hex Color Prompting

**Impact: MEDIUM**

FLUX supports hex color codes (#RRGGBB) for precise color specification, essential for brand consistency and exact color matching.

Include hex codes directly in your prompt with descriptive names:

Use these keywords to indicate color specification:

**1. Always Pair with Description:**

```text
Good: #FF6B6B (coral pink)
Bad: #FF6B6B
```

Never use hex codes alone - include the color name:

**2. Associate with Specific Objects:**

```text
A product shot featuring a smartphone with a #1DA1F2 (Twitter blue) case,
resting on a #14171A (near black) matte surface
```

Clearly connect colors to their targets:

**3. Limit Color Palette:**

```text
Color palette for the scene: #2ECC71 (emerald green), #3498DB (sky blue),
#F1C40F (sunflower yellow), #FFFFFF (pure white)
```

3-5 colors typically work best. Too many can confuse the model:

**Brand Colors:**

```text
Corporate office reception with brand colors prominently featured:
walls in #0066CC (company blue), accent furniture in #FF6600 (company orange),
logo displayed in #FFFFFF (white) against the blue backdrop
```

**Interior Design:**

```text
Scandinavian minimalist bedroom with #F5F5F5 (warm white) walls,
#8B4513 (saddle brown) wooden headboard and nightstands,
#708090 (slate gray) linen bedding, and #DAA520 (goldenrod) accent lamp
```

**Fashion:**

```text
Editorial fashion photo: model wearing #000000 (black) cashmere turtleneck,
#FF4500 (orange-red) wide-leg wool pants, #C0C0C0 (silver) geometric earrings,
against a #F0F0F0 (light gray) studio backdrop
```

**Product Design:**

```text
Premium headphones product shot: #1C1C1E (space gray) aluminum body,
#F5F5F7 (silver) mesh ear cups, #FF9500 (iOS orange) accent ring around controls
```

**Digital Art:**

```text
Synthwave cityscape: #FF00FF (magenta) and #00FFFF (cyan) neon signs,
#1A1A2E (deep navy) night sky, #E94560 (hot pink) setting sun on horizon,
#16213E (dark blue) building silhouettes, rain-slicked streets reflecting lights
```

**Data Visualization:**

```text
Sunset sky gradient from #FF6B6B (coral) at horizon through
#FFA07A (light salmon) to #87CEEB (sky blue) at top
```

Specify gradients with start and end colors:

**Complementary: Opposite on color wheel**

```text
Scene using complementary colors: #3498DB (blue) dominant with
#E67E22 (orange) accents for visual pop
```

**Analogous: Adjacent colors**

```text
Harmonious palette using analogous colors: #9B59B6 (purple),
#8E44AD (deep purple), #3498DB (blue) - flowing naturally together
```

**Triadic: Evenly spaced**

```text
Vibrant triadic scheme: #E74C3C (red), #F1C40F (yellow),
#3498DB (blue) - balanced and dynamic
```

**Monochromatic: Single hue variations**

```text
# Social Media
Twitter/X Blue: #1DA1F2
Facebook Blue: #1877F2
Instagram Gradient: #833AB4 to #FD1D1D
LinkedIn Blue: #0A66C2

# Tech
Apple Gray: #1C1C1E
Google Blue: #4285F4
Microsoft Blue: #00A4EF
Amazon Orange: #FF9900

# Design
Figma Purple: #A259FF
Dribbble Pink: #EA4C89
Behance Blue: #1769FF
```

For reference only - always verify current brand guidelines:

**Color Not Accurate:**

- Add the color name alongside hex

- Specify the exact object the color applies to

- Use fewer total colors in the prompt

**Color Bleeding:**

- Clearly delineate which objects get which colors

- Use spatial descriptions: "the LEFT chair in #color"

**Muddy Colors:**

- Check hex code accuracy

- Specify lighting that won't shift colors

- Use "maintaining exact color #XXXXXX" for emphasis

---

## 7. Typography and Text

**Impact: MEDIUM**

Rendering text and typography within generated images.

### 7.1 Typography and Text Prompting

**Impact: MEDIUM**

Guide to rendering text in FLUX images. Use FLUX.2 [flex] for best typography results.

Always quote the exact text you want rendered:

**1. Use Quotation Marks:**

```text
Correct: A poster with "HELLO WORLD" in bold letters
Wrong: A poster with HELLO WORLD in bold letters
```

**2. Specify Font Style:**

```text
"ADVENTURE" in bold sans-serif typography
"Welcome" in elegant cursive script
"CHAPTER ONE" in classic serif typeface
"CODE" in monospace terminal font
"SALE!" in decorative display lettering
```

**3. Describe Size Hierarchy:**

```text
Large headline "BREAKING NEWS" above smaller subtext "Details inside"
```

**4. Indicate Placement:**

```text
"OPEN" sign centered in storefront window
"EXIT" text positioned above doorway
"Page 1" in bottom right corner
```

**5. Front-Load Text:**

```text
Good: A sign reading "FRESH BREAD" in a bakery window...
Less Good: A bakery window with a sign that says "FRESH BREAD"...
```

Place text descriptions early in the prompt for better accuracy:

**Sans-Serif (Modern/Clean):**

```text
"MINIMAL" in clean geometric sans-serif, Swiss modernist style
"TECH SUMMIT" in bold condensed grotesque typeface
"future" in thin uppercase sans-serif, contemporary design
```

**Serif: Classic/Elegant**

```text
"The New Yorker" in traditional serif typeface, editorial masthead
"LUXURY" in high-contrast Didone serif with thin/thick strokes
"Wisdom" in old-style serif with subtle bracketed serifs
```

**Script/Cursive (Decorative):**

```text
"With Love" in flowing calligraphic script with flourishes
"Signature" in connected brush script, casual elegance
"Romance" in formal copperplate script, wedding invitation style
```

**Display/Decorative:**

```text
"ROCK CONCERT" in distressed vintage concert poster lettering
"CIRCUS" in ornate Victorian display type with decorative elements
"RETRO" in 1970s rounded bubble letters
```

**Handwritten:**

```text
"Note to self" in casual handwritten style, slightly imperfect
"Thanks!" in quick marker pen handwriting
"ideas" in sketchy pencil handwriting
```

**Monospace:**

```text
"CODE_COMPLETE" in terminal monospace, developer aesthetic
"SYSTEM" in typewriter monospace, vintage tech
"DEBUG" in LCD-style digital monospace
```

**Neon Signs:**

```text
Glowing neon sign spelling "OPEN 24/7" in pink neon tubes with
blue outline, slight glow and reflection, night scene
```

**Metallic/3D:**

```text
"GOLD" in three-dimensional metallic gold letters with realistic
reflections and subtle shadows, luxury aesthetic
```

**Embossed/Debossed:**

```text
"PREMIUM" embossed into leather surface, subtle shadows showing
the raised letterforms
```

**Outlined:**

```text
"MODERN" in outline-only letters, no fill, thin white stroke
on dark background
```

**Gradient Text:**

```text
"SUMMER" with gradient fill from #FF6B6B (coral) at top to
#4ECDC4 (teal) at bottom
```

**Poster Design:**

```text
Event poster with "SUMMER FEST 2025" as large headline in bold
condensed sans-serif at top, "JULY 15-17" as medium subheading
in regular weight, "Central Park, NYC" as small body text at
bottom, all in white text on #FF6B35 (sunset orange) background
```

**Book Cover:**

```text
Book cover design: "THE GREAT GATSBY" in elegant art deco gold
lettering centered in upper third, author name "F. SCOTT FITZGERALD"
in smaller gold caps below, #1A1A2E (midnight blue) background
with geometric gold accents
```

**Magazine Cover:**

```text
Fashion magazine cover with "VOGUE" in classic serif masthead at top,
cover line "SPRING COLLECTION" in bold sans-serif, "The New Rules of Style"
in lighter weight italic, all in white against dramatic portrait
```

**Signage:**

```text
Vintage diner sign: "MEL'S DINER" in red neon script lettering,
"OPEN" below in separate green neon block letters, chrome border,
1950s Americana aesthetic
```

**Business Card:**

```text
Minimalist business card with "JOHN SMITH" in medium weight sans-serif,
"Creative Director" in lighter weight below, contact details in small
type at bottom, #2C3E50 (dark blue) text on white background
```

**Centered Composition:**

```text
Centered text layout: "WELCOME" in large caps at center,
perfectly balanced with equal margins
```

**Left-Aligned:**

```text
Left-aligned text block: "Company Name" as header,
"Tagline goes here" below, flush left alignment
```

**Text on Path:**

```text
"GOING IN CIRCLES" text following a circular path around
the center of the design
```

**Text Overlay:**

```text
"ADVENTURE AWAITS" in bold white text overlaid on landscape
photograph, positioned in lower third with slight shadow for readability
```

**Steps Parameter:**

- Higher steps (30-50) = better text quality

- Lower steps (10-20) = faster, lower quality

**Guidance Parameter:**

- Higher guidance (6-10) = stricter prompt following

- Lower guidance (1.5-4) = more creative interpretation

**Recommended Settings:**

```text
For clean typography: steps=50, guidance=7
For artistic text: steps=30, guidance=4
```

**Misspelled Words:**

- Keep text short (1-4 words work best)

- Use common words when possible

- Repeat the exact text in the prompt

**Illegible Text:**

- Specify larger text size

- Use simpler fonts (sans-serif)

- Ensure high contrast with background

- Use [flex] model

**Wrong Font Style:**

```text
Instead of: "text in a nice font"
Use: "text in bold geometric sans-serif similar to Futura"
```

Be more specific:

**Text Not Appearing:**

- Front-load text description in prompt

- Put text in quotes

- Specify exact placement

- Reduce other prompt complexity

---

## 8. Multi-Reference Editing

**Impact: MEDIUM**

Combining multiple reference images for style transfer and composition.

### 8.1 Multi-Reference Image Editing

**Impact: MEDIUM**

Guide to using multiple reference images for character consistency, style transfer, and complex compositions.

FLUX.2 models support multiple reference images for advanced editing:

- **FLUX.2 [klein]**: Up to 4 reference images - fast editing

- **FLUX.2 [pro]**: Up to 8 via API - balanced quality/speed

- **FLUX.2 [max]**: Up to 8 via API, 10 in playground - highest quality

- **FLUX.2 [flex]**: Up to 8 via API - best for typography

> **Note:** FLUX.2 models are recommended over FLUX.1 Kontext Max for better results.

**Preferred: Use URLs directly** - simpler and more convenient than base64.

Pass image URLs directly to `input_image`, `input_image_2`, etc.:

The API fetches URLs automatically. Both URL and base64 work, but URLs are recommended when available.

**Natural Language Description:**

```text
The person from image 1 is sitting at the cafe table from image 2,
wearing the outfit from image 3, with the warm lighting style of image 4
```

Describe relationships between images naturally:

**Explicit Indexing:**

```text
Combine the face from image 1 with the hairstyle from image 2
on the body pose from image 3
```

Reference images by number for precision:

**Character Consistency:**

```text
The same person from image 1, now seated at a desk in a modern office,
same clothing and hairstyle, different environment
```

Maintain the same character across multiple scenes:

For sequential consistency:

**Style Transfer:**

```text
Apply the color grading and mood from image 2 to the scene in image 1
```

Apply the style of one image to another:

**Pose Guidance:**

```text
The person from image 1 in the exact pose shown in image 2,
placed in the environment from image 3
```

Use a reference for body positioning:

**Object Composition:**

```text
Place the product from image 1 on the table setting from image 2,
using the lighting style from image 3
```

Combine elements from multiple images:

**Background Replacement:**

```text
Keep the subject from image 1 exactly as shown, replace the background
with the beach scene from image 2, match the lighting naturally
```

**Two Characters:**

```text
Image 1 (person A) and image 2 (person B) having a conversation
at a coffee shop table, person A on the left gesturing, person B
on the right listening intently
```

**Group Composition:**

```text
The three people from images 1, 2, and 3 standing together for a
group photo, arranged left to right in that order, friendly poses,
outdoor park setting
```

**Selective Attribute Transfer:**

```text
The face and expression from image 1, the hairstyle from image 2,
wearing the outfit from image 3, in the pose from image 4
```

**Partial Transfer:**

```text
Arrange the scene using the layout shown in the collage input:
- Person from image 1 in the left position
- Object from image 2 in the center position
- Background element from image 3 filling the right side
```

Use a collage input for layout guidance:

**1. Clear Image Roles:**

```text
Image 1: face/identity reference
Image 2: pose/body reference
Image 3: style/aesthetic reference
Image 4: environment/background reference
```

Specify what each reference provides:

**2. Quality References:**

- Use high-quality, clear reference images

- Ensure good lighting in references

- Avoid heavily processed or filtered images

**3. Consistent Lighting:**

```text
...ensure the lighting direction matches across all elements,
with main light source from the upper left
```

When combining elements:

**4. Resolution Awareness:**

For [pro] API with 9MP total limit:

- At 1MP output: up to 8 reference images comfortably

- Calculate: input images + output = total MP

**5. Explicit Relationships:**

```text
Create a scene combining:
- The woman from image 1 (keep exact face, expression, hair)
- Wearing the vintage dress from image 2 (exact pattern and cut)
- In the pose from image 3 (seated position, arm placement)
- Set in the library from image 4 (bookshelves, furniture)
- Using the warm lighting style from image 5 (golden hour quality)

Position her in the center of frame, medium shot, looking slightly
to the right with a thoughtful expression.
```

Don't assume - specify exactly how elements relate:

**Elements Not Transferring:**

- Be more specific about which element from which image

- Use explicit indexing ("from image 1")

- Reduce the number of references and complexity

**Inconsistent Blending:**

- Specify lighting consistency

- Describe how elements should interact

- Use style references to unify the composition

**Identity Drift:**

- Emphasize key identifying features

- Use phrases like "maintaining exact likeness"

- Provide multiple angles of the same subject if available

---

## 9. Positive Prompt Alternatives

**Impact: MEDIUM**

Strategies for achieving results without negative prompts, which FLUX does not support.

### 9.1 Negative Prompt Alternatives

**Impact: MEDIUM**

FLUX does not support negative prompts. This guide provides positive alternatives for common negative prompt patterns.

Negative prompts can actually make models focus MORE on unwanted elements. Instead, describe exactly what you DO want - this gives clearer direction and better results.

For any unwanted element:

1. Identify what you don't want

2. Ask: "What would be there instead?"

3. Describe the positive alternative

**People/Crowds:**

| Instead of | Use |

|-----------|-----|

| "no people" | "empty", "deserted", "solitary", "abandoned" |

| "no crowds" | "quiet", "peaceful", "secluded", "private" |

| "without background people" | "isolated subject", "clean background", "solo figure" |

**Example:**

```text
Bad: A beach scene, no people
Good: A deserted beach at dawn, pristine untouched sand, solitary seagull
```

**Skin/Appearance:**

| Instead of | Use |

|-----------|-----|

| "no makeup" | "natural skin", "bare face", "fresh-faced" |

| "no blemishes" | "clear skin", "smooth complexion", "healthy glow" |

| "no wrinkles" | "youthful skin", "smooth features" |

**Example:**

```text
Bad: Portrait of woman, no makeup, no blemishes
Good: Portrait of a woman with natural clear skin, fresh-faced with a healthy glow
```

**Accessories:**

| Instead of | Use |

|-----------|-----|

| "no glasses" | "visible eyes", "unobstructed gaze", "clear eye contact" |

| "no hat" | "bare head", "visible hair", "uncovered head" |

| "no jewelry" | "minimal accessories", "understated", "unadorned" |

**Example:**

```text
Bad: Man portrait, no glasses, no hat
Good: Portrait of a man with clear direct gaze, wind-swept visible hair
```

**Colors:**

| Instead of | Use |

|-----------|-----|

| "no color" | "monochrome", "black and white", "grayscale" |

| "not colorful" | "muted tones", "subdued palette", "desaturated" |

| "no bright colors" | "neutral tones", "earth tones", "soft pastels" |

**Example:**

```text
Bad: Landscape photo, no bright colors
Good: Landscape in muted earth tones, soft morning light, desaturated palette
```

**Text/Watermarks:**

| Instead of | Use |

|-----------|-----|

| "no text" | "clean surfaces", "unmarked", "text-free" |

| "no watermark" | "pristine image", "clean composition" |

| "no logos" | "unbranded", "plain", "logo-free surface" |

**Example:**

```text
Bad: Product photo, no watermark, no text
Good: Clean product photography with pristine unmarked surfaces, minimal unbranded design
```

**Style/Era:**

| Instead of | Use |

|-----------|-----|

| "not modern" | "traditional", "classical", "vintage", "historical" |

| "no CGI look" | "photorealistic", "authentic", "natural", "organic" |

| "not cartoonish" | "realistic", "lifelike", "naturalistic" |

**Example:**

```text
Bad: Building design, not modern, no futuristic elements
Good: Traditional Victorian architecture with classical ornate details and period-accurate features
```

**Quality/Artifacts:**

| Instead of | Use |

|-----------|-----|

| "no blur" | "sharp focus", "crisp details", "tack-sharp" |

| "no noise" | "clean image", "smooth gradients", "low ISO" |

| "no artifacts" | "pristine quality", "clean render", "flawless" |

**Example:**

```text
Bad: Portrait, no blur, no noise
Good: Tack-sharp portrait with pristine image quality, smooth skin tones, crisp details
```

**Objects:**

| Instead of | Use |

|-----------|-----|

| "no cars" | "pedestrian area", "car-free zone", "walking street" |

| "no buildings" | "open landscape", "natural scenery", "wilderness" |

| "no furniture" | "empty room", "bare space", "minimalist interior" |

**Example:**

```text
Bad: Street scene, no cars, no modern buildings
Good: Historic cobblestone walking street lined with traditional stone buildings from the 1800s
```

**Weather/Environment:**

| Instead of | Use |

|-----------|-----|

| "no rain" | "clear sky", "dry weather", "sunny day" |

| "no clouds" | "clear blue sky", "cloudless", "perfect visibility" |

| "not dark" | "well-lit", "bright", "daylight", "illuminated" |

**Example:**

```text
Bad: Outdoor portrait, no rain, no clouds, not dark
Good: Outdoor portrait under clear blue sky on a bright sunny day, perfect natural lighting
```

**Composition:**

| Instead of | Use |

|-----------|-----|

| "no distractions" | "clean composition", "focused framing", "minimal elements" |

| "nothing in background" | "solid background", "isolated subject", "clean backdrop" |

| "no clutter" | "organized", "tidy", "minimal", "streamlined" |

**Example:**

```text
Bad: Product shot, no distractions, nothing in background
Good: Product on clean white seamless backdrop, isolated subject, minimal focused composition
```

**Original Negative-Heavy Prompt:**

```text
Portrait of a woman, no glasses, no makeup, no wrinkles, no blemishes,
no bright colors, no distracting background, no harsh lighting
```

**Positive Rewrite:**

```text
Portrait of a youthful woman with clear natural skin and visible bright eyes,
fresh-faced with a healthy glow, wearing muted earth tones against a soft
blurred neutral background, gentle diffused lighting creating soft shadows
```

**Original Negative-Heavy Prompt:**

```text
Landscape photo, no people, no buildings, no power lines, no modern elements,
no overcast sky, no dead trees
```

**Positive Rewrite:**

```text
Pristine wilderness landscape with lush green living forest, clear blue sky,
untouched natural scenery stretching to the horizon, peaceful solitude with
only birdsong and wind, golden hour sunlight filtering through healthy foliage
```

| Unwanted | Positive Alternative |

|----------|---------------------|

| No people | Empty, solitary, deserted |

| No makeup | Natural, fresh-faced, bare |

| No text | Clean, unmarked, pristine |

| No blur | Sharp, crisp, tack-sharp |

| No modern | Traditional, vintage, classical |

| No dark | Bright, well-lit, luminous |

| No busy | Minimal, clean, focused |

| No artificial | Natural, organic, authentic |

---

## References

1. [https://docs.bfl.ai](https://docs.bfl.ai)
2. [https://bfl.ai](https://bfl.ai)
