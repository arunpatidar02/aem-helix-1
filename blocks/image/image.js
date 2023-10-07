import utils from '../../scripts/utils.js';

/**
 * loads and decorates the text
 * @param {Element} block The text block element
 */
export default async function decorate(block) {
  const cssClassName = 'hlx-image-content';

  // Get image, mobile image, and alt text rows
  const imgRow = utils.getRow(block, 0);
  const mobileImgRow = utils.getRow(block, 1);
  const altTextImgRow = utils.getRow(block, 2);

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

  // Clear the default rendering inside the block
  utils.clearBlock(block);

  // Append the decorated image div back to the block
  block.append(imgDiv);
}
