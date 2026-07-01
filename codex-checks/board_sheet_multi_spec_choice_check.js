const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');

function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}

const estimatorSource = sectionBetween('function pruneFreeRects', 'function checkBoardFitWarnings');
const context = {};
vm.createContext(context);
vm.runInContext(estimatorSource, context);

const pieces = Array.from({length: 12}, () => ({w: 400, h: 900}));
const sheets = [
  {w: 1220, h: 2440, enabled: true},
  {w: 800, h: 2440, enabled: true},
];
const estimate = context.estimateBoardSheets(pieces, sheets, true);
if (estimate.count !== 2) {
  throw new Error(`Expected enabled 1220x2440 sheet to keep 12 pieces of 400x900 at 2 boards, got ${estimate.count}`);
}
console.log('multi sheet board choice contract ok');
