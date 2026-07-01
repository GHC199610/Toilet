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
const mouseDown = sectionBetween("cv.addEventListener('mousedown'", "cv.addEventListener('dblclick'");
const tapHandler = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
const textModeIndex = tapHandler.indexOf('if (textToolMode) {');
const hitIndex = tapHandler.indexOf('const hit = hitPlanSelectable');
if (!(textModeIndex > 0 && hitIndex > 0 && textModeIndex < hitIndex)) {
  throw new Error('T text mode should create text before normal selectable hit priority.');
}
assertIncludes(mouseDown, 'if (textToolMode) return;', 'mousedown should not start sheet/block dragging while T text mode is active.');
console.log('free plan text priority contract ok');
