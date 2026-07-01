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

const pieces = [
  ...Array.from({length: 2}, () => ({w: 610, h: 1830, label:'door'})),
  ...Array.from({length: 12}, () => ({w: 400, h: 900, label:'???'})),
];
const sheets = [
  {w:1220, h:1830, enabled:true},
  {w:1220, h:2440, enabled:true},
];
const estimate = context.estimateBoardSheets(pieces, sheets, true);
const summary = (estimate.sheetCounts || []).map(item => `${item.w}x${item.h}=${item.count}`).join('/');
if (summary !== '1220x1830=3') {
  throw new Error(`Urinal panels should be packed after normal boards and not force larger-height boards, got ${summary}`);
}
if (!/function\s+isUrinalBoardPiece/.test(source)) {
  throw new Error('Expected explicit urinal-board priority helper.');
}
console.log('urinal board estimate priority contract ok');
