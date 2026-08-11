const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const RUNTIME_FILES = [
  'destinations.js',
  'image-library.js',
  'image-selection-rules.js',
  'content-packs.js'
];

function loadRuntime() {
  const context = { globalThis: {} };

  RUNTIME_FILES.forEach((file) => {
    const source = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf8');
    vm.runInNewContext(source, context, { filename: file });
  });

  return context.globalThis;
}

function buildDestinationSamples(destination) {
  const englishPoi = (destination.poiKeywords || []).find((keyword) => /[A-Za-z]/.test(keyword)) || '';
  const chinesePoi = (destination.poiKeywords || []).find((keyword) => /[\u4e00-\u9fa5]/.test(keyword)) || '';

  return [
    {
      kind: 'english',
      message: [destination.nameEn, englishPoi].filter(Boolean).join(' ')
    },
    {
      kind: 'chinese',
      message: [destination.nameZh, chinesePoi].filter(Boolean).join(' ')
    }
  ];
}

function run() {
  const runtime = loadRuntime();
  const destinations = runtime.DESTINATIONS || [];
  const imageLibrary = runtime.SALESMARTLY_IMAGE_LIBRARY || [];
  const imageLibraryApi = runtime.SALESMARTLY_IMAGE_LIBRARY_API;
  const selectionRules = runtime.SALESMARTLY_IMAGE_SELECTION_RULES;
  const packsApi = runtime.CONTENT_PACKS_API;

  const assetDestinations = destinations.filter((destination) => destination.hasAssets);
  const destinationChecks = [];

  assetDestinations.forEach((destination) => {
    const images = imageLibraryApi.getImagesByDestination(destination.id);
    const packs = packsApi.getPacksByDestination(destination.id);

    buildDestinationSamples(destination).forEach((sample) => {
      const selected = selectionRules.selectImages({
        destination: destination.id,
        language: sample.kind === 'chinese' ? 'zh' : 'en',
        intent: 'general',
        messages: [sample.message]
      });

      destinationChecks.push({
        destination: destination.id,
        kind: sample.kind,
        message: sample.message,
        imageCount: images.length,
        packCount: packs.length,
        topSelectedId: selected[0] ? selected[0].id : null,
        ok: images.length > 0 && packs.length > 0 && selected.length > 0
      });
    });
  });

  const titleChecks = imageLibrary
    .filter((image) => !image.isPlaceholder)
    .map((image) => {
      const englishSelected = selectionRules.selectImages({
        destination: image.destination,
        language: 'en',
        intent: 'general',
        messages: [image.englishName || '']
      }).slice(0, 3).map((item) => item.id);

      const chineseSelected = selectionRules.selectImages({
        destination: image.destination,
        language: 'zh',
        intent: 'general',
        messages: [image.chineseName || '']
      }).slice(0, 3).map((item) => item.id);

      return {
        id: image.id,
        destination: image.destination,
        englishName: image.englishName,
        chineseName: image.chineseName,
        englishExactTop3: englishSelected.includes(image.id),
        chineseExactTop3: chineseSelected.includes(image.id)
      };
    });

  const destinationFailures = destinationChecks.filter((check) => !check.ok);
  const titleWarnings = titleChecks.filter(
    (check) => !check.englishExactTop3 || !check.chineseExactTop3
  );

  const summary = {
    checkedAt: new Date().toISOString(),
    assetDestinations: assetDestinations.length,
    libraryImages: imageLibrary.filter((image) => !image.isPlaceholder).length,
    destinationFailures,
    titleWarnings
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  if (destinationFailures.length > 0) {
    process.exitCode = 1;
  }
}

run();
