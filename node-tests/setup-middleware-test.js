const QUnit = require('qunit');
const fs = require('fs');
const tmp = require('tmp');
const express = require('express');
const readJSONSync = require('fs-extra').readJSONSync;
const {
  setupMiddleware,
} = require('@scalvert/ember-setup-middleware-reporter');
const violationsFixture = require('./fixtures/violations');

function createTmpDir() {
  return fs.realpathSync(tmp.dirSync({ unsafeCleanup: true }).name);
}

function buildResult(axeResults) {
  let { module, testName } = QUnit.config.current;

  return {
    moduleName: module.name,
    testName,
    helperName: 'visit',
    stack: 'STACK',
    axeResults,
  };
}

QUnit.module('setupMiddleware', function (hooks) {
  let tmpDir;
  let app;
  let server;
  let port;

  hooks.beforeEach(async function () {
    tmpDir = createTmpDir();
    app = express();

    setupMiddleware(app, {
      root: tmpDir,
      name: 'ember-a11y-testing',
      urlPath: 'report-violations',
      reportDir: 'ember-a11y-report',
    });
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let { default: getPort } = await import('get-port');

    port = await getPort({ port: 3000 });
    server = app.listen(port);
  });

  hooks.afterEach(function () {
    server.close();
  });

  QUnit.test(
    'can respond to requests to report violations',
    async function (assert) {
      let data = [buildResult(violationsFixture)];
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      let { default: fetch } = await import('node-fetch');

      let json = await fetch(`http://localhost:${port}/report-violations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      assert.deepEqual(readJSONSync(json.outputPath), data);
    }
  );
});
