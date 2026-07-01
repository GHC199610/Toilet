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
const drawPlanRow = sectionBetween('function drawPlanRow', 'const edge = c.edge');
assertIncludes(drawPlanRow, 'const boardPanelHitPad =', 'front panel hit area should have explicit padding.');
assertIncludes(drawPlanRow, 'y:hitY + (boardY - boardPanelHitPad) * hitScale', 'front panel hit area should extend above the panel.');
assertIncludes(drawPlanRow, 'h:(st + boardPanelHitPad * 2) * hitScale', 'front panel hit area should extend below the panel.');
console.log('board panel hit area contract ok');
