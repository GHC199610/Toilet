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

const sheet = {w: 1000, h: 1000, enabled: true};
const pieces = [
  {w: 200, h: 650},
  {w: 450, h: 700},
  {w: 350, h: 600},
  {w: 400, h: 300},
];
const noRotate = context.estimateBoardSheets(pieces, [sheet], false);
const rotate = context.estimateBoardSheets(pieces, [sheet], true);
if (noRotate.count !== 1) {
  throw new Error(`Test setup should fit without rotation in 1 board, got ${noRotate.count}`);
}
if (rotate.count > noRotate.count) {
  throw new Error(`Rotation is a material-saving option and must not use more boards: no rotate ${noRotate.count}, rotate ${rotate.count}`);
}
console.log('rotation saving floor contract ok');
