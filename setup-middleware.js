'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const writeJsonSync = require('fs-extra').writeJSONSync;
const path = require('path');
const date = require('date-and-time');

function reportViolations(req, res, options) {
  const REPORT_TIMESTAMP = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
  let outputPath = path.resolve(
    path.join(options.root, 'ember-a11y-report', `${REPORT_TIMESTAMP}.json`)
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
