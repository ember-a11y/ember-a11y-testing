import { module, test } from 'qunit';
import formatViolation from 'ember-a11y-testing/utils/format-violation';

module('Unit | Utils | formatViolation', {
});

test('formats a well-formed violation and relevant html', function(assert) {
  let violation = {
    name: 'test',
    impact: 'critical',
    help: 'it should be better',
    helpUrl: 'http://example.com',
    nodes: [
      {
        target: ['.some-class'],
        html: '<input type="text">'
      }
    ]
  };

  let message = formatViolation(violation, violation.nodes[0].html);
  let expected = `[critical]: it should be better \nOffending markup is: \n <input type="text">\nhttp://example.com`;
  assert.equal(message, expected);
});

test('formats a well-formed violation', function(assert) {
  let violation = {
    name: 'test',
    impact: 'critical',
    help: 'it should be better',
    helpUrl: 'http://example.com'
  };

  let message = formatViolation(violation);
  let expected = `[critical]: it should be better \nhttp://example.com`;
  assert.equal(message, expected);
});

test('validates violation parameter structure', function(assert) {
  let violation = {
    name: 'test',
    nodes: [
      {
        target: ['.some-class'],
        html: '<input type="text">'
      }
    ]
  };

  let expected = /formatViolation called with improper structure of parameter: violation. Required properties: impact, help, helpUrl./;

  assert.throws(
    function() {
      formatViolation(violation, violation.nodes[0].html);
    },
    expected
  );
});

test('validates violation parameter exists', function(assert) {
  let expected = /formatViolation called without required parameter: violation/;

  assert.throws(
    function() {
      formatViolation();
    },
    expected
  );
});
