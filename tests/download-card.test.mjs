import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDownloads,renderDownloads} from '../dist/download-catalog.mjs';

const base={title:'Meu jogo',description:'Tradução PT-BR',url:'/downloads/meu-jogo.zip'};
test('cartão exibe capa e status, escapando o conteúdo cadastrado',()=>{
  const html=renderDownloads(normalizeDownloads([{...base,title:'Jogo <novo>',status:'Beta <teste>',url_image:'/img/capa.png?x="teste"'}]));
  assert.match(html,/class="download-card"/);
  assert.match(html,/src="\/img\/capa.png\?x=&quot;teste&quot;"/);
  assert.match(html,/Capa de Jogo &lt;novo&gt;/);
  assert.match(html,/Beta &lt;teste&gt;/);
  assert.ok(html.indexOf('download-status')<html.indexOf('<h2>'));
  assert.match(html,/href="\/downloads\/meu-jogo.zip"/);
});
test('cadastros antigos omitem status e usam símbolo PT-BR',()=>{
  const html=renderDownloads(normalizeDownloads([base]));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('download-status'));
  assert.match(html,/download-placeholder/);
});
test('imagem aceita caminho local e HTTPS, rejeitando protocolos inseguros',()=>{
  for(const url_image of ['/img/capa.png','https://example.com/capa.jpg',''])assert.doesNotThrow(()=>normalizeDownloads([{...base,url_image}]));
  for(const url_image of ['javascript:alert(1)','data:image/svg+xml,<svg>','//example.com/capa.jpg','http://example.com/capa.jpg','https://user:pass@example.com/capa.jpg'])assert.throws(()=>normalizeDownloads([{...base,url_image}]));
});
