import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTheme } from './build-theme.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

export async function buildAll() {
  run('npx', ['style-dictionary', 'build', '--config', 'style-dictionary.config.js']);
  const theme = await buildTheme();
  console.log(`Built variables.css + theme.css (${theme.blockCount} theme blocks)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildAll().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
