const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
const dblClickHandler = sectionBetween("cv.addEventListener('dblclick'", 'function handlePlanTapFromPoint');
const tapHandler = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
const hitPlanSelectable = sectionBetween('function hitPlanSelectable', 'function hitPlanBlock');
assertIncludes(source, 'function editFreePlanTextFromHit', 'free text should have a reusable edit entry point.');
assertIncludes(hitPlanSelectable, "area.type === 'free-text'", 'free text hit areas should be selectable for click, double click, and drag.');
assertIncludes(dblClickHandler, "textHit?.type === 'free-text'", 'double click should detect existing free text.');
assertIncludes(dblClickHandler, 'editFreePlanTextFromHit(textHit)', 'double click should enter edit mode for the hit free text.');
assertIncludes(tapHandler, "if (hit.type === 'free-text')", 'single click should select an existing free text before row lookup.');
assertIncludes(tapHandler, 'editFreePlanTextFromHit(hit)', 'free text selection should use the same edit setup path.');
console.log('free plan text double click edit contract ok');
