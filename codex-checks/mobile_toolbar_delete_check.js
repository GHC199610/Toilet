const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html'), 'utf8');
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}
const sheetActions = sectionBetween('<div class="sheet-actions" id="sheet-actions">', '<div class="export-row">');
if (!sheetActions.includes('id="selected-delete-button"')) throw new Error('sheet actions should include a selected delete/trash button.');
if (!sheetActions.includes('deleteSelectedItemsFromToolbar()')) throw new Error('trash button should delete current selected items.');
if (!source.includes('function deleteSelectedItemsFromToolbar()')) throw new Error('toolbar delete helper should exist.');
if (!/function\s+deleteSelectedItemsFromToolbar[\s\S]*deleteSelectedItems\(\{allowFocusedEditor:true\}\)/.test(source)) throw new Error('toolbar delete should work even when the hidden canvas text editor is focused.');
console.log('mobile toolbar delete contract ok');
