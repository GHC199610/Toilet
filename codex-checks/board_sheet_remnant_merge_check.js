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

const remnants = context.boardRemnantPiecesFromEstimate([{
  free: [
    {x: 900, y: 0, w: 320, h: 400},
    {x: 900, y: 400, w: 320, h: 400},
    {x: 900, y: 800, w: 320, h: 400},
  ],
}]);

if (remnants.length !== 1 || remnants[0].w !== 320 || remnants[0].h !== 1200) {
  throw new Error(`Adjacent remnant strips should merge into 320x1200, got ${JSON.stringify(remnants)}`);
}

const pairCutRemnant = context.estimateBoardSheets(
  Array.from({length: 2}, () => ({w: 600, h: 1750})),
  [{w: 1220, h: 1830, enabled: true}],
  true
);
const pairCutMatches = pairCutRemnant.remnants.filter(piece => piece.w === 20 && piece.h === 1830);
if (pairCutMatches.length !== 1 || pairCutRemnant.remnants.length !== 1) {
  throw new Error(`1220x1830 cutting 600x1750x2 should show one 1830x20 remnant, got ${JSON.stringify(pairCutRemnant.remnants)}`);
}

const urinalPieces = Array.from({length: 12}, () => ({w: 400, h: 900}));
const estimate = context.estimateBoardSheets(urinalPieces, [{w: 1220, h: 2440, enabled: true}], true);
if (estimate.count !== 2) {
  throw new Error(`Urinal case should still need 2 boards, got ${estimate.count}`);
}
if (!estimate.remnants.length || estimate.remnants.some(piece => piece.w <= 0 || piece.h <= 0)) {
  throw new Error(`Remnants should only list positive pieces, got ${JSON.stringify(estimate.remnants)}`);
}

console.log('board sheet remnant merge contract ok');
