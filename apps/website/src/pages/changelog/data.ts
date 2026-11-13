export type ChangelogPlatform = 'Website' | 'Extension' | 'Desktop' | 'API' | 'Packages' | 'Build' | 'Skills';

type ChangelogEntry = {
  id: string;
  date: string;
  title: string;
  groups: readonly {
    platform: ChangelogPlatform;
    changes: readonly string[];
  }[];
};

// 日期取公开发布或用户明确批准的交付日期，统一为北京时间。
export const changelogEntries: readonly ChangelogEntry[] = [
  {
    id: 'flip-clock-studio-v230',
    date: '2026-11-13',
    title: '新增翻页时钟与倒计时，优化 Studio 使用体验',
    groups: [{
      platform: 'Extension',
      changes: [
        '新增翻页时钟与倒计时，支持拖动设置时长、切换计时音与完成音，以及分别关闭声音。',
        '优化 Daily 表格滚动、固定表头与操作列，统一加载和空状态展示。',
        '完善 Studio 登录页面与导航，支持恢复当前账号上次访问的页面。',
        '主题保存时显示加载状态，防止重复操作。',
      ],
    }],
  },
  {
    id: 'activity-editing-workflow-v220',
    date: '2026-11-10',
    title: '完善 Activity 编辑与开发工作流',
    groups: [{
      platform: 'Extension',
      changes: ['优化表格编辑组件与右侧 Sheet 表单。'],
    }, {
      platform: 'API',
      changes: ['新增 Activity 日记录更新接口。'],
    }, {
      platform: 'Skills',
      changes: [],
    }],
  },
  {
    id: 'daily-activity-query-v210',
    date: '2026-11-09',
    title: '新增 Daily 活动记录查询',
    groups: [{
      platform: 'Extension',
      changes: [
        '在 Studio 中查看每日活动记录，支持日期范围查询。',
        '支持分页、每页条数、页码跳转、单列及多字段排序。',
        '统一查询、重置、列显隐与加载反馈，完善失败重试体验。',
      ],
    }, {
      platform: 'API',
      changes: [],
    }],
  },
  {
    id: 'settings-studio-experience',
    date: '2026-11-08',
    title: '完善设置同步与 Studio 体验',
    groups: [{
      platform: 'Extension',
      changes: [
        '支持登录后同步云端设置，未登录时使用本机设置。',
        '完善退出与重新登录时的状态清理，避免旧数据和请求影响当前账号。',
        '优化 Studio 登录提示与活动入口，支持恢复本机上次使用的 Home／Studio 视图。',
      ],
    }, {
      platform: 'API',
      changes: [],
    }],
  },
  {
    id: 'architecture-workflow-v200',
    date: '2026-11-05',
    title: '优化扩展架构与开发流程',
    groups: [
      {
        platform: 'Extension',
        changes: ['重构扩展整体架构，按页面、业务功能与公共组件组织代码。'],
      },
      {
        platform: 'Skills',
        changes: ['新增 workflow-tests Skill，按变更影响范围选择检查、复用验证结果，避免重复验证。'],
      },
      {
        platform: 'Build',
        changes: ['优化部署与发布流程，版本变化时自动生成 Release 草稿。'],
      },
    ],
  },
  {
    id: 'account-login-v190',
    date: '2026-11-04',
    title: '完善账户登录与状态提示',
    groups: [{
      platform: 'Extension',
      changes: [
        '配置并接入 GitHub、Google 登录。',
        '在 Studio 与 Newtab 增加账户登录入口。',
        '支持查看账户资料与退出登录，并完善登录状态提示。',
      ],
    }],
  },
  {
    id: 'studio-activity-v180',
    date: '2026-11-02',
    title: '新增 Studio 布局与登录入口',
    groups: [
      {
        platform: 'Extension',
        changes: [
          '支持侧栏折叠与返回首页，提供独立的工作空间。',
          '提供账户登录弹窗与 GitHub、Google 登录选项。',
        ],
      },
      {
        platform: 'Build',
        changes: [
          '支持统一启动官网、扩展、桌面端与 API，在独立终端窗口中查看各任务日志。',
        ],
      },
    ],
  },
  {
    id: 'api-docs-auto-deploy',
    date: '2026-10-31',
    title: '新增 API 服务与接口文档',
    groups: [
      {
        platform: 'API',
        changes: [
          '上线 API 服务，支持自动部署。',
          '新增交互式接口文档，支持在线查看与调试。',
        ],
      },
      {
        platform: 'Website',
        changes: [
          '官网新增接口文档入口，并支持自动部署。',
          '产品介绍新增 API 分类，集中说明服务架构与使用方式。',
        ],
      },
    ],
  },
  {
    id: 'folders-media-download-settings',
    date: '2026-10-28',
    title: '优化文件夹、下载与设置体验',
    groups: [{
      platform: 'Extension',
      changes: [
        '优化文件夹查看、解锁与滚动体验。',
        '整合并优化 Media Download 与下载记录，预留 X 下载扩展。',
        '整合并优化 Settings，统一全局状态图标与操作反馈。',
      ],
    }],
  },
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
      },
      {
        platform: 'Extension',
        changes: [
          '新增 Newtab 书签，调整常用入口。',
          '优化 Newtab 与设置页面的样式布局。',
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
    }],
  },
];
