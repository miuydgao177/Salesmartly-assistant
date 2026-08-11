const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGE_LIBRARY_PATH = path.join(PROJECT_ROOT, 'image-library.js');
const IMPORT_PATH = path.join(PROJECT_ROOT, 'generated', 'image-library.import.json');
const ASSETS_ROOT = path.join(PROJECT_ROOT, 'assets');

function parseImageLibraryItems() {
  const source = fs.readFileSync(IMAGE_LIBRARY_PATH, 'utf8');
  const marker = 'const IMAGE_LIBRARY_ITEMS = [';
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error('Failed to find IMAGE_LIBRARY_ITEMS in image-library.js');
  }

  const arrayStart = source.indexOf('[', markerIndex);
  const arrayEnd = source.indexOf('];', arrayStart);
  return JSON.parse(source.slice(arrayStart, arrayEnd + 1));
}

function listLibraryFiles() {
  const files = [];

  function walk(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        return;
      }

      if (fullPath.replace(/\\/g, '/').includes('/library/')) {
        files.push(path.relative(PROJECT_ROOT, fullPath).replace(/\\/g, '/'));
      }
    });
  }

  walk(ASSETS_ROOT);
  return files.sort();
}

function main() {
  const imageLibraryItems = parseImageLibraryItems();
  const importedItems = JSON.parse(fs.readFileSync(IMPORT_PATH, 'utf8'));
  const libraryFiles = listLibraryFiles();

  const indexedFiles = new Set(imageLibraryItems.map((item) => item.file));
  const importedFiles = new Set(importedItems.map((item) => item.file));
  const allReferencedFiles = new Set([...indexedFiles, ...importedFiles]);

  const destinationMismatches = imageLibraryItems.filter((item) => {
    const fileSegments = item.file.split('/');
    return fileSegments[1] !== item.destination;
  });

  const unusedFiles = libraryFiles.filter((file) => !allReferencedFiles.has(file));
  const importOnlyFiles = [...importedFiles].filter((file) => !indexedFiles.has(file)).sort();

  const report = {
    totals: {
      indexedItems: imageLibraryItems.length,
      importedItems: importedItems.length,
      libraryFiles: libraryFiles.length,
      unusedFiles: unusedFiles.length,
      importOnlyFiles: importOnlyFiles.length,
      destinationMismatches: destinationMismatches.length
    },
    destinationMismatches: destinationMismatches.map((item) => ({
      id: item.id,
      destination: item.destination,
      file: item.file
    })),
    importOnlyFiles,
    unusedFiles
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (
    report.totals.unusedFiles > 0 ||
    report.totals.destinationMismatches > 0
  ) {
    process.exitCode = 1;
  }
}

main();
