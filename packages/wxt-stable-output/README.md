# @linguio/wxt-stable-output

[中文](./README.zh-CN.md)

Keep a stable unpacked extension directory during WXT development. Successful builds update it; failed builds leave the previous output in place.

Supports WXT **0.21.4**, Node.js **24.16.0**, and Chrome/Edge.

## Quick start

```sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.0 wxt@0.21.4
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

[MIT](./LICENSE) · [Changelog](./CHANGELOG.md)
