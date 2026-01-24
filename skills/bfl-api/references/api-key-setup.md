---
name: api-key-setup
description: How to obtain and configure a BFL API key
---

# API Key Setup

## Check if Configured

```bash
echo $BFL_API_KEY
```

If empty, follow steps below.

## Get a Key

1. Go to **https://dashboard.bfl.ai/get-started**
2. Click **"Create Key"**
3. Select organization (ask user if multiple options)
4. Copy the key (starts with `bfl_`)

## For Agents Making Direct API Calls

When `BFL_API_KEY` is not set in the current session:

1. **Check for existing `.env`**:
   ```bash
   grep BFL_API_KEY .env 2>/dev/null
   ```

2. **If found, export it**:
   ```bash
   export BFL_API_KEY=$(grep BFL_API_KEY .env | cut -d '=' -f2)
   ```

3. **If not found, ask the user** for their key:
   > "I need a BFL API key to generate images. Please:
   > 1. Go to https://dashboard.bfl.ai/get-started
   > 2. Click 'Create Key' and copy it
   > 3. Paste it here"

4. **Save and export**:
   ```bash
   echo 'BFL_API_KEY=bfl_provided_key' >> .env
   echo '.env' >> .gitignore
   export BFL_API_KEY=bfl_provided_key
   ```

Now `$BFL_API_KEY` is available for direct curl/API calls in the session.
