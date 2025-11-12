// content/salesiq.js
window.$zoho = window.$zoho || {};
$zoho.salesiq = $zoho.salesiq || { ready: function () { } };

(function () {
    if (document.getElementById('zsiqscript')) return;
    var s = document.createElement('script');
    s.id = 'zsiqscript';
    s.src = 'https://salesiq.zohopublic.com/widget?wc=siq661b3c690233e140e667eb2011f71bacbde8e0374600c18ca43af18d499fa838';
    s.defer = true;
    (document.body || document.head).appendChild(s);
})();

// 下载链接自动更新脚本（内联版本，避免路径和 CORS 问题）
(function() {
  'use strict';

  // 解析 YAML 文件（简单版本，只提取 version）
  function parseYAML(text) {
    const versionMatch = text.match(/version:\s*([^\n]+)/);
    if (versionMatch) {
      return {
        version: versionMatch[1].trim()
      };
    }
    return null;
  }

  // 根据版本号和平台信息构建下载链接
  function buildDownloadUrl(version, platform, arch) {
    const baseUrl = 'https://cloud.crowmesh.com';
    
    if (platform === 'macos') {
      if (arch === 'apple') {
        return baseUrl + '/crowvpn-apple-' + version + '.dmg';
      } else if (arch === 'intel') {
        return baseUrl + '/crowvpn-intel-' + version + '.dmg';
      }
    } else if (platform === 'windows') {
      if (arch === 'x64') {
        return baseUrl + '/crowvpn-windows-' + version + '-x64-setup.exe';
      } else if (arch === 'arm64') {
        return baseUrl + '/crowvpn-windows-' + version + '-arm64-setup.exe';
      }
    }
    
    return null;
  }

  // 更新单个链接
  function updateLink(element, version, platform, arch) {
    const newUrl = buildDownloadUrl(version, platform, arch);
    if (!newUrl) return;

    // Mintlify 的 Card 组件可能将链接放在不同的位置
    // 尝试多种方式更新链接
    
    // 1. 如果元素本身是链接
    if (element.tagName === 'A' && element.href) {
      element.href = newUrl;
    }
    
    // 2. 查找元素内部的所有链接
    const links = element.querySelectorAll('a');
    links.forEach(function(link) {
      if (link.href && (
        link.href.includes('crowvpn-apple') ||
        link.href.includes('crowvpn-intel') ||
        link.href.includes('crowvpn-windows')
      )) {
        link.href = newUrl;
        // 也更新 data-href 属性（如果存在）
        if (link.hasAttribute('data-href')) {
          link.setAttribute('data-href', newUrl);
        }
      }
    });
    
    // 3. 查找父元素中的链接（Card 组件可能将链接放在父级）
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentLinks = parent.querySelectorAll('a');
      parentLinks.forEach(function(link) {
        if (link.href && (
          link.href.includes('crowvpn-apple') ||
          link.href.includes('crowvpn-intel') ||
          link.href.includes('crowvpn-windows')
        )) {
          link.href = newUrl;
        }
      });
      parent = parent.parentElement;
    }
    
    // 4. 尝试通过 ID 查找对应的链接
    const elementId = element.getAttribute('id');
    if (elementId) {
      const idLinks = document.querySelectorAll('a[href*="crowvpn"]');
      idLinks.forEach(function(link) {
        const linkParent = link.closest('[id="' + elementId + '"]') || 
                          link.closest('[data-platform="' + platform + '"][data-arch="' + arch + '"]');
        if (linkParent) {
          link.href = newUrl;
        }
      });
    }
  }

  // 从 latest.yml 获取最新版本并更新链接
  async function updateDownloadLinks() {
    try {
      // 尝试使用 CORS 代理或直接访问
      // 如果 CORS 失败，可以尝试通过 JSONP 或其他方式
      let yamlText = null;
      
      try {
        // 方法1: 直接 fetch（可能被 CORS 阻止）
        const response = await fetch('https://cloud.crowmesh.com/latest.yml', {
          mode: 'cors',
          cache: 'no-cache'
        });
        if (response.ok) {
          yamlText = await response.text();
        }
      } catch (e) {
        console.warn('直接 fetch 失败，尝试其他方法:', e);
        
        // 方法2: 尝试使用 JSONP（如果服务器支持）
        // 或者使用代理
        try {
          // 如果 latest.yml 可以通过 JSONP 访问，可以在这里实现
          // 或者通过文档站点的后端代理
          const proxyResponse = await fetch('https://docs.crowmesh.com/api/latest-version', {
            mode: 'cors',
            cache: 'no-cache'
          });
          if (proxyResponse.ok) {
            const data = await proxyResponse.json();
            if (data.version) {
              // 如果代理返回 JSON 格式
              yamlText = 'version: ' + data.version;
            }
          }
        } catch (proxyError) {
          console.warn('代理方法也失败:', proxyError);
        }
      }
      
      if (!yamlText) {
        console.warn('无法获取最新版本信息，使用默认链接');
        return;
      }
      
      const versionInfo = parseYAML(yamlText);
      
      if (!versionInfo || !versionInfo.version) {
        console.warn('无法解析版本信息，使用默认链接');
        return;
      }
      
      const version = versionInfo.version;
      console.log('获取到最新版本: ' + version);
      
      // 更新所有带有 data-platform 和 data-arch 属性的元素
      const elements = document.querySelectorAll('[data-platform][data-arch]');
      
      if (elements.length === 0) {
        console.warn('未找到带有 data-platform 和 data-arch 属性的元素，尝试其他方式查找');
        // 备用方案：直接查找所有包含 crowvpn 的链接
        const allLinks = document.querySelectorAll('a[href*="crowvpn"]');
        allLinks.forEach(function(link) {
          const href = link.href;
          if (href.includes('crowvpn-apple-')) {
            link.href = buildDownloadUrl(version, 'macos', 'apple');
          } else if (href.includes('crowvpn-intel-')) {
            link.href = buildDownloadUrl(version, 'macos', 'intel');
          } else if (href.includes('crowvpn-windows-') && href.includes('-x64-')) {
            link.href = buildDownloadUrl(version, 'windows', 'x64');
          } else if (href.includes('crowvpn-windows-') && href.includes('-arm64-')) {
            link.href = buildDownloadUrl(version, 'windows', 'arm64');
          }
        });
      } else {
        elements.forEach(function(element) {
          const platform = element.getAttribute('data-platform');
          const arch = element.getAttribute('data-arch');
          updateLink(element, version, platform, arch);
        });
      }
      
    } catch (error) {
      console.warn('更新下载链接时出错:', error);
    }
  }

  // 页面加载完成后执行
  function init() {
    // 多次尝试更新，因为 Mintlify 的组件可能延迟渲染
    function tryUpdate() {
      updateDownloadLinks();
    }
    
    // 立即尝试一次
    tryUpdate();
    
    // DOM 加载完成后尝试
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(tryUpdate, 500);
        setTimeout(tryUpdate, 1000);
        setTimeout(tryUpdate, 2000);
      });
    } else {
      setTimeout(tryUpdate, 500);
      setTimeout(tryUpdate, 1000);
      setTimeout(tryUpdate, 2000);
    }
    
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations, obs) {
      const hasDownloadLinks = document.querySelectorAll('[data-platform][data-arch]').length > 0 ||
                               document.querySelectorAll('a[href*="crowvpn"]').length > 0;
      if (hasDownloadLinks) {
        setTimeout(tryUpdate, 100);
      }
    });
    
    // 开始观察
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      // 如果 body 还不存在，等待它创建
      setTimeout(function() {
        if (document.body) {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      }, 100);
    }
  }

  // 初始化
  init();
})();