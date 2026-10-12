# Changelog

## 1.0.0

- Validate and preserve the last successful unpacked WXT development output.
- Synchronize incremental disk builds before forwarding WXT reload notifications.
- Keep the previous output on validation or replacement failures, with diagnostic backup paths.
- Reject overlapping source and target directories; expose ESM and TypeScript declarations.

This is the initial public release. Tested with WXT 0.21.4 and Node.js 24.16.0.
