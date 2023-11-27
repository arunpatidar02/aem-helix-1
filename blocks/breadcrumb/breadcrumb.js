import { createElement } from '../../scripts/scripts.js';

const getBreadcrumbTitle = (document) => {
  const breadcrumbTitleMeta = document.querySelector('meta[name="breadcrumbtitle"]');
  return breadcrumbTitleMeta ? breadcrumbTitleMeta.getAttribute('content') : document.querySelector('title').innerText;
};

const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return getBreadcrumbTitle(html);
  }

  return '';
};

const getAllPathsExceptCurrent = async (paths) => {
  const result = [];
  // remove first and last slash characters
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  let subPath = '';
  const subPathArray = [];

  for (let i = 0; i < pathsList.length - 1; i += 1) {
    subPath += `${pathsList[i]}/`;
    subPathArray.push(`/${subPath}`);
  }

  for (let i = 0; i < subPathArray.length; i += 1) {
    const url = `${window.location.origin}${subPathArray[i]}`;
    /* eslint-disable-next-line no-await-in-loop */
    const name = await getPageTitle(url);
    if (name) {
      result.push({ name, url });
    }
  }
  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  pathLink.innerText = path.name;
  return pathLink;
};

export default async function decorate(block) {
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  block.innerHTML = '';
  const HomeLink = createLink({ path: '', name: 'Home', url: window.location.origin });
  const breadcrumbLinks = [HomeLink.outerHTML];

  const path = window.location.pathname;
  const paths = await getAllPathsExceptCurrent(path);

  paths.forEach((pathPart) => breadcrumbLinks.push(createLink(pathPart).outerHTML));
  const currentPath = document.createElement('span');
  currentPath.innerText = getBreadcrumbTitle(document);
  breadcrumbLinks.push(currentPath.outerHTML);

  breadcrumb.innerHTML = breadcrumbLinks.join('<span class="breadcrumb-separator">/</span>');
  block.append(breadcrumb);
}
