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
const targets = sectionBetween('function selectionDeleteTargets', 'function deleteSelectedItems');
const del = sectionBetween('function deleteSelectedItems', 'function setSelectedDepthPanel');
assertIncludes(targets, "selectionScope === 'free-text'", 'single selected free text should be a delete target.');
assertIncludes(targets, "selectionScope === 'board-panel'", 'single selected board panel should be a delete target.');
assertIncludes(del, "target.type === 'free-text'", 'delete should remove selected free text annotations.');
assertIncludes(del, "target.type === 'board-panel'", 'delete should reset selected board panel custom variables.');
assertIncludes(source, 'function clearBoardPanelCustomVariables', 'board panel delete should use a focused helper.');
console.log('delete any selected item contract ok');
