const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}
const selectedBoardPanelRow = sectionBetween('function selectedBoardPanelRow', 'function refreshTextToolButton');
const dimensionCurrentValue = sectionBetween('function dimensionCurrentValue', 'function commitDimensionValue');
const commitDimensionValue = sectionBetween('function commitDimensionValue', 'function positionDimensionEditor');
assertIncludes(source, 'function resolveBoardPanelForRow', 'front panel history should resolve selected panel data from current row state.');
assertIncludes(selectedBoardPanelRow, 'resolveBoardPanelForRow(selectedBoardPanelRef.panel, row)', 'selected front panel should not reuse stale panel dimensions after undo/redo.');
assertIncludes(dimensionCurrentValue, 'resolveBoardPanelForRow(meta.panel, row)', 'front panel dimension editor should read current row panel dimensions after undo/redo.');
assertIncludes(commitDimensionValue, 'resolveBoardPanelForRow(meta.panel, row)', 'front panel dimension commit should lock the current row panel after undo/redo.');
console.log('front panel history resolution contract ok');
