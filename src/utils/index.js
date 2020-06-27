/**
 * @param {string} markdown
 * @returns {string}
 */
export function insertMentionLinks(markdown) {
  return markdown.replace(
    /\B(@([a-zA-Z0-9](-?[a-zA-Z0-9_])+))/g,
    `**[$1](https://github.com/$2)**`,
  );
}

/**
 * @param {string} [text='']
 * @param {number} [maxLength=140]
 * @returns {string}
 */
export function shorten(text = '', maxLength = 140) {
  // Normalize newlines.
  const cleanText = text.replace(/\\r\\n/g, '\n');

  // Return if short enough already.
  if (cleanText.length <= maxLength) return cleanText;

  const ellip = '...';

  // Return the 140 chars as-is if they end in a non-word char.
  const oneTooLarge = cleanText.substr(0, 141);

  if (/\W$/.test(oneTooLarge)) return oneTooLarge.substr(0, 140) + ellip;

  let i = oneTooLarge.length;

  // eslint-disable-next-line no-plusplus
  while (--i) {
    if (/\W/.test(oneTooLarge[i])) return oneTooLarge.substr(0, i) + ellip;
  }

  return oneTooLarge.substr(0, 140) + ellip;
}
