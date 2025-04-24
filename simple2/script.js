// Default RSS feed URL
const defaultRssUrl = 'https://feeds.npr.org/1001/rss.xml';

// Fetch and parse RSS feed
async function fetchRSS(url) {
  try {
    console.log('Attempting to fetch RSS feed:', url); // Debug: Log URL
    // Fetch RSS feed directly (CORS handled by browser add-on)
    const response = await fetch(url, { mode: 'cors' });
    console.log('Fetch response status:', response.status, response.statusText); // Debug: Log status
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
    }
    const text = await response.text();
    console.log('Received response (first 200 chars):', text.substring(0, 200)); // Debug: Log response
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    
    // Check for XML parsing errors
    if (xml.querySelector('parsererror')) {
      console.error('XML parsing error:', xml.querySelector('parsererror').textContent); // Debug: Log parse error
      throw new Error('Error parsing RSS feed');
    }
    
    // Parse Atom or standard RSS
    const entries = xml.querySelectorAll('entry').length > 0 ? xml.querySelectorAll('entry') : xml.querySelectorAll('item');
    console.log('Found entries:', entries.length); // Debug: Log number of entries
    const items = Array.from(entries).map(item => ({
      title: item.querySelector('title')?.textContent || 'No title',
      thumbnail: extractImage(item.querySelector('content')?.textContent || item.querySelector('description')?.textContent) || 'https://via.placeholder.com/100',
      description: item.querySelector('content')?.textContent || item.querySelector('description')?.textContent || ''
    }));
    
    // Check if items were found
    if (items.length === 0) {
      throw new Error('No feed items found');
    }
    
    renderFeed(items);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    document.getElementById('feed-container').innerHTML = `<p>Error loading feed: ${error.message}</p>`;
  }
}

// Render feed items
function renderFeed(items) {
  console.log('Rendering items:', items); // Debug: Log items
  const container = document.getElementById('feed-container');
  container.innerHTML = '';
  if (!items || !Array.isArray(items)) {
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
      <h2 class="title">${item.title}</h2>
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
  console.log('Extracted image:', img ? img.src : 'None'); // Debug: Log image
  return img ? img.src : null;
}

// Load RSS feed from input
function loadRSS() {
  const rssUrl = document.getElementById('rss-url').value.trim();
  if (!rssUrl) {
    document.getElementById('feed-container').innerHTML = '<p>Please enter a valid RSS feed URL.</p>';
    return;
  }
  console.log('Loading RSS from input:', rssUrl); // Debug: Log input URL
  fetchRSS(rssUrl);
}

// Set number of columns
function setColumns(count) {
  const container = document.getElementById('feed-container');
  container.style.gridTemplateColumns = `repeat(${count}, var(--column-width, 300px))`;
}

// Adjust column width via slider
function adjustColumnWidth(width) {
  document.documentElement.style.setProperty('--column-width', `${width}px`);
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

// Initialize
console.log('Initializing with default URL:', defaultRssUrl); // Debug: Log init
document.getElementById('rss-url').value = defaultRssUrl;
fetchRSS(defaultRssUrl);
setColumns(3);
