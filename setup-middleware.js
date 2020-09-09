'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const path = require('path');
const date = require('date-and-time');
const { ensureDirSync, writeJsonSync } = require('fs-extra');

function reportViolations(req, res, options) {
  const REPORT_TIMESTAMP = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
  let outputDir = path.join(options.root, 'ember-a11y-report');
  let outputPath = path.resolve(
    path.join(outputDir, `${REPORT_TIMESTAMP}.json`)
  );

  ensureDirSync(outputDir);
  writeJsonSync(outputPath, req.body);

  res.send({
    outputPath,
  });
}

function logError(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function setupMiddleware(app, options) {
  app.post(
    '/report-violations',
    bodyParser,
    (req, res) => {
      reportViolations(req, res, options);
    },
    logError
  );
}

module.exports = setupMiddleware;
