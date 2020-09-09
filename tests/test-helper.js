import QUnit from 'qunit';
import Application from 'dummy/app';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { printResults } from 'ember-a11y-testing/test-support';

setApplication(Application.create(config.APP));

QUnit.done(function () {
  printResults();
});

start();
