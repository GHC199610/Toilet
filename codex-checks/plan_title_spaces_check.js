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
const normalizeTwoLineText = sectionBetween('function normalizeTwoLineText', 'function wrapCanvasTextLines');
const applyCanvasTextEditorValue = sectionBetween('function applyCanvasTextEditorValue', 'function clearSelectedBooth');
assertIncludes(normalizeTwoLineText, "parts.slice(0, 2).join('\\n')", 'plan title text should still be limited to two lines.');
assertNotIncludes(normalizeTwoLineText, '.trim()', 'plan title text must preserve spaces typed by the user.');
assertIncludes(applyCanvasTextEditorValue, 'const normalized = normalizeTwoLineText(value)', 'canvas title editor should keep using shared normalization.');
console.log('plan title spaces contract ok');
