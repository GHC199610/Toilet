const fs = require('fs');
const source = fs.readFileSync('toilet_partition_auto_generator_V2Pro.html', 'utf8');

const titleMatch = source.match(/<div class="bom-title">[\s\S]*?<\/div>/);
if (!titleMatch) throw new Error('Missing bom-title block.');
if (!titleMatch[0].includes('id="board-sheet-result"')) {
  throw new Error('board-sheet-result should be inside bom-title, immediately after the material-list title.');
}

const estimatorMatch = source.match(/<div class="bom-board-estimator"[\s\S]*?<div class="bom-actions">/);
if (!estimatorMatch) throw new Error('Missing bom-board-estimator block.');
if (estimatorMatch[0].includes('id="board-sheet-result"')) {
  throw new Error('board-sheet-result should not remain inside the board estimator controls.');
}

if (!/\.bom-title\{[^}]*display:inline-flex/.test(source)) {
  throw new Error('bom-title should align the title and board estimate on one row.');
}
if (!/\.bom-title \.bom-board-result\{[^}]*margin-left:0/.test(source)) {
  throw new Error('board estimate should not keep auto margin when placed after the title.');
}

console.log('board sheet result title position contract ok');
