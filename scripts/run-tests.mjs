import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TEST_DIR = join(ROOT, 'test');

const testFiles = readdirSync(TEST_DIR)
  .filter((name) => name.endsWith('.test.mjs'))
  .map((name) => join(TEST_DIR, name))
  .sort();

if (testFiles.length === 0) {
  console.error(`No test files found in ${TEST_DIR}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...testFiles], {
  cwd: ROOT,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
