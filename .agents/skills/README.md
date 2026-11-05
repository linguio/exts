# Skills

这里收录可以被 AI 直接使用或继续组合的技能说明与配套资源。

## 目录职责

- `.agents/skills/` 面向 AI 协作能力，不是 npm 包目录。
- 每个具体 Skill 通常以独立目录维护，入口文件为 `SKILL.md`。
- Skill 可以包含示例、脚本和模板等配套资源，但应保持与具体工作场景直接相关。
- 只有在一个 Skill 已经形成稳定、可复用的能力边界后，才新增独立目录；不要为了占位创建空 Skill。

## 与其他目录的区别

- `apps/`：可以直接运行或交付给用户的应用，包括浏览器扩展和原生 Helper。
- `packages/`：可以被 Node.js 项目安装和复用的 npm 包。
- `.agents/skills/`：指导 AI 如何完成特定任务的技能与资源。
- `docs/`：仓库自身的项目管理、架构和开发文档。

官网通过 [Skills 产品介绍](https://exts.linguio.dev/features/#skills) 展示这些技能；这里直接维护真实源码，同时作为仓库级 Skill 发现目录，不再另设根 skills 目录或符号链接。
