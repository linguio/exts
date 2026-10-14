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
    id: 'wxt-stable-output-first-release',
    date: '2026-10-14',
    title: 'WXT 稳定产物工具首次发布',
    groups: [{
      platform: 'Packages',
      changes: [
        '公开发布 wxt-stable-output，为 WXT 开发提供稳定的扩展加载目录',
        '构建成功时同步产物，校验或替换失败时保留上一份成功产物',
      ],
      links: [{ label: '查看 npm 包', href: 'https://www.npmjs.com/package/@linguio/wxt-stable-output/v/1.0.0' }],
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
