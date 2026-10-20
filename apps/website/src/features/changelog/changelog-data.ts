export type ChangelogPlatform = 'Website' | 'Extension' | 'Desktop' | 'Packages' | 'Build';

type ChangelogEntry = {
  id: string;
  date: string;
  title: string;
  groups: readonly {
    platform: ChangelogPlatform;
    changes: readonly string[];
    links?: readonly { label: string; href: string }[];
  }[];
};

// 日期取公开发布或用户明确批准的交付日期，统一为北京时间。
export const changelogEntries: readonly ChangelogEntry[] = [
  {
    id: 'website-quick-start',
    date: '2026-10-20',
    title: '新增快速开始',
    groups: [{
      platform: 'Website',
      changes: [
        '新增快速开始，介绍浏览器扩展与 macOS 应用的安装及首次打开授权。',
      ],
    }],
  },
  {
    id: 'photos-first-release',
    date: '2026-10-19',
    title: '推出 Photos 桌面应用',
    groups: [
      {
        platform: 'Desktop',
        changes: [
          '支持预览 iPhone 中的照片和视频。',
          '支持按月份分组选择，批量下载所选照片和视频。',
          '新增 DMG 拖拽安装窗口，支持将 Exts 拖入应用程序。',
        ],
        links: [
          { label: 'exts-mac.dmg · 1.2.0', href: 'https://github.com/linguio/exts/releases/download/v1.2.0/exts-mac.dmg' },
        ],
      },
      {
        platform: 'Extension',
        changes: [
          '新增 Newtab 书签，调整常用入口。',
          '优化 Newtab 与设置页面的样式布局。',
        ],
        links: [
          { label: 'exts-chrome.zip · 1.2.0', href: 'https://github.com/linguio/exts/releases/download/v1.2.0/exts-chrome.zip' },
        ],
      },
    ],
  },
  {
    id: 'build-packaging',
    date: '2026-10-19',
    title: '优化构建与打包流程',
    groups: [{
      platform: 'Build',
      changes: [
        '优化 GitHub Actions，统一生成浏览器扩展与 macOS 安装包。',
        '完善 macOS 应用签名与打包校验。',
      ],
    }],
  },
  {
    id: 'extension-settings',
    date: '2026-10-17',
    title: '新增主题切换与历史清理',
    groups: [{
      platform: 'Extension',
      changes: [
        '新增主题切换，支持浅色、深色和跟随系统。',
        '新增历史清理，支持在浏览器打开与关闭时清理访问历史。',
        '优化界面样式，统一组件风格与交互反馈。',
      ],
      links: [{ label: 'exts-chrome.zip · 1.1.0', href: 'https://github.com/linguio/exts/releases/tag/v1.1.0' }],
    }],
  },
  {
    id: 'website-content-layout',
    date: '2026-10-15',
    title: '完善产品介绍与首页布局',
    groups: [{
      platform: 'Website',
      changes: [
        '新增更新日志页面，集中展示各项工具的发布与改动。',
        '新增产品说明页面，介绍工具用途、使用方式与相关入口。',
        '调整首页布局，新增工具分类与产品展示。',
      ],
    }],
  },
  {
    id: 'wxt-stable-output-first-release',
    date: '2026-10-14',
    title: '推出 WXT 稳定构建工具包',
    groups: [{
      platform: 'Packages',
      changes: [
        '新增稳定开发目录，完成产物同步后再通知扩展重载。',
        '新增产物校验，更新失败时保留上一份可用产物。',
      ],
      links: [{ label: '@linguio/wxt-stable-output · 1.0.0', href: 'https://www.npmjs.com/package/@linguio/wxt-stable-output/v/1.0.0' }],
    }],
  },
  {
    id: 'website-launch',
    date: '2026-10-12',
    title: '上线产品官网',
    groups: [{
      platform: 'Website',
      changes: [
      '提供产品展示与统一下载入口',
      '新增更新日志，以时间线记录产品变化与进展',
      '新增产品介绍，按扩展、桌面与协同分类展示模块用途',
      ],
    }],
  },
  {
    id: 'first-release',
    date: '2026-10-10',
    title: '推出新标签页扩展',
    groups: [{
      platform: 'Extension',
      changes: [
      '新增新标签页，集中展示常用网站。',
      '新增标签组，按分组打开并组织网页。',
      '新增书签与 Dock，快速访问常用网站和工具。',
      ],
      links: [{ label: 'exts-chrome.zip · 1.0.0', href: 'https://github.com/linguio/exts/releases/tag/v1.0.0' }],
    }],
  },
];
