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
function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) throw new Error(message);
}
const sourceSelection = sectionBetween('function selectedNoteTarget()', 'function syncPlanNoteInputFromSelection');
const activeEditable = sectionBetween('function activeCanvasTextEditable()', 'function focusCanvasTextEditor');
const drawView = sectionBetween('function drawView(p, tab)', 'function syncActiveCanvasTextEditorPosition');
const tapHandler = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
assertIncludes(source, 'let freePlanTexts = []', 'free text annotations should have persistent state.');
assertIncludes(source, 'let selectedFreeTextId = null', 'free text editing should track selected annotation id.');
assertIncludes(activeEditable, "selectionScope === 'free-text'", 'canvas text editor should edit free text annotations.');
assertIncludes(sourceSelection, "selectionScope === 'free-text'", 'selected note target should route to selected free text.');
assertIncludes(drawView, "if (tab === 'plan') drawFreePlanTexts();", 'plan drawing should render free text annotations in all plan canvas modes.');
assertIncludes(tapHandler, 'startFreePlanTextAtPoint(pt)', 'blank plan clicks should create free text at the clicked point.');
console.log('free plan text contract ok');
