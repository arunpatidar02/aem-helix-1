/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

/**
 * Filters tags in the given data based on a query.
 *
 * @param {Object} data - The data to filter.
 * @param {string} query - The query to filter by.
 * @returns {Array} - An array containing filtered tags.
 */
function getFilteredTags(data, query) {
  if (!query) {
    return data;
  }

  const filteredObj = [];

  /**
     * Recursively filters tags in an object.
     *
     * @param {Object} obj - The object to filter.
     */
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

/**
   * Removes undefined properties/objoect from an parent object.
   *
   * @param {Object} obj - The object from which to remove undefined properties.
   */
function removeUndefined(obj) {
  for (const key in obj) {
    if (key === 'undefined' || key === '') {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeUndefined(obj[key]);
    }
  }
}

function adjustStack(stack, i, value) {
  const level = stack.length;
  stack[i - 1] = value;

  while (i < level) {
    stack[i] = '';
    i++;
  }
}

/**
   * Finds an object in a JSON structure based on a specified key.
   *
   * @param {Object} json - The JSON object to search.
   * @param {string} keyToFind - The key to search for.
   * @returns {Object|null} - The found object or null if not found.
   */
function findObjectByKey(json, keyToFind) {
  let result = null;

  /**
     * Recursively searches for an object in a JSON structure.
     *
     * @param {Object} obj - The object to search.
     * @param {string} key - The key to find.
     */
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

/**
   * Converts a flat array to a hierarchical JSON structure.
   *
   * @param {Array} flatArray - The flat array to convert.
   * @returns {Object} - The hierarchical JSON structure.
   */
function convertFlatArrayToHierarchy(flatArray) {
  const hierarchy = {};
  let stack = [];

  flatArray.forEach((item) => {
    let currentLevel = hierarchy;

    for (let i = 0; i <= 5; i++) {
      const key = i === 0 ? 'tag-category' : `level${i}`;
      const value = item[key];
      if (value !== '') {
        if (i === 0) {
          stack = [];
        }

        currentLevel[value] = currentLevel[value] || {};
        currentLevel = currentLevel[value];
        adjustStack(stack, i, value);
      } else {
        currentLevel[stack[i - 1]] = currentLevel[stack[i - 1]] || {};
        currentLevel = currentLevel[stack[i - 1]];
        console.log(stack);
      }
    }
  });

  return hierarchy;
}

/**
   * Gets a hierarchical JSON object from a flat array.
   *
   * @param {Array} flatArray - The flat array to convert.
   * @returns {Object} - The hierarchical JSON structure.
   */
function getJsonObject(flatArray) {
  const hierarchy = convertFlatArrayToHierarchy(flatArray);
  removeUndefined(hierarchy);
  return hierarchy;
}

/**
 * Removes a CSS class from an HTML element.
 *
 * @param {HTMLElement} element - The HTML element from which to remove the class.
 * @param {string} className - The name of the class to be removed.
 */
function removeClass(element, className) {
  element?.classList.remove(className);
}

/**
  * Removes the content of a column element
  * including any 'expanded' class and the inner <ul> element.
  *
  * @param {HTMLElement} colEle - The column element to clear.
  */
function removeColumnContent(colEle) {
  removeClass(colEle, 'expanded');
  const list = colEle.querySelector('ul');
  if (list) {
    colEle.removeChild(list);
  }
}

export default {
  getJsonObject,
  getFilteredTags,
  findObjectByKey,
  removeColumnContent,
  removeClass,
};
