const fs = require('fs');
const path = require('path');
const { normalizeDestinationSlug } = require('./destination-slugs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ASSETS_ROOT = path.join(PROJECT_ROOT, 'assets');
const DEFAULT_OUTPUT = path.join(PROJECT_ROOT, 'generated', 'image-library.generated.js');
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.svg', '.webp']);

function parseArgs(argv) {
  const options = {
    assetsDir: ASSETS_ROOT,
    output: DEFAULT_OUTPUT
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--assets-dir' && argv[index + 1]) {
      options.assetsDir = path.resolve(PROJECT_ROOT, argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--output' && argv[index + 1]) {
      options.output = path.resolve(PROJECT_ROOT, argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--stdout') {
      options.stdout = true;
    }
  }

  return options;
}

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const results = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
      return;
    }

    if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  });

  return results;
}

function humanizeToken(token) {
  return token
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildTags(parts) {
  return [...new Set(parts.filter(Boolean))];
}

function createItem(absoluteFilePath, assetsDir) {
  const relativePath = path.relative(PROJECT_ROOT, absoluteFilePath).replace(/\\/g, '/');
  const relativeToAssets = path.relative(assetsDir, absoluteFilePath);
  const segments = relativeToAssets.split(path.sep);
  const [rawDestination = 'unknown', category = 'library', fileName = 'unknown'] = segments;
  const destination = normalizeDestinationSlug(rawDestination);
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);
  const nameParts = baseName.split(/[-_]+/).filter(Boolean);
  const title = humanizeToken(baseName);

  return {
    id: baseName,
    destination,
    title,
    titleZh: title,
    file: relativePath,
    tags: buildTags([destination, category, ...nameParts]),
    languages: ['en', 'id', 'es'],
    enabled: true,
    defaultSelected: true,
    isPlaceholder: false
  };
}

function generateSource(items) {
  return `/*
 * 由 scripts/generate-image-library-snippet.js 自动生成。
 * 如需补充中文标题、标签或语言，请复制需要的条目到 image-library.js 手动调整。
 */
(function () {
  const IMAGE_LIBRARY_ITEMS = ${JSON.stringify(items, null, 2)};

  function normalizeLibraryItem(item) {
    return {
      id: item.id,
      destination: item.destination,
      englishName: item.title,
      chineseName: item.titleZh,
      alt: \`\${item.title} / \${item.titleZh}\`,
      path: item.file,
      tags: item.tags || [],
      languages: item.languages || ['en'],
      defaultSelected: item.defaultSelected !== false,
      enabled: item.enabled !== false,
      isPlaceholder: Boolean(item.isPlaceholder),
      sourceType: 'library'
    };
  }

  const NORMALIZED_LIBRARY = IMAGE_LIBRARY_ITEMS.map(normalizeLibraryItem);

  function getImagesByDestination(destination) {
    return NORMALIZED_LIBRARY.filter(
      (item) => item.destination === destination && item.enabled
    );
  }

  globalThis.SALESMARTLY_IMAGE_LIBRARY = NORMALIZED_LIBRARY;
  globalThis.SALESMARTLY_IMAGE_LIBRARY_API = {
    getImagesByDestination
  };
})();
`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.assetsDir)) {
    throw new Error(`Assets directory not found: ${options.assetsDir}`);
  }

  const imageFiles = walk(options.assetsDir)
    .filter((filePath) => {
      const normalized = filePath.replace(/\\/g, '/');
      return normalized.includes('/library/') || normalized.includes('/general/') || normalized.includes('/family/') || normalized.includes('/senior/');
    })
    .sort();

  const items = imageFiles.map((filePath) => createItem(filePath, options.assetsDir));
  const source = generateSource(items);

  if (options.stdout) {
    process.stdout.write(source);
    return;
  }

  fs.writeFileSync(options.output, source, 'utf8');
  process.stdout.write(
    `Generated ${path.relative(PROJECT_ROOT, options.output)} with ${items.length} images.\n`
  );
}

main();
