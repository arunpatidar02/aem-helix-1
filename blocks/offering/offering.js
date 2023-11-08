async function loadJson(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(path);
    if (resp.ok) {
      return resp.json();
    }
  }
  return null;
}

function getJsonData(json) {
  return json ? json.data : null;
}

function parseJson(json) {
  return json ? JSON.parse(json) : null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  block.innerHTML = '';
  const apiData = await loadJson(path);
  const data = getJsonData(apiData);

  if (!data) {
    return;
  }

  // Loop through the JSON data and create offerss
  data.forEach((offerData) => {
    const offers = document.createElement('div');
    offers.className = 'offers';

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.innerText = offerData.tag;

    const heading = document.createElement('h2');
    heading.innerText = offerData.heading;

    const shortDescription = document.createElement('p');
    shortDescription.innerText = offerData.shortDescription;

    const tilesWrapper = document.createElement('div');
    tilesWrapper.className = 'tiles-wrapper';

    offers.appendChild(badge);
    offers.appendChild(heading);
    offers.appendChild(shortDescription);

    const tiles = parseJson(offerData.tiles);

    tiles.forEach((tileData) => {
      const tile = document.createElement('div');
      tile.className = 'tile';

      const tileIcon = document.createElement('span');
      tileIcon.innerText = tileData.icon;

      const tileHeadline = document.createElement('h3');
      tileHeadline.innerText = tileData.headline;

      const tileText = document.createElement('p');
      tileText.innerText = tileData.text;

      const ctaButton = document.createElement('a');
      ctaButton.className = 'button primary';
      ctaButton.innerText = tileData.ctaLabel;
      ctaButton.href = tileData.ctaLink;

      tile.appendChild(tileIcon);
      tile.appendChild(tileHeadline);
      tile.appendChild(tileText);
      tile.appendChild(ctaButton);

      tilesWrapper.appendChild(tile);
    });
    offers.appendChild(tilesWrapper);
    block.appendChild(offers);
  });
}
