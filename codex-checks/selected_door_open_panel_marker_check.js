const fs = require('fs');
const source = fs.readFileSync('toilet_partition_auto_generator_V2Pro.html', 'utf8');

function expect(pattern, message) {
  if (!pattern.test(source)) {
    console.error(message);
    process.exit(1);
  }
}

expect(/function\s+drawDoorSwing\s*\(\s*door\s*,\s*baseY\s*,\s*st\s*,\s*p\s*,\s*options\s*=\s*\{\}\s*\)/, 'drawDoorSwing should accept an options object for selection state');
expect(/const\s+drawDoorBoardSelection\s*=\s*\(\s*x1\s*,\s*y1\s*,\s*x2\s*,\s*y2\s*\)\s*=>/, 'drawDoorSwing should define a rotated selection marker helper');
expect(/drawSelectedBoardPanelMarker\s*\(\s*0\s*,\s*-st\s*\/\s*2\s*,\s*len\s*,\s*st\s*\)/, 'open door selection should use the same board marker style');
expect(/if\s*\(\s*options\.selected\s*&&\s*!drawingForExport\s*\)\s*drawDoorBoardSelection\s*\(\s*hingeX\s*,\s*closedY\s*,\s*hingeX\s*,\s*openEndY\s*\)/, 'selected open door panel should receive a marker');
expect(/drawDoorSwing\s*\(\s*door\s*,\s*oy\s*\+\s*sD\s*,\s*st\s*,\s*p\s*,\s*\{\s*selected\s*:\s*isSelectedBooth\s*\(\s*options\.groupId\s*\?\?\s*activeGroupId\s*,\s*options\.rowId\s*\?\?\s*activeRowId\s*,\s*door\.index\s*\)\s*\}\s*\)/, 'drawPlanRow should pass selected booth state into drawDoorSwing');

console.log('selected door open panel marker contract ok');
