const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function normalizeDownloads(items) {
  if (!Array.isArray(items)) throw new Error('downloads deve ser uma lista.');
  return items.map((item, index) => {
    if (!item || typeof item.title !== 'string' || !item.title.trim() || typeof item.url !== 'string') {
      throw new Error(`Tradução ${index + 1}: informe título e URL.`);
    }
    const url = item.url.trim();
    const parsed = new URL(url, 'https://grscronicas.com');
    const local = url.startsWith('/downloads/') && !url.includes('\\') && parsed.origin === 'https://grscronicas.com' && parsed.pathname.startsWith('/downloads/');
    if (!local && !/^https:\/\//i.test(url)) throw new Error('Download precisa de HTTPS ou caminho /downloads/arquivo.zip.');
    if (parsed.username || parsed.password || !parsed.pathname.toLowerCase().endsWith('.zip')) throw new Error('Informe um link direto para um arquivo ZIP.');
    const status = typeof item.status === 'string' ? item.status.trim() : '';
    const url_image = typeof item.url_image === 'string' ? item.url_image.trim() : '';
    if (url_image) {
      const image = new URL(url_image, 'https://grscronicas.com');
      const localImage = url_image.startsWith('/') && !url_image.startsWith('//') && !url_image.includes('\\') && image.origin === 'https://grscronicas.com';
      if ((!localImage && !/^https:\/\//i.test(url_image)) || image.username || image.password) {
        throw new Error('url_image precisa de HTTPS ou caminho local, como /img/meu-jogo.png.');
      }
    }
    return {title:item.title.trim(), description:typeof item.description === 'string' ? item.description : '', url:local ? parsed.pathname + parsed.search + parsed.hash : parsed.href, url_image, status};
  });
}

export function renderDownloads(items) {
  return items.map(item => `<article class="download-card">
    <div class="download-cover">
      <span class="download-placeholder" aria-hidden="true">PT<br>BR</span>
      ${item.url_image ? `<img src="${escape(item.url_image)}" alt="Capa de ${escape(item.title)}" width="140" height="160" loading="lazy" onerror="this.hidden=true">` : ''}
    </div>
    <div class="download-copy">
      ${item.status ? `<p class="download-status">${escape(item.status)}</p>` : ''}
      <h2>${escape(item.title)}</h2>
      <p class="download-description">${escape(item.description)}</p>
      <a class="text-link" href="${escape(item.url)}" download>Baixar tradução ↓</a>
    </div>
  </article>`).join('');
}
