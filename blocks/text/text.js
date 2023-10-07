import utils from '../../scripts/utils.js';

/**
 * loads and decorates the text
 * @param {Element} block The text block element
 */
export default async function decorate(block) {
  const cssClassName = 'hlx-text-content';

  // getting text and style rows
  const textRow = utils.getRow(block, 0);
  const styleRow = utils.getRow(block, 1);

  // getting text and style values
  const style = utils.getColumnTextContentFromRow(styleRow, 1);
  const text = utils.getColumnFromRow(textRow, 1);

  // clear the default rendering
  utils.clearBlock(block);

  // Decorate the text element with appropriate class names
  const classNames = [cssClassName];
  if (style) {
    classNames.push(`${cssClassName}-${style}`);
  }
  text.className = classNames.join(' ');

  // append text element
  block.append(text);
}
