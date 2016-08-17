/* jshint node:true */
'use strict';

var bower = require('bower');
var assert = require('assert');
var readFileSync = require('fs').readFileSync;

bower.commands.list().on('end', function(packageInfo) {
	var axeVersionFromAddon = packageInfo.dependencies['axe-core'].endpoint.target;
	var blueprintContent = readFileSync('blueprints/ember-a11y-testing/index.js', 'UTF-8');

	assert.ok(
		blueprintContent.indexOf(axeVersionFromAddon) !== -1,
		"The axe-core version in blueprint and the one in the addons' bower.json should be the same"
	);

});
