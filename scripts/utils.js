function getColumnFromRow(row, number) {
  return row?.children[number];
}

function getRow(block, number) {
  return [...block.children][number];
}

function getColumnTextContent(col) {
  return col?.textContent;
}

function getColumnTextContentFromRow(row, number) {
  return getColumnTextContent(getColumnFromRow(row, number));
}

function clearBlock(block) {
  block.innerHTML = '';
}

export default {
  getColumnTextContent,
  getColumnFromRow,
  getColumnTextContentFromRow,
  getRow,
  clearBlock,
};
