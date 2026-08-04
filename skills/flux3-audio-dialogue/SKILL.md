---
name: flux3-audio-dialogue
description: Use when directing FLUX 3 audio, dialogue, or voiceover. Covers ambience, effects, music, silence, and timing.
metadata:
  author: Black Forest Labs
  version: "1.0.0"
  tags: flux, flux-3, bfl, audio, dialogue, voiceover, sound-design
---

# FLUX 3 Audio and Dialogue

Direct synchronized sound as part of a FLUX 3 scene. Give each layer a source, owner, timing role, and priority.

## When to Use

- A clip includes spoken dialogue, voiceover, or narration
- Visible actions need synchronized effects
- Ambience or music carries the tone
- Voice quality, pronunciation, or cross-clip consistency matters
- The desired clip should be intentionally silent
- Generated audio failed and needs a controlled revision

When available, use `flux3-cinematic-inserts` or `flux3-keyframes-continuation` for visual direction and `flux3-generate` for API execution.

## Workflow

### 1. Build an audio ledger

Name each layer separately in the prompt. Ambient sound, music, and speech are read as distinct layers, and describing them as one blur gives up control of all three.

List only layers that serve the scene:

- **Speech:** visible speaker, exact words, and delivery
- **Voiceover:** off-screen owner, exact words, and recording character
- **Ambience:** location-specific bed such as rain on an awning, room tone, crowd murmur, or traffic
- **Effects:** sound caused by visible action
- **Music:** style, pace, entry, progression, and role under the scene
- **Silence:** deliberate absence of generated sound

Complete when every requested sound has a physical source or narrative role.

### 2. Assign every voice to a source

For on-camera speech, name the visible speaker and describe how they deliver the line. For off-screen speech, label it `voiceover` or `narration` and name its owner. If on-screen text is unwanted, add `no on-screen text, no subtitles`.

These details reduce ambiguity around quoted lines:

1. quote the exact line;
2. identify the visible speaker or explicitly label the line as voiceover/narration;
3. add `no on-screen text, no subtitles` when text is unwanted.

```text
A weather presenter on camera in front of a stylized storm map, speaking directly to the lens: "Storm season is here — and this time, we're ready." Confident delivery, clean studio lighting. No on-screen text, no subtitles.
```

For off-screen speech, label it `voiceover` or `narration` so the line is not searching for a mouth to belong to.

Useful anchors include age range, accent when relevant, register, energy, recording distance, and social delivery:

```text
A woman in her thirties speaks close to the camera in a warm, low register, conversational and slightly breathless: "We made it."
```

Reusing the same direction can preserve a kind of voice, but does not guarantee the same performer across separate generations.

Complete when each line has one unambiguous owner and a visible or explicitly off-screen source.

### 3. Make dialogue speakable

Write for the clip's real duration:

- use short sentences and natural contractions;
- prefer one thought per line;
- leave room before and after important speech;
- avoid tongue-twisters, dense product names, and crowded background speech;
- spell unusual names phonetically when pronunciation matters;
- reduce line length before increasing delivery speed.

Read the line aloud or estimate its spoken duration. If it cannot finish comfortably, shorten it or lengthen the clip.

Complete when the line can begin, land, and end without clipping the scene's payoff.

### 4. Tie sound to visible causes

Describe effects with their action and timing relationship:

- `As the cup hits the tile, it cracks with one sharp ceramic snap.`
- `The engine turns over twice, catches, then settles into a rough idle.`
- `Footsteps approach from the hallway before the door opens.`

Use causal language rather than a detached sound list. Exact frame sync remains a finishing task when the timing is production-critical.

Complete when every important effect maps to a visible or implied event.

### 5. Build the mix hierarchy

State what leads and what stays under it:

```text
Her line is foreground and fully intelligible. Café chatter and espresso hiss remain low and diffuse. A restrained piano pulse enters beneath the final words without masking them.
```

Keep background voices out when one line matters. Use music to support the action rather than compete with it.

Complete when the listener's priority is obvious.

### 6. Choose generated audio or silence

FLUX 3 generates synchronized audio by default. Set `generate_audio: false` when the desired source clip should be silent or all sound will be finished later.

Reserve deterministic post for:

- final loudness, EQ, compression, ducking, fades, and music edits;
- guaranteed wording or speaker identity;
- frame-accurate sync;
- subtitles, captions, and accessibility deliverables;
- continuity across many separately generated clips.

### 7. Revise one audio dimension at a time

When a take misses, isolate the cause:

1. speaker ownership;
2. line length or pronunciation;
3. delivery anchors;
4. competing ambience or music;
5. action-to-effect causality;
6. generation versus deterministic post.

Complete when each rerun tests one named audio hypothesis.

## Output Contract

Return:

1. **Audio ledger** — layer, source, owner, and priority;
2. **Exact spoken lines** — with visible or off-screen attribution;
3. **Voice direction** — compact audible anchors;
4. **Synchronization cues** — causal relation to visible action;
5. **Mix hierarchy** — foreground and supporting layers;
6. **Generation setting** — audio on or off;
7. **Post plan** — exact elements reserved for finishing.

## Common Pitfalls

1. **Leaving a quoted line's source unclear.** Identify the visible speaker or label the line as voiceover/narration; add a no-text instruction when needed.
2. **Blurring the layers together.** Name ambience, music, and speech separately.
3. **Listing sounds without sources.** Tie each layer to a place, object, person, or action.
4. **Writing more dialogue than the clip can hold.** Shorten before speeding up.
5. **Leaving the speaker ambiguous.** Name the visible speaker or label voiceover.
6. **Letting background voices compete.** Protect the primary line.
7. **Treating repeated voice direction as identity lock.** Audition and finish continuity deliberately.
8. **Treating generated audio as the final mix.** Plan deterministic finishing.

## Verification Checklist

- [ ] Every requested sound has a source or role
- [ ] Ambience, music, and speech are named as separate layers
- [ ] Every line has one owner
- [ ] Every quoted line has a visible speaker, or is labeled voiceover
- [ ] Spoken lines carry `no on-screen text, no subtitles` when text is unwanted
- [ ] Dialogue fits the clip duration
- [ ] Effects map to visible or implied causes
- [ ] Foreground and background priorities are explicit
- [ ] `generate_audio` intent is clear
- [ ] Production-critical sound has a post plan
- [ ] Each audio rerun changes one named dimension

## References

- [BFL documentation](https://docs.bfl.ai) — authoritative for audio prompting guidance and the `generate_audio` setting
