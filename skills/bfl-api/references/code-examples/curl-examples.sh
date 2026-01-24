#!/bin/bash
#
# BFL FLUX API - cURL Examples
#
# These examples demonstrate how to use the BFL FLUX API with cURL.
# Replace YOUR_API_KEY with your actual API key from https://dashboard.bfl.ai
#

API_KEY="${BFL_API_KEY:-YOUR_API_KEY}"
BASE_URL="https://api.bfl.ai"

# -----------------------------------------------------------------------------
# Example 1: Basic Image Generation with FLUX.2 Pro
# -----------------------------------------------------------------------------

echo "=== Submitting generation request ==="

RESPONSE=$(curl -s -X POST "${BASE_URL}/v1/flux-2-pro" \
  -H "x-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene mountain landscape at golden hour, dramatic lighting",
    "width": 1024,
    "height": 1024
  }')

echo "Response: ${RESPONSE}"

# Extract polling URL
POLLING_URL=$(echo "${RESPONSE}" | grep -o '"polling_url":"[^"]*"' | cut -d'"' -f4)
echo "Polling URL: ${POLLING_URL}"

# -----------------------------------------------------------------------------
# Example 2: Poll for Result
# -----------------------------------------------------------------------------

echo ""
echo "=== Polling for result ==="

while true; do
  RESULT=$(curl -s "${POLLING_URL}" -H "x-key: ${API_KEY}")
  STATUS=$(echo "${RESULT}" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

  echo "Status: ${STATUS}"

  if [ "${STATUS}" = "Ready" ]; then
    IMAGE_URL=$(echo "${RESULT}" | grep -o '"sample":"[^"]*"' | cut -d'"' -f4)
    echo "Image URL: ${IMAGE_URL}"
    break
  elif [ "${STATUS}" = "Error" ]; then
    echo "Generation failed!"
    echo "${RESULT}"
    exit 1
  fi

  sleep 2
done

# -----------------------------------------------------------------------------
# Example 3: Download the Image
# -----------------------------------------------------------------------------

echo ""
echo "=== Downloading image ==="
curl -s -o output.png "${IMAGE_URL}"
echo "Saved to output.png"


# =============================================================================
# ONE-LINER EXAMPLES (for quick reference)
# =============================================================================

# Submit request (returns polling_url):
# curl -s -X POST "https://api.bfl.ai/v1/flux-2-pro" \
#   -H "x-key: YOUR_API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{"prompt": "A red apple", "width": 1024, "height": 1024}'

# Poll for result (replace POLLING_URL):
# curl -s "POLLING_URL" -H "x-key: YOUR_API_KEY"

# Download image (replace IMAGE_URL):
# curl -s -o output.png "IMAGE_URL"


# =============================================================================
# MODEL ENDPOINT EXAMPLES
# =============================================================================

# FLUX.2 [klein] 4B - Fastest
# curl -s -X POST "https://api.bfl.ai/v1/flux-2-klein-4b" ...

# FLUX.2 [klein] 9B - Fast with better quality
# curl -s -X POST "https://api.bfl.ai/v1/flux-2-klein-9b" ...

# FLUX.2 [pro] - Production balanced
# curl -s -X POST "https://api.bfl.ai/v1/flux-2-pro" ...

# FLUX.2 [max] - Highest quality
# curl -s -X POST "https://api.bfl.ai/v1/flux-2-max" ...

# FLUX.2 [flex] - Best for typography
# curl -s -X POST "https://api.bfl.ai/v1/flux-2-flex" ...


# =============================================================================
# REGIONAL ENDPOINTS
# =============================================================================

# Global (default): https://api.bfl.ai
# EU (GDPR):        https://api.eu.bfl.ai
# US:               https://api.us.bfl.ai
