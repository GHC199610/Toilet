const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const url = 'http://127.0.0.1:8787/toilet_partition_auto_generator_V2Pro.html';
const outDir = 'D:/Toilet/.codex-check';
fs.mkdirSync(outDir, {recursive:true});
const withTimeout = (p, ms, name) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms in ${name}`)), ms))]);
async function sampleCanvas(page) {
  return await page.evaluate(() => {
    const c = document.getElementById('cv');
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    let nonWhite=0, nonTransparent=0;
    for (let y=0; y<10; y++) for (let x=0; x<10; x++) {
      const d = ctx.getImageData(Math.floor((x+.5)*w/10), Math.floor((y+.5)*h/10), 1, 1).data;
      if (d[3] !== 0) nonTransparent++;
      if (!(d[0] > 245 && d[1] > 245 && d[2] > 245)) nonWhite++;
    }
    return {width:w, height:h, nonWhite, nonTransparent};
  });
}
async function run(label, viewport, isMobile=false) {
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport, isMobile, hasTouch:isMobile, deviceScaleFactor:isMobile?2:1, acceptDownloads:true});
  const page = await context.newPage();
  const logs = [];
  page.on('console', msg => { if (['error','warning'].includes(msg.type())) logs.push({type:msg.type(), text:msg.text()}); });
  page.on('pageerror', err => logs.push({type:'pageerror', text:err.message}));
  page.on('dialog', async d => { logs.push({type:'dialog', text:d.message()}); await d.dismiss().catch(()=>{}); });
  const results = [];
  const write = () => fs.writeFileSync(path.join(outDir, `${label}.json`), JSON.stringify({label, logs, results}, null, 2), 'utf8');
  const check = async (name, fn, ms=5000) => {
    const started = Date.now();
    results.push({name, status:'running'}); write();
    const idx = results.length - 1;
    try { results[idx] = {name, ok:true, ms:Date.now()-started, detail: await withTimeout(fn(), ms, name)}; }
    catch (e) { results[idx] = {name, ok:false, ms:Date.now()-started, error:e.message}; }
    write();
  };
  await check('goto', async () => { await page.goto(url, {waitUntil:'domcontentloaded', timeout:10000}); await page.waitForTimeout(1000); return await page.title(); }, 15000);
  await check('initial-visible', async () => ({sidebar: await page.locator('.sidebar').isVisible(), canvas: await page.locator('#cv').isVisible(), body: await page.locator('body').boundingBox()}));
  await check('canvas-nonblank', async () => await sampleCanvas(page));
  await check('default-bom', async () => (await page.locator('#bom').innerText({timeout:2000})).slice(0,300));
  await check('tabs-switch', async () => { await page.locator('#tab-front').click({timeout:2000}); await page.locator('#tab-side').click({timeout:2000}); await page.locator('#tab-plan').click({timeout:2000}); return await page.locator('#tab-plan').evaluate(e=>e.className); });
  await check('input-count-updates-width-cards', async () => { await page.locator('#p-count').fill('5'); await page.locator('#p-count').dispatchEvent('change'); await page.waitForTimeout(300); return {cards: await page.locator('#width-card-row .width-card').count(), value: await page.locator('#p-count').inputValue()}; });
  await check('wall-buttons-active', async () => { await page.locator('.wall-btn[data-wall="left"]').click({timeout:2000}); await page.waitForTimeout(150); return await page.locator('.wall-btn.active').getAttribute('data-wall'); });
  await check('rebate-toggle', async () => { const before = await page.locator('#p-rebate').isChecked(); await page.locator('#rebate-toggle').click({timeout:2000}); await page.waitForTimeout(150); return {before, after: await page.locator('#p-rebate').isChecked()}; });
  await check('quick-layout-select', async () => { await page.locator('button', {hasText:'全选'}).first().click({timeout:2000}); await page.waitForTimeout(150); return {active: await page.evaluate(() => window.quickSelectAllActive), selected: await page.evaluate(() => window.selectionScope)}; });
  await check('save-dialog-open-close', async () => { await page.locator('.save-drawing-btn').click({timeout:2000}); await page.waitForTimeout(150); const open = await page.locator('#save-drawing-modal').evaluate(e => e.classList.contains('active') || e.getAttribute('aria-hidden') === 'false'); await page.keyboard.press('Escape').catch(()=>{}); await page.locator('#save-drawing-modal .project-close').click({timeout:2000}).catch(()=>{}); return {open, hidden: await page.locator('#save-drawing-modal').getAttribute('aria-hidden')}; });
  await check('urinal-panel-save', async () => { await page.locator('button', {hasText:'小便板'}).click({timeout:2000}); await page.waitForTimeout(150); const visible = await page.locator('#urinal-panel').isVisible(); await page.locator('#u-count').fill('2'); await page.locator('#urinal-panel button.primary').click({timeout:2000}); await page.waitForTimeout(200); return {visible, bom: (await page.locator('#bom').innerText()).includes('小便')}; });
  await check('export-current-dialog', async () => { await page.locator('#btn-export-current').click({timeout:2000}); await page.waitForTimeout(150); return await page.locator('#export-name-modal').evaluate(e => ({cls:e.className, hidden:e.getAttribute('aria-hidden'), value:document.getElementById('export-file-name')?.value})); });
  await check('close-export-dialog', async () => { await page.locator('#export-name-modal .project-close').click({timeout:2000}); await page.waitForTimeout(100); return await page.locator('#export-name-modal').getAttribute('aria-hidden'); });
  await check('zoom-reset-and-wheel', async () => { const before = await page.locator('#zoom-info').innerText(); await page.mouse.wheel(0,-300); await page.waitForTimeout(100); const zoomed = await page.locator('#zoom-info').innerText(); await page.locator('button', {hasText:'重置视图'}).click({timeout:2000}); await page.waitForTimeout(100); return {before, zoomed, reset: await page.locator('#zoom-info').innerText()}; });
  if (isMobile) {
    await check('mobile-collapse-toggles', async () => { const sec = page.locator('#mobile-section-swing'); const before = await sec.evaluate(e=>e.className); await sec.locator('.mobile-sec-toggle').click({timeout:2000}); await page.waitForTimeout(150); const after = await sec.evaluate(e=>e.className); await page.locator('.bom-toggle').click({timeout:2000}); await page.waitForTimeout(150); return {before, after, bomClass: await page.locator('#bom-area').evaluate(e=>e.className)}; });
    await check('mobile-top-button', async () => { await page.evaluate(() => document.querySelector('.sidebar')?.scrollTo(0,9999)); await page.locator('.top-btn').click({timeout:2000}); await page.waitForTimeout(400); return await page.evaluate(() => document.querySelector('.sidebar')?.scrollTop ?? window.scrollY); });
  }
  await check('screenshot', async () => { await page.screenshot({path:path.join(outDir, `${label}.png`), fullPage:false, timeout:10000}); return `${label}.png`; }, 12000);
  await browser.close().catch(()=>{});
  write();
  return {label, logs, results};
}
(async()=>{
  const results=[];
  results.push(await run('desktop-1440x1000', {width:1440,height:1000}, false));
  results.push(await run('mobile-390x844', {width:390,height:844}, true));
  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(results,null,2), 'utf8');
  console.log(JSON.stringify(results.map(r => ({label:r.label, failed:r.results.filter(x=>!x.ok), logs:r.logs})), null, 2));
})();
