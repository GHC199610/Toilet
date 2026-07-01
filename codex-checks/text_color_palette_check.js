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
const sheetActions = sectionBetween('<div class="sheet-actions" id="sheet-actions">', '<div class="export-row">');
const swatchCount = (sheetActions.match(/class="text-color-swatch"/g) || []).length;
assertIncludes(sheetActions, 'id="text-color-button"', 'color control should be a button, not native color input.');
assertIncludes(sheetActions, 'class="text-color-control"', 'color palette should be positioned relative to the color button.');
assertIncludes(sheetActions, 'id="text-color-palette"', 'color control should include a grid palette panel.');
assertIncludes(sheetActions, 'selectTextPaletteColor', 'palette swatches should apply selected color.');
if (swatchCount !== 8) throw new Error(`color palette should provide exactly 8 colors, found ${swatchCount}.`);
assertNotIncludes(sheetActions, 'type="color"', 'native color input should not be used for text color.');
assertIncludes(source, '.text-color-palette', 'palette should have panel styling.');
assertIncludes(source, '.text-color-control{position:relative', 'color palette wrapper should anchor the panel to the button.');
assertIncludes(source, 'left:50%', 'color palette should open centered under the button.');
assertIncludes(source, 'transform:translateX(-50%)', 'color palette should be horizontally centered on the button.');
assertIncludes(source, '.text-color-swatch', 'palette should have swatch styling.');
assertIncludes(source, 'var(--text-current-color,#000000)', 'color preview should default to black.');
assertIncludes(source, 'function toggleTextColorPalette', 'color palette should be toggleable.');
assertIncludes(source, 'function selectTextPaletteColor', 'color swatches should apply color via JS.');
assertIncludes(source, 'function handleTextColorPaletteOutsideClick', 'color palette should close when clicking outside.');
assertIncludes(source, "document.addEventListener('pointerdown', handleTextColorPaletteOutsideClick", 'outside click handler should listen before normal click actions.');
console.log('text color palette contract ok');
