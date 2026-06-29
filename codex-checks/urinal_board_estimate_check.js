const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}
function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) throw new Error(message);
}
const urinalBomItem = sectionBetween('function urinalBomItem()', 'function parseBomPieceLine');
const collectBomPiecesFromItems = sectionBetween('function collectBomPiecesFromItems', 'function pruneFreeRects');
assertIncludes(urinalBomItem, 'sub:`${urinalSpec.height}×${urinalSpec.width} = ${count}', 'urinal panel BOM should emit height x width = quantity so board-sheet estimate can parse it.');
assertIncludes(collectBomPiecesFromItems, 'parseBomPieceLine(part, lastHeight)', 'board-sheet estimate should continue deriving pieces from BOM item lines.');
console.log('urinal board estimate contract ok');
