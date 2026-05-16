// esbuild.js — Talan XLF Translator
// Bundles the extension into a single file, excluding vscode and marking
// all node_modules as external EXCEPT fast-xml-parser (which is bundled inline).

const esbuild = require('esbuild');
const path = require('path');

const isDev = process.argv.includes('--dev');

esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: [
    'vscode',          // provided by VS Code runtime — never bundle
  ],
  // fast-xml-parser is NOT in external → gets bundled into extension.js
  // All other node_modules are external (none used at runtime)
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: isDev ? 'inline' : false,
  minify: !isDev,
  treeShaking: true,
  logLevel: 'info',
}).then(() => {
  console.log('[Talan XLF] Build complete → dist/extension.js');
}).catch(e => {
  console.error('[Talan XLF] Build failed:', e);
  process.exit(1);
});
