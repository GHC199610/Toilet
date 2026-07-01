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
const hitCanMultiSelect = sectionBetween('function hitCanMultiSelect', 'function setSelectedDepthPanel');
const hitSelectionIndex = sectionBetween('function hitSelectionIndex', 'function hitCanMultiSelect');
const isSelectedBoardPanel = sectionBetween('function isSelectedBoardPanel', 'function boardPanelKey');
const tapHandler = sectionBetween('function handlePlanTapFromPoint', "cv.addEventListener('click'");
const drawFree = sectionBetween('function drawFreePlanTexts', 'function drawDimensionCaret');
assertIncludes(hitCanMultiSelect, "'board-panel'", 'shift multi-select should support front/door board panels.');
assertIncludes(hitCanMultiSelect, "'free-text'", 'shift multi-select should support free text.');
assertIncludes(hitSelectionIndex, "hit.type === 'board-panel'", 'board panel multi-select should use a stable panel key.');
assertIncludes(hitSelectionIndex, "hit.type === 'free-text'", 'free text multi-select should use text id.');
assertIncludes(isSelectedBoardPanel, "isMultiSelected('board-panel'", 'selected board panel rendering should include multi-selection state.');
assertIncludes(drawFree, "isMultiSelected('free-text'", 'selected free text rendering should include multi-selection state.');
assertIncludes(tapHandler, 'drawView(lastParams || getParams(), currentTab);', 'shift multi-select should redraw immediately.');
console.log('shift multi-select contract ok');
