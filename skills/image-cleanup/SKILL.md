---
name: image-cleanup
description: Remove unwanted elements from images using BFL FLUX image-to-image editing. Remove text and watermarks, clear furniture from rooms, or remove any specified object. Use when users want to clean up photos by removing distracting or unwanted content.
metadata:
  author: playground
  version: "1.0"
  tags: flux, bfl, image-editing, removal, cleanup, i2i
---

# Image Cleanup & Removal

Guide for crafting prompts to remove unwanted elements from images using BFL FLUX image-to-image editing.

## Model Selection

Use FLUX.2 models with `input_image` parameter for removal tasks:
- **FLUX.2 [pro]** - Recommended for most cleanup tasks
- **FLUX.2 [max]** - Best quality for complex removals
- **FLUX.1 Fill** - Alternative for inpainting-style removal with masks

For API integration details, see the **bfl-api** skill. For general prompting best practices, see **flux-best-practices**.

## How to Use

Pass the source image URL to `input_image` and describe what to remove in the prompt.

## Removal Types

### Remove Text

**Goal:** Remove all text, labels, watermarks, and written content from the image.

**Prompt principles:**
- Be explicit about removing ALL text
- The model will inpaint the areas where text was removed

**Example prompts:**
```
Remove all text from the image
```
```
Remove all text, watermarks, labels, and written content from this image, filling the areas naturally
```
```
Erase all visible text including signs, labels, and watermarks
```

**What gets removed:**
- Watermarks and logos
- Signs and labels
- Captions and overlays
- Handwritten text
- Any visible lettering

---

### Remove Furniture

**Goal:** Clear all furniture and appliances from interior spaces to show empty rooms.

**Prompt principles:**
- Explicitly list categories of items to remove
- Mention specific items if visible (lights, carpets, curtains)
- The goal is a completely empty room showing only the structure

**Example prompts:**
```
Remove all furniture from the image
```
```
Remove all furniture and all appliances from the image. Remove lights, carpets, curtains, and all decorative items. Show only the empty room structure.
```
```
Clear the room completely: remove all furniture, appliances, lighting fixtures, rugs, curtains, and decorations. Leave only walls, floor, ceiling, windows, and doors.
```

**Items to explicitly mention removing:**
- Furniture: sofas, chairs, tables, beds, desks, shelving
- Appliances: refrigerators, ovens, washing machines, TVs
- Soft furnishings: carpets, rugs, curtains, blinds
- Lighting: lamps, chandeliers, floor lights
- Decorations: art, plants, accessories, mirrors

**Use cases:**
- Virtual staging preparation
- Real estate "empty room" shots
- Interior design planning
- Renovation visualization

---

### Remove Anything (Targeted Removal)

**Goal:** Remove a specific element from the image.

**Required input:** `SUBJECT` - what to remove

**Prompt principles:**
- Clearly identify the specific element to remove
- Can specify level of removal (just the item, or related elements too)
- Model will inpaint the removed area to match surroundings

**Example prompts:**
```
Remove [SUBJECT] completely from the image
```
```
Remove the person on the left side of the image completely
```
```
Remove the car in the background, filling the area naturally
```
```
Remove [SUBJECT] and any related elements (supports, shadows, reflections)
```

**Removal levels:**
- **Basic:** Remove only the specified object
- **Extended:** Remove object plus directly related elements (e.g., lamp + cord + shadow)
- **Complete:** Remove object and all associated structures

**Tips for specifying subjects:**
- Use position: "the person on the left", "the object in the background"
- Use description: "the red car", "the tall building"
- Use category: "all people", "the furniture", "background clutter"
- Be specific to avoid unintended removals

## General Prompt Guidelines

1. **Be explicit** - Clearly state what should be removed
2. **Consider context** - Removed areas will be filled; think about what makes sense
3. **Specify scope** - Individual item vs. category vs. everything of a type
4. **Use position descriptors** - Help identify exactly what to remove

## Choosing the Right Approach

| User Intent | Prompt Strategy |
|------------|-----------------|
| Remove watermark | "Remove all text" |
| Remove specific person | "Remove [description + position]" |
| Empty a room | "Remove all furniture and appliances" |
| Remove background object | "Remove [object] in the background" |
| Clean up clutter | "Remove [specific items] from the image" |
| Remove text overlays | "Remove all text from the image" |

## Parameters Summary

| Removal Type | aspect_ratio | Notes |
|-------------|--------------|-------|
| Remove Text | (preserve original) | Removes ALL text |
| Remove Furniture | (preserve original) | List item categories explicitly |
| Remove Anything | (preserve original) | Specify SUBJECT clearly |

## Example Scenarios

**Watermark removal:**
```
Remove all text from the image
```

**Photobomber removal:**
```
Remove the person in the background on the right side of the image
```

**Real estate empty room:**
```
Remove all furniture and all appliances from the image. Remove lights, carpets, curtains, and all decorative items.
```

**Object removal:**
```
Remove the trash can next to the bench completely
```

**Multiple items:**
```
Remove the parked cars from the street, filling the areas naturally
```

## Related Skills

- **bfl-api** - API endpoints, authentication, polling patterns
- **flux-best-practices** - General prompting principles and model selection
