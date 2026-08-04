# FLUX 3 Video API — Durable Shape

This file covers the parts of the integration that hold steady. It is deliberately not a copy of the schema.

**Read [the FLUX 3 API reference](https://docs.bfl.ai) for current endpoint paths, field names, enum values, numeric limits, concurrency limits, and status strings.** Where that reference disagrees with anything here, it wins.

## The request

One JSON body. `prompt` is the only required field; everything else has a working default, so a bare prompt is a valid request. The schema is strict — an unknown field returns `422`.

Authenticate with the `x-key` header. The endpoint is asynchronous: it returns an `id` and a `polling_url` immediately.

There is more than one endpoint, and they differ in what they accept — the faster checkpoint is text-only and rejects media. Pick by whether the request attaches an input.

## Intent comes from the attached field

There is no generation `mode`. Send a prompt plus **at most one** input field:

| Input | What the model does |
| --- | --- |
| *(none)* | Generates from your text alone |
| `keyframes` | Puts your images on screen, pixel for pixel, at frame positions you choose |
| `reference_images` | Keeps the subject recognizable in a new scene; the images never appear on screen |
| `reference_video` | Builds a new clip with the subjects from yours |
| `start_video` | Continues from the final frames of your clip |

Two input fields return a `422` listing the alternatives. An empty list counts as not set.

Short codes in error messages (`t2v`, `i2v`, `ii2v`, `k2v`, `ir2v`, `vr2v`, `f2v`) name these behaviors for diagnostics. They are not request parameters.

Media is passed as a public URL or inline base64 — there is no upload service.

### Keyframes address frames, not seconds

Each keyframe pairs an image with a frame index, and the timebase is 24 fps. Indices must be unique and fall inside the clip. Two keyframes intended as a start-and-end morph need an explicit whole-number duration; without one, the images are read as a storyboard instead.

## Settings

Beyond the input field, requests carry generation settings: aspect ratio, resolution, duration, whether audio is generated, a research pass before generation, seed, version pinning, and an optional webhook URL. Defaults are chosen so that `auto` means "you decide for me" rather than a cap — anything set explicitly is honored.

Look up the current values and defaults rather than hard-coding them. Also check the constraints section: some fields couple, so a video input at a higher resolution can cap duration below the general maximum.

## Draft and enhance

`draft: true` returns a fast low-step preview plus a `draft_cache` — an encrypted bundle pinning that generation's final prompt, seed, and settings.

To render the same generation at full quality, send the cache back with `mode: "draft_enhance"`. That request takes no prompt and no conditioning media, because the bundle already carries them; any other field returns `422`. The cache is accepted as base64 or as an http(s) URL while its download link is still valid.

Draft cache URLs expire on the same clock as result videos. Download the bundle immediately if you may enhance it later.

## Submit, poll, download

```python
import os
import time
import requests

key = os.environ["BFL_API_KEY"]
endpoint = "https://api.bfl.ai/v1/..."  # resolve from the API reference

submit = requests.post(
    endpoint,
    headers={"x-key": key},
    json={"prompt": "A fox running through dawn mist."},
)
submit.raise_for_status()
task = submit.json()

TERMINAL_FAILURES = {"Error", "Request Moderated", "Content Moderated", "Task not found"}

while True:
    response = requests.get(task["polling_url"], headers={"x-key": key})
    response.raise_for_status()
    result = response.json()
    status = result["status"]

    if status == "Ready":
        video = requests.get(result["result"]["sample"])
        video.raise_for_status()
        with open("output.mp4", "wb") as output:
            output.write(video.content)
        break

    if status in TERMINAL_FAILURES:
        raise RuntimeError(f"Task ended: {status}")

    time.sleep(5)
```

Status passes through a planning stage before generation begins; extra time there on a complex brief is normal, not a stall. Generations take several minutes — poll, or set a `webhook_url`, rather than blocking.

## Operational behavior

- **Results expire.** Signed MP4 and draft-cache URLs are valid for a couple of hours. Results are not long-term storage; download immediately and keep your own copy.
- **Follow redirects.** Polling and download hosts may redirect to regional endpoints (`curl -L`).
- **Limits are on concurrency, not request rate.** They are scoped per organization and differ per endpoint.
- **`429` means too many active generations.** Wait for one to finish, then submit. Retrying in a loop only burns quota. The workable pattern is to keep your limit in flight, poll, and top up as tasks complete.
- **`503` means the service is briefly at capacity**, independent of your quota. Retry with exponential backoff.
- **`422` means the request is invalid** — unknown field, bad enum, oversized input, or malformed base64. Fix the request rather than retrying it.
- **`403` means the key was not recognized.** Check the `x-key` header.
- **Moderation and failure arrive as task status, not HTTP errors.** Stop polling; these are final.
