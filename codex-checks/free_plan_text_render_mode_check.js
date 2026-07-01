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
const drawView = sectionBetween('function drawView(p, tab)', 'function syncActiveCanvasTextEditorPosition');
assertIncludes(drawView, "if (tab === 'plan') drawFreePlanTexts();", 'free text should render at the view level in both sheet preview and single plan modes.');
console.log('free plan text render mode contract ok');
