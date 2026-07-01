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
const renderQuickLayout = sectionBetween('function renderQuickLayout', 'function clearQuickSelectAllVisual');
const refreshQuickCellActiveClasses = sectionBetween('function refreshQuickCellActiveClasses', 'function selectQuickCellValueOnDblClick');
const selectQuickCellValueOnDblClick = sectionBetween('function selectQuickCellValueOnDblClick', 'function selectQuickCell(input)');
const clearQuickSelectAllVisual = sectionBetween('function clearQuickSelectAllVisual', 'document.addEventListener(\'pointerdown\', e => {');
const keepQuickSelectAllTarget = sectionBetween('function shouldKeepQuickSelectAllForTarget', 'document.addEventListener(\'pointerdown\', e => {');
const pointerDownHandler = sectionBetween("document.addEventListener('pointerdown', e => {", "}, {capture:true});");
const syncQuickCellToLayout = sectionBetween('function syncQuickCellToLayout', 'function selectAllQuickLayoutRows');
const focusTotalInputForQuickCell = sectionBetween('function focusTotalInputForQuickCell', 'function activeQuickCellRef');
const activeQuickCellRef = sectionBetween('function activeQuickCellRef', 'function focusNextQuickInputCellFromRef');
const commitFieldAndAdvance = sectionBetween('function commitFieldAndAdvance', 'function applyBatchFieldOnly');
const commitFieldChange = sectionBetween('function commitFieldChange', "document.getElementById('p-total')");

assertIncludes(source, 'let quickEditingCellRef = null;', 'quick layout should track the editing cell separately from select-all state.');
assertIncludes(renderQuickLayout, 'ondblclick="selectQuickCellValueOnDblClick(this)"', 'quick layout cells should select their value on double click.');
assertIncludes(selectQuickCellValueOnDblClick, 'input.select();', 'double clicking a quick layout cell should select the whole value.');
assertIncludes(refreshQuickCellActiveClasses, "input.classList.toggle('active'", 'quick cell focus should update active styling without rebuilding inputs.');
assertIncludes(selectQuickCell, "const keepSelectAll = quickSelectAllActive && selectionScope === 'group';", 'quick cell focus should preserve select-all state while entering variables.');
assertIncludes(selectQuickCell, "selectionScope = keepSelectAll ? 'group' : 'row';", 'quick cell focus should restore group selection when select-all is active.');
assertNotIncludes(selectQuickCell, 'renderQuickLayout({row: rowIndex, col: colIndex});', 'quick cell focus should not rebuild inputs because it breaks double-click selection.');
assertIncludes(selectQuickCell, 'refreshQuickCellActiveClasses();', 'quick cell focus should refresh active styling in place.');
assertIncludes(selectQuickCell, 'loadGroupToForm(group, target);', 'quick cell focus should load the selected row so elevation views match the active cell.');
assertIncludes(selectQuickCell, 'drawView(lastParams, currentTab);', 'quick cell focus should redraw the current view after loading the selected row.');
assertNotIncludes(selectQuickCell, 'redrawAfterActiveQuickCellChange', 'quick cell focus should avoid the old redraw helper that rebuilt related UI.');
assertNotIncludes(selectQuickCell, 'focusTotalInputForQuickCell', 'quick cell focus should not steal focus from the quick input.');
assertIncludes(clearQuickSelectAllVisual, 'quickEditingCellRef = null;', 'clearing select-all should clear the editing-cell hint.');
assertIncludes(keepQuickSelectAllTarget, '#p-total', 'clicking total length while select-all is active should preserve batch state.');
assertIncludes(keepQuickSelectAllTarget, '#p-depth', 'clicking parameter inputs while select-all is active should preserve batch state.');
assertIncludes(pointerDownHandler, 'if (shouldKeepQuickSelectAllForTarget(e.target)) return;', 'global pointerdown should keep select-all inside quick layout and batch edit fields.');
assertIncludes(focusTotalInputForQuickCell, 'if (quickEditingCellRef) lastQuickCellRef = {...quickEditingCellRef};', 'focusing total input should keep the cell currently being edited.');
assertIncludes(activeQuickCellRef, 'if (quickEditingCellRef) return {...quickEditingCellRef};', 'field advance should use the editing cell, not only active row selection.');
assertNotIncludes(syncQuickCellToLayout, 'quickSelectAllActive = false;', 'quick cell input should not clear select-all before batch editing fields.');
assertIncludes(syncQuickCellToLayout, 'const keepSelectAll = quickSelectAllActive && selectionScope === \'group\';', 'quick cell input should remember select-all state before syncing layout rows.');
assertIncludes(syncQuickCellToLayout, 'selectionScope = keepSelectAll ? \'group\' : \'row\';', 'quick cell input should keep group selection when select-all is active.');
assertNotIncludes(commitFieldAndAdvance, 'quickSelectAllActive = false;', 'batch field advance should not cancel select-all mode.');
assertNotIncludes(commitFieldChange, 'quickSelectAllActive = false;', 'batch field change should not cancel select-all mode.');

console.log('quick select-all input contract ok');
