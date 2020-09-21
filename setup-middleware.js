'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const path = require('path');
const date = require('date-and-time');
const { ensureDirSync, writeJsonSync, emptyDirSync } = require('fs-extra');

let outputDir;

function reportViolations(req, res) {
  const REPORT_TIMESTAMP = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
  let outputPath = path.resolve(
    path.join(outputDir, `${REPORT_TIMESTAMP}.json`)
  );

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
  outputDir = path.join(options.root, 'ember-a11y-report');

  ensureDirSync(outputDir);
  emptyDirSync(outputDir);

  app.post(
    '/report-violations',
    bodyParser,
    (req, res) => {
      reportViolations(req, res);
    },
    logError
  );
}

module.exports = setupMiddleware;
