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
function assertNotIncludes(haystack, needle, message) {
  if (haystack.includes(needle)) throw new Error(message);
}
const drawSheetNoteCard = sectionBetween('function drawSheetNoteCard', 'function drawTitleBlock');
assertIncludes(source, 'function canvasTextCaretPosition()', 'canvas text caret should expose the editor selectionStart position.');
assertIncludes(drawSheetNoteCard, 'const caret = canvasTextCaretPosition()', 'sheet title caret should use the real editor caret position.');
assertIncludes(drawSheetNoteCard, 'caret.lineIndex', 'sheet title caret should choose the visible line from caret position.');
assertIncludes(drawSheetNoteCard, 'caret.lineTextBeforeCaret', 'sheet title caret should measure text before the caret, not the full title.');
assertNotIncludes(drawSheetNoteCard, 'const lastLine = lines[lines.length - 1] ||', 'sheet title caret must not always use the final rendered line.');
console.log('plan title caret position contract ok');
