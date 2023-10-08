import utils from '../../scripts/utils.js';
import DOMUtils from '../../scripts/DOMUtils.js';
import { adaptToText } from '../text/text.js';
import { adaptToImage } from '../image/image.js';

/**
 * Loads and decorates the text and image elements based on image position.
 * @param {Element} block - The text and image block element.
 */
export default async function decorate(block) {
  const textRows = [0, 1];
  const imageRows = [2, 3, 4];

  // Get text and image elements
  const textEle = adaptToText(block, textRows);
  const imageEle = adaptToImage(block, imageRows);

  // Get the image position
  const imagePositionRow = utils.getRow(block, 5);
  const imgPos = utils.getColumnTextContentFromRow(imagePositionRow, 1);

  DOMUtils.clearBlock(block);

  // Determine the order based on image position
  if (imgPos?.toLowerCase() === 'left') {
    block.append(imageEle, textEle);
  } else {
    block.append(textEle, imageEle);
  }
}
