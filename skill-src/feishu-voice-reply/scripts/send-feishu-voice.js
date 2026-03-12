#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function loadEdgeTTS() {
  const candidates = [
    'node-edge-tts',
    'node-edge-tts/dist/edge-tts.js',
    '/app/npm-global/lib/node_modules/openclaw/node_modules/node-edge-tts/dist/edge-tts.js',
  ];

  try {
    const openclawRoot = path.dirname(require.resolve('openclaw/package.json'));
    candidates.push(path.join(openclawRoot, 'node_modules/node-edge-tts/dist/edge-tts.js'));
  } catch {}

  try {
    const pkgPath = require.resolve('node-edge-tts/package.json');
    candidates.push(path.join(path.dirname(pkgPath), 'dist/edge-tts.js'));
  } catch {}

  const tried = [];
  for (const candidate of candidates) {
    try {
      const mod = require(candidate);
      if (mod && mod.EdgeTTS) return mod.EdgeTTS;
    } catch (err) {
      tried.push(`${candidate}: ${err.message}`);
    }
  }

  throw new Error(
    '无法加载 node-edge-tts，请先安装或确保 OpenClaw 环境自带该依赖。\n' +
    tried.join('\n')
  );
}

const EdgeTTS = loadEdgeTTS();

async function main() {
  const [, , target, ...textParts] = process.argv;
  const text = textParts.join(' ').trim();
  if (!target || !text) {
    console.error('用法: node send-feishu-voice.js <feishu_open_id> <文本内容>');
    process.exit(1);
  }

  const tmpDir = fs.mkdtempSync(path.join('/tmp/openclaw/', 'feishu-voice-'));
  const mp3Path = path.join(tmpDir, 'voice.mp3');
  const oggPath = path.join(tmpDir, 'voice.ogg');

  const tts = new EdgeTTS({
    voice: 'zh-CN-XiaoxiaoNeural',
    lang: 'zh-CN',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    timeout: 30000,
  });

  await tts.ttsPromise(text, mp3Path);

  const stat = fs.statSync(mp3Path);
  if (!stat.size) throw new Error('TTS 生成失败：mp3 文件为空');

  execFileSync('ffmpeg', [
    '-y', '-i', mp3Path,
    '-c:a', 'libopus',
    '-b:a', '24k',
    '-ar', '16000',
    '-ac', '1',
    oggPath,
  ], { stdio: 'inherit' });

  const oggStat = fs.statSync(oggPath);
  if (!oggStat.size) throw new Error('转码失败：ogg 文件为空');

  const base64 = fs.readFileSync(oggPath).toString('base64');
  const payload = {
    action: 'send',
    channel: 'feishu',
    target,
    buffer: base64,
    filename: 'voice.ogg',
    contentType: 'audio/ogg',
    caption: '语音消息',
  };

  console.log(JSON.stringify({ ok: true, target, text, mp3Path, oggPath, payload }, null, 2));
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
