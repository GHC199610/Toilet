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
const currentTextStyleTarget = sectionBetween('function currentTextStyleTarget()', 'function syncTextStyleControls');
const applyTextStyleChange = sectionBetween('function applyTextStyleChange', 'function toggleTextBold');
assertIncludes(currentTextStyleTarget, "selectionScope === 'sheet-note'", 'style target should use selected text scope, not focus state.');
assertIncludes(currentTextStyleTarget, "selectionScope === 'tag'", 'style target should support selected red tag independent of focus.');
assertIncludes(currentTextStyleTarget, "selectionScope === 'free-text'", 'style target should support selected free text independent of focus.');
assertNotIncludes(currentTextStyleTarget, 'activeCanvasTextEditable()', 'style target must not change when toolbar controls take focus.');
assertNotIncludes(applyTextStyleChange, 'selectedNoteTarget().set', 'style changes must not write text content.');
assertNotIncludes(applyTextStyleChange, 'noteInputValue', 'style changes must not sync text content.');
console.log('text style independent target contract ok');
