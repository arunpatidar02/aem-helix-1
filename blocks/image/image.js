import utils from '../../scripts/utils.js';
import DOMUtils from '../../scripts/DOMUtils.js';

export function getPictureDOM(block, rows) {
  const cssClassName = 'hlx-image-content';

  // Get image, mobile image, and alt text rows
  const imgRow = utils.getRow(block, rows[0]);
  const mobileImgRow = utils.getRow(block, rows[1]);
  const altTextImgRow = utils.getRow(block, rows[2]);

  // Get alt text
  const altText = utils.getColumnTextContentFromRow(altTextImgRow, 1);

  // Get image div and apply the CSS class
  const imgDiv = utils.getColumnFromRow(imgRow, 1);
  imgDiv.className = cssClassName;

  // Find the picture element within the image div
  const pictureElement = imgDiv.querySelector('picture');

  // Find the img element within the picture element and set alt text
  const imgElement = pictureElement?.querySelector('img');
  if (imgElement) {
    imgElement.alt = altText;
    imgElement.removeAttribute('width');
    imgElement.removeAttribute('height');
  }

  // Get mobile image div
  const mobileImgDiv = utils.getColumnFromRow(mobileImgRow, 1);

  // Find all source elements with 'media' attribute
  const mobileSourceElements = mobileImgDiv?.querySelectorAll('source[media]');

  // Update 'media' attribute for mobile source elements
  mobileSourceElements.forEach((sourceElement) => {
    sourceElement.media = '(max-width: 480px)';
    pictureElement.insertBefore(sourceElement, pictureElement.firstChild);
  });

  return imgDiv;
}

/**
 * loads and decorates the text
 * @param {Element} block The text block element
 */
export default async function decorate(block) {
  const contentRows = [0, 1, 2];
  const ele = getPictureDOM(block, contentRows);
  // clear the default rendering and append a text
  DOMUtils.clearAndAppend(block, ele);
}
