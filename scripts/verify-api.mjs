/**
 * verify-api.mjs — проверяет, что файлы fake API не изменялись.
 *
 * Task 4 требует: «Do not modify the fake API implementation».
 * В репозитории лежат контрольные суммы (SHA-256) файлов из стартового
 * репозитория leravanna/fake-api. Если сумма не совпадает — скрипт падает
 * с ненулевым кодом выхода.
 *
 * Запуск:  npm run verify:api
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const apiDir = join(here, '..', 'src', 'api');

// SHA-256 файлов из https://github.com/leravanna/fake-api (main)
const EXPECTED = {
  'fakeApi.js': 'b2091630fc91fd1e93509540e7d9959929de59e615e6db9e7804bc41a22fcf5d',
  'settings.js': '2f33e68d6e86aa992c00f3c32f6ca36dca9875c9839f424d1662e21ab5943411',
};

let failed = false;

for (const [fileName, expectedHash] of Object.entries(EXPECTED)) {
  const filePath = join(apiDir, fileName);
  const hash = createHash('sha256').update(readFileSync(filePath)).digest('hex');

  if (hash === expectedHash) {
    console.log(`✓ ${fileName} — unmodified (${hash.slice(0, 12)}…)`);
  } else {
    failed = true;
    console.error(`✗ ${fileName} — MODIFIED! expected ${expectedHash}, got ${hash}`);
  }
}

if (failed) {
  console.error('\nThe fake API must stay untouched (see README, "Restrictions respected").');
  process.exit(1);
}

console.log('\nThe fake API matches the starter repository.');
