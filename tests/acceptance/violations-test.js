import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import sinon from 'sinon';

/*
 * Violation selectors reported by axe in its violations results
 * 🔊 NOTE: These are deliberatly sorted A-Z, as haven't yet figured out
 * where axes gets its ordering from (it doesn't appear to be DOM order)
 */
const VIOLATION_SELECTORS = [
  "#violations__empty-button",
  "#violations__img-without-alt",
  "#violations__labeless-input",
  "#violations__low-contrast-text",
  "#violations__non-standard-html > blink",
  "#violations__radio-group-items--strawberries"
];


let actual, expected, sandbox;

moduleForAcceptance('Acceptance | violations', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('marking DOM nodes with violations', function(assert) {

  sandbox.stub(axe.ember, 'a11yCheckCallback', function (results) {
    expected = VIOLATION_SELECTORS.length;
    actual = results.violations.length;

    assert.equal(actual, expected);

    expected = VIOLATION_SELECTORS;
    actual = results
      .violations
      .map(violation => violation.nodes)
      .map(node => node[0].target[0])
      .sort((a, b) => {
        // descending (A-Z) order (NOTE: We need explicit numeric returns here to please Phantom (https://github.com/ariya/phantomjs/issues/11090)
        if (a < b) { return -1; }
        else if (a > b) { return 1; }

        return 0;
      });

    assert.deepEqual(actual, expected);
  });

  visit('/');

});
