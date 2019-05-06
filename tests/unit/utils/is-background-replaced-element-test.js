import isBackgroundReplacedElement from 'ember-a11y-testing/utils/is-background-replaced-element';
import { module, test } from 'qunit';

const BACKGROUND_REPLACED_ELEMENTS = [
  { tagName: 'VIDEO' },
  { tagName: 'AUDIO' },
  { tagName: 'OBJECT' },
  { tagName: 'SOURCE' },
  { tagName: 'IMG' },
  { tagName: 'INPUT', type: 'radio' },
  { tagName: 'INPUT', type: 'range' }
];

const STANDARD_ELEMENTS = [
  { tagName: 'DIV' },
  { tagName: 'LI' },
  { tagName: 'A' },
  { tagName: 'INPUT', type: 'text' },
  { tagName: 'INPUT', type: 'number' }
];

function makeMessage({ tagName, type }, expected) {
  return `Element with tagName "${tagName}" ${type ? `with type "${type}" ` : ''}evaluates to ${expected}`;
}

module('Unit | Utility | is replaced element', function() {
  test(`it determines whether or not an HTMLElement is of the variety that will have its background content be unstylable`, function(assert) {
    let expected;
    let actual;
    let message;

    BACKGROUND_REPLACED_ELEMENTS.forEach(element => {
      expected = true;
      actual = isBackgroundReplacedElement(element);
      message = makeMessage(element, expected);

      assert.equal(actual, expected, message);
    });

    STANDARD_ELEMENTS.forEach(element => {
      expected = false;
      actual = isBackgroundReplacedElement(element);
      message = makeMessage(element, expected);

      assert.equal(actual, expected, message);
    });
  });
});
