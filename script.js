// Sample RSS feed URL (replace with your own)
const rssUrl = 'https://www.reddit.com/r/gifsgonewild.rss'; // Replace with a valid RSS feed URL

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
// Fetch and parse RSS feed
async function fetchRSS() {
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    
    // Check for XML parsing errors
    if (xml.querySelector('parsererror')) {
      throw new Error('Error parsing RSS feed');
    }
    
    const items = Array.from(xml.querySelectorAll('entry')).map(item => ({
      title: item.querySelector('title').textContent,
      thumbnail: extractImage(item.querySelector('content').textContent) || 'https://via.placeholder.com/100',
      description: item.querySelector('content').textContent
    }));
    renderFeed(items);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    document.getElementById('feed-container').innerHTML = '<p>Error loading feed. Please try again later.</p>';
  }
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
