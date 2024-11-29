import { io } from 'socket.io-client';

const socket = io(window.location.origin);

function startCrawling() {
    const url = document.getElementById('urlInput').value;
    if (!url) {
        alert('Veuillez entrer une URL valide');
        return;
    }
    
    // Nettoyer les listes
    document.getElementById('crawledUrls').innerHTML = '';
    document.getElementById('externalSites').innerHTML = '';
    document.getElementById('crawledCount').textContent = '0';
    document.getElementById('externalCount').textContent = '0';
    document.getElementById('errorCount').textContent = '0';
    
    socket.emit('start-crawl', url);
}

socket.on('url-crawled', (url) => {
    const div = document.createElement('div');
    div.className = 'url-item';
    div.textContent = url;
    document.getElementById('crawledUrls').appendChild(div);
    div.scrollIntoView({ behavior: 'smooth' });
});

socket.on('expired-domain', (domain) => {
    const div = document.createElement('div');
    div.className = 'url-item expired-domain';
    div.textContent = `[EXPIRÉ] ${domain}`;
    document.getElementById('externalSites').appendChild(div);
    div.scrollIntoView({ behavior: 'smooth' });
});

socket.on('external-site', (data) => {
    const div = document.createElement('div');
    div.className = 'url-item external-site';
    div.innerHTML = `${data.domain} (${data.url})`;
    if (data.sourceUrl) {
        div.innerHTML += `<div class="source-url">Source: ${data.sourceUrl}</div>`;
    }
    document.getElementById('externalSites').appendChild(div);
});

socket.on('crawl-error', (error) => {
    const div = document.createElement('div');
    div.className = 'url-item error';
    div.textContent = `${error.url}: ${error.error}`;
    document.getElementById('externalSites').appendChild(div);
});

socket.on('crawl-stats', (stats) => {
    document.getElementById('crawledCount').textContent = stats.crawledCount;
    document.getElementById('externalCount').textContent = stats.externalCount;
    document.getElementById('errorCount').textContent = stats.errorCount || 0;
});

socket.on('error', (message) => {
    alert(`Erreur: ${message}`);
});

window.startCrawling = startCrawling;