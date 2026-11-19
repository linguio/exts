# @linguio/wxt-stable-output

[中文](./README.md) · [Source](https://github.com/linguio/exts/tree/main/packages/wxt-stable-output) · [npm](https://www.npmjs.com/package/@linguio/wxt-stable-output)

Keeps a stable unpacked extension directory during WXT development for Chrome and Edge.

WXT's temporary output may be cleared or incomplete during a rebuild, causing extension loading to fail. This package lets the browser use the last validated successful output, reducing loading failures caused by missing files during rebuilds.

## Features

- Updates the stable directory only after a successful, validated build.
- Preserves the previous usable output when a build fails.
- Synchronizes incremental disk output before WXT sends reload notifications.

## Requirements

WXT **0.21.4** and Node.js **24.16.0**. Keep the WXT development server running during development.

## Installation

```sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.2
```

## Documentation

[Usage guide](https://github.com/linguio/exts/blob/main/docs/packages/wxt-stable-output.en.md) · [Changelog](./CHANGELOG.md)

## License

[MIT](./LICENSE)
