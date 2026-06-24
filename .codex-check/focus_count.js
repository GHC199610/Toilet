const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 for (const cfg of [{label:'desktop', viewport:{width:1440,height:1000}, isMobile:false},{label:'mobile', viewport:{width:390,height:844}, isMobile:true}]) {
  const context=await browser.newContext({viewport:cfg.viewport,isMobile:cfg.isMobile,hasTouch:cfg.isMobile,deviceScaleFactor:cfg.isMobile?2:1});
  const page=await context.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message)); page.on('console', m=>{ if(m.type()==='error') errors.push(m.text()) });
  await page.goto('http://127.0.0.1:8787/toilet_partition_auto_generator_V2Pro.html',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1000);
  const profile = await page.evaluate(async () => {
    const out=[];
    const t=(name, fn)=>{ const s=performance.now(); try { const r=fn(); out.push({name, ms:performance.now()-s, result:r}); } catch(e){ out.push({name, ms:performance.now()-s, error:e.message}); }};
    t('initial cards',()=>document.querySelectorAll('#width-card-row .width-card').length);
    const el=document.getElementById('p-count');
    t('set value',()=>{el.value='5'; return el.value;});
    t('dispatch input',()=>el.dispatchEvent(new Event('input',{bubbles:true})));
    t('after input cards',()=>document.querySelectorAll('#width-card-row .width-card').length);
    t('dispatch change',()=>el.dispatchEvent(new Event('change',{bubbles:true})));
    t('after change cards',()=>document.querySelectorAll('#width-card-row .width-card').length);
    t('generate',()=>{ window.generate(); return document.querySelectorAll('#width-card-row .width-card').length;});
    return out;
  });
  console.log(cfg.label, JSON.stringify({profile, errors},null,2));
  await context.close();
 }
 await browser.close();
})();
