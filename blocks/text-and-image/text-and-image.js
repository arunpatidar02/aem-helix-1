import utils from '../../scripts/utils.js';
import DOMUtils from '../../scripts/DOMUtils.js';
import { getTextDOM } from '../text/text.js';
import { getPictureDOM } from '../image/image.js';

/**
 * loads and decorates the text
 * @param {Element} block The text block element
 */
export default async function decorate(block) {
  const textRows = [0, 1];
  const imageRows = [2, 3, 4];

  const textEle = getTextDOM(block, textRows);
  const imageEle = getPictureDOM(block, imageRows);

  const imagePositionRow = utils.getRow(block, 5);

  // getting text and style values
  const imgPos = utils.getColumnTextContentFromRow(imagePositionRow, 1);

  DOMUtils.clearBlock(block);

  if (imgPos?.toLowerCase() === 'left') {
    block.append(imageEle);
    block.append(textEle);
  } else {
    block.append(textEle);
    block.append(imageEle);
  }
}
