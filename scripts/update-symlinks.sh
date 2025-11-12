#!/bin/bash
# 更新下载链接符号链接脚本
# 使用方法: ./update-symlinks.sh <version> <download-dir>
# 示例: ./update-symlinks.sh 2.0.2 /path/to/downloads

set -e

VERSION=${1:-""}
DOWNLOAD_DIR=${2:-""}

if [ -z "$VERSION" ] || [ -z "$DOWNLOAD_DIR" ]; then
    echo "使用方法: $0 <version> <download-dir>"
    echo "示例: $0 2.0.2 /path/to/downloads"
    exit 1
fi

if [ ! -d "$DOWNLOAD_DIR" ]; then
    echo "错误: 下载目录不存在: $DOWNLOAD_DIR"
    exit 1
fi

cd "$DOWNLOAD_DIR"

# 检查文件是否存在
APPLE_FILE="crowvpn-apple-${VERSION}.dmg"
INTEL_FILE="crowvpn-intel-${VERSION}.dmg"
WIN_X64_FILE="crowvpn-windows-${VERSION}-x64-setup.exe"
WIN_ARM64_FILE="crowvpn-windows-${VERSION}-arm64-setup.exe"

if [ ! -f "$APPLE_FILE" ]; then
    echo "警告: 文件不存在: $APPLE_FILE"
fi

if [ ! -f "$INTEL_FILE" ]; then
    echo "警告: 文件不存在: $INTEL_FILE"
fi

if [ ! -f "$WIN_X64_FILE" ]; then
    echo "警告: 文件不存在: $WIN_X64_FILE"
fi

if [ ! -f "$WIN_ARM64_FILE" ]; then
    echo "警告: 文件不存在: $WIN_ARM64_FILE"
fi

# 创建符号链接
echo "更新符号链接到版本 $VERSION..."

if [ -f "$APPLE_FILE" ]; then
    ln -sf "$APPLE_FILE" "crowvpn-apple-latest.dmg"
    echo "✓ 已更新: crowvpn-apple-latest.dmg -> $APPLE_FILE"
fi

if [ -f "$INTEL_FILE" ]; then
    ln -sf "$INTEL_FILE" "crowvpn-intel-latest.dmg"
    echo "✓ 已更新: crowvpn-intel-latest.dmg -> $INTEL_FILE"
fi

if [ -f "$WIN_X64_FILE" ]; then
    ln -sf "$WIN_X64_FILE" "crowvpn-windows-latest-x64-setup.exe"
    echo "✓ 已更新: crowvpn-windows-latest-x64-setup.exe -> $WIN_X64_FILE"
fi

if [ -f "$WIN_ARM64_FILE" ]; then
    ln -sf "$WIN_ARM64_FILE" "crowvpn-windows-latest-arm64-setup.exe"
    echo "✓ 已更新: crowvpn-windows-latest-arm64-setup.exe -> $WIN_ARM64_FILE"
fi

echo ""
echo "完成！符号链接已更新。"
echo ""
echo "当前符号链接："
ls -la *-latest.* 2>/dev/null || echo "没有找到 -latest 符号链接"

