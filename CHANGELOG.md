# Changelog

## [1.1.0] - 2026-09-20

### Fixed

- Unsubscribing twice no longer removes another listener. Listeners added or removed during dispatch no longer disrupt delivery of the current event.

### Changed

- Handlers receive the general DOM Event type. Narrow the event before accessing mouse, touch, or keyboard fields.
- Event lists and hook dependencies accept readonly arrays, and direct subscriptions expose their cleanup function in TypeScript.
- Declare the existing React Hooks requirement as React >=16.8.0.
