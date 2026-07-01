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

const pieces = Array.from({length: 4}, (_, i) => ({w:500, h:800, label:`P${i+1}`}));
const estimate = context.estimateBoardSheets(pieces, [{w:1000, h:1600, enabled:true}], false);
if (!Array.isArray(estimate.boards) || !estimate.boards.length) {
  throw new Error('estimateBoardSheets should return board layout data for preview.');
}
const board = estimate.boards[0];
if (!board.sheet || board.sheet.w !== 1000 || board.sheet.h !== 1600) {
  throw new Error('preview board should include the physical sheet size.');
}
if (!Array.isArray(board.placed) || !board.placed.length || !board.placed[0].label) {
  throw new Error('preview board should include placed pieces with labels.');
}
if (!Array.isArray(board.free)) {
  throw new Error('preview board should include remaining free rectangles.');
}

if (!source.includes('id="bom-cut-layout-toggle"')) throw new Error('BOM should include a cutting layout toggle button.');
if (!source.includes('id="bom-cut-layout"')) throw new Error('BOM should include a cutting layout preview container.');
if (!/function\s+renderBoardCutLayoutPreview/.test(source)) throw new Error('Expected renderBoardCutLayoutPreview function.');
if (!/function\s+toggleBoardCutLayoutPreview/.test(source)) throw new Error('Expected toggleBoardCutLayoutPreview function.');
if (!/const\s+xScale\s*=\s*100\s*\/\s*sheetW/.test(source) || !/const\s+yScale\s*=\s*100\s*\/\s*sheetH/.test(source)) {
  throw new Error('cut layout preview should scale X by sheet width and Y by sheet height so pieces keep true proportions.');
}
if (/const\s+scale\s*=\s*Math\.min\(100\s*\/\s*sheetW,\s*100\s*\/\s*sheetH\)/.test(source)) {
  throw new Error('cut layout preview should not use one shared scale for percentage layout.');
}
if (!source.includes('bom-cut-sheet-width-dim') || !source.includes('bom-cut-sheet-height-dim')) {
  throw new Error('cut layout preview should show outer sheet width and height dimension labels.');
}
if (!source.includes('bom-cut-piece-width-dim') || !source.includes('bom-cut-piece-height-dim')) {
  throw new Error('cut layout preview should show piece width and height dimension labels.');
}
if (!source.includes('bomCutPieceDims(piece)')) {
  throw new Error('cut layout preview should format piece dimensions separately from the label.');
}
if (!source.includes('bomCutPieceTextFlow') || !/return 'horizontal'/.test(source) || !/return 'vertical'/.test(source) || !/\.bom-cut-piece-text\.horizontal/.test(source) || !/\.bom-cut-piece-text\.vertical/.test(source)) {
  throw new Error('cut layout preview should choose horizontal text when it fits and vertical text when it does not.');
}
if (!/Number\(piece\?\.w\)\s*\|\|\s*0[\s\S]*pieceW\s*<\s*520[\s\S]*return 'vertical'/.test(source)) {
  throw new Error('narrow cut pieces should use vertical stacked text instead of clipped horizontal text.');
}
if (!source.includes('bomCutPieceTextHtml') || !/\.bom-cut-piece-text\.vertical\{[^}]*flex-direction:column/.test(source)) {
  throw new Error('vertical piece text should stack label and size line by line.');
}
if (/\.bom-cut-piece-text\.vertical\{[^}]*rotate\(-90deg\)/.test(source)) {
  throw new Error('vertical piece text should not rotate the whole label sideways.');
}
if (/\.bom-cut-piece-text\.vertical\{[^}]*top:50%/.test(source) || /\.bom-cut-piece-text\.vertical\{[^}]*translate\(-50%,-50%\)/.test(source)) {
  throw new Error('vertical piece text should start near the top like the reference label, not float in the center.');
}
if (/Array\.from\(name\)/.test(source)) {
  throw new Error('vertical piece labels should not split the board name into one character per line.');
}
if (!source.includes('<span>${name}</span>') || !source.includes('${dims.h}\\u00d7${dims.w}')) {
  throw new Error('vertical piece labels should show two readable lines: name and height by width.');
}
console.log('board cut layout preview contract ok');
