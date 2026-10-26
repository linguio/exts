export type ChangelogPlatform = 'Website' | 'Extension' | 'Desktop' | 'Packages' | 'Build' | 'Skills';

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
    id: 'newtab-studio-actions-ui-folder',
    date: '2026-10-26',
    title: '新增工作台入口并优化书签体验',
    groups: [{
      platform: 'Extension',
      changes: [
        '新增 Studio 工作台入口与 Actions 快捷操作菜单，支持首页与工作台切换。',
        '调整书签分类，新增 UI 文件夹并统一网站 SVG 图标配色。',
        '优化文件夹内部滚动，补充上下方向提示与边缘渐变磨砂。',
      ],
      links: [
        { label: 'exts-chrome.zip · 1.6.0', href: 'https://github.com/linguio/exts/releases/download/v1.6.0/exts-chrome.zip' },
      ],
    }],
  },
  {
    id: 'bookmarks-scroll-download-standards',
    date: '2026-10-25',
    title: '整理书签与统一功能规范',
    groups: [{
      platform: 'Extension',
      changes: [
        '统一滚动区域组件，保持界面风格一致。',
        '统一下载功能框架，明确媒体保存、下载记录与操作提示的职责和规范。',
      ],
    }],
  },
  {
    id: 'telegram-download-newtab-improvements',
    date: '2026-10-24',
    title: '完善 Telegram 下载体验',
    groups: [{
      platform: 'Extension',
      changes: [
        '优化 TG 下载操作，支持快速保存、文件另存为和保存文件夹选择。',
        '新增下载记录，支持查看文件名与大小、按来源筛选和清空记录。',
        '规范操作提示，统一提示文案、状态图标与显示位置。',
      ],
      links: [
        { label: 'exts-chrome.zip · 1.5.0', href: 'https://github.com/linguio/exts/releases/download/v1.5.0/exts-chrome.zip' },
      ],
    }],
  },
  {
    id: 'newtab-check-in-layout',
    date: '2026-10-22',
    title: '完善 Newtab 布局与学习日历',
    groups: [{
      platform: 'Extension',
      changes: [
        '重排书签、卡片与底部 Dock，各区域内容独立滚动。',
        '新增打卡记录日历，按本地日期展示内置示例的每日学习分钟数。',
        'Dock 新增 Download 空抽屉入口，EDU 文件夹悬停时切换锁图标。',
      ],
      links: [
        { label: 'exts-chrome.zip · 1.4.0', href: 'https://github.com/linguio/exts/releases/download/v1.4.0/exts-chrome.zip' },
      ],
    }],
  },
  {
    id: 'development-workflow-improvements',
    date: '2026-10-21',
    title: '完善开发工作流',
    groups: [{
      platform: 'Skills',
      changes: [
        '实施前展示 Issue、任务范围与下一步。',
        '明确本地提交即完结任务，同步更新 Issue、交付记录与工作台。',
        '精简提交收尾，避免重复验证、调查和确认。',
      ],
    }],
  },
  {
    id: 'telegram-web-download',
    date: '2026-10-21',
    title: '新增 Telegram Web Download',
    groups: [{
      platform: 'Extension',
      changes: [
        '支持 Telegram Web 图片、视频右键另存为。',
        'Newtab Settings 中提供开关，默认开启。',
        '统一全局 Toast 规范，支持主题同步与多条提示折叠。',
      ],
      links: [
        { label: 'exts-chrome.zip · 1.3.0', href: 'https://github.com/linguio/exts/releases/download/v1.3.0/exts-chrome.zip' },
      ],
    }],
  },
  {
    id: 'website-quick-start',
    date: '2026-10-20',
    title: '新增快速开始',
    groups: [{
      platform: 'Website',
      changes: [
        '新增快速开始，介绍浏览器扩展与 macOS 应用的安装及首次打开授权。',
        '新增 Skills 产品说明分类，介绍开发工作流 Skill 的用途与源码入口。',
      ],
    }],
  },
  {
    id: 'development-workflow-skills',
    date: '2026-10-20',
    title: '推出开发工作流 Skills',
    groups: [{
      platform: 'Skills',
      changes: [
        '新增 workflow-change，管理开发任务范围、交付记录、验收与本地提交。',
        '新增 workflow-observer，观察并记录开发习惯，通过复盘总结改进方向，优化自己的工作流。',
      ],
      links: [
        { label: 'workflow-change · 查看源码', href: 'https://github.com/linguio/exts/tree/main/skills/workflow-change' },
        { label: 'workflow-observer · 查看源码', href: 'https://github.com/linguio/exts/tree/main/skills/workflow-observer' },
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
      links: [{ label: 'exts-chrome.zip · 1.1.0', href: 'https://github.com/linguio/exts/releases/download/v1.1.0/exts-chrome.zip' }],
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
      links: [{ label: 'exts-chrome.zip · 1.0.0', href: 'https://github.com/linguio/exts/releases/download/v1.0.0/exts-chrome.zip' }],
    }],
  },
];
