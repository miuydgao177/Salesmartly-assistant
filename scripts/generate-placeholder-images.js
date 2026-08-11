const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SIZE = {
  width: 1200,
  height: 900
};

const IMAGE_GROUPS = [
  {
    intent: 'general',
    colors: ['#D9EEF5', '#BEE3F8', '#FDE68A']
  },
  {
    intent: 'senior',
    colors: ['#D1FAE5', '#A7F3D0', '#BFDBFE']
  },
  {
    intent: 'family',
    colors: ['#FCE7F3', '#FBCFE8', '#DDD6FE']
  }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function getTextColor(index) {
  return index % 2 === 0 ? '#17324D' : '#0F172A';
}

function createSvg({ intent, imageNumber, backgroundColor, accentColor }) {
  const textColor = getTextColor(imageNumber);
  const intentLabel = intent.charAt(0).toUpperCase() + intent.slice(1);
  const imageLabel = `Image ${String(imageNumber).padStart(2, '0')}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE.width}" height="${SIZE.height}" viewBox="0 0 ${SIZE.width} ${SIZE.height}">
  <rect width="${SIZE.width}" height="${SIZE.height}" fill="${backgroundColor}" />
  <rect x="60" y="60" width="${SIZE.width - 120}" height="${SIZE.height - 120}" rx="48" fill="${accentColor}" opacity="0.22" />
  <circle cx="980" cy="180" r="120" fill="${accentColor}" opacity="0.38" />
  <circle cx="220" cy="720" r="150" fill="${accentColor}" opacity="0.24" />
  <rect x="110" y="120" width="980" height="660" rx="36" fill="rgba(255,255,255,0.62)" />
  <text x="140" y="230" fill="${textColor}" font-family="Arial, sans-serif" font-size="68" font-weight="700">TEST ONLY</text>
  <text x="140" y="330" fill="${textColor}" font-family="Arial, sans-serif" font-size="54" font-weight="700">Zhangjiajie</text>
  <text x="140" y="430" fill="${textColor}" font-family="Arial, sans-serif" font-size="52" font-weight="700">${intentLabel}</text>
  <text x="140" y="530" fill="${textColor}" font-family="Arial, sans-serif" font-size="46" font-weight="700">${imageLabel}</text>
  <text x="140" y="655" fill="#B91C1C" font-family="Arial, sans-serif" font-size="42" font-weight="700">测试占位图，禁止正式发送</text>
  <text x="140" y="720" fill="#B91C1C" font-family="Arial, sans-serif" font-size="36" font-weight="700">TEST PLACEHOLDER ONLY · DO NOT SEND TO REAL CUSTOMER</text>
</svg>
`;
}

function writeImages() {
  IMAGE_GROUPS.forEach((group) => {
    const groupDir = path.join(
      PROJECT_ROOT,
      'assets',
      'zhangjiajie',
      group.intent
    );
    ensureDir(groupDir);

    group.colors.forEach((color, index) => {
      const imageNumber = index + 1;
      const fileName = `${group.intent}-${String(imageNumber).padStart(2, '0')}.svg`;
      const filePath = path.join(groupDir, fileName);
      const svg = createSvg({
        intent: group.intent,
        imageNumber,
        backgroundColor: color,
        accentColor: group.colors[(index + 1) % group.colors.length]
      });
      fs.writeFileSync(filePath, svg, 'utf8');
      process.stdout.write(`Generated ${path.relative(PROJECT_ROOT, filePath)}\n`);
    });
  });
}

writeImages();
