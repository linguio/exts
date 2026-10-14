# @linguio/wxt-stable-output

[中文](./README.zh-CN.md)

[Source](https://github.com/linguio/exts/tree/main/packages/wxt-stable-output) · [npm](https://www.npmjs.com/package/@linguio/wxt-stable-output)

Keep a stable unpacked extension directory during WXT development. WXT's temporary output can be cleared or incomplete during a rebuild. If Chrome or Edge loads that directory directly, reloading the extension or opening a new tab during this window may fail because the Manifest or page resources are missing. A failed build can also leave the temporary directory unusable.

Load the stable directory instead: successful, validated builds update it; failed builds preserve the last successful output. Incremental disk builds are synchronized before reload notifications. This protects the on-disk output; it does not fix code errors or replace WXT/Vite's development server.

## Requirements

- WXT **0.21.4** is declared in `peerDependencies` and must be available in the consuming project.
- Node.js **24.16.0** is declared in `engines`.
- The extension loading workflow targets Chrome and Edge.

The package's `devDependencies` are tools for maintaining and testing this package. They do not replace the consumer requirements above.

## Quick start

```sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.1 wxt@0.21.4
```

Add the hooks to `wxt.config.ts`:

```ts
import { defineConfig } from 'wxt';
import { createStableDevelopmentHooks } from '@linguio/wxt-stable-output';

export default defineConfig({
  hooks: {
    ...createStableDevelopmentHooks(),
  },
});
```

Run your usual WXT development command. After the first successful build, load `.output/chrome-mv3-dev-stable` as an unpacked extension. With a custom `outDir`, the stable directory defaults to the resolved development output path plus `-stable`.

Full and incremental disk builds update the stable directory before WXT sends reload notifications. Page HMR continues through WXT/Vite. Production builds do not create a stable copy.

## Options

```ts
createStableDevelopmentHooks({ suffix: '-stable' });
createStableDevelopmentHooks({ targetDir: '/absolute/path/to/stable-extension' });
```

- `suffix`: directory suffix; defaults to `-stable`.
- `targetDir`: custom stable directory; overrides the suffix-derived path.

Spread all returned hooks. If you override a hook, call the original as well. Do not replace WXT's `reloadExtension`, `reloadPage`, or `reloadContentScript` methods after registration.

## Publish a build directly

```ts
import { publishStableBuild } from '@linguio/wxt-stable-output';

await publishStableBuild({
  sourceDir: '/absolute/path/to/build',
  targetDir: '/absolute/path/to/stable-extension',
  requiredFiles: ['background.js'],
});
```

`manifest.json` is always required. Additional required paths must be relative files within the source directory, without `..` segments. The result contains `targetDir` and an optional `backupDir` if backup cleanup fails. `StableDevelopmentError.code` provides the filesystem error code when available.

## Limits

- Keep the development server running; pages may depend on localhost resources.
- Use one WXT process per target. Source and target directories must not overlap.
- Directory replacement has a brief gap between renames. On failure, restoration is attempted; if it fails, the error reports the backup path.
- Validation checks Manifest fields and file existence, not code correctness. Concurrent source writes are not a guaranteed snapshot.

[MIT](./LICENSE) · [更新记录](./CHANGELOG.md)
