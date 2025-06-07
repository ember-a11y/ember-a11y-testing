import { module, test } from 'qunit';
import { setupTest } from '#tests/helpers';
import { _calculateUpdatedHref } from '#src/test-support/should-force-audit';

module('Query parameter normalization', function (hooks) {
  setupTest(hooks);

  const baseUrl = 'https://www.example.com';

  const paramPermutations = [
    {
      label: 'Enable with no params',
      input: '/some/path',
      enabled: true,
      expected: '/some/path?enableA11yAudit',
    },
    {
      label: 'Disable with no other params',
      input: '/some/path?enableA11yAudit',
      enabled: false,
      expected: '/some/path',
    },
    {
      label: 'Enable with multiple params',
      input: '/some/path?foo=123&bar&baz',
      enabled: true,
      expected: '/some/path?foo=123&bar&baz&enableA11yAudit',
    },
    {
      label: 'Disable with multiple params',
      input: '/some/path?foo=123&bar&baz&enableA11yAudit',
      enabled: false,
      expected: '/some/path?foo=123&bar&baz',
    },
    {
      label: 'Already enabled, enabling noops',
      input: '/some/path?foo=123&bar&baz&enableA11yAudit',
      enabled: true,
      expected: '/some/path?foo=123&bar&baz&enableA11yAudit',
    },
    {
      label: 'Already enabled, enabling normalizes',
      input: '/some/path?foo=123&bar&baz&enableA11yAudit=',
      enabled: true,
      expected: '/some/path?foo=123&bar&baz&enableA11yAudit',
    },
    {
      label: 'Disable when not normalized',
      input: '/some/path?foo=123&bar&baz&enableA11yAudit=',
      enabled: false,
      expected: '/some/path?foo=123&bar&baz',
    },
    {
      label: 'Does not normalize unknown params',
      input: '/some/path?foo=&bar=&baz&enableA11yAudit=',
      enabled: true,
      expected: '/some/path?foo=&bar=&baz&enableA11yAudit',
    },
    {
      label: 'Normalize as first param',
      input: '/some/path?enableA11yAudit=&foo&bar=',
      enabled: true,
      expected: '/some/path?enableA11yAudit&foo&bar=',
    },
    {
      label: 'Disable as first param',
      input: '/some/path?enableA11yAudit=&foo&bar=',
      enabled: false,
      expected: '/some/path?foo&bar=',
    },
    {
      label: 'Not found, disabling is noop',
      input: '/some/path?foo=123&bar&baz=',
      enabled: false,
      expected: '/some/path?foo=123&bar&baz=',
    },
  ];

  paramPermutations.forEach(function ({ label, input, enabled, expected }) {
    test(`_calculateUpdatedHref ${label}`, function (assert) {
      const url = `${baseUrl}${input}`;
      const expectedHref = `${baseUrl}${expected}`;
      const href = _calculateUpdatedHref(url, baseUrl, enabled);

      assert.strictEqual(
        href,
        expectedHref,
        `_calculateUpdatedHref( ${url}, ${baseUrl}, ${enabled} ) -> ${href}`,
      );
    });
  });
});
