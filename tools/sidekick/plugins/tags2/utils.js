/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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

function getJsonObject(flatArray) {
  const hierarchy = convertFlatArrayToHierarchy(flatArray);
  removeUndefined(hierarchy);
  return hierarchy;
}

function getSelectedLabel(selectedTags) {
  return selectedTags.length > 0 ? `<span>${selectedTags.length}</span> tag${selectedTags.length > 1 ? 's' : ''} selected` : 'No tags selected';
}

function removeColumnContent(colEle) {
  const list = colEle.querySelector('ul');
  if (list) {
    colEle.removeChild(list);
  }
}

export default {
  getJsonObject,
  getFilteredTags,
  findObjectByKey,
  getSelectedLabel,
  removeColumnContent,
};
