# Reference implementation

A working pipeline for the process in `SKILL.md`. Two fictional products, three
cuts each, generated picture and voice, deterministic finish, two renderers.

## Layout

```
pipeline/spotkit.py          measurement + ffmpeg assembly + QC gates
pipeline/build_spot.py       manifest -> masters (base and rich)
pipeline/action_sync.py      where each plate's action is, in seconds
pipeline/extract_words.py    VO -> word-level caption timings
pipeline/export_timing.py    manifest + graphics -> timing.json for Remotion
pipeline/check_copy.py       every on-screen line has evidence
pipeline/check_graphics.py   graphics layout against real geometry
spots.manifest.json          content only
spots.graphics.json          graphics layer: callouts, cuts, camera
remotion/                    React renderer consuming the same timing
```

## Manifest

Content only. Every number is derived at build time.

```json
{
  "root": "refs/fake/spots",
  "out": "refs/fake/spots/masters",
  "spots": {
    "tenrove": {
      "vo": "tenrove/vo/tenrove-vo-b-dry-m.wav",
      "shots": [
        "tenrove/picture/tenrove-01-reveal.mp4",
        "tenrove/picture/tenrove-02-proof.mp4",
        "tenrove/picture-retry/tenrove-03-payoff-handle.mp4"
      ],
      "wordmark": "tenrove",
      "line": "Frame 38",
      "endline": "Opens flat. Packs honestly.",
      "endline_evidence": "said",
      "anchors": ["shell", "honestly", "still"],
      "script": "38 litres. One shell. The Tenrove Frame 38 opens flat..."
    }
  }
}
```

`anchors` is one spoken word per shot: the word that shot's action is *about*.
`script` is the VO text, which `check_copy.py` uses to decide whether a line
claiming evidence `said` is telling the truth.

Any shot count of two or more works; the transition chain is built to length.
Slugs, paths and copy are validated before reaching a shell command, because
`filter_complex` strings are assembled as text.

## Build

```bash
python3 pipeline/build_spot.py spots.manifest.json            # base + QC
python3 pipeline/build_spot.py spots.manifest.json --rich     # + graphics layer
python3 pipeline/build_spot.py spots.manifest.json --dry-run  # timing only
python3 pipeline/build_spot.py spots.manifest.json --only tenrove
```

`--dry-run` reports derived cuts without rendering, which is the fast way to see
whether a read and a set of plates can produce a spot at all.

`--rich` exports the derived timing, runs the copy and graphics gates, renders
the Remotion compositions, and puts them through the same QC as the base
masters. It is one command because the alternative, a hand-typed render plus a
scratch script to measure it, is the manual step this pipeline exists to remove.
The base master is the intermediate; the rich render is the deliverable.

## What gets derived

| Quantity | How |
|---|---|
| End of speech | silence detection at a true floor, counting only silence that runs to EOF, plus 0.12s for decay |
| Spot length | speech end + 0.70s tail |
| Cut points | pause centres scored on gap width minus pacing imbalance minus anchor miss, constrained by plate length |
| Action position | smoothed per-frame luma delta (`signalstats` YDIF), ignoring 4 frames at each end |
| Segment source window | slipped so the action lands on its anchor word; centred only when no anchor is declared |
| Flash tint | mean colour of the incoming plate's bright region, lifted toward white |
| End-card scrim | mean luminance of the text region against a threshold of 95 |
| Loudness target | the normaliser's first-pass report of what it can deliver under a -1.5 dBTP ceiling |

Observed on the reference material: both spots at 10.708s. Cuts derived at
3.30s/7.65s and 4.12s/7.56s. Scrim on for the light product (luma 136), off for
the dark one (luma 39). Loudness targets -16.6 and -17.7 LUFS, both stems
peak-limited well below a nominal -16.

The first product's derived cuts reproduced values that had been measured by
hand, which is the check worth running when you replace judgement with
measurement.

## QC gates

`spotkit.qc` reports every gate and fails on any.

| Gate | Threshold |
|---|---|
| duration | within 0.15s of intended |
| audio present | AAC stream exists |
| loudness | within 1.0 LU of the achievable target |
| true peak | at or below -1.0 dBFS |
| tail intact | final 250ms before the closing fade below -60 dB |
| no body black | no black run of 0.15s+ before the closing fade |
| action sync | every anchored action within 0.60s of its word |
| copy evidence | every on-screen line declares seen / spec / said, and `said` matches the script |
| graphics layout | no label off frame, no two graphics overlapping in time and space, nothing surviving into the end card, no callout outliving its shot, no spec hold under 0.9s |

The tail threshold came from a negative control: a master hard-cut mid-word
measured -34.1 dB in that window, an intact one -91.0 dB. -30 dB would have
passed the broken file.

## The graphics layer

`spots.graphics.json` carries everything the base master does not: what each
callout points at, how the edit arrives at each shot, and how the camera moves.

```json
{
  "tenrove": {
    "accent": "#C8A272",
    "emphasis": [{"word": "Tenrove"}],
    "shots": {
      "0": {
        "cut": "hard",
        "reframe": {"from": 1.0, "to": 1.055, "panX": -0.004, "panY": 0.0,
                    "moveSec": 2.2, "seed": "t0"},
        "sweep": {"from": 1.1, "angle": 18, "strength": 0.42},
        "counter": {"to": 38, "unit": "litres", "from": 0.3},
        "callouts": [{
          "anchor": [0.48, 0.19], "label": [0.62, 0.42],
          "title": "Telescoping handle", "sub": "TWO STAGES",
          "evidence": "seen", "sub_evidence": "seen",
          "from": 1.45, "hold": 0.9, "side": "left"
        }]
      }
    }
  }
}
```

`anchor` and `label` are normalised frame coordinates read off gridded stills of
the real plates. `cut` is how the edit arrives *at* this shot: `hard` between
two views of the same object, `dissolve` for a change of scale or subject,
`flash` for the arrival into the payoff. `evidence` is what makes the line
sayable at all.

`export_timing.py` merges this with the derived timing into
`remotion/src/timing.json` and links the plate tree into `public/`. Remotion
re-derives nothing.

Because `timing.json` is the merged artifact, editing `spots.graphics.json`
alone leaves the checkers validating data nobody renders. `check_graphics.py`
refuses to run when the graphics file is newer than the export, rather than
reporting green on stale numbers.

```bash
cd remotion && npm ci
npx remotion studio            # scrubbable preview
```

Both renderers pass identical gates on the reference material: 960x960, 24 fps,
matching loudness, tail intact, no body black. Remotion files are roughly 25 to
30 percent larger at the same CRF.

Three differences cost time to reconcile, and all three are worth knowing before
you try it:

1. **Audio.** The browser has no loudness normalisation. Handing Remotion the
   raw approved takes rendered at -21.0 and -27.1 LUFS against a -16 spec, and
   both passed picture and duration gates while failing loudness. Master the
   stem in ffmpeg first, then point Remotion at the mastered file.
2. **Text position.** A caption filter positions the glyph bounding box; a CSS
   block includes the font's internal ascent leading. Same nominal coordinates
   rendered 8px lower, confirmed by scanning white-pixel rows (peak row 591 vs
   599) rather than by eye.
3. **Transition phase.** A cross-dissolve at `offset=cut` runs from the cut
   forward. Starting the incoming layer's fade early instead finishes it at the
   cut, and the two renderers disagree through the whole transition.
