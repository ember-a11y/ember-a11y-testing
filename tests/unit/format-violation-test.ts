import { Result } from 'axe-core';
import { module, test } from 'qunit';
import formatViolation from 'ember-a11y-testing/test-support/format-violation';

module('Unit | Utils | formatViolation', function () {
  test('formats a well-formed violation and relevant html', function (assert) {
    let violation: Result = {
      id: 'test',
      impact: 'critical',
      help: 'it should be better',
      helpUrl: 'http://example.com',
      description: '',
      tags: [],
      nodes: [
        {
          target: ['.some-class'],
          html: '<input type="text">',
          any: [],
          all: [],
          none: [],
        },
      ],
    };

    let message = formatViolation(violation, [violation.nodes[0].html]);
    let expected = `[critical]: it should be better \nViolated 1 time. Offending nodes are: \n<input type="text">\nhttp://example.com`;
    assert.strictEqual(message, expected);
  });

  test('formats a well-formed violation', function (assert) {
    let violation: Result = {
      id: 'test',
      impact: 'critical',
      help: 'it should be better',
      helpUrl: 'http://example.com',
      description: '',
      tags: [],
      nodes: [],
    };

    let message = formatViolation(violation, []);
    let expected = `[critical]: it should be better \nViolated 1 time.\nhttp://example.com`;
    assert.strictEqual(message, expected);
  });

  test('validates violation parameter structure', function (assert) {
    let violation: Result = {
      id: 'test',
      help: 'it should be better',
      helpUrl: 'http://example.com',
      description: '',
      tags: [],
      nodes: [
        {
          target: ['.some-class'],
          html: '<input type="text">',
          any: [],
          all: [],
          none: [],
        },
      ],
    };

    let expected =
      /formatViolation called with improper structure of parameter: violation. Required properties: impact, help, helpUrl./;

    assert.throws(function () {
      formatViolation(violation, [violation.nodes[0].html]);
    }, expected);
  });
});
