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

const applySheetOrderKeys = sectionBetween('function applySheetOrderKeys(keys)', 'function previewOrderForTarget');
const autoCompactSheetLayout = sectionBetween('function autoCompactSheetLayout()', 'function updateGroupListState()');
const renderQuickLayout = sectionBetween('function renderQuickLayout', 'function clearQuickSelectAllVisual');

assertIncludes(applySheetOrderKeys, 'const orderedPages = [...new Set', 'sheet reorder should compact touched pages before assigning quick-grid cells.');
assertIncludes(applySheetOrderKeys, 'const pageIndex = orderedPages.indexOf(rawPage);', 'sheet reorder should convert sparse sheet pages into contiguous quick-layout pages.');
assertIncludes(applySheetOrderKeys, 'const localIndex = pageOffsets.get(pageIndex) || 0;', 'sheet reorder should pack each resulting quick-layout page from the first cell.');
assertNotIncludes(applySheetOrderKeys, 'const pageIndex = Math.max(0, Number(page) || 0);', 'sheet reorder should not preserve sparse page numbers because that leaves blank quick-layout pages/cells.');

assertIncludes(autoCompactSheetLayout, 'const groupOffsets = new Map();', 'auto layout should track quick-grid positions per group, independent of sheet pages.');
assertIncludes(autoCompactSheetLayout, 'const groupKey = String(block.group.id);', 'auto layout should isolate quick-grid counts by group only.');
assertIncludes(autoCompactSheetLayout, 'const groupLocalIndex = groupOffsets.get(groupKey) || 0;', 'auto layout should pack each group quick-grid from the first cell and keep going.');
assertIncludes(autoCompactSheetLayout, 'row.layoutRow = 1;', 'auto layout should keep quick-grid cells in one continuous quick row.');
assertIncludes(autoCompactSheetLayout, 'row.layoutCol = groupLocalIndex + 1;', 'auto layout should assign quick-grid columns from group-local continuous order.');
assertNotIncludes(autoCompactSheetLayout, 'row.layoutRow = Math.floor(blockIndex / QUICK_COMPACT_COLS) + 1;', 'auto layout must not use global page block index for quick-grid rows.');
assertNotIncludes(autoCompactSheetLayout, 'row.layoutCol = (blockIndex % QUICK_COMPACT_COLS) + 1;', 'auto layout must not use global page block index for quick-grid columns.');
assertNotIncludes(autoCompactSheetLayout, 'groupPageOffsets', 'auto layout should not split quick-grid positions by sheet page.');
assertNotIncludes(autoCompactSheetLayout, 'groupPageKey', 'auto layout should not split quick-grid positions by sheet page.');

assertNotIncludes(source, 'id="quick-prev-page"', 'quick layout should not expose pagination controls.');
assertNotIncludes(source, 'id="quick-next-page"', 'quick layout should not expose pagination controls.');
assertNotIncludes(source, 'id="quick-page-indicator"', 'quick layout should not expose pagination controls.');
assertNotIncludes(renderQuickLayout, 'quick-next-page', 'quick layout render should not manage pagination state.');
assertNotIncludes(renderQuickLayout, 'quick-page-indicator', 'quick layout render should not manage pagination state.');

console.log('quick auto layout compact contract ok');
