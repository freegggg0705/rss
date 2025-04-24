// RSS feed URL for r/gifsgonewild
const rssUrl = 'https://www.reddit.com/r/gifsgonewild.rss';

// Fetch and parse RSS feed
async function fetchRSS() {
  try {
    // Use corsproxy.io to avoid CORS issues
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(rssUrl)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    
    // Check for XML parsing errors
    if (xml.querySelector('parsererror')) {
      throw new Error('Error parsing RSS feed');
    }
    
    // Parse Reddit's Atom feed (<entry> tags)
    const items = Array.from(xml.querySelectorAll('entry')).map(item => ({
      title: item.querySelector('title')?.textContent || 'No title',
      thumbnail: extractImage(item.querySelector('content')?.textContent) || 'https://via.placeholder.com/100',
      description: item.querySelector('content')?.textContent || ''
    }));
    
    // Check if items were found
    if (items.length === 0) {
      throw new Error('No feed items found');
    }
    
    renderFeed(items);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    document.getElementById('feed-container').innerHTML = '<p>Error loading feed: ' + error.message + '</p>';
  }
}

// Render feed items
function renderFeed(items) {
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
  return img ? img.src : null;
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
fetchRSS();
setColumns(3);
