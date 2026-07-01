const fs = require('fs');
const source = fs.readFileSync('toilet_partition_auto_generator_V2Pro.html', 'utf8');
if (!/\.bom-area\.collapsed \.bom-title \.bom-board-result\{display:none\}/.test(source)) {
  throw new Error('collapsed BOM should hide title board estimate result.');
}
console.log('collapsed board sheet result visibility contract ok');
