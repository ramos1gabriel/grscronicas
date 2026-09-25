import {normalizeDownloads, renderDownloads} from './download-catalog.mjs';

async function updateDownloads() {
  const list = document.querySelector('[data-download-list]');
  if (!list) return;
  try {
    const response = await fetch('/content.json', {cache:'no-cache'});
    if (!response.ok) throw new Error(`Catálogo indisponível (${response.status})`);
    const data = await response.json();
    const items = normalizeDownloads(data.downloads);
    list.innerHTML = items.length ? renderDownloads(items) : document.querySelector('#downloads-empty').innerHTML;
  } catch (error) {
    list.innerHTML = '<p>Não foi possível carregar as traduções. Tente recarregar a página em alguns instantes.</p>';
    console.warn('Não foi possível carregar as traduções.', error);
  }
}
updateDownloads();
