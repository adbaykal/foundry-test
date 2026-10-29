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

async function withServer(fn) {
  const server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test('GET /health returns ok', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/health`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'application/json');
    assert.equal(await res.text(), '{"ok":true}');
  }));

test('GET /health ignores the query string', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/health?probe=1`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), '{"ok":true}');
  }));

test('POST /health is not found', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/health`, { method: 'POST' });
    assert.equal(res.status, 404);
    assert.equal(await res.text(), '{"error":"not found"}');
  }));

test('GET /health/ (trailing slash) is not found', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/health/`);
    assert.equal(res.status, 404);
  }));
