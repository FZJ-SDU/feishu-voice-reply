# feishu-voice-reply

一个把**文本转成语音**，并作为 **飞书语音消息** 发出的 OpenClaw Skill。

> 已验证可用：**Edge TTS → ffmpeg 转 `ogg/opus` → Feishu 官方插件发送 audio**

---

## 功能特点

- 把文本转换成中文语音
- 自动转码为飞书更兼容的 `ogg/opus`
- 适合用于：
  - 飞书语音播报
  - 语音简报
  - 把文字回复变成飞书语音消息
  - 测试飞书语音发送链路

---

## 适用场景

当你需要这些能力时使用本 Skill：

- “把这段文字发成飞书语音”
- “给我发一条语音播报”
- “把天气/新闻整理后用语音回复”
- “测试飞书语音发送是否正常”

---

## 工作原理

本 Skill 当前采用的稳定链路：

1. 使用 **Edge TTS** 生成语音（mp3）
2. 使用 **ffmpeg** 转码为 `ogg/opus`
3. 使用 **Feishu 官方插件** 将音频作为语音消息发送到飞书

### 为什么这样做？
在当前环境里，直接依赖 OpenClaw 内置 `tts` 工具有时会返回空文件，因此本 Skill 采用了更稳定的直调方案。

---

## 仓库结构

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

---

## 安装前提

### 1. 已安装 OpenClaw
本 Skill 运行在 OpenClaw 环境中。

### 2. 已启用 Feishu 官方插件
需要可用的：
- `feishu-openclaw-plugin`
- 正确配置 appId / appSecret
- 已完成用户授权

### 3. 系统已安装 `ffmpeg`
例如在 Debian / Ubuntu：

```bash
apt update
apt-get install -y ffmpeg
```

### 4. 可用的 `node-edge-tts`
脚本会优先按标准 Node 模块方式加载 `node-edge-tts`；若找不到，会尝试 OpenClaw 常见安装路径。

---

## 安装 Skill

从 `releases/feishu-voice-reply.skill` 获取 Skill 包并导入 OpenClaw。

---

## 使用说明

本 Skill 核心脚本：

```bash
node skill-src/feishu-voice-reply/scripts/send-feishu-voice.js <feishu_open_id> <文本内容>
```

或者：

```bash
skill-src/feishu-voice-reply/scripts/send-feishu-voice.sh <feishu_open_id> <文本内容>
```

### 示例

```bash
node skill-src/feishu-voice-reply/scripts/send-feishu-voice.js ou_xxx "你好，这是飞书语音测试。"
```

脚本会：
- 生成 mp3
- 转成 `ogg/opus`
- 输出可用于发送飞书语音的 payload 信息

---

## 发布方式

建议两种同时提供：

### 1. GitHub 仓库源码
用于查看实现、二次修改、重新打包。

### 2. GitHub Releases
上传：
- `feishu-voice-reply.skill`

这样其他用户可以直接下载 Skill 包安装。

---

## 重新打包

如果你修改了 Skill 内容，可以重新执行：

```bash
python3 /app/npm-global/lib/node_modules/openclaw/skills/skill-creator/scripts/package_skill.py skill-src/feishu-voice-reply releases
```

---

## 已验证状态

当前已经验证成功：

- Edge TTS 直调：✅
- ffmpeg 转码 `ogg/opus`：✅
- 飞书语音消息发送：✅
- Skill 结构校验：✅

---

## 后续可扩展方向

- 接入 ASR，实现“飞书发语音 → 自动识别 → 自动语音回复”
- 增加更多中文音色配置
- 做成更完整的自动触发工作流
- 进一步减少对宿主 OpenClaw 环境路径的依赖

---

## 结论

如果你想在 OpenClaw 里实现“**把文字发成飞书语音消息**”，这个 Skill 就是目前这条路线的稳定封装。
