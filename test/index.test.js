import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../index.js';

test('GET / returns the greeting', async () => {
  const server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'hello from foundry-test\n');
  } finally {
    server.close();
  }
});

test('GET /health returns ok', async () => {
  const server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'application/json');
    assert.equal(await res.text(), '{"ok":true}');
  } finally {
    server.close();
  }
});
