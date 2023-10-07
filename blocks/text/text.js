import utils from '../../scripts/utils.js';
import DOMUtils from '../../scripts/DOMUtils.js';

export function getTextDOM(block, rows) {
  const cssClassName = 'hlx-text-content';

  // getting text and style rows
  const textRow = utils.getRow(block, rows[0]);
  const styleRow = utils.getRow(block, rows[1]);

  // getting text and style values
  const style = utils.getColumnTextContentFromRow(styleRow, 1);
  const text = utils.getColumnFromRow(textRow, 1);

  // Decorate the text element with appropriate class names
  const classNames = [cssClassName];
  if (style) {
    classNames.push(`${cssClassName}-${style}`);
  }
  text.className = classNames.join(' ');

  return text;
}

/**
 * loads and decorates the text
 * @param {Element} block The text block element
 */
export default async function decorate(block) {
  const contentRows = [0, 1];
  const ele = getTextDOM(block, contentRows);

  // clear the default rendering and append a text
  DOMUtils.clearAndAppend(block, ele);
}
