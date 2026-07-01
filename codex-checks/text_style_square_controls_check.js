const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
assertIncludes(source, '.text-tool,.text-bold,.text-style-size,.text-style-color', 'text toolbar controls should share one square sizing rule.');
assertIncludes(source, 'width:var(--text-tool-size)', 'text toolbar controls should have square width.');
assertIncludes(source, 'height:var(--text-tool-size)', 'text toolbar controls should have square height.');
assertIncludes(source, 'class="sheet-action-btn text-style-color"', 'color button should keep the same toolbar button UI class as the other tools.');
assertIncludes(source, '.text-color-preview', 'color button should show a compact color preview inside the square button.');
console.log('text style square controls contract ok');
