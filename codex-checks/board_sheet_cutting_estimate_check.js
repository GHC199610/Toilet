const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) throw new Error(message);
}

function assertNotIncludes(haystack, needle, message) {
  if (haystack.includes(needle)) throw new Error(message);
}

function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}

const estimatorSource = sectionBetween('function pruneFreeRects', 'function checkBoardFitWarnings');
const estimateBoardSheetMatches = estimatorSource.match(/function estimateBoardSheets\(/g) || [];
if (estimateBoardSheetMatches.length !== 1) {
  throw new Error(`Expected one estimateBoardSheets implementation, got ${estimateBoardSheetMatches.length}`);
}
if (estimatorSource.includes('estimateStripPackBoardSheetCount')) {
  throw new Error('Board-sheet estimate should use full-board rectangle cutting, not strip-only packing.');
}
assertIncludes(source, 'aria-label="整板切割估算"', 'BOM estimator should describe the full-board cutting estimate.');
assertNotIncludes(source, 'board-kerf', 'BOM estimator should not expose kerf controls.');
assertNotIncludes(source, 'boardKerf', 'BOM estimator should not keep kerf state.');
assertNotIncludes(source, 'setBoardKerfInput', 'BOM estimator should not keep kerf handlers.');
assertNotIncludes(source, 'partition-board-kerf', 'BOM estimator should not persist kerf settings.');
assertIncludes(source, 'estimateBoardSheets(lastBomPieces, boardSheets, boardRotateEnabled)', 'BOM estimator should call full-board estimate without kerf.');
assertIncludes(source, '<span>板件旋转</span>', 'Rotation toggle should clearly mean rotating cut pieces, not rotating the full board.');
assertIncludes(estimatorSource, 'function pieceFitsSheet(piece, sheet, allowRotate)', 'Board estimate should express fit checks as piece rotation against a fixed sheet.');
assertNotIncludes(estimatorSource, 'sheet.h <= piece.w', 'Board estimate must not treat rotation as rotating the full sheet.');
assertNotIncludes(estimatorSource, 'w:sheet.h', 'Board estimate must not create rotated sheet dimensions.');
assertNotIncludes(estimatorSource, 'h:sheet.w', 'Board estimate must not create rotated sheet dimensions.');
assertIncludes(source, 'function boardRemnantPiecesFromEstimate', 'BOM should derive remnant sizes from board cutting estimate.');
assertIncludes(source, "{name:'余料'", 'BOM should append a remnant item at the bottom of the material list.');
assertIncludes(source, 'boardRemnantBomItem(estimate)', 'BOM render should append remnants from the cutting estimate.');
assertIncludes(source, 'function currentBomPrintableItems()', 'BOM print/export should use a dedicated printable item source.');
assertIncludes(source, 'const items = currentBomPrintableItems();', 'BOM image/canvas print paths should use printable items without remnants.');
assertNotIncludes(sectionBetween('function currentBomPrintableItems()', 'function collectBomImageItems()'), 'boardRemnantBomItem', 'Printable BOM source must not include remnant-only viewer items.');
const context = {};
vm.createContext(context);
vm.runInContext(estimatorSource, context);

function pieces(w, h, qty) {
  return Array.from({length: qty}, () => ({w, h}));
}

const sheet = {w: 1000, h: 1000, enabled: true};
const areaTrap = [
  ...pieces(700, 700, 1),
  ...pieces(300, 700, 1),
  ...pieces(700, 300, 1),
  ...pieces(300, 300, 1),
];
const areaTrapEstimate = context.estimateBoardSheets(areaTrap, [sheet], false);
if (areaTrapEstimate.count !== 1) {
  throw new Error(`Cutting estimate should pack complementary rectangles into 1 full board, got ${areaTrapEstimate.count}`);
}

const remnantEstimate = context.estimateBoardSheets(pieces(600, 400, 1), [sheet], false);
if (!Array.isArray(remnantEstimate.remnants) || !remnantEstimate.remnants.some(item => item.w > 0 && item.h > 0)) {
  throw new Error('Cutting estimate should return remaining board rectangles.');
}

const cannotAreaOnly = pieces(600, 600, 3);
const cannotAreaOnlyEstimate = context.estimateBoardSheets(cannotAreaOnly, [sheet], false);
if (cannotAreaOnlyEstimate.count !== 3) {
  throw new Error(`Cutting estimate should use geometry, not area-only math: expected 3 boards, got ${cannotAreaOnlyEstimate.count}`);
}

const rotationPieces = pieces(700, 300, 3);
const noRotate = context.estimateBoardSheets(rotationPieces, [sheet], false).count;
const rotate = context.estimateBoardSheets(rotationPieces, [sheet], true).count;
if (rotate > noRotate) {
  throw new Error(`Rotation should not increase full-board cutting estimate: no rotate ${noRotate}, rotate ${rotate}`);
}

const urinalCaseSheet = {w: 1220, h: 2440, enabled: true};
const urinalCasePieces = pieces(400, 900, 12);
const urinalNoRotate = context.estimateBoardSheets(urinalCasePieces, [urinalCaseSheet], false).count;
const urinalRotate = context.estimateBoardSheets(urinalCasePieces, [urinalCaseSheet], true).count;
if (urinalNoRotate !== 2 || urinalRotate !== 2) {
  throw new Error(`12 pieces of 400x900 should need 2 boards with or without piece rotation, got no rotate ${urinalNoRotate}, rotate ${urinalRotate}`);
}

console.log('board sheet cutting estimate contract ok');
