import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

test('layout compartilhado destaca cada rota e mantém links básicos em falhas', async () => {
  const source=(await readFile(new URL('../dist/layout.js',import.meta.url),'utf8')).replace(/export /g,'').replace('await Promise.all([','globalThis.done = Promise.all([');
  for(const pathname of ['/','/videos/','/downloads','/sobre/index.html','/contato/']) {
    for(const failure of [null,'network','http']) {
      const links=['/','/videos/','/downloads/','/sobre/','/contato/'].map(href=>({href,current:null,getAttribute(){return href;},removeAttribute(){this.current=null;},setAttribute(k,v){this.current=v;}}));
      const header={innerHTML:'Home',querySelectorAll:()=>links};
      const footer={innerHTML:'Contato'};
      const context=vm.createContext({URL,window:{location:{origin:'https://grscronicas.com',pathname}},document:{querySelector:s=>s==='[data-site-header]'?header:footer},console:{warn(){}},fetch:async path=>{
        if(failure==='network')throw Error('offline');
        return {ok:failure!=='http',status:404,text:async()=>path.includes('header')?'Cabeçalho alterado uma vez':'Rodapé alterado uma vez'};
      }});
      vm.runInContext(source,context);await context.done;
      if(failure){assert.equal(header.innerHTML,'Home');assert.equal(footer.innerHTML,'Contato');}
      else {
        assert.equal(header.innerHTML,'Cabeçalho alterado uma vez');
        assert.equal(footer.innerHTML,'Rodapé alterado uma vez');
        const active=links.filter(l=>l.current==='page');assert.equal(active.length,1);
        assert.equal(active[0].href.replace(/\/$/,''),pathname.replace(/\/index.html$/,'').replace(/\/$/,''));
      }
    }
  }
});

test('as cinco páginas usam os mesmos fragmentos sem duplicar o layout', async () => {
  for(const path of ['index.html','videos/index.html','downloads/index.html','sobre/index.html','contato/index.html']) {
    const html=await readFile(new URL('../dist/'+path,import.meta.url),'utf8');
    assert.match(html,/data-site-header/);assert.match(html,/data-site-footer/);
    assert.match(html,/src="\/layout.js"/);assert.ok(!html.includes('class="footer-brand"'));
    assert.ok(!html.includes('aria-current="page"'));
  }
});
