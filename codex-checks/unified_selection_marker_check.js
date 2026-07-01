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
const drawSheetHeader = sectionBetween('function drawSheetNoteCard', 'function drawTitleBlock');
const drawFree = sectionBetween('function drawFreePlanTexts', 'function drawDimensionCaret');
const drawPlanRow = sectionBetween('function drawPlanRow', 'const edge = c.edge');
assertIncludes(drawSheetHeader, 'drawTextSelectionMarker(x, y, w, h)', 'selected sheet note should use the lightweight text marker.');
assertIncludes(drawFree, 'drawTextSelectionMarker(x, y, width, height)', 'selected free text should use the lightweight text marker.');
assertIncludes(drawPlanRow, 'drawSelectedBoardPanelMarker(tagX, tagY, tagW, tagH)', 'selected red tag should use the middle partition selection marker.');
assertIncludes(drawPlanRow, 'drawSelectedBoardPanelMarker(labelX - textW / 2 - padX, labelY - textH / 2 - padY, textW + padX * 2, textH + padY * 2)', 'selected booth label should use the middle partition selection marker.');
assertIncludes(drawPlanRow, 'drawSelectedBoardPanelMarker(ox, oy, sW, sD)', 'selected row/block should use the middle partition selection marker.');
assertNotIncludes(drawPlanRow, 'ctx.setLineDash([anno(46), anno(26)])', 'row/block selection should not use a separate custom dashed style.');
console.log('unified selection marker contract ok');
