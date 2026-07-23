import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary, { excludeParentKeys: true });

StyleDictionary.registerFormat({
  name: 'css/sa-theme-vars',
  format({ options }) {
    const entries = options.cssEntries ?? [];
    return `${entries.map(({ cssVar, value }) => `  ${cssVar}: ${value};`).join('\n')}\n`;
  },
});

export function createStyleDictionaryConfig(sourcePath, cssEntries, destination) {
  return {
    source: [sourcePath],
    preprocessors: ['tokens-studio'],
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        buildPath: '',
        files: [
          {
            destination,
            format: 'css/sa-theme-vars',
            options: { cssEntries },
          },
        ],
      },
    },
  };
}

export async function runStyleDictionaryBuild(config) {
  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();
}
