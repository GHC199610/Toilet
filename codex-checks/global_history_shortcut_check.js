const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
assertIncludes(source, 'function handleGlobalHistoryShortcut', 'global undo/redo should have a dedicated key handler.');
assertIncludes(source, "document.addEventListener('keydown', handleGlobalHistoryShortcut", 'global undo/redo shortcuts should be bound at document level.');
assertIncludes(source, "const isUndo = key === 'z' && !e.shiftKey", 'Ctrl/Cmd+Z should trigger undo globally.');
assertIncludes(source, "const isRedo = key === 'y' || (key === 'z' && e.shiftKey)", 'Ctrl/Cmd+Y and Ctrl/Cmd+Shift+Z should trigger redo globally.');
assertIncludes(source, 'undoLayout();', 'global history shortcut should call undoLayout.');
assertIncludes(source, 'redoLayout();', 'global history shortcut should call redoLayout.');
assertIncludes(source, 'e.preventDefault();', 'global history shortcut should prevent browser/input undo when app history handles it.');
console.log('global history shortcut contract ok');
