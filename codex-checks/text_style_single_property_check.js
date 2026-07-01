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
const applyTextStyleChange = sectionBetween('function applyTextStyleChange', 'function toggleTextBold');
assertIncludes(applyTextStyleChange, "target.style[key]", 'style change should write only the requested style key.');
assertNotIncludes(applyTextStyleChange, 'Object.assign(target.style, next)', 'style change must not write a full normalized style object.');
assertNotIncludes(applyTextStyleChange, 'defaultTextStyle = next', 'single style changes must not replace the whole default style object.');
console.log('text style single property contract ok');
