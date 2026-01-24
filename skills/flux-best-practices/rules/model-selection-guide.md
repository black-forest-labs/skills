---
name: model-selection-guide
description: Choosing the right FLUX model for your use case
---

# FLUX Model Selection Guide

Decision guide for selecting the optimal FLUX model based on your requirements.

## Quick Decision Matrix

| Priority | Recommended Model |
|----------|-------------------|
| Speed | FLUX.2 [klein] |
| Quality | FLUX.2 [max] |
| Balance | FLUX.2 [pro] |
| Typography | FLUX.2 [flex] |
| Image Editing | FLUX.2 [klein], [pro], or [max] |
| Local/Free | FLUX.2 [dev] |
| Inpainting | FLUX.1 Fill (legacy) |

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
│   └─ Need LOCAL/FREE generation?
│       └─ FLUX.2 [dev]
│
├─ Need REAL-TIME web information?
│   └─ FLUX.2 [max] (grounding search)
│
└─ Legacy options (FLUX.1 family)
    ├─ FLUX.1 Kontext - older context-aware editing
    └─ FLUX.1 Fill - inpainting/object removal
```

**Note:** All FLUX.2 models natively support image-to-image editing via reference images. Simply provide your source image(s) as references and describe the desired changes.

## Detailed Model Comparisons

### By Speed

| Model | Relative Speed | Best For |
|-------|---------------|----------|
| FLUX.2 [klein] 4B | Fastest | Rapid prototyping |
| FLUX.2 [klein] 9B | Very Fast | Better quality previews |
| FLUX.2 [pro] | Medium | Production workflows |
| FLUX.2 [flex] | Medium | Typography tasks |
| FLUX.2 [max] | Slower | Final hero images |

### By Quality

| Model | Quality Level | Trade-off |
|-------|--------------|-----------|
| FLUX.2 [max] | Highest | Slowest, most expensive |
| FLUX.2 [pro] | High | Good balance |
| FLUX.2 [flex] | High (text) | Specialized for typography |
| FLUX.2 [klein] 9B | Good | Fast, slightly less detail |
| FLUX.2 [klein] 4B | Moderate | Fastest, preview quality |

### By Cost (Approximate)

| Model | Pricing | Volume Recommendation |
|-------|---------|----------------------|
| FLUX.2 [klein] 4B | $0.014/image | High volume, previews |
| FLUX.2 [klein] 9B | $0.015/image | High volume, better quality |
| FLUX.2 [pro] | $0.03/MP | Production workloads |
| FLUX.2 [flex] | $0.06/MP | Typography-specific |
| FLUX.2 [max] | $0.07/MP | Hero images, premium |

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
- Superior quality over legacy Kontext

### Photo Editing / Retouching
**Recommended: FLUX.2 [klein], [pro], or [max]**
- Native image-to-image support via references
- Style transfer
- Object modification
- Attribute changes
- Better results than legacy FLUX.1 Kontext

### Object Removal / Completion
**Recommended: FLUX.1 Fill (legacy)**
- Clean inpainting
- Background completion
- Artifact removal
- Note: Consider FLUX.2 with reference images as alternative

### Real-Time Information
**Recommended: FLUX.2 [max]**
- Grounding search feature
- Current events
- Recent news visualization
- Weather/location data

### Local Development / Testing
**Recommended: FLUX.2 [dev]**
- No API costs
- Full control
- Fine-tuning experiments
- Offline capability

## Multi-Model Workflows

### Ideation to Production Pipeline
```
1. FLUX.2 [klein] - Generate 20 quick concepts
2. FLUX.2 [pro] - Refine top 5 candidates
3. FLUX.2 [max] - Final hero image from best concept
```

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
- **Legacy option**: FLUX.1 Kontext (not recommended)

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
Fill gaps?  → FLUX.1 Fill (legacy)
```

**Key insight:** All FLUX.2 models support image editing natively via reference images. There's no need to use legacy FLUX.1 Kontext models for editing tasks.
