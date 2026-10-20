# Exts

将想法与能力延伸为实用工具。

Exts 是按个人习惯打造的工具集合，包含浏览器扩展、macOS 桌面应用、产品官网、开发工具包与 AI 开发 Skill。本仓库使用 Monorepo 组织源码，共用品牌资源和产品版本入口。

[产品官网](https://exts.linguio.dev/) · [产品介绍与快速开始](https://exts.linguio.dev/features/) · [更新日志](https://exts.linguio.dev/changelog/) · [GitHub Releases](https://github.com/linguio/exts/releases)

## 模块介绍

| 模块 | 说明 | 文档 |
| --- | --- | --- |
| Extension | 面向 Chrome 和 Edge 的浏览器扩展，按模块集成日常浏览所需的工具。 | [模块文档](docs/extension/README.md) · [开发入口](apps/extension/README.md) |
| Desktop | 基于 Swift 与 SwiftUI 的 macOS 原生应用，承载需要本机与设备能力的桌面工具。 | [模块文档](docs/desktop/README.md) · [开发入口](apps/desktop/README.md) |
| Website | 对外展示 Exts 的产品官网，提供产品信息与相关资源入口。 | [模块文档](docs/website/README.md) · [开发入口](apps/website/README.md) |
| Packages | 面向开发场景的可复用工具包，以及服务仓库的内部工具。 | [工具包文档](packages/wxt-stable-output/README.zh-CN.md) |
| Skills | 可复用的 AI 开发流程与协作方法，配合代理和项目规范使用。 | [本地变更工作流](skills/workflow-change/SKILL.md) · [开发工作流观察](skills/workflow-observer/SKILL.md) |

桌面当前为 Apple Silicon（arm64），需要 macOS 27.0 或更新版本，未提供 Intel 或旧版 macOS 安装包。各模块的具体功能和使用方式见对应文档。

## 快速开始

### 浏览器扩展

1. [下载 exts-chrome.zip](https://github.com/linguio/exts/releases/latest/download/exts-chrome.zip)，解压到固定文件夹。
2. 在 Chrome 地址栏输入 `chrome://extensions`，打开“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择解压后的文件夹，完成加载。

安装后保留该文件夹并保持开发者模式开启。Edge 可在扩展管理页使用相同的开发者模式加载流程；这不是浏览器商店安装包。

### macOS 应用

1. [下载 exts-mac.dmg](https://github.com/linguio/exts/releases/latest/download/exts-mac.dmg)，双击打开。
2. 将 Exts 拖入“应用程序”，复制完成后从应用程序目录启动。
3. 应用未进行 Apple 公证。首次打开需要手动允许时，先尝试启动，再进入“系统设置 → 隐私与安全性”，按系统提示选择“仍要打开”。

两个下载入口指向 GitHub 最新公开 Release 的同名附件；草稿不属于公开下载，缺少附件时入口可能不可用。

### 开发 Skill

Skill 源码位于 `skills/`，需要先接入所用代理的 Skill 发现目录，再通过 `$workflow-change` 或 `$workflow-observer` 调用。可将两个目录分别链接到本机用户的 `.agents/skills/`，保持仓库唯一源稿；克隆仓库本身不等于已安装或生效。适用范围与调用规则见各 Skill 文档。

## 本地开发

使用 Node.js **24.16.0** 和 pnpm **12.4.2**，在根目录安装依赖：

```sh
pnpm install --frozen-lockfile
```

| 应用 | 开发 | 构建 |
| --- | --- | --- |
| 官网 | `pnpm web:dev` | `pnpm web:build` |
| 浏览器扩展 | `pnpm ext:dev` | `pnpm ext:build` |
| macOS 桌面 | `pnpm desk:dev` | `pnpm desk:build` |

桌面开发需要 macOS 27.0、Xcode 27.0.0 与 XcodeGen 2.46.0。Windows 可独立开发和构建官网、扩展；根 `pnpm build` 与 `pnpm release` 仅支持 macOS。

- 扩展开发在浏览器中加载 `dist/dev/chrome-mv3-dev-stable/`，不要加载构建时会被清空的临时目录。
- `pnpm desk:dev` 生成并打开 `dist/dev/exts-dev.app`；正式应用为 `dist/build/exts.app`。数据位置与开发环境隔离规则见[桌面开发文档](apps/desktop/README.md)。
- 官网正式产物为 `dist/build/exts-web/`，扩展正式产物为 `dist/build/chrome-mv3/`，构建缓存集中到根 `dist/.cache/`。

根 `pnpm build` 串行构建官网、扩展和桌面；`pnpm release` 构建并生成 `dist/release/exts-chrome.zip` 与 `dist/release/exts-mac.dmg`，不自动公开发布。扩展与桌面共用根 `package.json` 的产品版本，每次 Release 同时包含两个安装包。完整命令、产物、版本及 Actions 说明见[构建与分发规范](docs/build-release.md)。

## 目录与文档

```text
exts/
├─ .github/                     # GitHub Actions 构建与发布流程
├─ apps/                        # 应用源码
│  ├─ extension/                # 浏览器扩展
│  ├─ desktop/                  # macOS 原生应用
│  └─ website/                  # 产品官网
├─ packages/                    # 开发工具包与内部复用工具
├─ skills/                      # AI 开发流程与协作技能
├─ docs/                        # 功能、设计及开发文档
├─ scripts/                     # 根版本、构建与打包入口
├─ assets/                      # 共享品牌资源
└─ dist/                        # 本地产物和缓存，不纳入 Git
```

- [扩展文档](docs/extension/README.md)、[桌面文档](docs/desktop/README.md)、[官网文档](docs/website/README.md)
- [构建与分发](docs/build-release.md)
- [品牌资源](assets/brand/README.md)
- [历史归档](archive/README.md)
- [MIT License](LICENSE)
