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

const selectQuickCell = sectionBetween('function selectQuickCell(input)', 'function focusTotalInputForQuickCell');
const addRow = sectionBetween('function addRow', 'function addColumn');
const addColumn = sectionBetween('function addColumn', 'function deleteRow');

assertNotIncludes(source, 'insertManualA4PageBreak', 'manual A4 page-break feature should be removed.');
assertNotIncludes(source, 'A4换页', 'manual A4 page-break button should be removed.');
assertNotIncludes(source, 'A4鎹㈤〉', 'manual A4 page-break button should be removed.');

assertIncludes(selectQuickCell, 'activeRowId = target.id;', 'focusing an existing quick-grid cell should sync the active row for elevation views.');
assertIncludes(selectQuickCell, "selectionScope = keepSelectAll ? 'group' : 'row';", 'focusing an existing quick-grid cell should select that row unless preserving select-all.');
assertIncludes(selectQuickCell, 'saveActiveGroup();', 'focusing an existing quick-grid cell should save the previous row before switching.');
assertIncludes(selectQuickCell, 'loadGroupToForm(group, target);', 'focusing an existing quick-grid cell should load that row so elevation views use its total length.');
assertIncludes(selectQuickCell, 'lastParams = getParams();', 'focusing an existing quick-grid cell should refresh params from the selected row.');
assertIncludes(selectQuickCell, 'drawView(lastParams, currentTab);', 'focusing an existing quick-grid cell should redraw the current view with that row.');
assertNotIncludes(selectQuickCell, 'renderQuickLayout({row: rowIndex, col: colIndex});', 'quick-grid focus must not rebuild inputs.');
assertNotIncludes(selectQuickCell, 'redrawAfterActiveQuickCellChange', 'quick-grid focus should use a narrow redraw path, not the old rebuild path.');

assertIncludes(addRow, 'const nextRowNo = Math.max(...rows.map(r => Number(r.layoutRow) || 1)) + 1;', 'new row should append after existing rows, independent of current sheet page.');
assertNotIncludes(addRow, 'currentPlanPage', 'new row should not use the selected plan page.');
assertNotIncludes(addRow, 'targetSheetPage', 'new row should not preserve page-switch landing logic.');

assertIncludes(addColumn, 'const nextColNo = Math.max(0, ...rows.filter(r => r.layoutRow === currentLayoutRow).map(r => Number(r.layoutCol) || 1)) + 1;', 'new column should append in the current layout row, independent of sheet page.');
assertNotIncludes(addColumn, 'currentPlanPage', 'new column should not use the selected plan page.');
assertNotIncludes(addColumn, 'targetSheetPage', 'new column should not preserve page-switch landing logic.');

console.log('page switch residue removal contract ok');
