/**
 * Tag names of replaced elements that axe might flag
 */
const BG_REPLACED_ELEMENT_TAGS = ['IMG', 'VIDEO', 'OBJECT', 'AUDIO', 'SOURCE'];

const BG_REPLACED_ELEMENT_TAG_PATTERN = new RegExp(
  BG_REPLACED_ELEMENT_TAGS.join('|'),
  'i'
);

/**
 * Mapping of elements with specific "type" attributes that
 * might signal bg replaced
 */
const BG_REPLACED_ELEMENT_TYPE_PATTERNS = {
  INPUT: new RegExp('range|radio', 'i'),
};

/**
 * Determines whether or not a given element is a variant of a
 * replaced element that will have its background replaced (that is,
 * making it unavailable to style with CSS)
 *
 * @param element {HTMLElement}
 * @see: https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element
 */
export default function isBackgroundReplacedElement({ tagName, type }) {
  return !!(
    BG_REPLACED_ELEMENT_TAG_PATTERN.test(tagName) ||
    (BG_REPLACED_ELEMENT_TYPE_PATTERNS[tagName] &&
      BG_REPLACED_ELEMENT_TYPE_PATTERNS[tagName].test(type))
  );
}
