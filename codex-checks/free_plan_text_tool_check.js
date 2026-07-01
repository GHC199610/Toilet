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
function assertNotIncludes(haystack, needle, message) { if (haystack.includes(needle)) throw new Error(message); }
const sheetActions = sectionBetween('<div class="sheet-actions" id="sheet-actions">', '<div class="export-row">');
const tapHandler = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
assertIncludes(sheetActions, 'id="text-tool-toggle"', 'sheet actions should include a T text tool button near urinal controls.');
assertIncludes(sheetActions, 'toggleTextToolMode()', 'T button should toggle text insertion mode.');
assertIncludes(source, 'let textToolMode = false', 'text tool should have explicit insertion mode state.');
assertIncludes(source, 'function toggleTextToolMode()', 'text tool mode should have a toggle function.');
assertIncludes(tapHandler, 'if (textToolMode) {', 'blank plan tap should create text only while text tool is active.');
assertIncludes(tapHandler, 'startFreePlanTextAtPoint(pt)', 'text tool mode should create free text on click.');
assertNotIncludes(tapHandler, 'if (!hit) {\n    startFreePlanTextAtPoint(pt);', 'blank plan taps must not always create text.');
console.log('free plan text tool contract ok');
