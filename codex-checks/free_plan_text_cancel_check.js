const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '..', 'toilet_partition_auto_generator_V2Pro.html'), 'utf8');
if (!source.includes('let pendingFreeTextId = null')) throw new Error('free text should track newly inserted pending text.');
if (!source.includes('function cancelPendingEmptyFreeText')) throw new Error('free text should have a cancel helper for empty pending insertion.');
if (!/canvas-text-editor'\)\?\.addEventListener\('blur'[\s\S]*cancelPendingEmptyFreeText/.test(source)) throw new Error('empty pending free text should be cancelled on editor blur.');
if (!/filter\(textItem => textItem\.id !== pendingFreeTextId\)/.test(source)) throw new Error('cancel should remove the pending free text item.');
console.log('free text cancel contract ok');
