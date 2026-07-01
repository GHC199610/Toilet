const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
function assertNotIncludes(haystack, needle, message) { if (haystack.includes(needle)) throw new Error(message); }
assertIncludes(source, 'const HISTORY_LIMIT =', 'global history should use a named limit instead of the old tiny inline cap.');
assertIncludes(source, 'function markGlobalEditStart', 'global history should snapshot before any editable control changes.');
assertIncludes(source, 'function shouldTrackGlobalHistoryTarget', 'global history should decide which controls participate.');
assertIncludes(source, "document.addEventListener('focusin', e => markGlobalEditStart", 'global history should capture form/text edit starts.');
assertIncludes(source, "document.addEventListener('pointerdown', e => markGlobalEditStart", 'global history should capture pointer changes for variable controls.');
assertIncludes(source, "document.addEventListener('change', e => clearGlobalEditStart", 'global history should finish grouped form edits after change.');
assertIncludes(source, "document.addEventListener('blur', e => clearGlobalEditStart", 'global history should finish grouped text edits after blur.');
assertIncludes(source, 'if (undoStack.length > HISTORY_LIMIT) undoStack.shift();', 'undo history should use the global history limit.');
assertIncludes(source, 'if (redoStack.length > HISTORY_LIMIT) redoStack.shift();', 'redo history should use the global history limit.');
assertIncludes(source, 'function historyStateSignature', 'global history should avoid duplicate snapshots from captured and explicit events.');
assertIncludes(source, 'if (undoStack.length && historyStateSignature(undoStack[undoStack.length - 1]) === historyStateSignature(state)) return;', 'global history should not push identical consecutive states.');
assertIncludes(source, 'boardSheets: JSON.parse(JSON.stringify(boardSheets))', 'global history should snapshot board sheet settings.');
assertIncludes(source, 'urinalSpec: JSON.parse(JSON.stringify(urinalSpec))', 'global history should snapshot urinal board settings.');
assertIncludes(source, 'paperSize,', 'global history should snapshot paper size.');
assertIncludes(source, 'quickTenMode,', 'global history should snapshot quick layout mode.');
assertIncludes(source, 'localStorage.setItem(\'partition-board-sheets\'', 'restore should persist restored board sheet settings.');
assertIncludes(source, 'updateBoardSheetEstimate();', 'restore should refresh board sheet estimate UI.');
assertIncludes(source, "closest?.('input, textarea, select, [contenteditable=\"true\"]')", 'global history should auto-track variable controls only.');
assertNotIncludes(source, "closest?.('input, textarea, select, button", 'global history should not auto-track ordinary button clicks.');
console.log('global history tracking contract ok');
