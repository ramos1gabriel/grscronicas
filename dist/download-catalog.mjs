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
    return {title:item.title.trim(), description:typeof item.description === 'string' ? item.description : '', url:local ? parsed.pathname + parsed.search + parsed.hash : parsed.href};
  });
}

export function renderDownloads(items) {
  return items.map(item => `<article class="empty-download"><span class="file-symbol" aria-hidden="true">PT<br>BR</span><div><h2>${escape(item.title)}</h2><p>${escape(item.description)}</p><a class="button" href="${escape(item.url)}" download>Baixar tradução ↓</a></div></article>`).join('');
}
