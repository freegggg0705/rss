// Sample RSS feed URL (replace with your own)
const rssUrl = 'https://example.com/feed'; // Replace with a valid RSS feed URL

// Fetch and parse RSS feed
async function fetchRSS() {
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    renderFeed(data.items);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    document.getElementById('feed-container').innerHTML = '<p>Error loading feed.</p>';
  }
}

// Render feed items
function renderFeed(items) {
  const container = document.getElementById('feed-container');
  container.innerHTML = '';
  items.forEach(item => {
    const thumbnail = item.thumbnail || extractImage(item.description) || 'https://via.placeholder.com/100';
    const isVideo = thumbnail.endsWith('.mp4') || thumbnail.endsWith('.webm');
    const isGif = thumbnail.endsWith('.gif');
    
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    
    // Use video tag for videos, img for images/GIFs
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

// Extract first image from description (fallback)
function extractImage(description) {
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
    setGridSize('medium'); // Default grid size
  } else {
    setColumns(3); // Default column count
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
setColumns(3); // Default to 3 columns