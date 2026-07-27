import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import styleDictionaryConfig from '../style-dictionary.config.js';
import { buildTheme } from './build-theme.mjs';

export async function buildAll() {
  const sd = new StyleDictionary(styleDictionaryConfig);
  await sd.buildAllPlatforms();
  const theme = await buildTheme();
  console.log(`Built variables.css + theme.css (${theme.blockCount} theme blocks)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildAll().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
