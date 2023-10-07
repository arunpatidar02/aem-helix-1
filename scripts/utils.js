import DOMUtils from './DOMUtils.js';

function getColumnFromRow(row, number) {
  return row?.children[number];
}

function getRow(block, number) {
  return [...block.children][number];
}

function getColumnTextContentFromRow(row, number) {
  return DOMUtils.getTextContent(getColumnFromRow(row, number));
}

export default {
  getColumnFromRow,
  getColumnTextContentFromRow,
  getRow,
};
