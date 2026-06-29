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

const estimatorSource = sectionBetween('function pruneFreeRects', 'function estimateBoardSheets');
const context = {performance: {now: () => 0}};
vm.createContext(context);
vm.runInContext(estimatorSource, context);

function expand(w, h, qty) {
  return Array.from({length: qty}, () => ({w, h}));
}

const pieces = [
  ...expand(250, 1830, 8),
  ...expand(500, 1830, 4),
  ...expand(600, 1750, 8),
  ...expand(1220, 1800, 4),
  ...expand(80, 1800, 4),
  ...expand(400, 900, 6),
];

const sheet = {w: 1220, h: 2440};
const noRotate = context.estimateSingleBoardSheetCount(pieces, sheet, false, 2).count;
const rotate = context.estimateSingleBoardSheetCount(pieces, sheet, true, 2).count;

if (rotate > noRotate) {
  throw new Error(`Rotation should not increase board-sheet estimate: no rotate ${noRotate}, rotate ${rotate}`);
}

const shortSheet = {w: 1220, h: 1830};
const piecesWithUrinals = [
  ...expand(250, 1830, 8),
  ...expand(500, 1830, 4),
  ...expand(600, 1750, 8),
  ...expand(1220, 1800, 4),
  ...expand(80, 1800, 4),
  ...expand(400, 900, 6),
];
const withUrinals = context.estimateSingleBoardSheetCount(piecesWithUrinals, shortSheet, false, 2).count;

if (withUrinals !== 13) {
  throw new Error(`1220x1830 board estimate with 6 urinal panels should be 13, got ${withUrinals}`);
}

console.log('board sheet rotation estimate contract ok');
