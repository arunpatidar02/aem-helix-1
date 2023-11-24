/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved
import { PLUGIN_EVENTS } from 'https://www.hlx.live/tools/sidekick/library/events/events.js';
import UTILS from './utils.js';

const CONST = {
  PLUGIN_TITLE: 'tags_advance',
  NO_TAG_MSG: 'No tags selected',
  NO_DATA: 'Tag sheet is not configured',
  COPIED_MSG: 'Copied Tags',
  TRUE: 'true',
  FALSE: 'false',
  ARIA_CHECKED: 'aria-checked',
  ACTIVE: 'active',
  EXPANDED: 'expanded',
  CONTAINER: 'container',
  COLUMN_ITEM: 'column-item',
  TAG_ITEM: 'tag-item',
  ICON_ITEM: 'icon-item',
};

const SELECTOR = {
  CATEGORY: '.category',
  SEARCH_TAG_COLUMN: '.search-result-column',
  DIV: 'div',
  UL: 'ul',
  LI: 'li',
  IMG: 'img',
  SPAN: 'span',
  P: 'p',
  SELECTED_LABEL: '.selectedLabel',
  TAG_ITEM: `.${CONST.TAG_ITEM}`,
  COLUMN: '.column',
  SUBCATEGORY: '.subcategory',
  COPY_ACTION: '.copy-action',
  ACTIVE_ITEM: 'li.active',
};

let selectedTags = [];

/**
 * Generates a label indicating the number of selected tags.
 *
 * @returns {string} - The generated label HTML.
 */
function getSelectedLabel() {
  const tagCount = selectedTags.length;
  return tagCount > 0 ? `<span>${tagCount}</span> tag${tagCount !== 1 ? 's' : ''} selected` : CONST.NO_TAG_MSG;
}

/**
 * Decorates the container with tag-related functionality based on provided data.
 *
 * @param {HTMLElement} container - The container element to decorate.
 * @param {Object} data - The data object containing tag information.
 * @param {string} query - The search query string.
 */
export async function decorate(container, data, query) {
  if (!data) {
    // eslint-disable-next-line no-console
    console.warn(CONST.NO_DATA);
    return;
  }

  const dataObj = UTILS.getJsonObject(data);

  /**
   * Creates the tag list in the column based on the search query.
   */
  const createColumnList = () => {
    if (query) {
      createSearchItems();
    } else {
      createNavigation(null, container.querySelector(SELECTOR.CATEGORY));
    }
  };

  /**
   * Creates search items in the search result column based on the filtered tags.
   */
  const createSearchItems = () => {
    const srConatiner = container.querySelector(SELECTOR.SEARCH_TAG_COLUMN);
    const filteredTags = UTILS.getFilteredTags(dataObj, query);

    const fragment = new DocumentFragment();
    const list = document.createElement(SELECTOR.UL);
    fragment.appendChild(list);
    filteredTags.forEach((key) => {
      createTagItem(key, list, false);
    });
    srConatiner?.appendChild(fragment);
  };

  /**
   * Handles the click event on a tag item in the column.
   * Toggles the selection status and updates the UI.
   *
   * @param {Event} e - The click event object.
   */
  const handleColumnItemClick = (e) => {
    const ele = e.target.closest(SELECTOR.P);
    const { value } = ele;
    const selected = ele.ariaChecked === CONST.TRUE;

    if (selected) {
      selectedTags.splice(selectedTags.indexOf(value), 1);
    } else {
      selectedTags.push(value);
    }
    ele.ariaChecked = selected ? CONST.FALSE : CONST.TRUE;

    changeSelectionLabel();
  };

  /**
   * Updates the selected tags label in the UI.
   */
  const changeSelectionLabel = () => {
    const selectedLabel = container.querySelector(SELECTOR.SELECTED_LABEL);
    selectedLabel.innerHTML = getSelectedLabel(selectedTags);
  };

  /**
   * Handles the click event on the copy button.
   * Copies the selected tags to the clipboard and triggers a toast message.
   */
  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(selectedTags.join(', '));
    container.dispatchEvent(
      new CustomEvent(PLUGIN_EVENTS.TOAST, {
        detail: { message: CONST.COPIED_MSG },
      }),
    );
  };

  /**
   * Handles the expansion/collapse of the menu column.
   *
   * @param {HTMLElement} element - The element representing the expansion control.
   */
  function handleMenuExpand(element) {
    element.addEventListener('click', () => {
      selectedTags = [];
      const { parentElement } = element;
      const isActive = parentElement.classList.contains(CONST.ACTIVE);
      const parentKey = parentElement.querySelector(SELECTOR.TAG_ITEM).value.trim();
      const curColEle = parentElement.closest(SELECTOR.COLUMN);
      const curColNum = Number(curColEle.dataset.col);
      const nextColEle = container.querySelector(`${SELECTOR.SUBCATEGORY}[data-col="${curColNum + 1}"]`);

      if (isActive) {
        UTILS.removeColumnContent(nextColEle);
      } else {
        collapsePreviousColumns(curColNum);
        createNavigation(parentKey, nextColEle);
        curColEle.classList.add(CONST.EXPANDED);
        UTILS.removeClass(container.querySelector(`${SELECTOR.COLUMN}[data-col="${curColNum}"] ${SELECTOR.ACTIVE_ITEM}`), CONST.ACTIVE);
      }
      uncheckActiveItems();
      parentElement.classList.toggle(CONST.ACTIVE);
    });

    /**
     * Collapses previous columns up to the specified column number.
     *
     * @param {number} currentColumn - The current column number.
     */
    function collapsePreviousColumns(currentColumn) {
      for (let i = 5; i > currentColumn; i--) {
        const colEle = container.querySelector(`${SELECTOR.SUBCATEGORY}[data-col="${i}"]`);
        UTILS.removeColumnContent(colEle);
      }
    }

    /**
     * Unchecks active items in the UI.
     */
    function uncheckActiveItems() {
      const checkedItems = container.querySelectorAll(`${SELECTOR.TAG_ITEM}[aria-checked="${CONST.TRUE}"]`);
      checkedItems.forEach((item) => {
        item.ariaChecked = CONST.FALSE;
      });
    }
  }

  /**
   * Creates the navigation column based on the provided parent key and parent element.
   *
   * @param {string} parentKey - The parent key for navigation.
   * @param {HTMLElement} parentElement - The parent element to append the navigation column.
   */
  function createNavigation(parentKey, parentElement) {
    selectedTags = [];
    const fragment = new DocumentFragment();
    const list = document.createElement(SELECTOR.UL);
    fragment.appendChild(list);
    const elementJson = parentKey ? UTILS.findObjectByKey(dataObj, parentKey) : dataObj;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in elementJson) {
      const obj = elementJson[key];
      const objKeys = Object.keys(obj);
      createTagItem(key, list, objKeys.length > 0);
    }
    parentElement?.appendChild(fragment);
  }

  /**
   * Creates a tag item and appends it to the specified list.
   *
   * @param {string} tag - The tag value.
   * @param {HTMLElement} list - The list element to append the tag item.
   * @param {boolean} isObject - Indicates if the tag represents an object.
   */
  function createTagItem(tag, list, isObject) {
    const isSelected = selectedTags.includes(tag);

    const listItem = document.createElement(SELECTOR.LI);
    listItem.className = CONST.COLUMN_ITEM;

    const tagItem = document.createElement(SELECTOR.P);
    tagItem.className = CONST.TAG_ITEM;
    tagItem.setAttribute(CONST.ARIA_CHECKED, isSelected ? CONST.TRUE : CONST.FALSE);
    tagItem.value = tag;

    const tagItemElements = `
    <img class="icon-img tag" src="/tools/sidekick/plugins/tags-advance/icons/tag.png">
    <img class="icon-img tag-fill" src="/tools/sidekick/plugins/tags-advance/icons/tag-filled.png">
    <span value="${tag}">${tag}</span>
    <img class="icon-img checked" src="/tools/sidekick/plugins/tags-advance/icons/checked.png">
`;

    tagItem.innerHTML = tagItemElements;
    listItem.appendChild(tagItem);
    tagItem.addEventListener('click', handleColumnItemClick);

    if (isObject) {
      const iconItem = document.createElement(SELECTOR.P);
      iconItem.className = CONST.ICON_ITEM;

      const icon = document.createElement(SELECTOR.IMG);
      icon.className = 'icon-img right-chevron';
      icon.src = '/tools/sidekick/plugins/tags-advance/icons/right-chevron.png';

      iconItem.appendChild(icon);
      listItem.appendChild(iconItem);
      handleMenuExpand(iconItem);
    }

    list.appendChild(listItem);
  }

  // HTML template for the container
  let sp = `
  <div class="footer">
      <span class="selectedLabel">${getSelectedLabel(selectedTags)}</span>
      <p class="copy-action">
        <span>Copy</span>
        <img class="icon-img copy" src="/tools/sidekick/plugins/tags-advance/icons/copy.png">
      </p>
    </div>
    <sp-divider size="s"></sp-divider>`;
  if (query) {
    sp += '<div class="search-result-column"></div>';
  } else {
    sp += `
    <div class="menu-columns">
      <div class="column category" data-col=0></div>
      <div class="column subcategory" data-col=1></div>
      <div class="column subcategory" data-col=2></div>
      <div class="column subcategory" data-col=3></div>
      <div class="column subcategory" data-col=4></div>
      <div class="column subcategory" data-col=5></div>
    </div>`;
  }

  // Create and append the container element
  const spContainer = document.createElement(SELECTOR.DIV);
  spContainer.classList.add(CONST.CONTAINER);
  spContainer.innerHTML = sp;
  container.append(spContainer);

  // Initialize the column list and update the selected label
  createColumnList();
  changeSelectionLabel();

  // Attach click event to the copy button
  const copyButton = spContainer.querySelector(SELECTOR.COPY_ACTION);
  copyButton.addEventListener('click', handleCopyButtonClick);
}

// Export metadata for the module
export default {
  title: CONST.PLUGIN_TITLE,
  searchEnabled: true,
};
