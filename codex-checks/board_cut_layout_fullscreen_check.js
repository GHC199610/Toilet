const fs = require('fs');
const source = fs.readFileSync('toilet_partition_auto_generator_V2Pro.html', 'utf8');

function expect(pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

expect(/id="bom-cut-layout-fullscreen"/, 'cut layout should have a fullscreen button.');
expect(/id="bom-cut-layout-modal"/, 'cut layout should have a fullscreen modal.');
expect(/function\s+openBoardCutLayoutFullscreen/, 'should define openBoardCutLayoutFullscreen.');
expect(/function\s+closeBoardCutLayoutFullscreen/, 'should define closeBoardCutLayoutFullscreen.');
expect(/function\s+renderBoardCutLayoutPreview\s*\([^)]*targetId\s*=/, 'renderBoardCutLayoutPreview should support rendering into modal target.');
expect(/\.bom-cut-layout-modal\.show/, 'fullscreen modal should have visible show state.');
expect(/\.bom-cut-layout-modal\{[^}]*position:absolute/, 'fullscreen cut layout should cover the canvas area, not the whole screen.');
if (/\.bom-cut-layout-modal\{[^}]*position:fixed/.test(source) || /\.bom-cut-layout-modal\{[^}]*inset:0/.test(source)) {
  throw new Error('fullscreen cut layout should not be a fixed full-screen overlay.');
}
expect(/\.bom-cut-layout-modal\s+\.bom-cut-piece\{[^}]*font-size:15px/, 'fullscreen cut layout piece labels should be 15px.');
expect(/\.bom-cut-layout-modal\s+\.bom-cut-layout\{[^}]*display:flex[^}]*flex-wrap:wrap/, 'fullscreen cut layout should keep normal sheet size and wrap sheets horizontally when space runs out.');
expect(/\.bom-cut-layout-modal\s+\.bom-cut-board\{[^}]*width:max-content/, 'fullscreen cut layout board cards should fit the sheet preview instead of leaving wide blank space.');
expect(/\.bom-cut-layout-modal\s+\.bom-cut-figure\{[^}]*width:24rem/, 'fullscreen cut layout sheet figure should keep the normal preview width.');
expect(/\.bom-cut-canvas\{[^}]*width:100%/, 'cut layout canvas should fill the stable sheet figure width.');
expect(/\.bom-cut-layout-modal\s+\.bom-cut-canvas\{[^}]*aspect-ratio:var\(--sheet-ratio\)/, 'fullscreen cut layout should show boards with the physical sheet aspect ratio.');
expect(/style="--sheet-ratio:\$\{sheetW\}\/\$\{sheetH\}"/, 'cut layout canvases should receive their sheet aspect ratio.');
expect(/Escape[\s\S]*closeBoardCutLayoutFullscreen/, 'Escape should close fullscreen cut layout.');

console.log('board cut layout fullscreen contract ok');
