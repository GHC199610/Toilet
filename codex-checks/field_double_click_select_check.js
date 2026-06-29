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

const selectInputValue = sectionBetween('function selectInputValue', "document.getElementById('p-count')");
const dblClickBinding = sectionBetween('document.querySelectorAll(\'.field input[type=number], .field input[type=text]\')', "document.getElementById('p-count')");

assertIncludes(selectInputValue, 'input.select();', 'shared input selection helper should select the whole value.');
assertIncludes(selectInputValue, 'input.setSelectionRange(0, String(input.value || \'\').length);', 'shared input selection helper should have a selection-range fallback.');
assertIncludes(dblClickBinding, "input.addEventListener('dblclick'", 'parameter inputs should select their value on double click.');
assertIncludes(dblClickBinding, 'selectInputValue(input)', 'parameter input double click should use the shared selection helper.');

console.log('field double-click select contract ok');
