# 版本管理设置说明

## 概述

本文档说明如何设置自动版本管理，使下载链接自动指向最新版本，无需每次手动更新文档中的链接。

## 推荐方案：从 latest.yml 自动获取版本（推荐）

### 方案说明

使用 `https://cloud.crowmesh.com/latest.yml` 文件获取最新版本号，客户端脚本自动更新下载链接。这样文档中只需要设置默认链接，脚本会自动从 `latest.yml` 获取最新版本并更新链接。

### 工作原理

1. 页面加载时，JavaScript 脚本从 `https://cloud.crowmesh.com/latest.yml` 获取最新版本号
2. 解析 YAML 文件中的 `version` 字段
3. 根据版本号动态构建下载链接
4. 更新页面中所有带有 `data-platform` 和 `data-arch` 属性的下载链接

### 当前配置

- 下载页面已配置 `data-platform` 和 `data-arch` 属性
- 脚本文件：`content/update-download-links.js`
- 脚本会在页面加载后自动执行

### 优点

- ✅ 文档无需修改（只需设置默认链接）
- ✅ 自动从 `latest.yml` 获取最新版本
- ✅ 无需服务器端符号链接
- ✅ 版本更新只需更新 `latest.yml` 文件

### 维护

当有新版本发布时：
1. 更新 `https://cloud.crowmesh.com/latest.yml` 文件中的 `version` 字段
2. 上传新版本的安装包文件
3. 文档会自动使用最新版本（无需修改文档）

### 示例

`latest.yml` 文件格式：
```yaml
version: 2.1.0
release_date: 2025-11-12
changelog: |
  1、修复登录失败问题
  2、优化界面适配
```

脚本会自动构建下载链接：
- macOS Apple: `https://cloud.crowmesh.com/crowvpn-apple-2.1.0.dmg`
- macOS Intel: `https://cloud.crowmesh.com/crowvpn-intel-2.1.0.dmg`
- Windows x64: `https://cloud.crowmesh.com/crowvpn-windows-2.1.0-x64-setup.exe`
- Windows Arm64: `https://cloud.crowmesh.com/crowvpn-windows-2.1.0-arm64-setup.exe`

---

## 备用方案：服务器端符号链接

### 方案说明

在服务器上创建符号链接，将固定的 `-latest` URL 指向最新版本文件。这样文档中可以使用固定的 URL，无需修改。

### 设置步骤

1. **在服务器上创建符号链接**

   假设您的文件存储在服务器目录中，例如：
   ```
   /path/to/downloads/
   ├── crowvpn-apple-2.0.1.dmg
   ├── crowvpn-apple-2.1.0.dmg  (新版本)
   ├── crowvpn-intel-2.0.1.dmg
   ├── crowvpn-intel-2.1.0.dmg  (新版本)
   ├── crowvpn-windows-2.0.1-x64-setup.exe
   ├── crowvpn-windows-2.1.0-x64-setup.exe  (新版本)
   ├── crowvpn-windows-2.0.1-arm64-setup.exe
   └── crowvpn-windows-2.1.0-arm64-setup.exe  (新版本)
   ```

2. **创建符号链接**

   在服务器上执行以下命令：
   ```bash
   # 进入下载目录
   cd /path/to/downloads/
   
   # 创建 macOS 符号链接
   ln -sf crowvpn-apple-2.1.0.dmg crowvpn-apple-latest.dmg
   ln -sf crowvpn-intel-2.1.0.dmg crowvpn-intel-latest.dmg
   
   # 创建 Windows 符号链接
   ln -sf crowvpn-windows-2.1.0-x64-setup.exe crowvpn-windows-latest-x64-setup.exe
   ln -sf crowvpn-windows-2.1.0-arm64-setup.exe crowvpn-windows-latest-arm64-setup.exe
   ```

3. **配置 Web 服务器**

   确保 Web 服务器（如 Nginx 或 Apache）能够正确处理符号链接。

   **Nginx 配置示例：**
   ```nginx
   location /downloads/ {
       alias /path/to/downloads/;
       autoindex off;
   }
   ```

   **Apache 配置示例：**
   ```apache
   <Directory "/path/to/downloads">
       Options FollowSymLinks
       AllowOverride None
       Require all granted
   </Directory>
   ```

4. **更新版本时的操作**

   当有新版本发布时，只需更新符号链接：
   ```bash
   # 更新到新版本 2.0.3
   ln -sf crowvpn-apple-2.0.3.dmg crowvpn-apple-latest.dmg
   ln -sf crowvpn-intel-2.0.3.dmg crowvpn-intel-latest.dmg
   ln -sf crowvpn-windows-2.0.3-x64-setup.exe crowvpn-windows-latest-x64-setup.exe
   ln -sf crowvpn-windows-2.0.3-arm64-setup.exe crowvpn-windows-latest-arm64-setup.exe
   ```

### 优点

- ✅ 文档无需修改
- ✅ 自动指向最新版本
- ✅ 服务器端控制，更可靠
- ✅ 无需客户端脚本

## 备用方案：版本配置文件

如果服务器不支持符号链接，可以使用版本配置文件方案。

### 设置步骤

1. **更新版本配置文件**

   编辑 `content/versions.json`，更新版本号：
   ```json
   {
     "macos": {
       "apple": {
         "version": "2.1.0",
         "filename": "crowvpn-apple-2.1.0.dmg",
         "url": "https://cloud.crowmesh.com/crowvpn-apple-2.1.0.dmg"
       },
       "intel": {
         "version": "2.1.0",
         "filename": "crowvpn-intel-2.1.0.dmg",
         "url": "https://cloud.crowmesh.com/crowvpn-intel-2.1.0.dmg"
       }
     },
     "windows": {
       "x64": {
         "version": "2.1.0",
         "filename": "crowvpn-windows-2.1.0-x64-setup.exe",
         "url": "https://cloud.crowmesh.com/crowvpn-windows-2.1.0-x64-setup.exe"
       },
       "arm64": {
         "version": "2.1.0",
         "filename": "crowvpn-windows-2.1.0-arm64-setup.exe",
         "url": "https://cloud.crowmesh.com/crowvpn-windows-2.1.0-arm64-setup.exe"
       }
     }
   }
   ```

2. **更新文档中的链接**

   编辑下载页面，更新链接：
   - `client/mac-download.mdx`
   - `client/windows-download.mdx`

3. **使用更新脚本**

   可以使用提供的更新脚本自动更新版本（需要根据实际情况调整）。

### 缺点

- ❌ 每次新版本都需要更新文档
- ❌ 需要手动维护版本文件

## 当前配置

文档中已使用 `-latest` URL：
- macOS: `crowvpn-apple-latest.dmg`, `crowvpn-intel-latest.dmg`
- Windows: `crowvpn-windows-latest-x64-setup.exe`, `crowvpn-windows-latest-arm64-setup.exe`

**请确保服务器上已设置相应的符号链接，否则链接将无法工作。**

## 测试

1. 访问下载页面
2. 点击下载链接
3. 验证下载的文件是否为最新版本

## 注意事项

1. 符号链接路径必须正确
2. Web 服务器必须支持符号链接
3. 文件权限必须正确设置
4. 建议保留旧版本文件，以便回滚

