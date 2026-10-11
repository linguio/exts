export type ChangelogPlatform = 'Website' | 'Chrome' | 'macOS';

type ChangelogEntry = {
  id: string;
  date: string;
  title: string;
  platforms: readonly ChangelogPlatform[];
  changes: readonly string[];
};

// 日期按对应代码交付的 Git 提交时间转换为北京时间，同日按提交先后倒序。
export const changelogEntries: readonly ChangelogEntry[] = [
  {
    id: 'website-launch',
    date: '2026-10-11',
    title: '产品官网上线',
    platforms: ['Website'],
    changes: [
      '在 exts.linguio.dev 了解 Exts。',
      '提供统一的产品下载入口。',
    ],
  },
  {
    id: 'latest-downloads',
    date: '2026-10-11',
    title: '下载链接保持最新',
    platforms: ['Website', 'Chrome'],
    changes: [
      '下载入口随最新正式发布更新，不再绑定某个版本。',
      'Chrome 安装包统一命名为 exts-chrome.zip。',
    ],
  },
  {
    id: 'first-release',
    date: '2026-10-10',
    title: 'Exts 首个正式版本',
    platforms: ['Chrome'],
    changes: [
      '新标签页与书签管理。',
      'Dock 与标签组。',
      '提供 Chrome 扩展安装包下载。',
    ],
  },
];
