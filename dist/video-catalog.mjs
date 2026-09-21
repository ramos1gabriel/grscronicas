// Shared by the browser and the static build. Edit content.json, not this file.
const text = value => typeof value === 'string' ? value.trim() : '';
const escape = value => text(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function youtubeId(value) {
  const input = text(value);
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    const host = url.hostname.replace(/^www\./, '');
    const id = host === 'youtu.be' ? url.pathname.slice(1) :
      ['youtube.com', 'm.youtube.com'].includes(host) ?
        (url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed)\/([^/]+)$/.exec(url.pathname)?.[2]) : '';
    return /^[\w-]{11}$/.test(id || '') ? id : '';
  } catch { return ''; }
}

export function normalizeVideos(items) {
  if (!Array.isArray(items)) throw new Error('videos precisa ser uma lista.');
  const ids = new Set();
  return items.map((item, index) => {
    const id = youtubeId(item?.url || item?.id);
    if (!id || !text(item?.title)) throw new Error(`Vídeo ${index + 1}: informe um link do YouTube e um título válidos.`);
    if (ids.has(id)) throw new Error(`Vídeo repetido: ${id}`);
    ids.add(id);
    let thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    if (text(item.thumbnail)) {
      const url = new URL(item.thumbnail);
      if (url.protocol !== 'https:') throw new Error(`Miniatura do vídeo ${index + 1} precisa de HTTPS.`);
      thumbnail = url.href;
    }
    return {...item, id, title:text(item.title), thumbnail, number:index + 1};
  });
}

function context(video) {
  const rows = [[video.gameLabel || 'Jogo', video.game],
    [video.thinker ? video.referenceLabel || 'Pensador' : 'Tema', video.thinker || video.theme]];
  return rows.filter(([,value]) => text(value)).map(([label,value]) =>
    `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
}

function thumbnail(video, featured = false) {
  return `<div class="thumbnail"><img src="${escape(video.thumbnail)}" alt="" width="720" height="405" ${featured ? 'fetchpriority="high"' : 'loading="lazy"'}><span class="play" aria-hidden="true">▶</span>${text(video.duration) ? `<span class="duration">${escape(video.duration)}</span>` : ''}</div>`;
}

export function renderVideoCard(video) {
  return `<a class="video-card" href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">${thumbnail(video)}<p class="video-label">CRÔNICA ${String(video.number).padStart(2,'0')} <span>YOUTUBE ↗</span></p><h3>${escape(video.title)}</h3><dl class="video-context">${context(video)}</dl></a>`;
}

export function renderFeatured(video) {
  if (!video) return '<p>Novas crônicas em breve.</p>';
  const topic = [video.game, video.thinker || video.theme].filter(text).join(' · ');
  return `<div class="feature-kicker"><span>EM DESTAQUE</span><span>APERTE O PLAY ↘</span></div><a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">${thumbnail(video,true)}${topic ? `<p class="eyebrow">${escape(topic)}</p>` : ''}<h2>${escape(video.title)}</h2><span class="text-link">Assistir no YouTube ↗</span></a>`;
}

export function renderGrid(videos) {
  return videos.length ? videos.map(renderVideoCard).join('') : '<p>Novas crônicas em breve.</p>';
}

export function catalogCount(videos) {
  return `${videos.length} ${videos.length === 1 ? 'VIDEOENSAIO' : 'VIDEOENSAIOS'} NO ARQUIVO`;
}
