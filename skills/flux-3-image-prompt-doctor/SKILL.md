---
name: flux-3-image-prompt-doctor
description: Use when a FLUX 3 Image (flux-3-image) request will put text on the image (posters, flyers, cards, signage, labels). Catches copy the rewrite step would invent before you pay for the render.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, flux-3-image, bfl, prompt-doctor, typography, validation
---

# FLUX 3 Image Prompt Doctor

FLUX 3 Image plans every prompt before rendering (status `Reasoning`, then
`Generating`) and returns the rewritten prompt in `result.prompt`. When a brief names a
piece of text without giving its value ("show the address, time, and dress code"), the
rewrite has been observed to fill the slot with plausible but invented copy: a street
address, a start time, an RSVP email, an age limit. `grounding: false` did not change
this. When the brief supplies the value, the rewrite has been observed to keep it word
for word. This skill closes the gap before generation. It does not call the API; leave
the request itself to the [API reference](https://docs.bfl.ai).

## Text inventory

List every piece of text the image should carry, one row each:

| Element | Value | Mode |
| --- | --- | --- |
| title | "HAUNTED HOUSE PARTY" | exact |
| headline | (none) | model may write |
| address | (missing) | exact |

- **exact**: facts and names (dates, times, addresses, prices, contacts, brand names).
  The value goes in the prompt verbatim, in double quotes.
- **model may write**: slogans and captions the user left open. Say how many and where.
- Close the list in the prompt: "The only text on the image is ...". For art with no
  copy, write "with NO text, letters, or words anywhere".

## Verdict

Return exactly one, with the inventory:

- **READY**: every exact row has a value. Hand off the prompt with the values quoted.
- **NEEDS INFO**: an exact row has no value. Ask only for those values; never let the
  model or yourself fill them.
- **REVISE**: the copy must be pixel-exact (logos, legal text, long paragraphs, small
  print). Generate the art with no text, reserve the empty zones in the prompt, and
  typeset the copy afterwards.

Set aspect ratio as a request field; also name it in the prompt when the layout depends
on it.

## After the job is Ready

Save `result.prompt` with the task id, then check that every quoted string in it is
either in the inventory or a `model may write` row. Report the rest as invented:

```python
import re, unicodedata

def norm(s):
    s = unicodedata.normalize("NFKC", s).replace("’", "'")
    return re.sub(r"\s+", " ", s).strip().casefold()

def quoted(text):
    return [a or b for a, b in re.findall(r'"([^"]+)"|“([^”]+)”', text)]

def invented(brief, rewritten):
    allowed = {norm(q) for q in quoted(brief)}
    return [q for q in quoted(rewritten) if norm(q) not in allowed]
```

Anything returned that is not an allowed `model may write` line is copy nobody approved.
Fix the inventory and regenerate rather than shipping it.
