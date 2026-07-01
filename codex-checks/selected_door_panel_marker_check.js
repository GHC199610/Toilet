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
const drawPlanRow = sectionBetween('function drawPlanRow', 'const boardModel = buildBoardModel');
assertIncludes(drawPlanRow, 'const doorSelected = isSelectedBooth', 'door panel body should check booth selection.');
assertIncludes(drawPlanRow, 'if (doorSelected && hasDoor && !drawingForExport) drawSelectedBoardPanelMarker(bigStart, oy + sD, bigEnd - bigStart, st)', 'selected door panel body should show the same selection marker.');
assertIncludes(drawPlanRow, 'drawSelectedBoardPanelMarker(labelX - textW / 2 - padX', 'existing selected booth label marker should remain.');
console.log('selected door panel body marker contract ok');
