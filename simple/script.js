async function loadFeed(feedNumber) {
    const feedUrl = document.getElementById(`rssFeed${feedNumber}`).value;
    const articleList = document.getElementById(`articleList${feedNumber}`);
    const articleContent = document.getElementById(`articleContent${feedNumber}`);

    if (!feedUrl) {
        articleList.innerHTML = `<p>Please enter an RSS feed URL.</p>`;
        return;
    }

    try {
        // Fetch the RSS feed
        const response = await fetch(feedUrl);
        if (!response.ok) throw new Error('Failed to fetch feed');
        const text = await response.text();

        // Parse XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const items = xmlDoc.querySelectorAll('item');

        // Clear previous articles
        articleList.innerHTML = '';

        // Populate article list
        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || 'No title';
            const description = item.querySelector('description')?.textContent || 'No content';
            const link = item.querySelector('link')?.textContent || '#';

            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.textContent = title;
            articleItem.onclick = () => displayArticle({ title, description, link }, articleContent);
            articleList.appendChild(articleItem);
        });

        // Display first article
        if (items.length > 0) {
            const firstItem = {
                title: items[0].querySelector('title')?.textContent || 'No title',
                description: items[0].querySelector('description')?.textContent || 'No content',
                link: items[0].querySelector('link')?.textContent || '#'
            };
            displayArticle(firstItem, articleContent);
        } else {
            articleList.innerHTML = `<p>No articles found.</p>`;
        }
    } catch (error) {
        articleList.innerHTML = `<p>Error: ${error.message}. Use a local RSS file or CORS-enabled feed.</p>`;
    }
}

function displayArticle(item, contentElement) {
    contentElement.innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <a href="${item.link}" target="_blank">Read full article</a>
    `;
}
