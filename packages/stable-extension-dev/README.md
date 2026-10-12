# @linguio/wxt-stable-output

[中文说明](./README.zh-CN.md)

Keep a validated, last-successful unpacked extension directory during WXT development.

WXT clears its working output on a full startup or restart. Loading that directory directly in Chrome/Edge can expose missing extension files during rebuilding. This package publishes complete builds to a separate stable directory and preserves the previous build if validation or replacement fails.

Ordinary page HMR is still provided by WXT/Vite. This package does not make it faster or keep dev-server-dependent pages working while the server is unavailable.

## Compatibility

The initial release is tested with **WXT 0.21.4**, **Node.js 24.16.0**, and Chrome/Edge unpacked extensions. WXT is an exact peer dependency because reload synchronization depends on its lifecycle. Other versions and browsers are not claimed as supported.

## Installation

~~~sh
npm install --save-dev --save-exact @linguio/wxt-stable-output@1.0.0 wxt@0.21.4
~~~

~~~ts
import { defineConfig } from 'wxt';
import { createStableDevelopmentHooks } from '@linguio/wxt-stable-output';

export default defineConfig({
  hooks: {
    ...createStableDevelopmentHooks(),
  },
});
~~~

Run your existing development command. After the first successful build, load **.output/chrome-mv3-dev-stable** using Load unpacked in Chrome or Edge. With a custom outDir, the default stable target is its resolved development output directory plus -stable.

Keep the dev server running: development HTML can load scripts/styles from localhost. Production builds do not publish a stable copy.

## Updates

- Full successful builds publish through build:done.
- Incremental disk builds update server.currentOutput; the package publishes before forwarding WXT's extension/page/content-script reload notification.
- Vite module HMR continues unchanged without copying the full extension on every edit.
- Missing output, invalid Manifest, copying or replacement failure prevents publication. Incremental errors are logged and that reload is suppressed; later success can recover.

The integration wraps reloadExtension, reloadPage and reloadContentScript. Arguments, context and void returns are preserved. Notifications can be delayed until publication finishes. Closing/restarting invalidates queued notifications. Avoid replacing these methods yourself after registration.

## Options

~~~ts
createStableDevelopmentHooks({ suffix: '-browser' });
createStableDevelopmentHooks({ targetDir: '/absolute/path/to/stable-extension' });
~~~

The default suffix is -stable. A custom target overrides the suffix-derived path. Source and target must not be the same or contain each other. Use separate targets for different browser/manifest configurations and one WXT process per target.

Spread **all** hooks. When overriding build:done, delegate to the original:

~~~ts
const stable = createStableDevelopmentHooks();
export default defineConfig({
  hooks: {
    ...stable,
    'build:done': async (wxt, output) => {
      await stable['build:done'](wxt, output);
    },
  },
});
~~~

## Direct publisher

~~~ts
import { publishStableBuild } from '@linguio/wxt-stable-output';

const result = await publishStableBuild({
  sourceDir: '/absolute/path/to/complete-build',
  targetDir: '/absolute/path/to/stable-extension',
  requiredFiles: ['background.js'],
});
~~~

manifest.json is always required. Additional paths must be relative files inside the source, without .. segments. The result contains targetDir and optional backupDir when old-output cleanup fails. StableDevelopmentError includes a filesystem code when available.

## Guarantees and limits

The publisher validates source and staging output, then replaces the stable directory using a sibling backup. Installation failure triggers attempted restoration; failure to restore reports the backup location.

This is **not an uninterrupted atomic directory exchange**: the target briefly disappears between renames. Validation checks Manifest fields and reported file existence, not code correctness. Concurrent source writes are not a guaranteed byte-for-byte snapshot. Run one WXT process per target. The package does not eliminate browser context invalidation or dependencies on the dev server.

## Development

~~~sh
pnpm --filter @linguio/wxt-stable-output test
pnpm --filter @linguio/wxt-stable-output typecheck
pnpm --filter @linguio/wxt-stable-output verify:integration
~~~

The integration check installs an actual tarball into an isolated consumer and reuses locally installed exact-version WXT/Node type peers. It checks public types and real WXT startup, incremental background rebuilding, failure preservation, recovery and restart without opening a browser. Browser acceptance is manual.

This monorepo uses a local workspace dependency; npm publication does not change it. The package version is independent of the application version.

MIT. See [LICENSE](./LICENSE) and [CHANGELOG](./CHANGELOG.md).
