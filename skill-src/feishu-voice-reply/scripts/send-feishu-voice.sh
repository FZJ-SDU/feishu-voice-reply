#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "用法: ./send-feishu-voice.sh <feishu_open_id> <文本内容>"
  exit 1
fi

TARGET="$1"
shift
TEXT="$*"

node "$(dirname "$0")/send-feishu-voice.js" "$TARGET" "$TEXT"
