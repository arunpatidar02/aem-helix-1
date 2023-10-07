import utils from '../../scripts/utils.js';

/**
 * loads and decorates the text
 * @param {Element} block The text block element
 */
export default async function decorate(block) {
  // getting text and style rowsnpm install eslint --save-dev
  const textRow = utils.getRow(block, 0);
  const styleRow = utils.getRow(block, 1);
  const cssClassName = 'hlx-text-content';

  // getting text and style values
  const style = utils.getColumnTextContentFromRow(styleRow, 1);
  const text = utils.getColumnFromRow(textRow, 1);

  // clear the default rendering
  utils.clearBlock(block);

  // decorates text element
  text.className = `${cssClassName}${style ? ` ${cssClassName}-${style}` : ''}`;

  // append text element
  block.append(text);
}
