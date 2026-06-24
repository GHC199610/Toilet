const { test, expect } = require('@playwright/test');
test.setTimeout(120000);
const fs = require('fs');
const path = require('path');
const url = 'http://127.0.0.1:8787/toilet_partition_auto_generator_V2Pro.html';
const outDir = 'D:/Toilet/.codex-check';
fs.mkdirSync(outDir, {recursive:true});

async function sampleCanvas(page) {
  return await page.evaluate(() => {
    const c = document.getElementById('cv');
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    let nonWhite=0, nonTransparent=0;
    for (let y=0; y<10; y++) for (let x=0; x<10; x++) {
      const px = Math.floor((x+.5)*w/10), py = Math.floor((y+.5)*h/10);
      const d = ctx.getImageData(px,py,1,1).data;
      if (d[3] !== 0) nonTransparent++;
      if (!(d[0] > 245 && d[1] > 245 && d[2] > 245)) nonWhite++;
    }
    return {width:w, height:h, nonWhite, nonTransparent};
  });
}

async function scenario(page, label, isMobile=false) {
  const logs = [];
  page.on('console', msg => { if (['error','warning'].includes(msg.type())) logs.push({type:msg.type(), text:msg.text()}); });
  page.on('pageerror', err => logs.push({type:'pageerror', text:err.message}));
  const results = [];
  const check = async (name, fn) => {
    try { results.push({name, ok:true, detail: await fn()}); }
    catch (e) { results.push({name, ok:false, error: e.message}); }
  };
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1000);
  await check('initial-visible', async () => ({title: await page.title(), sidebar: await page.locator('.sidebar').isVisible(), canvas: await page.locator('#cv').isVisible()}));
  await check('canvas-nonblank', async () => await sampleCanvas(page));
  await check('default-bom', async () => (await page.locator('#bom').innerText()).slice(0,300));
  await check('tabs-switch', async () => {
    await page.locator('#tab-front').click(); await page.waitForTimeout(150);
    const front = await page.locator('#tab-front').evaluate(e => e.className);
    await page.locator('#tab-side').click(); await page.waitForTimeout(150);
    const side = await page.locator('#tab-side').evaluate(e => e.className);
    await page.locator('#tab-plan').click(); await page.waitForTimeout(150);
    return {front, side, plan: await page.locator('#tab-plan').evaluate(e => e.className)};
  });
  await check('input-count-updates-width-cards', async () => {
    await page.locator('#p-count').fill('5');
    await page.locator('#p-count').dispatchEvent('change');
    await page.waitForTimeout(300);
    return {cards: await page.locator('#width-card-row .width-card').count(), value: await page.locator('#p-count').inputValue()};
  });
  await check('wall-buttons-active', async () => {
    await page.locator('.wall-btn[data-wall="left"]').click(); await page.waitForTimeout(150);
    return await page.locator('.wall-btn.active').getAttribute('data-wall');
  });
  await check('rebate-toggle', async () => {
    const before = await page.locator('#p-rebate').isChecked();
    await page.locator('#rebate-toggle').click(); await page.waitForTimeout(150);
    return {before, after: await page.locator('#p-rebate').isChecked()};
  });
  await check('quick-layout-select', async () => {
    await page.locator('button', {hasText:'全选'}).first().click(); await page.waitForTimeout(150);
    return {active: await page.evaluate(() => window.quickSelectAllActive), selected: await page.evaluate(() => window.selectionScope)};
  });
  await check('save-dialog-open-close', async () => {
    await page.locator('.save-drawing-btn').click(); await page.waitForTimeout(150);
    const open = await page.locator('#save-drawing-modal').evaluate(e => e.classList.contains('active') || e.getAttribute('aria-hidden') === 'false');
    await page.locator('#save-drawing-modal .project-close').click(); await page.waitForTimeout(100);
    return {open, hidden: await page.locator('#save-drawing-modal').getAttribute('aria-hidden')};
  });
  await check('urinal-panel-save', async () => {
    await page.locator('button', {hasText:'小便板'}).click(); await page.waitForTimeout(150);
    const visible = await page.locator('#urinal-panel').isVisible();
    await page.locator('#u-count').fill('2');
    await page.locator('#urinal-panel button.primary').click(); await page.waitForTimeout(200);
    return {visible, bom: (await page.locator('#bom').innerText()).includes('小便')};
  });
  await check('export-dialogs', async () => {
    await page.locator('#btn-export-current').click(); await page.waitForTimeout(150);
    const currentOpen = await page.locator('#export-name-modal').evaluate(e => e.classList.contains('active') || e.getAttribute('aria-hidden') === 'false');
    await page.locator('#export-name-modal .project-close').click();
    await page.locator('#btn-print-pdf').click(); await page.waitForTimeout(150);
    const pdfOpen = await page.locator('#export-name-modal').evaluate(e => e.classList.contains('active') || e.getAttribute('aria-hidden') === 'false');
    return {currentOpen, pdfOpen};
  });
  await check('zoom-reset-and-wheel', async () => {
    const before = await page.locator('#zoom-info').innerText();
    await page.mouse.wheel(0, -300); await page.waitForTimeout(100);
    const zoomed = await page.locator('#zoom-info').innerText();
    await page.locator('button', {hasText:'重置视图'}).click(); await page.waitForTimeout(100);
    return {before, zoomed, reset: await page.locator('#zoom-info').innerText()};
  });
  if (isMobile) {
    await check('mobile-collapse-toggles', async () => {
      const sec = page.locator('#mobile-section-swing');
      const before = await sec.evaluate(e => e.className);
      await sec.locator('.mobile-sec-toggle').click(); await page.waitForTimeout(150);
      const after = await sec.evaluate(e => e.className);
      await page.locator('.bom-toggle').click(); await page.waitForTimeout(150);
      return {before, after, bomClass: await page.locator('#bom-area').evaluate(e => e.className)};
    });
    await check('mobile-top-button', async () => {
      await page.evaluate(() => document.querySelector('.sidebar')?.scrollTo(0, 9999));
      await page.locator('.top-btn').click(); await page.waitForTimeout(400);
      return await page.evaluate(() => document.querySelector('.sidebar')?.scrollTop ?? window.scrollY);
    });
  }
  const summary = {label, logs, results};
  fs.writeFileSync(path.join(outDir, `${label}.json`), JSON.stringify(summary,null,2), 'utf8');
  await page.screenshot({path:path.join(outDir, `${label}.png`), fullPage:false, timeout:15000});
  for (const r of results) expect(r.ok, `${label}:${r.name}:${r.error || ''}`).toBeTruthy();
}

test('desktop interactions', async ({ page }) => scenario(page, 'desktop-1440x1000', false));
test.use({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
test('mobile interactions', async ({ page }) => scenario(page, 'mobile-390x844', true));


