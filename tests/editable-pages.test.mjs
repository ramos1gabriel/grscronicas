import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {normalizeDownloads, renderDownloads} from '../dist/download-catalog.mjs';

test('comando da Cloudflare não altera nenhum arquivo público', async () => {
  const root = new URL('../', import.meta.url);
  const paths = (await readdir(new URL('dist/',root),{recursive:true,withFileTypes:true})).filter(p=>p.isFile());
  const snapshot = async () => Promise.all(paths.map(p=>readFile(`${p.parentPath ?? p.path}/${p.name}`,'utf8')));
  const before = await snapshot();
  execFileSync(process.execPath,['complete-pages.mjs'],{cwd:root});
  assert.deepEqual(await snapshot(),before);
});

const entry = {title:'Jogo <novo>',description:'Instruções & créditos',url:'/downloads/meu-jogo.zip'};
test('traduções aceitam ZIP local e HTTPS, escapam textos e rejeitam links inválidos', () => {
  assert.match(renderDownloads(normalizeDownloads([entry])),/Jogo &lt;novo&gt;/);
  assert.match(renderDownloads(normalizeDownloads([entry])),/href="\/downloads\/meu-jogo.zip"/);
  assert.equal(normalizeDownloads([{...entry,url:'https://example.com/patch.zip'}]).length,1);
  for(const url of ['javascript:alert(1)','http://example.com/a.zip','/downloads/../a.zip','/downloads/a.html']) {
    assert.throws(()=>normalizeDownloads([{...entry,url}]));
  }
});

test('downloads carregam cadastro, mensagem vazia e falha de rede', async () => {
  const source=(await readFile(new URL('../dist/downloads.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/,'').replace('updateDownloads();','globalThis.done = updateDownloads();');
  for(const scenario of ['filled','empty','offline']) {
    const list={innerHTML:''};
    const context=vm.createContext({normalizeDownloads,renderDownloads,console:{warn(){}},document:{querySelector:s=>s==='[data-download-list]'?list:{innerHTML:'Mensagem editada no HTML'}},fetch:async()=>{
      if(scenario==='offline')throw Error('offline');
      return {ok:true,json:async()=>({downloads:scenario==='filled'?[entry]:[]})};
    }});
    vm.runInContext(source,context);await context.done;
    assert.match(list.innerHTML,scenario==='filled'?/meu-jogo.zip/:scenario==='empty'?/Mensagem editada no HTML/:/Não foi possível carregar/);
  }
});
