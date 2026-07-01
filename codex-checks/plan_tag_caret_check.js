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
const drawPlan = sectionBetween('function drawPlan', 'function drawFront');
assertIncludes(source, 'function canvasTextCaretPosition()', 'canvas text caret should expose the editor selectionStart position.');
assertIncludes(drawPlan, 'const caret = canvasTextCaretPosition()', 'red tag caret should use the real editor caret position.');
assertIncludes(drawPlan, 'caret.lineTextBeforeCaret', 'red tag caret should measure text before the caret.');
assertNotIncludes(drawPlan, 'tagW / 2 + textW / 2', 'red tag caret must not always draw after the full tag text.');
console.log('plan tag caret position contract ok');
