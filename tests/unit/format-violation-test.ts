import { module, test } from 'qunit';
import formatViolation from '#src/test-support/format-violation';

import type { Result } from 'axe-core';

module('Unit | Utils | formatViolation', function () {
  test('formats a well-formed violation and relevant html', function (assert) {
    const violation: Result = {
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

    const message = formatViolation(violation, [
      violation.nodes[0]?.html ?? '',
    ]);
    const expected = `[critical]: it should be better \nViolated 1 time. Offending nodes are: \n<input type="text">\nhttp://example.com`;
    assert.strictEqual(message, expected);
  });

  test('formats a well-formed violation', function (assert) {
    const violation: Result = {
      id: 'test',
      impact: 'critical',
      help: 'it should be better',
      helpUrl: 'http://example.com',
      description: '',
      tags: [],
      nodes: [],
    };

    const message = formatViolation(violation, []);
    const expected = `[critical]: it should be better \nViolated 1 time.\nhttp://example.com`;
    assert.strictEqual(message, expected);
  });

  test('validates violation parameter structure', function (assert) {
    const violation: Result = {
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

    const expected =
      /formatViolation called with improper structure of parameter: violation. Required properties: impact, help, helpUrl./;

    assert.throws(function () {
      formatViolation(violation, [violation.nodes[0]?.html ?? '']);
    }, expected);
  });
});
