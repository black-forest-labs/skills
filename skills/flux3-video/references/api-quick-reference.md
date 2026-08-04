# FLUX 3 Video API Quick Reference

## Endpoint

```text
POST https://api.bfl.ai/v1/flux-3-video
```

Authenticate with the `x-key` header. The endpoint is asynchronous and returns an `id` and `polling_url`.

## Modes

| Mode | Required input | Purpose |
| --- | --- | --- |
| `t2v` | `prompt` | Generate from text |
| `i2v` | `prompt`, `keyframes` | Animate one frame or interpolate through frames |
| `v2v` | `prompt`, `start_video` | Continue an existing clip |
| `draft_enhance` | `draft_cache` | Render an approved draft at full quality |

The schema is strict. A field outside its mode or an unknown field returns `422`.

## Common settings

- `aspect_ratio`: `auto`, `21:9`, `2:1`, `16:9`, `4:3`, `1:1`, `3:4`, or `9:16`
- `resolution`: `hd` or `fhd`
- `duration`: `auto` or a whole number from 5 to 20 seconds
- `generate_audio`: boolean, defaults to `true`
- `version`: `latest` or a documented release tag
- `draft`: boolean; drafts render at HD
- `batch`: 1–4, only with `draft: true`

## Text-to-video

```json
{
  "mode": "t2v",
  "prompt": "A low tracking shot of a fox sprinting through wet pine undergrowth at dawn. Mist drifts between the trees as the camera keeps pace beside it. Cool morning light and grounded motion.",
  "aspect_ratio": "16:9",
  "duration": 5,
  "resolution": "hd",
  "generate_audio": true
}
```

## Image-to-video

One opening frame:

```json
{
  "mode": "i2v",
  "prompt": "The camera pushes forward as wind begins moving the trees.",
  "keyframes": "https://example.com/opening-frame.png",
  "duration": 5
}
```

Timestamped keyframes:

```json
{
  "mode": "i2v",
  "prompt": "A seed grows into a tree through the seasons.",
  "keyframes": [
    [0, "https://example.com/seed.png"],
    [4.5, "https://example.com/sapling.png"],
    [10, "https://example.com/tree.png"]
  ],
  "duration": 10
}
```

Keyframe rules:

- 1 image pins the opening frame.
- 2 images pin opening and closing frames.
- 3–10 images become ordered waypoints and require explicit duration when untimed.
- Timestamped pairs use seconds followed by image.
- Times must be non-negative, increasing, at least 1/24 second apart, and within an explicit duration.
- Images may be public HTTP(S) URLs or inline base64 PNG/JPEG/WebP, up to 20 MB each.

## Video continuation

```json
{
  "mode": "v2v",
  "prompt": "The rider crests the hill and continues into the fog.",
  "start_video": "https://example.com/part-one.mp4",
  "duration": 10
}
```

The input is one MP4 supplied by public URL or inline base64, up to 50 MB.

## Draft and enhance

Explore:

```json
{
  "mode": "t2v",
  "prompt": "A storm rolls over a quiet harbor at dawn.",
  "duration": 5,
  "resolution": "hd",
  "draft": true,
  "batch": 4
}
```

Commit the selected draft:

```json
{
  "mode": "draft_enhance",
  "draft_cache": "BASE64_OR_SIGNED_DRAFT_CACHE_URL"
}
```

`draft_enhance` takes no other generation fields. Download the chosen cache before its signed URL expires.

## Polling

```python
import os
import time
import requests

key = os.environ["BFL_API_KEY"]
submit = requests.post(
    "https://api.bfl.ai/v1/flux-3-video",
    headers={"x-key": key},
    json={
        "mode": "t2v",
        "prompt": "A fox running through dawn mist.",
        "aspect_ratio": "16:9",
        "duration": 5,
    },
)
submit.raise_for_status()
task = submit.json()

while True:
    response = requests.get(task["polling_url"], headers={"x-key": key})
    response.raise_for_status()
    result = response.json()
    status = result["status"]
    if status == "Ready":
        video_url = result["result"]["sample"]
        video = requests.get(video_url)
        video.raise_for_status()
        open("output.mp4", "wb").write(video.content)
        break
    if status in {"Error", "Request Moderated", "Content Moderated", "Task not found"}:
        raise RuntimeError(f"Task ended: {status}")
    time.sleep(5)
```

## Operational constraints

- Result MP4 and draft-cache URLs are signed and expire after roughly two hours. Download them immediately.
- The organization concurrency limit is 5 active generations.
- `429` means wait for an active task to finish before submitting another.
- `503` means temporary service capacity; retry with backoff.
- Follow redirects from polling and download hosts.

Source of truth: [FLUX 3 API reference](https://docs.bfl.ai/api-reference/flux3).
