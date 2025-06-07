import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { Readable } from 'node:stream';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { setupMiddleware } = require('../middleware.cjs');

/**
 * Creates a minimal Express-like app shim that records registered POST routes.
 */
function createApp() {
  const routes = new Map();
  return {
    post(urlPath, handler) {
      routes.set(urlPath, handler);
    },
    _routes: routes,
  };
}

/**
 * Simulates a POST request to a registered route handler.
 */
function simulatePost(handler, body) {
  return new Promise((resolve) => {
    const fakeReq = new Readable();
    fakeReq._read = () => {};

    const fakeRes = {
      statusCode: null,
      headers: {},
      body: null,
      writeHead(status, headers) {
        this.statusCode = status;
        this.headers = headers;
      },
      end(data) {
        this.body = data;
        resolve(this);
      },
    };

    handler(fakeReq, fakeRes);
    fakeReq.push(typeof body === 'string' ? body : JSON.stringify(body));
    fakeReq.push(null);
  });
}

describe('middleware', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'a11y-middleware-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('registers a POST route at /report-violations by default', () => {
    const app = createApp();
    setupMiddleware(app, { root: tmpDir });
    assert.ok(app._routes.has('/report-violations'));
  });

  it('registers a POST route at a custom urlPath', () => {
    const app = createApp();
    setupMiddleware(app, { root: tmpDir, urlPath: '/custom-path' });
    assert.ok(app._routes.has('/custom-path'));
  });

  it('normalizes urlPath without leading slash', () => {
    const app = createApp();
    setupMiddleware(app, { root: tmpDir, urlPath: 'no-slash' });
    assert.ok(app._routes.has('/no-slash'));
  });

  it('writes violations to a JSON file and responds with 200', async () => {
    const app = createApp();
    setupMiddleware(app, { root: tmpDir });

    const testData = [
      {
        moduleName: 'Acceptance | index',
        violations: [{ id: 'color-contrast', impact: 'serious' }],
      },
    ];

    const handler = app._routes.get('/report-violations');
    const res = await simulatePost(handler, testData);

    assert.equal(res.statusCode, 200);

    const result = JSON.parse(res.body);
    assert.ok(result.outputPath);
    assert.ok(fs.existsSync(result.outputPath));

    const written = JSON.parse(fs.readFileSync(result.outputPath, 'utf8'));
    assert.deepEqual(written, testData);
  });

  it('uses a custom reportDir', async () => {
    const app = createApp();
    setupMiddleware(app, { root: tmpDir, reportDir: 'custom-reports' });

    const handler = app._routes.get('/report-violations');
    const res = await simulatePost(handler, [{ test: true }]);

    const result = JSON.parse(res.body);
    assert.ok(result.outputPath.includes('custom-reports'));
  });

  it('creates the report directory if it does not exist', async () => {
    const reportDir = 'nested/deep/reports';
    const app = createApp();
    setupMiddleware(app, { root: tmpDir, reportDir });

    const handler = app._routes.get('/report-violations');
    await simulatePost(handler, []);

    assert.ok(
      fs.existsSync(path.join(tmpDir, reportDir)),
      'nested report directory should be created',
    );
  });

  it('responds with 500 on invalid JSON', async () => {
    const app = createApp();
    setupMiddleware(app, { root: tmpDir });

    const handler = app._routes.get('/report-violations');
    const res = await simulatePost(handler, 'not-valid-json{{{');

    assert.equal(res.statusCode, 500);
    const result = JSON.parse(res.body);
    assert.ok(result.error);
  });

  it('uses default options when none are provided', () => {
    const app = createApp();
    setupMiddleware(app);
    assert.ok(app._routes.has('/report-violations'));
  });
});
