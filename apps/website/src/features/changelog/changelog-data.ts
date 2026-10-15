export type ChangelogPlatform = 'Website' | 'Chrome' | 'macOS' | 'Packages';

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

// 日期取实际发布或代码交付时间并转换为北京时间，不使用补录日期。
export const changelogEntries: readonly ChangelogEntry[] = [
  {
    id: 'website-content-layout',
    date: '2026-10-15',
    title: '完善官网内容与布局',
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
    title: '发布 WXT 稳定构建产物工具',
    groups: [{
      platform: 'Packages',
      changes: [
        '转发 WXT 重载通知前，先同步最新构建产物到稳定加载目录。',
        '校验或目录替换失败时，保留最后一次成功的产物，并提供错误信息供排查。',
      ],
      links: [{ label: '@linguio/wxt-stable-output · 1.0.0', href: 'https://www.npmjs.com/package/@linguio/wxt-stable-output/v/1.0.0' }],
    }],
  },
  {
    id: 'website-launch',
    date: '2026-10-12',
    title: '产品官网上线',
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
    title: 'Chrome 插件首次发布',
    groups: [{
      platform: 'Chrome',
      changes: [
      '新标签页：集中展示常用网站',
      '标签组：按分组打开并组织网页',
      '书签与 Dock：快速访问常用网站和工具',
      ],
    }],
  },
];
