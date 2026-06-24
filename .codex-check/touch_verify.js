const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const page=await context.newPage();
 const logs=[]; page.on('pageerror', e=>logs.push(e.message)); page.on('console', m=>{if(m.type()==='error') logs.push(m.text())});
 await page.goto('http://127.0.0.1:8787/toilet_partition_auto_generator_V2Pro.html',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(1000);
 const box=await page.locator('#cv').boundingBox();
 const before=await page.locator('#zoom-info').innerText();
 await page.touchscreen.tap(box.x + box.width/2, box.y + box.height/2);
 await page.waitForTimeout(100);
 const afterTap=await page.locator('#zoom-info').innerText();
 await page.evaluate(() => {
   const cv=document.getElementById('cv');
   const r=cv.getBoundingClientRect();
   const mk=(type, touches)=>cv.dispatchEvent(new TouchEvent(type,{bubbles:true,cancelable:true,touches,changedTouches:touches,targetTouches:touches}));
   const t=(id,x,y)=>new Touch({identifier:id,target:cv,clientX:r.left+x,clientY:r.top+y});
   mk('touchstart',[t(1,160,300),t(2,220,300)]);
   mk('touchmove',[t(1,130,300),t(2,250,300)]);
   mk('touchend',[]);
 });
 await page.waitForTimeout(200);
 const afterPinch=await page.locator('#zoom-info').innerText();
 console.log(JSON.stringify({before, afterTap, afterPinch, logs},null,2));
 await browser.close();
})();
