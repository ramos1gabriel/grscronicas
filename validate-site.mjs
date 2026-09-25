import {readFile, access} from 'node:fs/promises';
import {normalizeVideos} from './dist/video-catalog.mjs';
import {normalizeDownloads} from './dist/download-catalog.mjs';

// Apenas leitura. O HTML de cada página é a fonte definitiva do site.
const catalog = JSON.parse(await readFile(new URL('./dist/content.json', import.meta.url), 'utf8'));
const videos = normalizeVideos(catalog.videos);
const downloads = normalizeDownloads(catalog.downloads);
for (const path of ['index.html', 'videos/index.html', 'downloads/index.html', 'sobre/index.html', 'contato/index.html']) {
  await access(new URL(`./dist/${path}`, import.meta.url));
}
for (const item of downloads) {
  const url = new URL(item.url, 'https://grscronicas.com');
  if (url.origin === 'https://grscronicas.com') {
    const pathname = decodeURIComponent(url.pathname);
    if (!pathname.startsWith('/downloads/') || pathname.includes('..') || pathname.includes('\\')) throw new Error('Caminho de download inválido.');
    await access(new URL(`./dist${pathname}`, import.meta.url));
  }
}
console.log(`Site validado: ${videos.length} vídeos e ${downloads.length} traduções. Nenhum HTML foi alterado.`);
