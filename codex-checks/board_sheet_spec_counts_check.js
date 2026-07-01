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

const pieces = [
  {w: 1100, h: 2400},
  {w: 700, h: 1800},
];
const sheets = [
  {w: 1220, h: 2440, enabled: true},
  {w: 700, h: 1800, enabled: true},
  {w: 500, h: 1200, enabled: false},
];
const estimate = context.estimateBoardSheets(pieces, sheets, false);

if (!Array.isArray(estimate.sheetCounts)) {
  throw new Error('Expected estimate.sheetCounts to report per enabled sheet size usage.');
}

const summary = estimate.sheetCounts.map(item => `${item.w}x${item.h}=${item.count}`).join('/');
if (summary !== '1220x2440=1/700x1800=1') {
  throw new Error(`Expected per-size sheet counts 1220x2440=1/700x1800=1, got ${summary || '(empty)'}`);
}

if (!/function\s+formatBoardSheetEstimateText/.test(source)) {
  throw new Error('Expected a formatter for per-size board sheet estimate text.');
}

console.log('board sheet per-spec counts contract ok');


