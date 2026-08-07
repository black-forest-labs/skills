---
name: flux-3-audio-dialogue
description: Use when directing FLUX 3 audio, dialogue, or voiceover. Covers ambience, effects, music, silence, and timing.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, audio, dialogue, voiceover, sound-design
---

# FLUX 3 Audio and Dialogue

Name each layer separately: speech, voiceover, ambience, effects, music, or deliberate
silence. One blurred description gives up control of all of them; every sound needs a
physical source or narrative role.

**Speech.** Quote the exact line, name the visible speaker (or label the line
`voiceover`/`narration` so it is not searching for a mouth to belong to), and add
`no on-screen text, no subtitles` when text is unwanted:

```text
A weather presenter on camera in front of a stylized storm map, speaking directly to
the lens: "Storm season is here, and this time, we're ready." Confident delivery,
clean studio lighting. No on-screen text, no subtitles.
```

Voice anchors: age range, accent when relevant, register, energy, recording distance.
Reusing the same direction preserves a kind of voice, not the same performer across
generations.

**Speakability.** Write for the clip's real duration: short sentences, one thought per
line, room before and after the payoff; spell unusual names phonetically; shorten the
line before speeding the delivery. A line that cannot finish comfortably needs a
shorter script or a longer clip.

**Effects are causal**, not a detached list:

```text
As the cup hits the tile, it cracks with one sharp ceramic snap.
```

**Mix.** Say what leads and what stays under it. Keep background voices out when one
line matters:

```text
Her line is foreground and fully intelligible. Café chatter and espresso hiss remain
low and diffuse. A restrained piano pulse enters beneath the final words without
masking them.
```

**Silence and post.** Set `generate_audio: false` for a deliberately silent source
clip. Reserve for deterministic post: final loudness, EQ, ducking, and fades;
guaranteed wording or speaker identity; frame-accurate sync; subtitles and captions;
continuity across separately generated clips.

When a take misses, change one dimension at a time: speaker ownership, line length,
delivery anchors, competing layers, action-to-effect causality, or generation versus
post.
