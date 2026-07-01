const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (start < 0 || end < 0) throw new Error('Missing estimator section');
  return source.slice(start, end);
}
const context = {};
vm.createContext(context);
vm.runInContext(sectionBetween('function pruneFreeRects', 'function checkBoardFitWarnings'), context);
const smallerSheets = {count:24, unplacedCount:0, sheetArea:24 * 1220 * 1830, utilization:0.5};
const fewerLargeSheets = {count:23, unplacedCount:0, sheetArea:23 * 1220 * 2440, utilization:0.7};
if (context.betterBoardEstimate(smallerSheets, fewerLargeSheets) !== smallerSheets) {
  throw new Error('24 smaller sheets should beat 23 larger sheets when total material area is lower.');
}
console.log('board sheet large-vs-small area priority contract ok');
