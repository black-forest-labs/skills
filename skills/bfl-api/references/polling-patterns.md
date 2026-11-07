---
name: polling-patterns
description: Implementing async polling for BFL API responses
---

# Polling Patterns

BFL API uses asynchronous generation. All requests return a `polling_url` for status checking.

## Basic Flow

```
1. POST request to model endpoint
   └─> Immediate response: { "polling_url": "..." }

2. GET polling_url (repeat until complete)
   └─> { "status": "Pending" | "Reasoning" | "Generating" | "Ready" | ... }

3. When "Ready", download result sample URL
   └─> URL expires in 10 minutes
```

## Response States

| Status | Description | Action |
|--------|-------------|--------|
| `Pending` | Request queued/processing | Continue polling |
| `Reasoning` | FLUX 3 is planning the output | Continue polling |
| `Generating` | FLUX 3 is rendering | Continue polling |
| `Ready` | Generation finished | Download result |
| `Error` | Generation Error | Stop, handle error |
| `Request Moderated` | Prompt or input blocked by moderation | Stop, do not retry unchanged |
| `Content Moderated` | Output blocked by moderation | Stop, do not retry unchanged |
| `Task not found` | Unknown or expired task ID | Stop |

Only `Pending`, `Reasoning`, and `Generating` mean "keep polling". Every other status is terminal and never later becomes `Ready`, so a loop that only checks for `Ready` and `Error` will poll a moderated task until it times out. Treat any status outside the in-progress set as a failure.

## Polling Strategies

### Simple Fixed Interval

```python
import time
import requests

def poll_fixed_interval(polling_url, headers, interval=2, timeout=120):
    """Simple polling with fixed interval."""
    start_time = time.time()

    while time.time() - start_time < timeout:
        response = requests.get(polling_url, headers=headers)
        data = response.json()

        if data["status"] == "Ready":
            return data["result"]
        elif data["status"] not in ("Pending", "Reasoning", "Generating"):
            # Error, Request Moderated, Content Moderated, Task not found:
            # terminal and never become Ready, so stop instead of polling to timeout.
            raise Exception(f"{data['status']}: {data.get('error', 'generation failed')}")

        time.sleep(interval)

    raise TimeoutError("Polling timeout exceeded")
```

### Exponential Backoff (Recommended)

```python
import time
import random
import requests

def poll_with_backoff(polling_url, headers, max_attempts=30):
    """Polling with exponential backoff and jitter."""
    base_delay = 0.5  # Start with 500ms
    max_delay = 10    # Cap at 10 seconds

    for attempt in range(max_attempts):
        response = requests.get(polling_url, headers=headers)
        data = response.json()

        if data["status"] == "Ready":
            return data["result"]
        elif data["status"] not in ("Pending", "Reasoning", "Generating"):
            # Error, Request Moderated, Content Moderated, Task not found:
            # terminal and never become Ready, so stop instead of polling to timeout.
            raise Exception(f"{data['status']}: {data.get('error', 'generation failed')}")

        # Exponential backoff with jitter
        delay = min(base_delay * (2 ** attempt), max_delay)
        jitter = random.uniform(0, delay * 0.1)  # 10% jitter
        time.sleep(delay + jitter)

    raise TimeoutError("Max polling attempts exceeded")
```

### Adaptive Polling

```python
import time
import requests

def poll_adaptive(polling_url, headers, timeout=120):
    """Adaptive polling that adjusts based on status."""
    start_time = time.time()
    delays = {
        "Pending": 2.0,      # Queue/processing
        "Reasoning": 2.0,    # FLUX 3 planning step (can take a while)
        "Generating": 1.5,   # FLUX 3 rendering
        None: 1.5            # Unknown/default
    }

    while time.time() - start_time < timeout:
        response = requests.get(polling_url, headers=headers)
        data = response.json()

        status = data.get("status")

        if status == "Ready":
            return data["result"]
        elif status not in ("Pending", "Reasoning", "Generating"):
            # Error, Request Moderated, Content Moderated, Task not found:
            # terminal and never become Ready, so stop instead of polling to timeout.
            raise Exception(f"{status}: {data.get('error', 'generation failed')}")

        delay = delays.get(status, delays[None])
        time.sleep(delay)

    raise TimeoutError("Polling timeout exceeded")
```

## Complete Example: Submit and Poll

```python
import time
import requests

class BFLClient:
    def __init__(self, api_key, base_url="https://api.bfl.ai"):
        self.base_url = base_url
        self.headers = {
            "x-key": api_key,
            "Content-Type": "application/json"
        }

    def generate(self, model, prompt, **kwargs):
        """Submit generation request and poll for result."""
        # Submit request
        endpoint = f"{self.base_url}/v1/{model}"
        payload = {"prompt": prompt, **kwargs}

        response = requests.post(endpoint, headers=self.headers, json=payload)
        response.raise_for_status()

        polling_url = response.json()["polling_url"]

        # Poll for result
        return self._poll(polling_url)

    def _poll(self, polling_url, timeout=120):
        """Poll until completion or timeout."""
        start = time.time()
        delay = 1.0

        while time.time() - start < timeout:
            response = requests.get(polling_url, headers=self.headers)
            data = response.json()

            if data["status"] == "Ready":
                return data["result"]
            elif data["status"] not in ("Pending", "Reasoning", "Generating"):
                # Error, Request Moderated, Content Moderated, Task not found:
                # terminal and never become Ready, so stop instead of polling to timeout.
                raise Exception(f"{data['status']}: {data.get('error', 'generation failed')}")

            time.sleep(delay)
            delay = min(delay * 1.5, 5.0)  # Gradual backoff

        raise TimeoutError("Generation timed out")

# Usage
client = BFLClient("your-api-key")
result = client.generate(
    model="flux-2-pro",
    prompt="A beautiful sunset over mountains"
)
print(f"Image URL: {result['sample']}")
```

## URL Expiration

**Critical:** Result URLs expire after 10 minutes. Always download immediately.

```python
def download_result(result_url, output_path):
    """Download result image before URL expires."""
    response = requests.get(result_url)
    response.raise_for_status()

    with open(output_path, 'wb') as f:
        f.write(response.content)

    return output_path
```

## Batch Processing with Polling

```python
import asyncio
import aiohttp

async def generate_batch(client, prompts, model="flux-2-pro"):
    """Generate multiple images concurrently."""
    async with aiohttp.ClientSession() as session:
        # Submit all requests
        tasks = []
        for prompt in prompts:
            task = submit_and_poll(session, client, model, prompt)
            tasks.append(task)

        # Wait for all to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

async def submit_and_poll(session, client, model, prompt):
    """Async submit and poll for single image."""
    # Submit
    async with session.post(
        f"{client.base_url}/v1/{model}",
        headers=client.headers,
        json={"prompt": prompt}
    ) as response:
        data = await response.json()
        polling_url = data["polling_url"]

    # Poll
    while True:
        async with session.get(polling_url, headers=client.headers) as response:
            data = await response.json()

            if data["status"] == "Ready":
                return data["result"]
            elif data["status"] not in ("Pending", "Reasoning", "Generating"):
                # Error, Request Moderated, Content Moderated, Task not found:
                # terminal and never become Ready, so stop instead of polling to timeout.
                raise Exception(f"{data['status']}: {data.get('error', 'generation failed')}")

        await asyncio.sleep(2)
```

## Best Practices

1. **Always implement timeouts** - Never poll indefinitely
2. **Use exponential backoff** - Reduces server load, handles congestion
3. **Add jitter** - Prevents thundering herd when polling multiple requests
4. **Handle all status values** - Including unexpected ones
5. **Download immediately** - URLs expire in 10 minutes
6. **Log polling attempts** - Useful for debugging and monitoring
7. **Respect rate limits** - Implement proper backoff on 429 responses
