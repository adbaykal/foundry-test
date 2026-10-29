# foundry-test

Tiny Node HTTP service used as the sample project for the Foundry end-to-end run.

- `npm start` runs the server on `PORT` (default 3000).
- `npm test` runs the tests with `node --test`.
- `GET /health` returns `{"ok":true}` (liveness check).
