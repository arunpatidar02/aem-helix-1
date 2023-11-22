/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved
import { PLUGIN_EVENTS } from 'https://www.hlx.live/tools/sidekick/library/events/events.js';
import UTILS from './utils.js';

let selectedTags = [];

export async function decorate(container, data, query) {
  if (!data) {
    // eslint-disable-next-line no-console
    console.warn('Tag sheet is not configured');
    return;
  }

  const dataObj = UTILS.getJsonObject(data);

  const createSearchItems = () => {
    const srConatiner = container.querySelector('.search-result-column');
    const filteredTags = UTILS.getFilteredTags(dataObj, query);

    const spMenu = document.createElement('ul');
    srConatiner?.appendChild(spMenu);

    filteredTags.forEach((key) => {
      const isSelected = selectedTags.includes(key);
      const spMenuItem = document.createElement('li');
      spMenuItem.className = 'column-item';
      const tagItem = document.createElement('p');
      tagItem.className = 'tag-item';
      tagItem.ariaChecked = isSelected ? 'true' : 'false';
      tagItem.value = key;
      const tagItemElements = `
      <img class="icon-img tag" src="/tools/sidekick/plugins/tags2/icons/tag.png">
      <img class="icon-img tag-fill" src="/tools/sidekick/plugins/tags2/icons/tag-filled.png">
      <span value="${key}">${key}</span>
      <img class="icon-img checked" src="/tools/sidekick/plugins/tags2/icons/checked.png">
      `;
      tagItem.innerHTML = tagItemElements;
      spMenuItem.appendChild(tagItem);
      tagItem.addEventListener('click', handleColumnItemClick);

      spMenu.appendChild(spMenuItem);
    });
  };

  const createColumnMenu = () => {
    if (query) {
      createSearchItems();
    } else {
      const parentElement = container.querySelector('.category');
      createNavigation(null, parentElement);
    }
  };

  const handleColumnItemClick = (e) => {
    let ele = e.target;
    const tagName = ele.tagName.toLowerCase();
    if (tagName !== 'p') {
      ele = ele.parentElement;
    }

    const { value } = ele;
    const selected = ele.ariaChecked === 'true';
    if (selected) {
      const index = selectedTags.indexOf(value);
      if (index > -1) {
        selectedTags.splice(index, 1);
      }
      ele.ariaChecked = 'false';
    } else {
      selectedTags.push(value);
      ele.ariaChecked = 'true';
    }

    const selectedLabel = container.querySelector('.selectedLabel');
    selectedLabel.innerHTML = UTILS.getSelectedLabel(selectedTags);
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(selectedTags.join(', '));
    container.dispatchEvent(
      new CustomEvent(PLUGIN_EVENTS.TOAST, {
        detail: { message: 'Copied Tags' },
      }),
    );
  };

  let sp = /* html */`
  <div class="footer">
      <span class="selectedLabel">${UTILS.getSelectedLabel(selectedTags)}</span>
      <p class="copy-action">
        <span>Copy</span>
        <img class="icon-img copy" src="/tools/sidekick/plugins/tags2/icons/copy.png">
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

  const spContainer = document.createElement('div');
  spContainer.classList.add('container');
  spContainer.innerHTML = sp;
  container.append(spContainer);

  createColumnMenu();

  const selectedLabel = container.querySelector('.selectedLabel');
  selectedLabel.innerHTML = UTILS.getSelectedLabel(selectedTags);

  function createNavigation(parentKey, parentElement) {
    selectedTags = [];
    const spMenu = document.createElement('ul');
    parentElement?.appendChild(spMenu);
    const elementJson = parentKey ? UTILS.findObjectByKey(dataObj, parentKey) : dataObj;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in elementJson) {
      const obj = elementJson[key];
      const objKeys = Object.keys(obj);
      const spMenuItem = document.createElement('li');
      spMenuItem.className = 'column-item';
      const tagItem = document.createElement('p');
      tagItem.className = 'tag-item';
      tagItem.ariaChecked = 'false';
      tagItem.value = key;
      const tagItemElements = `
        <img class="icon-img tag" src="/tools/sidekick/plugins/tags2/icons/tag.png">
        <img class="icon-img tag-fill" src="/tools/sidekick/plugins/tags2/icons/tag-filled.png">
        <span value="${key}">${key}</span>
        <img class="icon-img checked" src="/tools/sidekick/plugins/tags2/icons/checked.png">
      `;
      tagItem.innerHTML = tagItemElements;
      spMenuItem.appendChild(tagItem);
      tagItem.addEventListener('click', handleColumnItemClick);

      if (objKeys.length > 0) {
        const iconItem = document.createElement('p');
        iconItem.className = 'icon-item';
        const icon = document.createElement('img');
        icon.className = 'icon-img right-chevron';
        icon.src = '/tools/sidekick/plugins/tags2/icons/right-chevron.png';
        iconItem.appendChild(icon);
        spMenuItem.appendChild(iconItem);
        handleMenuExpand(iconItem);
      }

      spMenu.appendChild(spMenuItem);
    }
  }

  function handleMenuExpand(element) {
    element.addEventListener('click', () => {
      selectedTags = [];
      const { parentElement } = element;
      const isActive = parentElement.classList.contains('active');
      const parentKey = parentElement.querySelector('.tag-item').value.trim();
      const curColEle = parentElement.closest('.column');
      const curColNum = Number(curColEle.dataset.col);
      const nextColEle = container.querySelector(`.subcategory[data-col="${curColNum + 1}"]`);

      if (isActive) {
        UTILS.removeColumnContent(nextColEle);
        curColEle.classList.remove('expanded');
      } else {
        for (let i = 5; i > curColNum; i--) {
          const colEle = container.querySelector(`.subcategory[data-col="${i}"]`);
          colEle.classList.remove('expanded');
          UTILS.removeColumnContent(colEle);
        }
        createNavigation(parentKey, nextColEle);
        curColEle.classList.add('expanded');
        // remove existing active class from sibling
        const siblingColEle = container.querySelector(`.column[data-col="${curColNum}"] li.active`);
        siblingColEle?.classList.remove('active');
      }
      const checkedItems = container.querySelectorAll('.tag-item[aria-checked="true"]');
      checkedItems.forEach((item) => {
        item.ariaChecked = 'false';
      });
      parentElement.classList.toggle('active');
    });
  }

  const copyButton = spContainer.querySelector('.copy-action');
  copyButton.addEventListener('click', handleCopyButtonClick);
}

export default {
  title: 'Tags2',
  searchEnabled: true,
};
