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
const tapHandler = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
const hitPlanSelectable = sectionBetween('function hitPlanSelectable', 'function hitPlanBlock');
const renderDepthPanelSpecialPanel = sectionBetween('function renderDepthPanelSpecialPanel', 'function limitDepthPanelCardInput');
const selectedBoardMarker = sectionBetween('function drawSelectedBoardPanelMarker', 'function drawGenericBoardPanelSelection');
assertIncludes(source, 'let selectedBoardPanelRef = null', 'all board panels should have selection state.');
assertIncludes(source, 'function setSelectedBoardPanel', 'board panel selection should use a helper.');
assertIncludes(source, 'function isSelectedBoardPanel', 'board panel drawing should be able to test selection.');
assertIncludes(hitPlanSelectable, "area.type === 'board-panel'", 'generic board panels should participate in plan hit testing.');
assertIncludes(tapHandler, "hit.type === 'board-panel'", 'clicking a generic board panel should select it.');
assertIncludes(drawPlanRow, "type:'board-panel'", 'plan drawing should register hit areas for non-depth board panels.');
assertIncludes(source, 'function drawSelectedBoardPanelMarker', 'selected board panels should use the board-specific marker style.');
assertIncludes(drawPlanRow, 'drawSelectedBoardPanelMarker', 'selected board panels should draw the board-specific red/blue marker.');
assertIncludes(source, "ctx.strokeStyle = '#d64242'", 'selected board marker should draw a red solid board line.');
assertIncludes(source, "ctx.strokeStyle = '#0B6FD3'", 'selected board marker should draw a blue dashed side marker.');
assertIncludes(selectedBoardMarker, 'drawPlanSelectionBox(x, y, w, h, anno(10))', 'selected board marker should reuse the old middle partition selection box style.');
if (selectedBoardMarker.includes('ctx.moveTo(') || selectedBoardMarker.includes('ctx.lineTo(')) {
  throw new Error('selected board marker should not draw a single blue dashed side line.');
}
assertIncludes(renderDepthPanelSpecialPanel, 'selectedBoardPanelRow()', 'the board panel controls should show selected generic board panel details.');
assertIncludes(source, 'function boardPanelHeightKey', 'selected board panels should have per-panel height keys.');
assertIncludes(source, 'function boardPanelHeightValue', 'selected board panels should read per-panel height before row defaults.');
assertIncludes(source, 'function applySelectedBoardPanelHeight', 'selected board panel height edits should use a dedicated handler.');
assertIncludes(renderDepthPanelSpecialPanel, 'applySelectedBoardPanelHeight(this.value)', 'the selected board panel card should edit only the selected panel height.');
assertIncludes(source, 'boardPanelHeights: currentRow?.boardPanelHeights || null', 'row params should preserve selected board panel height overrides.');
assertIncludes(source, 'boardPanelHeights: row.boardPanelHeights', 'row snapshot should keep selected board panel height overrides.');
console.log('all board panel selection contract ok');
