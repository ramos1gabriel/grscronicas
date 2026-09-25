import {normalizeVideos, renderFeatured, renderGrid, catalogCount} from './video-catalog.mjs';

// A single catalog drives both the home page and the full video archive.
async function updateCatalog() {
  try {
    const response = await fetch('/content.json', {cache:'no-cache'});
    if (!response.ok) throw new Error(`Catálogo indisponível (${response.status})`);
    const {videos:items} = await response.json();
    const videos = normalizeVideos(items);
    const archive = document.querySelector('[data-video-grid]');
    const latest = document.querySelector('[data-latest-videos]');
    const featured = document.querySelector('[data-featured-video]');
    const count = document.querySelector('[data-video-count]');
    if (archive) archive.innerHTML = renderGrid(videos);
    if (latest) latest.innerHTML = renderGrid(videos.slice(1,4));
    if (featured) featured.innerHTML = renderFeatured(videos[0]);
    if (count) count.textContent = catalogCount(videos);
  } catch (error) {
    const message = '<p>Não foi possível carregar as crônicas. Recarregue a página ou <a href="https://www.youtube.com/@grscronicas/videos">visite o canal no YouTube</a>.</p>';
    for (const selector of ['[data-video-grid]', '[data-latest-videos]', '[data-featured-video]']) {
      const element = document.querySelector(selector);
      if (element) element.innerHTML = message;
    }
    const count = document.querySelector('[data-video-count]');
    if (count) count.textContent = 'ARQUIVO DE CRÔNICAS';
    console.warn('Não foi possível carregar o catálogo.', error);
  }
}

updateCatalog();
