const fs = require('fs');
const source = fs.readFileSync('toilet_partition_auto_generator_V2Pro.html', 'utf8');

if (!/\.bom-title\{[^}]*flex-wrap:wrap/.test(source)) {
  throw new Error('bom title should wrap so long board estimate text is not clipped.');
}
if (!/\.bom-title \.bom-board-result\{[^}]*white-space:normal/.test(source)) {
  throw new Error('board estimate inside title should allow wrapping.');
}
if (!/\.bom-title \.bom-board-result\{[^}]*overflow-wrap:anywhere/.test(source)) {
  throw new Error('board estimate inside title should break long sheet details when narrow.');
}

console.log('board sheet result wrap contract ok');
