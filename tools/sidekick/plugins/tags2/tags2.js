/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-unresolved
import { PLUGIN_EVENTS } from 'https://www.hlx.live/tools/sidekick/library/events/events.js';

const selectedTags = [];

function getSelectedLabel() {
  return selectedTags.length > 0 ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected` : 'No tags selected';
}

function getFilteredTags(data, query) {
  if (!query) {
    return data;
  }
  const filteredObj = [];
  function filterRecursive(obj) {
    for (const key in obj) {
      if (key.toLowerCase().includes(query.toLowerCase())) {
        filteredObj.push(key);
      }
      if (typeof obj[key] === 'object') {
        filterRecursive(obj[key]);
      }
    }
  }

  filterRecursive(data);

  return filteredObj;
}

function removeUndefined(obj) {
  for (const key in obj) {
    if (key === 'undefined') {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      // Recursively check nested objects
      removeUndefined(obj[key]);
    }
  }
}

function removeColumnContent(colEle) {
  const list = colEle.querySelector('ul');
  if (list) {
    colEle.removeChild(list);
  }
}

function findObjectByKey(json, keyToFind) {
  let result = null;

  function searchObject(obj, key) {
    for (const currentKey in obj) {
      if (currentKey === key) {
        result = obj[currentKey];
        break;
      } else if (typeof obj[currentKey] === 'object') {
        searchObject(obj[currentKey], key);
      }
    }
  }

  searchObject(json, keyToFind);
  return result;
}

function convertFlatArrayToHierarchy(flatArray) {
  const hierarchy = {};
  let stack = [];

  flatArray.forEach((item) => {
    let currentLevel = hierarchy;

    for (let i = 0; i <= 5; i++) {
      const key = i === 0 ? 'tag-category' : `level${i}`;
      const value = item[key];

      if (value !== '') {
        // If the value is not empty, add it to the current level or at category level
        if (i === 0) {
          stack = [];
        }
        currentLevel[value] = currentLevel[value] || {};
        currentLevel = currentLevel[value];
        stack[i - 1] = value;
      } else {
        // If the value is empty, use the previous non-empty value
        currentLevel[stack[i - 1]] = currentLevel[stack[i - 1]] || {};
        currentLevel = currentLevel[stack[i - 1]];
      }
    }
  });

  return hierarchy;
}

export async function decorate(container, data, query) {
  if (!data) {
    // eslint-disable-next-line no-console
    console.warn('Tag sheet is not configured');
    return;
  }

  // const dataObj = data;
  const dataObj = convertFlatArrayToHierarchy(data);
  removeUndefined(dataObj);

  const createMenuItems = () => {
    const filteredTags = getFilteredTags(dataObj, query);
    let resultString = '';
    filteredTags.forEach((tag) => {
      const isSelected = selectedTags.includes(tag);
      resultString += `
        <sp-menu-item class="tag-item-wrapper">
          <ion-icon name="pricetag-outline"></ion-icon>
          <ion-icon name="pricetag"></ion-icon>
          <span value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</span>
        </sp-menu-item>`;
    });

    return resultString;
  };

  const createColumnMenu = () => {
    if (query) {
      return;
    }
    const parentElement = container.querySelector('.category');
    createNavigation(null, parentElement);
  };

  const handleMenuItemClick = (e) => {
    let ele = e.target;
    const tagName = ele.tagName.toLowerCase();
    if (tagName !== 'sp-menu-item') {
      ele = ele.parentElement;
    }
    const { value, selected } = ele;
    if (selected) {
      const index = selectedTags.indexOf(value);
      if (index > -1) {
        selectedTags.splice(index, 1);
      }
    } else {
      selectedTags.push(value);
    }

    const selectedLabel = container.querySelector('.selectedLabel');
    selectedLabel.textContent = getSelectedLabel();
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
      <sp-icon-info slot="icon"></sp-icon-info>
      <span class="selectedLabel">${getSelectedLabel()}</span>
      <sp-action-button label="Copy" quiet>
        <sp-icon-copy slot="icon"></sp-icon-copy>
      </sp-action-button>
    </div>
    <sp-divider size="s"></sp-divider>`;
  if (query) {
    const menuItems = createMenuItems();
    sp += `<div class="search-result-column">
    <sp-menu label="Select tags" selects="multiple">${menuItems}</sp-menu>
    </div>`;
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

  function createNavigation(parentKey, parentElement) {
    const spMenu = document.createElement('sp-menu');
    parentElement?.appendChild(spMenu);
    const elementJson = parentKey ? findObjectByKey(dataObj, parentKey) : dataObj;

    for (const key in elementJson) {
      const obj = elementJson[key];
      const objKeys = Object.keys(obj);
      const spMenuItem = document.createElement('sp-menu-item');
      const tagItem = `
      <ion-icon name="pricetag-outline"></ion-icon>
      <ion-icon name="pricetag"></ion-icon>
      <span value="${key}">${key}</span>`;

      spMenuItem.innerHTML = tagItem;
      if (!parentKey) {
        spMenuItem.addEventListener('click', handleMenuItemClick);
      }

      if (objKeys.length > 0) {
        const icon = document.createElement('span');
        icon.className = 'chevron-right';
        spMenuItem.appendChild(icon);
        addEventListeners(icon);
      }

      spMenu.appendChild(spMenuItem);
    }
  }

  function addEventListeners(element) {
    element.addEventListener('click', () => {
      const { parentElement } = element;
      const isActive = parentElement.classList.contains('active');
      const parentKey = parentElement.querySelector('sp-menu-item').value.trim();
      const curColEle = parentElement.closest('.column');
      const curColNum = Number(curColEle.dataset.col);
      const nextColEle = container.querySelector(`.subcategory[data-col="${curColNum + 1}"]`);

      if (isActive) {
        removeColumnContent(nextColEle);
        curColEle.classList.remove('expanded');
      } else {
        for (let i = 5; i > curColNum; i--) {
          const colEle = container.querySelector(`.subcategory[data-col="${i}"]`);
          colEle.classList.remove('expanded');
          removeColumnContent(colEle);
        }
        createNavigation(parentKey, nextColEle);
        curColEle.classList.add('expanded');
        // remove existing active class from sibling
        const siblingColEle = container.querySelector(`.column[data-col="${curColNum}"] li.active`);
        siblingColEle?.classList.remove('active');
      }
    //  parentElement.classList.toggle('active');
    });
  }

  const menuItemElements = spContainer.querySelectorAll('sp-menu-item');
  menuItemElements.forEach((item) => {
    item.addEventListener('click', handleMenuItemClick);
  });

  const copyButton = spContainer.querySelector('sp-action-button');
  copyButton.addEventListener('click', handleCopyButtonClick);
}

export default {
  title: 'Tags2',
  searchEnabled: true,
};
