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
const drawSheetNoteCard = sectionBetween('function drawSheetNoteCard', 'function drawTitleBlock');
const drawFreePlanTexts = sectionBetween('function drawFreePlanTexts', 'function drawDimensionCaret');
const editorKeydown = sectionBetween("document.getElementById('canvas-text-editor')?.addEventListener('keydown'", "document.getElementById('canvas-text-editor')?.addEventListener('keyup'");
assertIncludes(source, 'function drawTextSelectionMarker', 'text selections should use a lightweight marker.');
assertIncludes(drawSheetNoteCard, 'drawTextSelectionMarker(x, y, w, h)', 'selected title/sheet note should use lightweight text selection.');
assertNotIncludes(drawSheetNoteCard, 'drawSelectedBoardPanelMarker(x, y, w, h)', 'selected title/sheet note should not use board selection marker.');
assertIncludes(drawFreePlanTexts, 'const lines = String(textValue || \' \').split(\'\\n\')', 'free text should render newline-separated lines.');
assertIncludes(drawFreePlanTexts, 'drawTextSelectionMarker(x, y, width, height)', 'selected free text should use lightweight text selection.');
assertNotIncludes(drawFreePlanTexts, 'drawSelectedBoardPanelMarker(x, y, width, height)', 'selected free text should not use board selection marker.');
assertNotIncludes(editorKeydown, "if (selectionScope === 'free-text')", 'free text Enter should not be blocked.');
console.log('text selection and multiline contract ok');
