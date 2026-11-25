import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = new URL(entry.name, `${directory}/`);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'sis8-service-worker',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle).filter((file) => bundle[file].type === 'asset' || bundle[file].type === 'chunk');
      const publicFiles = listFiles(new URL('./public', import.meta.url)).sort((a, b) => a.href.localeCompare(b.href));
      const fingerprint = [
        readFileSync(new URL('./index.html', import.meta.url)),
        ...files.sort().flatMap((file) => [file, bundle[file].type === 'chunk' ? bundle[file].code : bundle[file].source]),
        ...publicFiles.flatMap((file) => [file.href, readFileSync(file)]),
      ];
      const version = createHash('sha256').update(fingerprint.join('\n')).digest('hex').slice(0, 12);
      const sw = readFileSync(new URL('./public/sw.js', import.meta.url), 'utf8')
        .replace('__PRECACHE_FILES__', JSON.stringify(['index.html', ...files]))
        .replaceAll('__PWA_VERSION__', `sis8-pwa-${version}`);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: sw });
    },
  }],
  // Relative base so the same build works on GitHub Pages (/repo/) and on Vercel (/).
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
