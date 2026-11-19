# @linguio/wxt-stable-output

[English](./README.en.md) · [源码](https://github.com/linguio/exts/tree/main/packages/wxt-stable-output) · [npm](https://www.npmjs.com/package/@linguio/wxt-stable-output)

为 WXT 开发模式保留稳定的扩展加载目录，适用于 Chrome 和 Edge。

WXT 重建时，临时输出可能被清空或尚未完整生成，浏览器此时加载扩展可能失败。本包让浏览器使用上一份通过校验的成功产物，减少重建期间因文件缺失导致的加载问题。

## 主要能力

- 构建成功且校验通过后更新稳定目录。
- 构建失败时保留上一份可用产物。
- 在 WXT 发出重载通知前同步增量磁盘产物。

## 使用要求

WXT **0.21.4**、Node.js **24.16.0**。开发时仍需运行 WXT 开发服务器。

## 安装

```sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.2
```

## 相关文档

[使用说明](https://github.com/linguio/exts/blob/main/docs/packages/wxt-stable-output.md) · [更新记录](./CHANGELOG.md)

## 许可

[MIT](./LICENSE)
