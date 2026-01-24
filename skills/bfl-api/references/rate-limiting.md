---
name: rate-limiting
description: Understanding and handling BFL API rate limits
---

# Rate Limiting

BFL API enforces rate limits to ensure fair usage and system stability.

## Current Limits

| Endpoint Category | Concurrent Requests |
|-------------------|---------------------|
| Standard (most models) | 24 |
| FLUX.1 Kontext Max | 6 |

**Concurrent requests** means in-flight requests (submitted but not yet completed).

## Rate Limit Headers

Check response headers for rate limit status:

```
X-RateLimit-Limit: 24
X-RateLimit-Remaining: 23
X-RateLimit-Reset: 1640000000
```

## HTTP 429 Response

When rate limited, you receive HTTP 429:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many concurrent requests",
  "retry_after": 5
}
```

## Handling Strategies

### 1. Client-Side Tracking

Track active requests to stay under limits:

```python
from threading import Lock, Semaphore

class RateLimitedClient:
    def __init__(self, api_key, max_concurrent=24):
        self.api_key = api_key
        self.semaphore = Semaphore(max_concurrent)

    def generate(self, model, prompt, **kwargs):
        with self.semaphore:  # Blocks if at limit
            return self._make_request(model, prompt, **kwargs)

    def _make_request(self, model, prompt, **kwargs):
        # Submit request
        response = requests.post(...)
        polling_url = response.json()["polling_url"]

        # Poll until complete (request still "active")
        return self._poll(polling_url)
```

### 2. Retry with Exponential Backoff

```python
import time

def request_with_retry(endpoint, payload, headers, max_retries=5):
    """Make request with automatic retry on rate limit."""
    for attempt in range(max_retries):
        response = requests.post(endpoint, json=payload, headers=headers)

        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 5))
            wait_time = retry_after * (2 ** attempt)  # Exponential backoff
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
            continue

        response.raise_for_status()
        return response

    raise Exception("Max retries exceeded due to rate limiting")
```

### 3. Queue-Based Architecture

For high-volume applications:

```python
from queue import Queue
from threading import Thread
import time

class RequestQueue:
    def __init__(self, api_key, max_concurrent=24):
        self.api_key = api_key
        self.queue = Queue()
        self.active = 0
        self.max_concurrent = max_concurrent
        self.lock = Lock()

        # Start worker threads
        for _ in range(max_concurrent):
            worker = Thread(target=self._worker, daemon=True)
            worker.start()

    def submit(self, model, prompt, callback):
        """Submit request to queue."""
        self.queue.put({
            'model': model,
            'prompt': prompt,
            'callback': callback
        })

    def _worker(self):
        """Process queue items."""
        while True:
            item = self.queue.get()
            try:
                result = self._process(item)
                item['callback'](result, None)
            except Exception as e:
                item['callback'](None, e)
            finally:
                self.queue.task_done()

    def _process(self, item):
        # Make request and poll
        ...

# Usage
queue = RequestQueue("your-api-key")

def handle_result(result, error):
    if error:
        print(f"Error: {error}")
    else:
        print(f"Generated: {result['sample']}")

queue.submit("flux-2-pro", "A sunset", handle_result)
```

### 4. Async with Semaphore

```python
import asyncio
import aiohttp

class AsyncRateLimitedClient:
    def __init__(self, api_key, max_concurrent=24):
        self.api_key = api_key
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.headers = {"x-key": api_key}

    async def generate(self, model, prompt):
        async with self.semaphore:
            async with aiohttp.ClientSession() as session:
                # Submit
                async with session.post(
                    f"https://api.bfl.ai/v1/{model}",
                    headers=self.headers,
                    json={"prompt": prompt}
                ) as response:
                    data = await response.json()
                    polling_url = data["polling_url"]

                # Poll until complete
                while True:
                    async with session.get(
                        polling_url,
                        headers=self.headers
                    ) as response:
                        data = await response.json()
                        if data["status"] == "Ready":
                            return data["result"]
                        elif data["status"] == "Error":
                            raise Exception(data.get("error"))
                    await asyncio.sleep(2)

# Usage
async def main():
    client = AsyncRateLimitedClient("your-api-key")

    # Generate 50 images with rate limiting
    prompts = [f"Image {i}" for i in range(50)]
    tasks = [client.generate("flux-2-pro", p) for p in prompts]
    results = await asyncio.gather(*tasks)

asyncio.run(main())
```

## Monitoring Rate Limits

```python
class RateLimitMonitor:
    def __init__(self):
        self.requests_made = 0
        self.rate_limit_hits = 0
        self.lock = Lock()

    def record_request(self, response):
        with self.lock:
            self.requests_made += 1
            if response.status_code == 429:
                self.rate_limit_hits += 1

    def get_stats(self):
        return {
            "total_requests": self.requests_made,
            "rate_limit_hits": self.rate_limit_hits,
            "hit_rate": self.rate_limit_hits / max(self.requests_made, 1)
        }
```

## Best Practices

1. **Track active requests** - Know how many are in-flight
2. **Implement client-side limits** - Stay under limits proactively
3. **Use semaphores** - Clean way to limit concurrency
4. **Queue for high volume** - Buffer requests when traffic spikes
5. **Monitor headers** - React to remaining quota
6. **Graceful degradation** - Queue or delay when near limits
7. **Different limits per endpoint** - Remember Kontext Max is 6, not 24

## Regional Distribution

For very high volume, consider distributing across regions:

```python
ENDPOINTS = [
    "https://api.bfl.ai",
    "https://api.eu.bfl.ai",
    "https://api.us.bfl.ai"
]

def get_endpoint():
    """Round-robin or least-loaded selection."""
    return random.choice(ENDPOINTS)
```

Note: Verify regional rate limits are independent before relying on this strategy.
