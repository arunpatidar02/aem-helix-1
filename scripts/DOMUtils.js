function getTextContent(node) {
  return node?.textContent;
}

function clearBlock(block) {
  block.innerHTML = '';
}

function clearAndAppend(block, node) {
  clearBlock(block);
  block.append(node);
}

export default {
  getTextContent,
  clearBlock,
  clearAndAppend,
};
