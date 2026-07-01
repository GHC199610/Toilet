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
const applyHeight = sectionBetween('function applySelectedBoardPanelHeight', 'function resetSelectedBoardPanelHeight');
assertIncludes(applyHeight, 'const current = boardPanelHeightValue(target.panel, target.row)', 'selected board panel height should compare against current value before recording history.');
assertIncludes(applyHeight, 'if (next === current) return;', 're-submitting the same selected board panel height should not create an extra undo step.');
assertIncludes(applyHeight, 'pushHistory();', 'actual selected board panel height changes should still be recorded.');
console.log('board panel height no duplicate history contract ok');
