---
name: error-handling
description: Error codes and recovery strategies for BFL API
---

# Error Handling

Comprehensive guide to handling errors from the BFL API.

## HTTP Status Codes

| Code | Meaning | Cause | Action |
|------|---------|-------|--------|
| 200 | OK | Request successful | Process response |
| 400 | Bad Request | Invalid parameters | Check request format |
| 401 | Unauthorized | Invalid/missing API key | Verify credentials |
| 402 | Payment Required | Insufficient credits | Add credits to account |
| 403 | Forbidden | Access denied | Check permissions |
| 404 | Not Found | Invalid endpoint | Verify URL |
| 429 | Too Many Requests | Rate limited | Implement backoff |
| 500 | Internal Server Error | Server issue | Retry with backoff |
| 502 | Bad Gateway | Network issue | Retry with backoff |
| 503 | Service Unavailable | Temporary outage | Retry with backoff |

## Error Response Format

```json
{
  "error": "error_code",
  "message": "Human-readable description",
  "details": {
    "field": "specific field info"
  }
}
```

## Common Errors and Solutions

### Authentication Errors (401)

```json
{
  "error": "invalid_api_key",
  "message": "The provided API key is invalid or expired"
}
```

**Solution:**
```python
def verify_api_key(api_key):
    if not api_key:
        raise ValueError("API key is required")
    if not api_key.startswith("bfl_"):
        raise ValueError("Invalid API key format")
```

### Insufficient Credits (402)

```json
{
  "error": "insufficient_credits",
  "message": "Your account does not have enough credits"
}
```

**Solution:**
```python
def handle_payment_error(response):
    if response.status_code == 402:
        # Log and alert
        logging.error("Insufficient credits - add funds")
        # Optionally pause operations
        raise InsufficientCreditsError("Add credits to continue")
```

### Rate Limiting (429)

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many concurrent requests",
  "retry_after": 5
}
```

**Solution:**
```python
def handle_rate_limit(response):
    if response.status_code == 429:
        retry_after = int(response.headers.get('Retry-After', 5))
        time.sleep(retry_after)
        return True  # Signal to retry
    return False
```

### Validation Errors (400)

```json
{
  "error": "validation_error",
  "message": "Invalid request parameters",
  "details": {
    "width": "Must be a multiple of 16",
    "prompt": "Cannot be empty"
  }
}
```

**Solution:**
```python
def validate_request(prompt, width, height):
    errors = []

    if not prompt or not prompt.strip():
        errors.append("Prompt cannot be empty")

    if width % 16 != 0:
        errors.append(f"Width {width} must be multiple of 16")

    if height % 16 != 0:
        errors.append(f"Height {height} must be multiple of 16")

    if width * height > 4_000_000:
        errors.append("Total pixels cannot exceed 4MP")

    if errors:
        raise ValidationError(errors)
```

### Generation Failures

Failures during polling:

```json
{
  "status": "Error",
  "error": "content_policy_violation",
  "message": "The prompt violated content policy"
}
```

**Common failure reasons:**
- `content_policy_violation` - Prompt/image flagged by safety
- `generation_timeout` - Took too long to generate
- `internal_error` - Server-side issue
- `invalid_image` - Input image couldn't be processed

## Retry Strategy

```python
import time
import random

class RetryableError(Exception):
    """Errors that can be retried."""
    pass

class NonRetryableError(Exception):
    """Errors that should not be retried."""
    pass

def classify_error(status_code, error_code):
    """Determine if error is retryable."""
    # Retryable
    if status_code in [429, 500, 502, 503]:
        return RetryableError

    # Non-retryable
    if status_code in [400, 401, 402, 403]:
        return NonRetryableError

    # Generation failures
    if error_code in ['generation_timeout', 'internal_error']:
        return RetryableError

    if error_code in ['content_policy_violation', 'invalid_image']:
        return NonRetryableError

    return RetryableError  # Default to retryable

def make_request_with_retry(func, max_retries=3):
    """Execute function with retry logic."""
    last_exception = None

    for attempt in range(max_retries):
        try:
            return func()
        except RetryableError as e:
            last_exception = e
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Attempt {attempt + 1} failed, retrying in {wait_time:.1f}s")
            time.sleep(wait_time)
        except NonRetryableError:
            raise  # Don't retry

    raise last_exception
```

## Comprehensive Error Handler

```python
import logging

class BFLError(Exception):
    """Base exception for BFL API errors."""
    def __init__(self, message, status_code=None, error_code=None):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(message)

class AuthenticationError(BFLError):
    """API key or authentication issue."""
    pass

class InsufficientCreditsError(BFLError):
    """Account needs more credits."""
    pass

class RateLimitError(BFLError):
    """Too many concurrent requests."""
    def __init__(self, message, retry_after=5):
        super().__init__(message, 429, "rate_limit_exceeded")
        self.retry_after = retry_after

class ValidationError(BFLError):
    """Invalid request parameters."""
    pass

class GenerationError(BFLError):
    """Generation failed."""
    pass

def handle_response(response):
    """Process API response and raise appropriate errors."""
    if response.status_code == 200:
        return response.json()

    try:
        error_data = response.json()
    except:
        error_data = {"message": response.text}

    error_code = error_data.get("error", "unknown")
    message = error_data.get("message", "Unknown error")

    if response.status_code == 401:
        raise AuthenticationError(message, 401, error_code)

    if response.status_code == 402:
        raise InsufficientCreditsError(message, 402, error_code)

    if response.status_code == 429:
        retry_after = int(response.headers.get('Retry-After', 5))
        raise RateLimitError(message, retry_after)

    if response.status_code == 400:
        raise ValidationError(message, 400, error_code)

    if response.status_code >= 500:
        raise BFLError(f"Server error: {message}", response.status_code, error_code)

    raise BFLError(message, response.status_code, error_code)
```

## Logging Best Practices

```python
import logging
import json

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def log_request(endpoint, payload):
    logging.info(f"Request: POST {endpoint}")
    logging.debug(f"Payload: {json.dumps(payload, indent=2)}")

def log_error(error, context=None):
    logging.error(f"Error: {error}")
    if context:
        logging.error(f"Context: {context}")

def log_generation_failure(status, error, prompt):
    logging.warning(f"Generation failed: {error}")
    logging.debug(f"Failed prompt: {prompt[:100]}...")
```

## Circuit Breaker Pattern

For production systems:

```python
import time
from threading import Lock

class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.failures = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open
        self.lock = Lock()

    def record_success(self):
        with self.lock:
            self.failures = 0
            self.state = "closed"

    def record_failure(self):
        with self.lock:
            self.failures += 1
            self.last_failure_time = time.time()
            if self.failures >= self.failure_threshold:
                self.state = "open"

    def can_proceed(self):
        with self.lock:
            if self.state == "closed":
                return True

            if self.state == "open":
                if time.time() - self.last_failure_time > self.reset_timeout:
                    self.state = "half-open"
                    return True
                return False

            # half-open: allow one request to test
            return True
```
