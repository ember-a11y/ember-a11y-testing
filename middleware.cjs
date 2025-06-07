'use strict';

const path = require('node:path');
const fs = require('node:fs');

/**
 * @typedef {Object} MiddlewareOptions
 * @property {string} [root=process.cwd()] - Root directory for report output.
 * @property {string} [reportDir='ember-a11y-report'] - Directory name for reports (relative to root).
 * @property {string} [urlPath='/report-violations'] - URL path the middleware listens on.
 */

/**
 * Sets up Express middleware that receives a11y violation reports via POST
 * and writes them to timestamped JSON files on disk.
 *
 * @param {import('express').Application} app - The Express application (provided by Testem or your test server).
 * @param {MiddlewareOptions} [options]
 *
 * @example
 * // testem.js
 * const { setupMiddleware } = require('ember-a11y-testing/middleware');
 *
 * module.exports = {
 *   // …other config
 *   middleware: [
 *     function (app) {
 *       setupMiddleware(app);
 *     },
 *   ],
 * };
 */
function setupMiddleware(app, options = {}) {
  const {
    root = process.cwd(),
    reportDir = 'ember-a11y-report',
    urlPath = '/report-violations',
  } = options;

  const normalizedUrl = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  const outputDir = path.resolve(root, reportDir);

  app.post(normalizedUrl, (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
        const outputPath = path.join(outputDir, `${timestamp}.json`);

        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ outputPath }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  });
}

module.exports = { setupMiddleware };
