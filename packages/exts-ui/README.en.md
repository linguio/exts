# @linguio/exts-ui

[中文](./README.md)

[Source](https://github.com/linguio/exts/tree/main/packages/exts-ui) · [npm](https://www.npmjs.com/package/@linguio/exts-ui)

Foundational components from pinned shadcn/ui sources and reusable Exts enhancements. Foundation components retain their official names. Enhanced components compose copying, sound and overlay behavior; business data and permissions stay in the application.

## Requirements

- React and React DOM **19.3.0**, supplied by the consumer as exact peer dependencies.
- A build environment supporting ESM, React and CSS imports.
- Browser Web Audio support for notification sounds, subject to autoplay policies.

Tailwind is a package build tool. Consumers do not need to install Tailwind or scan package sources to use the compiled stylesheet.

## Quick start

Install the exact version after its release has been approved on npm. See the [Changelog](./CHANGELOG.md) for changes.

```sh
npm install --save-exact @linguio/exts-ui@0.2.0 react@19.3.0 react-dom@19.3.0
```

Import the stylesheet in your application entry point and mount the notification host:

```tsx
import '@linguio/exts-ui/styles.css';
import { Button } from '@linguio/exts-ui/ui/button';
import { ExtsToaster, toast } from '@linguio/exts-ui/plus/toast';

export function Application() {
  return (
    <ExtsToaster soundEnabled={false}>
      <Button onClick={() => toast.add({ type: 'error', title: 'Save failed' })}>
        Show notification
      </Button>
    </ExtsToaster>
  );
}
```

## Public entry points

| Entry point | Purpose |
| --- | --- |
| `@linguio/exts-ui/ui/button` | shadcn foundation button |
| `@linguio/exts-ui/ui/tooltip` | shadcn foundation tooltip |
| `@linguio/exts-ui/ui/toast` | shadcn foundation Toast |
| `@linguio/exts-ui/plus/toast` | ExtsToaster, toast, createToastManager, useExtsToastSound |
| `@linguio/exts-ui/styles.css` | Compiled stylesheet |

`ui/*` contains foundations; `plus/*` composes enhancements. Enhanced React components use the Exts prefix. Pinned upstream sources and adaptations are recorded in [SOURCES](./SOURCES.md).

## Notifications, copying and sound

- Applications provide notification types, titles and descriptions through `toast.add`. `ExtsToaster` copies the full message without rewriting business text.
- Sound is off by default. When enabled, only new error notifications play a sound, throttled to once per second without queuing or replaying previous notifications. Applications store preferences; the package does not read Chrome APIs, permissions or business state.
- Call `useExtsToastSound()` inside `ExtsToaster` for `preview()`, `setEnabled()`, `subscribe()` and `getStatus()`. Status is idle, ready, paused or unavailable. Browser audio policies still apply.
- The default `toast` and `ExtsToaster` share the official manager. Independent roots can pass an instance from `createToastManager()` and send notifications to that instance. Avoid mounting multiple hosts for the same manager within one document.
- `portalContainer` accepts an HTMLElement or ShadowRoot. Shadow DOM consumers must inject the stylesheet into that Shadow DOM and provide a container with the appropriate theme variables.

## Styles and layering

Import `styles.css` explicitly. Components use shadcn semantic variables such as `--background`, `--foreground`, `--popover`, `--border` and `--accent`, with basic fallbacks. Fonts inherit from the host; the package does not bundle fonts or a global reset.

Toast defaults to `--exts-z-toast: 80`; its copy Tooltip uses that value plus one. Consumers may override the variable on their root theme or Shadow host to match their Sheet and Dialog layers. This does not guarantee priority over arbitrary third-party overlays or the browser's native top layer. Verify close, copy and modal combinations in a real browser.

## Local development and distribution

The repository uses an exact Workspace reference. Extension dev/build commands build this package first. Component logic is consumed from local sources; rebuild after stylesheet or utility changes. There is no separate long-running watch process.

```sh
pnpm --filter @linguio/exts-ui build
pnpm --filter @linguio/exts-ui verify:npm
```

Build outputs ESM, declarations and CSS to the repository's `dist/build/npm/exts-ui`. verify:npm runs type checks, logic tests, builds and independent consumption of a real tarball sequentially. The package has an independent version and a single Chinese CHANGELOG.

NPM Publish detects package version changes on pushes to main, verifies the package and uploads it to npm staging. Maintainers manually approve the final release. Manual retries remain available; the workflow does not use OIDC or create additional Git tags or GitHub Releases.

[MIT](./LICENSE) · [Third-party licenses](./THIRD_PARTY_NOTICES.md) · [Changelog](./CHANGELOG.md)
