# CORS 配置说明

## 问题描述

从 `https://docs.crowmesh.com` 访问 `https://cloud.crowmesh.com/latest.yml` 时遇到 CORS 错误：

```
Access to fetch at 'https://cloud.crowmesh.com/latest.yml' from origin 'https://docs.crowmesh.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 解决方案

### 方案 1：在 cloud.crowmesh.com 服务器上添加 CORS 头（推荐）

在 `cloud.crowmesh.com` 服务器上配置，允许 `docs.crowmesh.com` 访问 `latest.yml` 文件。

#### Nginx 配置示例

```nginx
location /latest.yml {
    add_header 'Access-Control-Allow-Origin' 'https://docs.crowmesh.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    add_header 'Access-Control-Max-Age' '3600' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    # 其他配置...
}
```

#### Apache 配置示例

```apache
<Location "/latest.yml">
    Header always set Access-Control-Allow-Origin "https://docs.crowmesh.com"
    Header always set Access-Control-Allow-Methods "GET, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type"
    Header always set Access-Control-Max-Age "3600"
</Location>
```

#### 通用配置（允许所有来源，不推荐用于生产环境）

如果暂时无法配置特定域名，可以允许所有来源（仅用于测试）：

```nginx
location /latest.yml {
    add_header 'Access-Control-Allow-Origin' '*' always;
    # ...
}
```

### 方案 2：使用服务器端代理

在 `docs.crowmesh.com` 服务器上创建一个代理端点，例如 `/api/latest-version`，该端点从 `cloud.crowmesh.com/latest.yml` 获取数据并返回。

### 方案 3：使用 JSONP（如果支持）

如果服务器支持 JSONP，可以修改脚本使用 JSONP 方式获取数据。

## 测试 CORS 配置

配置完成后，可以使用以下命令测试：

```bash
curl -H "Origin: https://docs.crowmesh.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://cloud.crowmesh.com/latest.yml \
     -v
```

应该看到响应头中包含：
```
Access-Control-Allow-Origin: https://docs.crowmesh.com
Access-Control-Allow-Methods: GET, OPTIONS
```

## 当前状态

脚本已经内联到 `salesiq.js` 中，会在页面加载时自动执行。一旦服务器端配置了 CORS 头，脚本就能正常工作。

## 临时解决方案

如果暂时无法配置 CORS，可以考虑：
1. 使用服务器端符号链接方案（见 `VERSION_SETUP.md`）
2. 手动更新文档中的链接
3. 使用文档站点的后端代理

