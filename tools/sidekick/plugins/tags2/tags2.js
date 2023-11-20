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

function getSubCategoryColumnElement(columnNumber) {
  return document.querySelector(`.subcategory[data-col="${columnNumber}"]`);
}

function collapseColumns(curColNum) {
  for (let i = 5; i > curColNum; i--) {
    const colEle = getSubCategoryColumnElement(i);
    colEle.classList.remove('expanded');
    removeColumnContent(colEle);
  }
}

function createNavigation(dataObj, parentKey, parentElement) {
  const ul = document.createElement('ul');
  parentElement?.appendChild(ul);
  const elementJson = parentKey ? findObjectByKey(dataObj, parentKey) : dataObj;

  for (const key in elementJson) {
    const obj = elementJson[key];
    const objKeys = Object.keys(obj);
    const li = document.createElement('li');
    const tagItem = `<div class="tag-item-wrapper">
          <ion-icon name="pricetag-outline"></ion-icon>
          <ion-icon name="pricetag"></ion-icon>
          <sp-menu-item class="item" value="${key}"}>${key}</sp-menu-item>
        </div>`;

    li.innerHTML = tagItem;

    if (objKeys.length > 0) {
      const icon = document.createElement('sp-icon-chevron-right');
      li.appendChild(icon);
      addEventListeners(dataObj, icon);
    }

    ul.appendChild(li);
  }
}

function addEventListeners(dataObj, element) {
  element.addEventListener('click', () => {
    const { parentElement } = element;
    const isActive = parentElement.classList.contains('active');
    const parentKey = parentElement.querySelector('.item').textContent.trim();
    const curColEle = parentElement.closest('.column');
    const curColNum = Number(curColEle.dataset.col);
    const nextColEle = getSubCategoryColumnElement(curColNum + 1);

    if (isActive) {
      removeColumnContent(nextColEle);
      curColEle.classList.remove('expanded');
    } else {
      collapseColumns(curColNum);
      createNavigation(dataObj, parentKey, nextColEle);
      curColEle.classList.add('expanded');
    }

    parentElement.classList.toggle('active');
  });
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
  console.log(dataObj);
  removeUndefined(dataObj);

  const createMenuItems = () => {
    const filteredTags = getFilteredTags(dataObj, query);
    let resultString = '';
    if (query) {
      filteredTags.forEach((tag) => {
        const isSelected = selectedTags.includes(tag);
        resultString += `
        <div class="tag-item-wrapper">
          <ion-icon name="pricetag-outline"></ion-icon>
          <ion-icon name="pricetag"></ion-icon>
          <sp-menu-item value="${tag}" ${isSelected ? 'selected' : ''}>${tag}</sp-menu-item>
        </div>`;
      });
    } else {
      const parentElement = document.querySelector('.category');
      createNavigation(dataObj, null, parentElement);
    }
    return resultString;
  };

  const handleMenuItemClick = (e) => {
    const { value, selected } = e.target;
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

  const menuItems = createMenuItems();
  const sp = /* html */`
    <div class="column category" data-col=0></div>
    <div class="column subcategory" data-col=1></div>
    <div class="column subcategory" data-col=2></div>
    <div class="column subcategory" data-col=3></div>
    <div class="column subcategory" data-col=4></div>
    <div class="column subcategory" data-col=5></div>  
  <sp-menu
      label="Select tags"
      selects="multiple"
    >
      ${menuItems}
    </sp-menu>
    <sp-divider size="s"></sp-divider>
    <div class="footer">
    <sp-icon-info slot="icon"></sp-icon-info>
      <span class="selectedLabel">${getSelectedLabel()}</span>
      <sp-action-button label="Copy" quiet>
        <sp-icon-copy slot="icon"></sp-icon-copy>
      </sp-action-button>
    </div>
  `;

  const spContainer = document.createElement('div');
  spContainer.classList.add('container');
  spContainer.innerHTML = sp;
  container.append(spContainer);

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
