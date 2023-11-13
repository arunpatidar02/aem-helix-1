import DOMUtils from '../../scripts/DOMUtils.js';
import utils from '../../scripts/utils.js';

/**
 * Loads and decorates the text and image elements based on image position.
 * @param {Element} block - The text and image block element.
 */
export default async function decorate(block) {
  const classNames = [
    'stage-background',
    'stage-top-headline',
    'stage-headline',
    'stage-description',
    'button',
    'stage-bottom-text',
  ];

  for (let i = 0; i < classNames.length; i += 1) {
    const row = utils.getRow(block, i);
    const column = utils.getColumnFromRow(row, 1);

    // Remove the first column (column 0)
    utils.getColumnFromRow(row, 0).remove();

    column.className = classNames[i];
    if (classNames[i] === 'stage-background') {
      const imgEle = column.querySelector('img');
      const stageWrapperEle = block.parentNode;
      if (!imgEle) {
        const color = DOMUtils.getTextContent(column);
        stageWrapperEle.style.backgroundColor = color;
        stageWrapperEle.classList.add('color-banner');
      }
    }
  }
}
