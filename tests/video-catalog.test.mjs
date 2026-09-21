import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {normalizeVideos,renderGrid,renderFeatured,catalogCount,youtubeId} from '../dist/video-catalog.mjs';
const data=JSON.parse(await readFile(new URL('../dist/content.json',import.meta.url)));
const added={url:'https://youtu.be/abcdefghijk',title:'Novo <vídeo> & reflexão',game:'Jogo novo',thinker:'Pensador novo'};

test('adicionar só um registro atualiza destaque, total e numeração consistente',()=>{
  const list=normalizeVideos([added,...data.videos]);
  assert.equal(list.length,data.videos.length+1);
  assert.equal(list[0].thumbnail,'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg');
  assert.match(renderFeatured(list[0]),/Jogo novo · Pensador novo/);
  assert.match(renderFeatured(list[0]),/Novo &lt;vídeo&gt; &amp; reflexão/);
  assert.match(renderGrid(list.slice(1,4)),/CRÔNICA 02/);
  assert.equal((renderGrid(list).match(/class="video-card"/g)||[]).length,list.length);
  assert.equal(catalogCount(list),`${list.length} VIDEOENSAIOS NO ARQUIVO`);
  assert.ok(!renderGrid(list).includes('undefined'));
});

test('links válidos, duplicados e campos opcionais',()=>{
  assert.equal(youtubeId('https://www.youtube.com/watch?v=abcdefghijk&t=5'),'abcdefghijk');
  assert.equal(youtubeId('https://youtube.com/shorts/abcdefghijk'),'abcdefghijk');
  assert.equal(youtubeId('https://evil.example/watch?v=abcdefghijk'),'');
  assert.throws(()=>normalizeVideos([added,added]),/repetido/);
  assert.throws(()=>normalizeVideos([{title:'sem link'}]),/válidos/);
  assert.throws(()=>normalizeVideos([{...added,thumbnail:'javascript:alert(1)'}]),/HTTPS/);
  const html=renderGrid(normalizeVideos([{id:'abcdefghijk',title:'Só título'}]));
  assert.ok(!html.includes('duration'));
  assert.ok(!html.includes('<dt>'));
  assert.match(renderFeatured(undefined),/em breve/);
  assert.equal(catalogCount([]),'0 VIDEOENSAIOS NO ARQUIVO');
});

test('navegador lê o catálogo e preserva HTML em falha de rede',async()=>{
  const source=(await readFile(new URL('../dist/videos.js',import.meta.url),'utf8')).replace(/^import .*;\n/,'').replace('updateCatalog();','globalThis.done = updateCatalog();');
  for(const fail of [false,true]){
    const nodes=Object.fromEntries(['data-video-grid','data-latest-videos','data-featured-video','data-video-count'].map(key=>[`[${key}]`,{innerHTML:'fallback',textContent:'fallback'}]));
    const context=vm.createContext({normalizeVideos,renderFeatured,renderGrid,catalogCount,console:{warn(){}},document:{querySelector:key=>nodes[key]},fetch:async()=>{if(fail)throw Error('offline');return {ok:true,json:async()=>({videos:[added,...data.videos]})};}});
    vm.runInContext(source,context);await context.done;
    if(fail)assert.equal(nodes['[data-video-grid]'].innerHTML,'fallback');
    else{
      assert.match(nodes['[data-featured-video]'].innerHTML,/abcdefghijk/);
      assert.equal(nodes['[data-video-count]'].textContent,`${data.videos.length+1} VIDEOENSAIOS NO ARQUIVO`);
      assert.match(nodes['[data-latest-videos]'].innerHTML,/CRÔNICA 02/);
    }
  }
});
