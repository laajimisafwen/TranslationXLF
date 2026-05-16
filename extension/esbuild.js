// esbuild.js — Version corrigée pour ton projet
const esbuild = require('esbuild');

const isDev = process.argv.includes('--dev');

esbuild.build({
  entryPoints: ['dist/extension.js'],     // Point d'entrée = le JS déjà présent
  bundle: true,
  outfile: 'dist/extension.bundle.js',    // On sort vers un autre fichier temporaire
  allowOverwrite: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: isDev ? 'inline' : false,
  minify: !isDev,
  treeShaking: true,
  logLevel: 'info',
}).then(() => {
  // On remplace le fichier original par le bundle final
  const fs = require('fs');
  fs.copyFileSync('dist/extension.bundle.js', 'dist/extension.js');
  fs.unlinkSync('dist/extension.bundle.js');
  
  console.log('[Talan XLF] Build complete → dist/extension.js');
}).catch(e => {
  console.error('[Talan XLF] Build failed:', e);
  process.exit(1);
});