const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const cases=[{label:'desktop', viewport:{width:1440,height:1000}, isMobile:false},{label:'mobile', viewport:{width:390,height:844}, isMobile:true}];
 for (const cfg of cases) {
  const context=await browser.newContext({viewport:cfg.viewport,isMobile:cfg.isMobile,hasTouch:cfg.isMobile,deviceScaleFactor:cfg.isMobile?2:1});
  const page=await context.newPage();
  const logs=[]; page.on('pageerror', e=>logs.push({type:'pageerror', text:e.message})); page.on('console', m=>{ if(['error','warning'].includes(m.type())) logs.push({type:m.type(), text:m.text()}); });
  await page.goto('http://127.0.0.1:8787/toilet_partition_auto_generator_V2Pro.html',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1000);
  const out={label:cfg.label, checks:{}, logs};
  async function check(name, fn){ try{ out.checks[name]=await fn(); }catch(e){ out.checks[name]={error:e.message}; } }
  await check('wall', async()=>{
    if(cfg.isMobile){ await page.locator('#mobile-section-wall .mobile-sec-toggle').click(); await page.waitForTimeout(150); }
    await page.locator('.wall-btn[data-wall="left"]').click({timeout:3000}); await page.waitForTimeout(150);
    return {active: await page.locator('.wall-btn[data-wall].active').getAttribute('data-wall'), visible: await page.locator('.wall-btn[data-wall="left"]').isVisible()};
  });
  await check('urinal', async()=>{
    await page.locator('button', {hasText:'小便板'}).click({timeout:3000}); await page.waitForTimeout(150);
    const z = await page.locator('#urinal-panel').evaluate(e=>getComputedStyle(e).zIndex);
    const visible=await page.locator('#urinal-panel').isVisible();
    await page.locator('#u-count').fill('2');
    await page.locator('#urinal-panel button.primary').click({timeout:3000}); await page.waitForTimeout(200);
    return {visible,z,open: await page.locator('#urinal-panel').evaluate(e=>e.classList.contains('open')), bom:(await page.locator('#bom').innerText()).includes('小便')};
  });
  await check('exportDialog', async()=>{
    await page.locator('#btn-export-current').click({timeout:3000}); await page.waitForTimeout(150);
    const opened=await page.locator('#export-modal').evaluate(e=>({cls:e.className, hidden:e.getAttribute('aria-hidden'), value:document.getElementById('export-file-name')?.value}));
    await page.locator('#export-modal .project-close').click({timeout:3000}); await page.waitForTimeout(150);
    const closed=await page.locator('#export-modal').evaluate(e=>({cls:e.className, hidden:e.getAttribute('aria-hidden')}));
    return {opened, closed};
  });
  await check('zoom', async()=>{
    const before=await page.locator('#zoom-info').innerText();
    await page.mouse.move(cfg.viewport.width/2, cfg.viewport.height/2);
    await page.mouse.wheel(0,-300); await page.waitForTimeout(150);
    const zoomed=await page.locator('#zoom-info').innerText();
    await page.locator('button', {hasText:'重置视图'}).click({timeout:3000}); await page.waitForTimeout(150);
    return {before, zoomed, reset: await page.locator('#zoom-info').innerText()};
  });
  if(cfg.isMobile){
    await check('mobileCollapse', async()=>{
      const sec=page.locator('#mobile-section-swing');
      const before=await sec.evaluate(e=>e.className);
      await sec.locator('.mobile-sec-toggle').click({timeout:3000}); await page.waitForTimeout(150);
      return {before, after: await sec.evaluate(e=>e.className)};
    });
    await check('top', async()=>{
      await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await page.waitForTimeout(100);
      const before=await page.evaluate(()=>window.scrollY);
      await page.locator('.top-btn').click({timeout:3000}); await page.waitForTimeout(500);
      return {before, after: await page.evaluate(()=>window.scrollY)};
    });
  }
  await page.screenshot({path:`D:/Toilet/.codex-check/${cfg.label}-targeted.png`, fullPage:false});
  console.log(JSON.stringify(out,null,2));
  await context.close();
 }
 await browser.close();
})();
