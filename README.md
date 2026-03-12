# feishu-voice-reply

[中文](#中文说明) | [English](#english)

---

## 中文说明

一个将**文本转为语音**，并通过 **Feishu / 飞书语音消息** 发送的 OpenClaw Skill。

> 已验证链路：**Edge TTS → ffmpeg 转 `ogg/opus` → Feishu 官方插件发送 audio**

### 功能特点

- 将文本转换为中文语音
- 自动转码为飞书兼容性更好的 `ogg/opus`
- 适用于语音播报、语音简报、语音回复与发送链路测试

### 适用场景

本 Skill 适用于以下场景：

- 将文字内容发送为飞书语音消息
- 在飞书中生成语音播报或语音简报
- 将天气、新闻、提醒等文本内容转为语音发送
- 验证飞书语音发送链路是否正常

### 工作原理

当前采用的稳定实现链路：

1. 使用 **Edge TTS** 生成语音（mp3）
2. 使用 **ffmpeg** 转码为 `ogg/opus`
3. 使用 **Feishu 官方插件** 将音频作为语音消息发送到飞书

#### 采用该方案的原因

在当前环境中，直接依赖 OpenClaw 内置 `tts` 工具有时会返回空文件，因此这里采用了更稳定的直调方案。

### 仓库结构

```text
feishu-voice-reply/
├── README.md
├── releases/
│   └── feishu-voice-reply.skill
└── skill-src/
    └── feishu-voice-reply/
        ├── SKILL.md
        ├── scripts/
        │   ├── send-feishu-voice.js
        │   └── send-feishu-voice.sh
        └── references/
            └── implementation.md
```

### 环境要求

#### 1. 已安装 OpenClaw
本 Skill 运行于 OpenClaw 环境。

#### 2. 已启用 Feishu 官方插件
需要满足以下条件：
- 已安装 `feishu-openclaw-plugin`
- 已正确配置 appId / appSecret
- 已完成用户授权

#### 3. 已安装 `ffmpeg`
例如在 Debian / Ubuntu 上：

```bash
apt update
apt-get install -y ffmpeg
```

#### 4. 可用的 `node-edge-tts`
脚本会优先按标准 Node 模块方式加载 `node-edge-tts`；若找不到，则会尝试 OpenClaw 常见安装路径。

### 安装

可通过以下两种方式获取：

#### 1. GitHub 仓库源码
用于查看实现、二次修改与重新打包。

#### 2. GitHub Releases
用于下载打包后的 Skill 文件：
- `feishu-voice-reply.skill`

### 使用方法

核心脚本：

```bash
node skill-src/feishu-voice-reply/scripts/send-feishu-voice.js <feishu_open_id> <文本内容>
```

或：

```bash
skill-src/feishu-voice-reply/scripts/send-feishu-voice.sh <feishu_open_id> <文本内容>
```

#### 示例

```bash
node skill-src/feishu-voice-reply/scripts/send-feishu-voice.js ou_xxx "你好，这是飞书语音测试。"
```

脚本执行后将：
- 生成 mp3 文件
- 转码为 `ogg/opus`
- 输出可用于发送飞书语音消息的 payload 信息

### 重新打包

修改 Skill 内容后，可使用以下命令重新打包：

```bash
python3 /app/npm-global/lib/node_modules/openclaw/skills/skill-creator/scripts/package_skill.py skill-src/feishu-voice-reply releases
```

### 验证状态

当前已验证：

- Edge TTS 直调：✅
- ffmpeg 转码 `ogg/opus`：✅
- 飞书语音消息发送：✅
- Skill 结构校验：✅

### 可扩展方向

- 接入 ASR，实现“飞书语音输入 → 自动识别 → 自动语音回复”
- 增加更多中文音色配置
- 扩展为更完整的自动化工作流
- 进一步减少对宿主 OpenClaw 环境路径的依赖

### 总结

`feishu-voice-reply` 提供了一条稳定的 OpenClaw 工作流，用于将文本内容转换并发送为飞书语音消息。

[Back to top](#feishu-voice-reply)

---

## English

An OpenClaw skill for converting **text into speech** and sending it as a **Feishu voice message**.

> Verified pipeline: **Edge TTS → ffmpeg to `ogg/opus` → Feishu official plugin audio sending**

### Features

- Converts text into Chinese speech
- Automatically transcodes audio into Feishu-friendly `ogg/opus`
- Suitable for voice broadcasts, spoken briefings, voice replies, and delivery-path testing

### Use cases

This skill is intended for scenarios such as:

- sending text content as a Feishu voice message
- generating spoken briefings in Feishu
- turning weather, news, reminders, or other text into voice messages
- verifying that Feishu voice delivery works correctly

### How it works

Current stable implementation path:

1. Generate speech with **Edge TTS** (`mp3`)
2. Transcode the audio to **`ogg/opus`** with **ffmpeg**
3. Send the result through the **Feishu official plugin** as an audio message

#### Why this approach?

In this environment, the built-in OpenClaw `tts` tool may occasionally return empty output files. This skill therefore uses a more reliable direct-generation path.

### Repository layout

```text
feishu-voice-reply/
├── README.md
├── releases/
│   └── feishu-voice-reply.skill
└── skill-src/
    └── feishu-voice-reply/
        ├── SKILL.md
        ├── scripts/
        │   ├── send-feishu-voice.js
        │   └── send-feishu-voice.sh
        └── references/
            └── implementation.md
```

### Requirements

#### 1. OpenClaw installed
This skill runs inside an OpenClaw environment.

#### 2. Feishu official plugin enabled
The following are required:
- `feishu-openclaw-plugin`
- valid appId / appSecret configuration
- completed user authorization

#### 3. `ffmpeg` installed
For Debian / Ubuntu:

```bash
apt update
apt-get install -y ffmpeg
```

#### 4. `node-edge-tts` available
The script first tries standard Node module resolution for `node-edge-tts`; if that fails, it falls back to common OpenClaw installation paths.

### Installation

The skill can be obtained in two forms:

#### 1. GitHub source repository
For browsing the implementation, modifying the skill, and repackaging it.

#### 2. GitHub Releases
For downloading the packaged skill file:
- `feishu-voice-reply.skill`

### Usage

Main script:

```bash
node skill-src/feishu-voice-reply/scripts/send-feishu-voice.js <feishu_open_id> <text>
```

Or:

```bash
skill-src/feishu-voice-reply/scripts/send-feishu-voice.sh <feishu_open_id> <text>
```

#### Example

```bash
node skill-src/feishu-voice-reply/scripts/send-feishu-voice.js ou_xxx "Hello, this is a Feishu voice test."
```

After execution, the script will:
- generate an mp3 file
- transcode it to `ogg/opus`
- print payload information for sending the Feishu audio message

### Repackaging

After modifying the skill, rebuild the package with:

```bash
python3 /app/npm-global/lib/node_modules/openclaw/skills/skill-creator/scripts/package_skill.py skill-src/feishu-voice-reply releases
```

### Verification status

Currently verified:

- Edge TTS direct generation: ✅
- ffmpeg transcoding to `ogg/opus`: ✅
- Feishu voice message sending: ✅
- Skill structure validation: ✅

### Possible extensions

- Add ASR so Feishu voice input can be recognized and answered by voice
- Support more Chinese voice options
- Expand it into a more complete automated workflow
- Reduce dependency on host-specific OpenClaw paths

### Summary

`feishu-voice-reply` provides a stable OpenClaw workflow for converting text into Feishu voice messages.

[返回中文](#中文说明)
