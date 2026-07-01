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
const sheetActions = sectionBetween('<div class="sheet-actions" id="sheet-actions">', '<div class="export-row">');
const selectedNoteTarget = sectionBetween('function selectedNoteTarget()', 'function syncPlanNoteInputFromSelection');
const drawSheetNoteCard = sectionBetween('function drawSheetNoteCard', 'function drawTitleBlock');
const drawPlanRow = sectionBetween('function drawPlanRow', 'const drawDepthPanel');
const drawFreePlanTexts = sectionBetween('function drawFreePlanTexts', 'function drawDimensionCaret');
assertIncludes(sheetActions, 'id="text-size-input"', 'text toolbar should include font size input.');
assertIncludes(sheetActions, 'id="text-bold-toggle"', 'text toolbar should include bold toggle.');
assertIncludes(sheetActions, 'id="text-color-button"', 'text toolbar should include color palette button.');
assertIncludes(sheetActions, 'id="text-color-palette"', 'text toolbar should include color palette grid.');
assertIncludes(source, 'let defaultTextStyle =', 'text style should have a default for new text.');
assertIncludes(source, 'let sheetHeaderStyle = {fontSize:15', 'sheet title should default to font size 15.');
assertIncludes(source, "let defaultTextStyle = {fontSize:15, bold:false, color:'#000000'}", 'free text default font size and color should be 15 black.');
assertIncludes(sheetActions, 'id="text-size-input" class="text-style-size" type="number" min="8" max="96" step="1" value="15"', 'text toolbar size input should default to 15.');
assertIncludes(source, 'function currentTextStyleTarget()', 'text style controls should resolve current editable text target.');
assertIncludes(source, 'function applyTextStyleChange', 'text style controls should apply style to current/default text.');
assertIncludes(selectedNoteTarget, 'style:', 'editable text targets should expose style configuration.');
assertIncludes(drawSheetNoteCard, 'style.fontSize', 'sheet title should use configurable font size.');
assertIncludes(drawSheetNoteCard, 'style.bold', 'sheet title should use configurable bold.');
assertIncludes(drawSheetNoteCard, 'style.color', 'sheet title should use configurable color.');
assertIncludes(drawPlanRow, 'tagStyle.fontSize', 'red tag should use configurable font size.');
assertIncludes(drawPlanRow, 'tagStyle.bold', 'red tag should use configurable bold.');
assertIncludes(drawPlanRow, 'tagStyle.color', 'red tag should use configurable color.');
assertIncludes(drawFreePlanTexts, 'style.fontSize', 'free text should use configurable font size.');
assertIncludes(drawFreePlanTexts, 'style.bold', 'free text should use configurable bold.');
assertIncludes(drawFreePlanTexts, 'style.color', 'free text should use configurable color.');
console.log('text style toolbar contract ok');
