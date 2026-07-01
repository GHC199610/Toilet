const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html');
const source = fs.readFileSync(htmlPath, 'utf8');
function assertIncludes(haystack, needle, message) { if (!haystack.includes(needle)) throw new Error(message); }
function sectionBetween(startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Missing ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Missing ${endNeedle}`);
  return source.slice(start, end);
}
const bomSection = sectionBetween('function renderBOM', 'function addFrontRebateBomPieces');
const rebateSection = sectionBetween('function addFrontRebateBomPieces', 'function createBomBucket');
assertIncludes(bomSection, 'frontPanels.forEach(panel => addBomPiece(front, boardPanelHeightValue(panel, row)', 'front panel BOM should use each selected board panel height override.');
assertIncludes(bomSection, "boardPanelHeightValue({kind:'door', index:i}, row)", 'door BOM should use each selected door panel height override.');
assertIncludes(rebateSection, 'boardPanelHeightValue(panel, row)', 'rebated front panel BOM should use each selected board panel height override.');
assertIncludes(source, 'target.row.boardPanelHeights = {...(target.row.boardPanelHeights || {}), [key]:next}', 'selected board panel height should only update the selected panel override map.');
if (source.includes("document.getElementById('h-upright').value = next") || source.includes("document.getElementById('h-door').value = next")) {
  throw new Error('selected board panel height edits must not write global height inputs.');
}
console.log('board panel height override contract ok');
