// content/update-download-links.js
// 从 latest.yml 自动获取最新版本并更新下载链接

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

    // 尝试更新 Card 组件的 href 属性
    if (element.href !== undefined) {
      element.href = newUrl;
    }

    // 查找 Card 内部的所有链接
    const links = element.querySelectorAll('a');
    links.forEach(function(link) {
      if (link.href && (
        link.href.includes('crowvpn-apple') ||
        link.href.includes('crowvpn-intel') ||
        link.href.includes('crowvpn-windows')
      )) {
        link.href = newUrl;
      }
    });
  }

  // 从 latest.yml 获取最新版本并更新链接
  async function updateDownloadLinks() {
    try {
      // 从 latest.yml 获取版本信息
      const response = await fetch('https://cloud.crowmesh.com/latest.yml');
      if (!response.ok) {
        console.warn('无法获取最新版本信息，使用默认链接');
        return;
      }
      
      const yamlText = await response.text();
      const versionInfo = parseYAML(yamlText);
      
      if (!versionInfo || !versionInfo.version) {
        console.warn('无法解析版本信息，使用默认链接');
        return;
      }
      
      const version = versionInfo.version;
      console.log('获取到最新版本: ' + version);
      
      // 更新所有带有 data-platform 和 data-arch 属性的元素
      const elements = document.querySelectorAll('[data-platform][data-arch]');
      
      elements.forEach(function(element) {
        const platform = element.getAttribute('data-platform');
        const arch = element.getAttribute('data-arch');
        updateLink(element, version, platform, arch);
      });
      
    } catch (error) {
      console.warn('更新下载链接时出错:', error);
    }
  }

  // 页面加载完成后执行
  function init() {
    // 等待 DOM 完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        // 延迟执行，确保 Mintlify 的 Card 组件已渲染
        setTimeout(updateDownloadLinks, 1000);
      });
    } else {
      // DOM 已经加载完成，延迟执行
      setTimeout(updateDownloadLinks, 1000);
    }
    
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations, obs) {
      const hasDownloadLinks = document.querySelectorAll('[data-platform][data-arch]').length > 0;
      if (hasDownloadLinks) {
        updateDownloadLinks();
      }
    });
    
    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初始化
  init();
})();
