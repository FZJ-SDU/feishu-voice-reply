---
name: feishu-voice-reply
description: Send Feishu voice replies by converting text into speech, transcoding to ogg/opus, and sending as a Feishu audio message. Use when the user wants a reply sent to Feishu as a playable voice message, when testing Feishu voice delivery, or when building/operating a text-to-voice workflow for Feishu IM.
---

# Feishu Voice Reply

Use this skill to turn Chinese text into a Feishu voice message.

## Workflow

1. Generate speech with Edge TTS.
2. Transcode the output to `ogg/opus` with `ffmpeg`.
3. Send the `.ogg` file to Feishu as an audio message.

## Important Notes

- Do **not** rely on the built-in OpenClaw `tts` tool for this workflow in this environment. It may return empty files.
- Prefer direct Edge TTS generation through the bundled script.
- Feishu voice messages work best with `ogg/opus` audio.
- Use `message` to actually deliver the generated `.ogg` file to Feishu.

## Quick Start

Generate a Feishu-compatible voice payload:

```bash
node {baseDir}/scripts/send-feishu-voice.js <feishu_open_id> <文本内容>
```

or

```bash
{baseDir}/scripts/send-feishu-voice.sh <feishu_open_id> <文本内容>
```

The script will:
- generate mp3 with Edge TTS
- convert it to `ogg/opus`
- print a JSON payload template for Feishu sending

## Send Step

After generating the `.ogg` file, send it with the `message` tool as Feishu media.

## When to Read References

- Read `references/implementation.md` when you need the verified implementation details, ffmpeg parameters, or environment assumptions.

## Scripts

### `scripts/send-feishu-voice.js`
Use for the main generation flow.

### `scripts/send-feishu-voice.sh`
Use as a shell wrapper for quick invocation.
