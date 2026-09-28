// Edite o HTML compartilhado em /partials/header.html e /partials/footer.html.
export function normalizePath(path) {
  return path.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
}

export function markCurrentPage(header, pathname) {
  for (const link of header.querySelectorAll('nav a[href]')) {
    link.removeAttribute('aria-current');
    const url = new URL(link.getAttribute('href'), window.location.origin);
    if (url.origin === window.location.origin && normalizePath(url.pathname) === normalizePath(pathname)) {
      link.setAttribute('aria-current', 'page');
    }
  }
}

export async function loadPartial(selector, path) {
  const element = document.querySelector(selector);
  if (!element) return;
  try {
    const response = await fetch(path, {cache:'no-cache'});
    if (!response.ok) throw new Error(`Não foi possível carregar ${path} (${response.status})`);
    const html = await response.text();
    if (!html.trim() || /<!doctype|<html\b/i.test(html)) throw new Error(`Fragmento inválido: ${path}`);
    element.innerHTML = html;
    if (selector === '[data-site-header]') markCurrentPage(element, window.location.pathname);
  } catch (error) {
    // Os links básicos do HTML continuam disponíveis se a conexão falhar.
    console.warn('Não foi possível carregar uma parte do layout.', error);
  }
}

await Promise.all([
  loadPartial('[data-site-header]', '/partials/header.html'),
  loadPartial('[data-site-footer]', '/partials/footer.html')
]);
