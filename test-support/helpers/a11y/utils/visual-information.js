const PARENS_REGEX = /\(([^)]+)\)/;

/**
 * Reference: http://www.w3.org/TR/WCAG20/#contrast-ratiodef
 * @param {Number} l1 - Relative luminance of the lighter color
 * @param {Number} l2 - Relative luminance of the darker color
 * @return {Number} - Has a range of [1, 21]
 */
function contrastRatio(l1, l2) {
  let lighter = Math.max(l1, l2);
  let darker = Math.min(l1, l2);

  let numerator = lighter + 0.05;
  let denominator = darker + 0.05;

  return numerator / denominator;
}

/**
 * Compute the relative luminance of a color given it's normalized RGB values
 * Reference: http://www.w3.org/TR/WCAG20/relative-luminance.xml
 * @param {Array}
 * @return {Number}
 */
function relativeLuminance([r, g, b]) {
  let rn = r <= 0.03928 ? r / 12.92 : Math.pow(((r + 0.055)/1.055), 2.4);
  let gn = g <= 0.03928 ? g / 12.92 : Math.pow(((g + 0.055)/1.055), 2.4);
  let bn = b <= 0.03928 ? b / 12.92 : Math.pow(((b + 0.055)/1.055), 2.4);

  let rs = 0.2126 * rn;
  let gs = 0.7152 * gn;
  let bs = 0.0722 * bn;

  return rs + gs + bs;
}

/**
 * Normalize an array of RGB values into a scale of [0, 1]
 * @param {Array}
 * @return {Array}
 */
function normalizeColor([r, g, b]) {
  let rn = r / 255;
  let gn = g / 255;
  let bn = b / 255;

  return [rn, gn, bn];
}

/**
 * Converts an rgb() or rgba() color value into an array of RGB(A)
 * @param {String} color
 * @return {Array}
 */
export function extractRGB(color) {
  return color.match(PARENS_REGEX)[1].split(', ');
}

/**
 * Makes sure the contrast ratio for two colors is above a certain threshold
 * @param {String} color
 * @return {Array}
 */
export function checkContrastThreshold(color1, color2, threshold) {
  let normalC1 = normalizeColor(color1);
  let normalC2 = normalizeColor(color2);

  let l1 = relativeLuminance(normalC1);
  let l2 = relativeLuminance(normalC2);

  let ratio = contrastRatio(l1, l2);

  return ratio > threshold;
}
