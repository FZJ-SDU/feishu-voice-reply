# Feishu Voice Reply Implementation Notes

## Verified Working Path

1. Directly call Edge TTS to generate real audio (`mp3`).
2. Convert the file with:

```bash
ffmpeg -y -i input.mp3 -c:a libopus -b:a 24k -ar 16000 -ac 1 output.ogg
```

3. Send the resulting `.ogg` file to Feishu.

## Why This Path

### Works
- Edge TTS direct call
- ffmpeg transcoding
- Feishu official plugin audio sending

### Does Not Work Reliably Here
- OpenClaw built-in `tts` tool as the source for Feishu voice reply

## Recommended TTS Parameters

- voice: `zh-CN-XiaoxiaoNeural`
- lang: `zh-CN`
- outputFormat: `audio-24khz-48kbitrate-mono-mp3`

## Recommended Audio Output Parameters

- codec: `libopus`
- bitrate: `24k`
- sample rate: `16000`
- channels: `1`

## Environment Assumptions

- Feishu official plugin is enabled
- `ffmpeg` is installed
- `node-edge-tts` is available from the OpenClaw installation
