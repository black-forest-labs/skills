# FLUX 3 Video API Reference

Read the [official FLUX API documentation](https://docs.bfl.ai) before constructing a request. Use it as the source of truth for endpoints, input fields, request settings, media limits, draft support, response fields, status values, polling, errors, concurrency, and URL expiry.

If the reference does not document the FLUX 3 video operation you need, stop and ask for the correct reference or endpoint. Do not infer field names, status strings, limits, or request shapes from this skill.

After consulting the reference:

1. Build the smallest valid request for the documented operation.
2. Submit once and persist the returned task identifier and polling URL.
3. Poll the returned URL until the documented terminal state.
4. Download result artifacts before their documented expiry.
5. Validate the media file and keep a secret-free record of the request and result.

Keep API keys in environment variables and request headers only. Never copy them into prompts, logs, saved request bodies, or responses.
