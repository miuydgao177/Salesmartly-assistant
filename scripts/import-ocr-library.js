const fs = require('fs');
const path = require('path');
const { normalizeDestinationSlug } = require('./destination-slugs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const INPUT_PATH = path.join(PROJECT_ROOT, 'data', 'ocr', 'ocr-image-tags-cleaned.json');
const OUTPUT_METADATA_PATH = path.join(PROJECT_ROOT, 'generated', 'image-library.import.json');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toTitleZh(record) {
  const preferred = (record.cleanedTags || []).find((tag) => /[\u4e00-\u9fa5]/.test(tag));
  return preferred || record.destinationZh;
}

function copyFile(sourcePath, targetPath) {
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function buildMetadata(record) {
  const destination = normalizeDestinationSlug(record.destinationEn || record.destinationZh);
  const extension = path.extname(record.suggestedAssetPath);
  const rawImageId = String(record.imageId || '').trim();
  const imageId = rawImageId.startsWith(`${destination}-`)
    ? rawImageId
    : `${destination}-${rawImageId.replace(/^[^-]+-/, '')}`;
  const file = `assets/${destination}/library/${imageId}${extension}`;

  return {
    id: imageId,
    destination,
    title: record.title,
    titleZh: toTitleZh(record),
    file,
    tags: record.cleanedTags,
    languages: ['en', 'id', 'es'],
    enabled: true,
    defaultSelected: true,
    isPlaceholder: false
  };
}

function main() {
  const raw = fs.readFileSync(INPUT_PATH, 'utf8');
  const records = JSON.parse(raw);
  const metadata = [];

  records.forEach((record) => {
    const sourcePath = record.sourceFile;
    const destination = normalizeDestinationSlug(record.destinationEn || record.destinationZh);
    const extension = path.extname(record.suggestedAssetPath);
    const rawImageId = String(record.imageId || '').trim();
    const imageId = rawImageId.startsWith(`${destination}-`)
      ? rawImageId
      : `${destination}-${rawImageId.replace(/^[^-]+-/, '')}`;
    const targetFileName = `${imageId}${extension}`;
    const targetPath = path.join(
      PROJECT_ROOT,
      'assets',
      destination,
      'library',
      targetFileName
    );
    copyFile(sourcePath, targetPath);
    metadata.push(
      buildMetadata({
        ...record,
        destinationEn: destination,
        imageId,
        suggestedAssetPath: path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/')
      })
    );
  });

  fs.writeFileSync(OUTPUT_METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf8');
  process.stdout.write(
    `Imported ${metadata.length} images and generated ${path.relative(PROJECT_ROOT, OUTPUT_METADATA_PATH)}.\n`
  );
}

main();
