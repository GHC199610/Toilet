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
assertNotIncludes(source, 'bomCollapsed:', 'BOM collapsed/expanded state should not be part of variable history.');
assertNotIncludes(source, 'restoreBomCollapsedState', 'BOM collapsed/expanded state should not restore through variable history.');
[
  ['function saveUrinalSpec', 'function deleteUrinalSpec', 'pushHistory()'],
  ['function deleteUrinalSpec', 'function clearAutoCompactSheetLayout', 'pushHistory()'],
  ['function setBoardSheetEstimateInput', 'function setActiveBoardSheet', 'pushHistory()'],
  ['function setActiveBoardSheet', 'function toggleBoardSheetEnabled', 'pushHistory()'],
  ['function toggleBoardSheetEnabled', 'function toggleBoardRotate', 'pushHistory()'],
  ['function toggleBoardRotate', 'function renderBomItems', 'pushHistory()']
].forEach(([start, end, needle]) => {
  assertIncludes(sectionBetween(start, end), needle, `${start} should explicitly record BOM history.`);
});
assertNotIncludes(sectionBetween('function toggleBom', 'function toggleMobileBom'), 'pushHistory()', 'BOM expand/collapse is UI state and should not be recorded.');
console.log('BOM history contract ok');
