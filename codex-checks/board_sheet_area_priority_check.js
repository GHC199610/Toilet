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

const smallerArea = {
  count: 24,
  unplacedCount: 0,
  sheetArea: 24 * 1220 * 1830,
  utilization: 0.6,
};
const fewerBoardsButMoreArea = {
  count: 23,
  unplacedCount: 0,
  sheetArea: 23 * 1220 * 2440,
  utilization: 0.7,
};
const best = context.betterBoardEstimate(smallerArea, fewerBoardsButMoreArea);

if (best !== smallerArea) {
  throw new Error('Board estimate should prefer lower total sheet area before lower sheet count.');
}

console.log('board sheet area priority contract ok');
