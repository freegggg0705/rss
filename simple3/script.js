// Default RSS feed URL
const defaultRssUrl = 'https://feeds.npr.org/1001/rss.xml';
let currentItems = []; // Store current feed items for randomization

// Fetch and parse RSS feed
async function fetchRSS(url) {
  try {
    console.log('Attempting to fetch RSS feed:', url);
    const response = await fetch(url, { mode: 'cors' });
    console.log('Fetch response status:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
    }
    const text = await response.text();
    console.log('Received response (first 200 chars):', text.substring(0, 200));
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');

    if (xml.querySelector('parsererror')) {
      console.error('XML parsing error:', xml.querySelector('parsererror').textContent);
      throw new Error('Error parsing RSS feed');
    }

    const entries = xml.querySelectorAll('entry').length > 0 ? xml.querySelectorAll('entry') : xml.querySelectorAll('item');
    console.log('Found entries:', entries.length);
    const items = Array.from(entries).map(item => ({
      title: item.querySelector('title')?.textContent || 'No title',
      link: item.querySelector('link')?.getAttribute('href') || item.querySelector('link')?.textContent || '#',
      thumbnail: extractImage(item.querySelector('content')?.textContent || item.querySelector('description')?.textContent) || 'https://via.placeholder.com/100',
      description: item.querySelector('content')?.textContent || item.querySelector('description')?.textContent || ''
    }));

    if (items.length === 0) {
      throw new Error('No feed items found');
    }

    return items;
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return null;
  }
}

// Render feed items
function renderFeed(items) {
  console.log('Rendering items:', items);
  const container = document.getElementById('feed-container');
  container.innerHTML = '';
  if (!items || !Array.isArray(items) || items.length === 0) {
    container.innerHTML = '<p>No feed items to display.</p>';
    return;
  }
  items.forEach(item => {
    const thumbnail = item.thumbnail || 'https://via.placeholder.com/100';
    const isVideo = thumbnail.endsWith('.mp4') || thumbnail.endsWith('.webm');
    const isGif = thumbnail.endsWith('.gif');

    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';

    const media = isVideo
      ? `<video class="thumbnail" src="${thumbnail}" autoplay muted loop playsinline></video>`
      : `<img class="thumbnail" src="${thumbnail}" alt="${item.title}">`;

    feedItem.innerHTML = `
      ${media}
      <a href="${item.link}" class="title" target="_blank">${item.title}</a>
    `;
    container.appendChild(feedItem);
  });
}

// Extract first image from description
function extractImage(description) {
  if (!description) return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');
  const img = doc.querySelector('img');
  console.log('Extracted image:', img ? img.src : 'None');
  return img ? img.src : null;
}

// Load RSS feed(s) from input
async function loadRSS() {
  const rssInput = document.getElementById('rss-url').value.trim();
  if (!rssInput) {
    document.getElementById('feed-container').innerHTML = '<p>Please enter at least one valid RSS feed URL.</p>';
    return;
  }

  // Parse URLs (comma, newline, or space separated)
  const urls = rssInput.split(/[\n, ]+/).map(url => url.trim()).filter(url => url);
  console.log('Parsed URLs:', urls);

  const container = document.getElementById('feed-container');
  container.innerHTML = '<p>Loading feeds...</p>';
  currentItems = [];

  // Fetch feeds sequentially
  for (const url of urls) {
    const items = await fetchRSS(url);
    if (items) {
      currentItems.push(...items);
      renderFeed(currentItems); // Update UI after each feed
    }
  }

  if (currentItems.length === 0) {
    container.innerHTML = '<p>No valid feed items loaded.</p>';
  }
}

// Set number of columns
function setColumns(count) {
  const container = document.getElementById('feed-container');
  container.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
}

// Adjust column width via slider
function adjustColumnWidth(width) {
  document.documentElement.style.setProperty('--column-width', `${width}px`);
}

// Adjust title size via slider
function adjustTitleSize(size) {
  document.documentElement.style.setProperty('--title-size', `${size}px`);
}

// Toggle between column and grid view
function toggleView(view) {
  const container = document.getElementById('feed-container');
  const gridControls = document.querySelector('.grid-size-controls');
  container.className = view;
  gridControls.style.display = view === 'grid' ? 'block' : 'none';
  if (view === 'grid') {
    setGridSize('medium');
  } else {
    setColumns(3);
  }
}

// Set grid size
function setGridSize(size) {
  const container = document.getElementById('feed-container');
  const sizes = {
    small: '100px',
    medium: '150px',
    large: '200px'
  };
  container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${sizes[size]}, 1fr))`;
  document.querySelectorAll('.feed-item').forEach(item => {
    item.className = `feed-item ${size} grid`;
  });
}

// Randomize feed items
function randomizeFeed() {
  if (currentItems.length === 0) return;
  // Fisher-Yates shuffle
  for (let i = currentItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentItems[i], currentItems[j]] = [currentItems[j], currentItems[i]];
  }
  renderFeed(currentItems);
}

// Initialize
console.log('Initializing with default URL:', defaultRssUrl);
document.getElementById('rss-url').value = defaultRssUrl;
loadRSS();
setColumns(3);
