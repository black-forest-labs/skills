---
name: model-selection-guide
description: Choosing the right FLUX model for your use case
---

# FLUX Model Selection Guide

Decision guide for selecting the optimal FLUX model based on your requirements.

## Quick Decision Matrix

| Priority      | Recommended Model               |
| ------------- | ------------------------------- |
| Speed         | FLUX.2 [klein]                  |
| Quality       | FLUX.2 [max]                    |
| Balance       | FLUX.2 [pro]                    |
| Typography    | FLUX.2 [flex]                   |
| Image Editing | FLUX.2 [klein], [pro], or [max] |
| Local/Free    | FLUX.2 [dev]                    |
| Inpainting    | FLUX.1 Fill                     |
| Layout control / precise local edits | FLUX 3 Image       |
| Lowest cost per image / open weights | FLUX 3 Image Klein |

## Decision Tree

```
What's your primary need?

├─ Generate images (text-to-image OR image editing)
│   ├─ Need FASTEST possible generation?
│   │   └─ FLUX.2 [klein] (supports up to 4 reference images)
│   │
│   ├─ Need HIGHEST quality output?
│   │   └─ FLUX.2 [max] (supports up to 8-10 reference images)
│   │
│   ├─ Need TEXT/TYPOGRAPHY in image?
│   │   └─ FLUX.2 [flex] (supports up to 8 reference images)
│   │
│   ├─ Need BALANCED speed/quality?
│   │   └─ FLUX.2 [pro] (supports up to 8 reference images)
│   │
│   ├─ Need LOCAL/FREE generation?
│   │   └─ FLUX.2 [dev]
│   │
│   ├─ Need to PLACE elements (bounding boxes) or change one element and keep the rest?
│   │   └─ FLUX 3 Image (up to 10 reference images)
│   │
│   └─ Need the LOWEST cost per image, or open weights / LoRA?
│       └─ FLUX 3 Image Klein (up to 10 reference images)
│
├─ Need REAL-TIME web information?
│   └─ FLUX.2 [max] (grounding search)
│
└─ FLUX.1 family (only use when explicitly asked by user)
    ├─ FLUX.1 Kontext - context-aware editing
    └─ FLUX.1 Fill - inpainting/object removal
```

**Note:** All FLUX.2 models natively support image-to-image editing via reference images. Simply provide your source image(s) as references and describe the desired changes.

## Detailed Model Comparisons

### By Speed

| Model             | Relative Speed | Best For                |
| ----------------- | -------------- | ----------------------- |
| FLUX.2 [klein] 4B | Fastest        | Rapid prototyping       |
| FLUX.2 [klein] 9B | Very Fast      | Better quality previews |
| FLUX.2 [pro]      | Medium         | Production workflows    |
| FLUX.2 [flex]     | Medium         | Typography tasks        |
| FLUX.2 [max]      | Slower         | Final hero images       |
| FLUX 3 Image Klein | Very Fast     | High-volume edits       |
| FLUX 3 Image      | Slower         | Layout control, precise edits |

### By Quality

| Model             | Quality Level | Trade-off                  |
| ----------------- | ------------- | -------------------------- |
| FLUX.2 [max]      | Highest       | Slowest, most expensive    |
| FLUX.2 [pro]      | High          | Good balance               |
| FLUX.2 [flex]     | High (text)   | Specialized for typography |
| FLUX.2 [klein] 9B | Good          | Fast, slightly less detail |
| FLUX.2 [klein] 4B | Moderate      | Fastest, preview quality   |

### By Cost

> **Credit pricing:** 1 credit = $0.01 USD. FLUX.2 uses megapixel-based pricing.

#### FLUX.2 Models

| Model             | 1st MP | +MP  | 1MP T2I | 1MP I2I | Volume Recommendation       |
| ----------------- | ------ | ---- | ------- | ------- | --------------------------- |
| FLUX.2 [klein] 4B | 1.4c   | 0.1c | $0.014  | $0.015  | High volume, previews       |
| FLUX.2 [klein] 9B | 1.5c   | 0.2c | $0.015  | $0.017  | High volume, better quality |
| FLUX.2 [pro]      | 3c     | 1.5c | $0.03   | $0.045  | Production workloads        |
| FLUX.2 [max]      | 7c     | 3c   | $0.07   | $0.10   | Hero images, premium        |
| FLUX.2 [flex]     | 5c     | 5c   | $0.05   | $0.10   | Typography                  |
| FLUX.2 [dev]      | -      | -    | Free    | Free    | Local dev (non-commercial)  |

> **Pricing formula:** `(firstMP + (outputMP-1) * mpPrice) + (inputMP * mpPrice)` in cents

#### FLUX 3 Image

> Priced per image by `resolution` tier, the same for text-to-image and editing. The submit response returns `cost` in credits.

| Model              | `768sq` | `1k`   | `1.5k` | `2k`   | `4k`   | Volume Recommendation          |
| ------------------ | ------- | ------ | ------ | ------ | ------ | ------------------------------ |
| FLUX 3 Image Klein | $0.008  | $0.009 | $0.011 | $0.014 | $0.036 | High volume, editing at scale  |
| FLUX 3 Image       | $0.041  | $0.048 | -      | $0.100 | $0.607 | Layout control, precise edits  |

#### FLUX.1 Models

| Model                | Price/Image | Use Case                |
| -------------------- | ----------- | ----------------------- |
| FLUX.1 Kontext [pro] | $0.04       | Context-aware editing   |
| FLUX.1 Kontext [max] | $0.08       | Max quality editing     |
| FLUX1.1 [pro]        | $0.04       | Standard T2I            |
| FLUX1.1 [pro] Ultra  | $0.06       | Ultra high-resolution   |
| FLUX1.1 [pro] Raw    | $0.06       | Candid photography feel |
| FLUX.1 Fill [pro]    | $0.05       | Inpainting              |
| FLUX.1 [pro]         | $0.05       | Original pro model      |

#### FLUX 3 Video

> **Video pricing:** per second of output. Text/image input is cheaper than video input; drafts are HD-only.

| Model              | Text/Image → Video | Video → Video | Use Case                  |
| ------------------ | ------------------ | ------------- | ------------------------- |
| FLUX 3 Video Draft | $0.06/s            | $0.12/s       | Concept exploration       |
| FLUX 3 Video (HD)  | $0.17/s            | $0.41/s       | Standard delivery         |
| FLUX 3 Video (FHD) | $0.29/s            | $0.53/s       | High-resolution delivery  |

> **Cost:** `rate x seconds`. A 5s HD text-to-video clip is $0.85; as a draft, $0.30.

> Use [bfl.ai/pricing](https://bfl.ai/pricing) calculator for exact costs at different resolutions.

## Use Case Recommendations

### Creative Exploration / Ideation

**Recommended: FLUX.2 [klein]**

- Fast iterations
- Quick concept testing
- Mood board generation
- Exploring prompt variations

### Production Marketing Assets

**Recommended: FLUX.2 [pro]**

- Consistent quality
- Reasonable speed
- Cost-effective at scale
- Reliable for automation

### Hero Images / Premium Content

**Recommended: FLUX.2 [max]**

- Maximum detail
- Best coherence
- Supports grounding search
- Worth the premium for key visuals

### Typography / Signage / Posters

**Recommended: FLUX.2 [flex]**

- Superior text rendering
- Adjustable quality settings
- Best for readable text
- UI mockups and infographics

### Character Consistency

**Recommended: FLUX.2 [max] or [pro]**

- Multi-reference support (up to 8-10 images)
- Best editing consistency
- Maintains identity across scenes
- Superior quality over FLUX.1 Kontext

### Photo Editing / Retouching

**Recommended: FLUX.2 [klein], [pro], or [max]**

- Native image-to-image support via references
- Style transfer
- Object modification
- Attribute changes
- Better results than FLUX.1 Kontext

### Real-Time Information

**Recommended: FLUX.2 [max]**

- Grounding search feature
- Current events
- Recent news visualization
- Weather/location data

### Layout Control / Precise Local Edits

**Recommended: FLUX 3 Image**

- Bounding boxes in the prompt place every element (headline, product, each panel of a grid)
- Recolor, move, replace, or remove one element while the rest stays unchanged
- Up to 10 references in one `images` array
- `grounding` is on by default (web and image search); set `false` for invented people or products

### High-Volume Editing / Custom Styles

**Recommended: FLUX 3 Image Klein**

- About $0.009 per 1K image
- Same prompt, `images`, and bounding box format as FLUX 3 Image (but not every field; see `bfl-api/references/endpoints.md`)
- Open weights; train LoRAs on Klein Base

### Local Development / Testing

**Recommended: FLUX.2 [dev]**

- No API costs
- Full control
- Fine-tuning experiments
- Offline capability

### Editorial with Typography

```
1. FLUX.2 [max] - Generate base image (highest quality)
2. FLUX.2 [flex] - Add text overlay pass
```

### Character-Consistent Series

```
1. FLUX.2 [max] - Create character reference
2. FLUX.2 [max]/[pro] - Generate consistent variations using reference images
3. FLUX.2 [klein] - Quick iteration on variations if needed
```

### E-commerce Product Pipeline

```
1. FLUX.2 [pro] - Bulk product generations
2. FLUX.2 [pro]/[klein] - Product variations (colors, angles) using references
3. FLUX.2 [flex] - Add promotional text/pricing
```

## Constraint-Based Selection

### Limited Budget

- **High volume**: FLUX.2 [klein] 4B
- **Quality needed**: FLUX.2 [pro] (best value)

### Tight Deadline

- **Any task**: FLUX.2 [klein]
- **Quality matters**: FLUX.2 [pro]

### Maximum Quality Required

- **Always**: FLUX.2 [max]

### Text Must Be Readable

- **Always**: FLUX.2 [flex]

### Editing Existing Images

- **Fast edits**: FLUX.2 [klein] with reference images
- **Quality edits**: FLUX.2 [max] or [pro] with reference images
- **Alternative**: FLUX.1 Kontext (FLUX.2 preferred)

### Rate Limit Sensitivity

- **Prefer**: FLUX.2 models (24 concurrent limit)
- **Avoid**: FLUX.1 Kontext Max (6 concurrent limit)

## Summary Cheat Sheet

```
Speed?      → FLUX.2 [klein]
Quality?    → FLUX.2 [max]
Balance?    → FLUX.2 [pro]
Text?       → FLUX.2 [flex]
Edit?       → FLUX.2 [klein/pro/max] with reference images
Free?       → FLUX.2 [dev]
Layout?     → FLUX 3 Image (bounding boxes)
Cheapest?   → FLUX 3 Image Klein
```

**Key insight:** All FLUX.2 models support image editing natively via reference images. FLUX.2 is recommended over FLUX.1 Kontext for editing tasks.
