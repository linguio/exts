export type ChangelogPlatform = 'Website' | 'Chrome' | 'macOS';

type ChangelogEntry = {
  id: string;
  date: string;
  title: string;
  groups: readonly {
    platform: ChangelogPlatform;
    changes: readonly string[];
  }[];
};

// 日期按对应代码交付的 Git 提交时间转换为北京时间。
export const changelogEntries: readonly ChangelogEntry[] = [
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
