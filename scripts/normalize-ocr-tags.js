const fs = require('fs');
const path = require('path');
const {
  normalizeDestinationSlug,
  sanitizeDestinationSlug
} = require('./destination-slugs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const INPUT_PATH = path.join(PROJECT_ROOT, 'data', 'ocr', 'ocr-image-tags-results.json');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'data', 'ocr', 'ocr-image-tags-cleaned.json');

const DROP_TAGS = new Set([
  '00',
  'u',
  'g',
  'oei',
  'beuin',
  'ayersa',
  '埽匠',
  '生椰',
  '本铁',
  '風風古城湿繁风朋',
  '风風古城湿繁风朋',
  '蓬',
  '滋',
  '近',
  '雞窘',
  '寺隱',
  '墨錦',
  '丈化館',
  '山山森菜',
  '里',
  '锦',
  '巧',
  '畫壁沙面',
  '古城旅游区'
]);

const GLOBAL_REPLACEMENTS = {
  'wuingyuan': ['wulingyuan'],
  'hianmen': ['tianmen-mountain'],
  'mountamn': [],
  'zhangjaje': ['zhangjiajie'],
  'grand-can-on': ['grand-canyon'],
  'tradecity': ['international-trade-city'],
  'yiwu-international': ['yiwu-market'],
  'national-park': [],
  'the-bund': ['bund'],
  'yuyuan': ['yu-garden'],
  'chenghuangmiao': ['chenghuang-temple'],
  'disncyand': ['shanghai-disneyland'],
  'ihuozheng-garden': ['humble-administrators-garden'],
  'tigerhil': ['tiger-hill'],
  'qili-shan-tang': ['shantang-street'],
  'the-terracotta-army': ['terracotta-warriors'],
  'xian-ancient-wall': ['city-wall'],
  'dayan-tower': ['big-wild-goose-pagoda'],
  'huimin-street': ['muslim-quarter'],
  'shaanxi-history': ['shaanxi-history-museum'],
  'presidential': ['presidential-palace'],
  'palace': [],
  'xuanwu': ['xuanwu-lake'],
  'lake': [],
  'music-temple': ['music-stage'],
  'sun-yat-sen': ['sun-yat-sen-mausoleum'],
  'mausoleum': [],
  'zhonggu-pagoda': ['bell-and-drum-towers'],
  'pudacuo': ['pudacuo-national-park'],
  'balagezong-grand-canyon': ['balagezong'],
  'napahai': ['napa-sea'],
  'songzanlin': ['songzanlin-monastery'],
  'dukezong': ['duk ezong'],
  'eighteen': ['shibati'],
  'ladders': [],
  'river-cable-way': ['yangtze-river-cableway'],
  'light-rail': ['liziba'],
  'through-building': [],
  'ciqikou': ['ciqikou'],
  'zhazidong': ['zhazidong-prison'],
  'gele': ['gele-mountain'],
  'mansion': ['bai-mansion'],
  'bnziiang': [],
  'uuli-china-museun': [],
  'the-refinet': [],
  '2105': [],
  'gn': [],
  'bal': [],
  '一第中美': [],
  'moseum': [],
  'he-forbidden-city': ['forbidden-city'],
  'pedestrian-street': ['pedestrian-street'],
  'temple-three-pagodas': ['three-pagodas', 'chongsheng-temple'],
  'people-s-park': ['peoples-park'],
  'du-fu-thatched': ['du-fu-thatched-cottage'],
  'cottage': [],
  'oingcheng': ['qingcheng-mountain'],
  'mountain': [],
  'dujangyan': ['dujiangyan'],
  'jini': ['jinli'],
  'hongzhuanstreet': ['hongzhuan-street'],
  'winter-llarbin': ['winter-harbin'],
  'vogaaanor': ['volga-manor'],
  'ancientown': ['ancient-town'],
  'buterly-sprig': ['butterfly-spring'],
  'zhouchengvilage': ['zhoucheng-village'],
  'tie-dye-experience': ['tie-dye', 'zhoucheng-village'],
  'wangiujing': ['wangfujing'],
  'shangxiajiu': ['shangxiajiu-pedestrian-street'],
  'sacred-heart': ['sacred-heart-cathedral'],
  'cathedral': [],
  'yuexiu': ['yuexiu-park'],
  'park': [],
  'sun-yat-sen': ['sun-yat-sen-memorial-hall'],
  'memorial-hall': [],
  'yongqingtang': ['yongqingfang'],
  'night-cruise': ['pearl-river-night-cruise'],
  'wuh': ['wuhou-shrine'],
  'hcngdu-panda': ['panda-base'],
  'blue-oon-valley': ['blue-moon-valley'],
  'spruee-meadow': ['spruce-meadow'],
  'the-first-bend': ['first-bend-of-yangtze-river'],
  'of-the-yangtze': [],
  'white-sand': ['baisha-ancient-town'],
  'town': [],
  'mural': ['baisha-mural'],
  'experience': [],
  'aaclent-towa-scenic-area': ['ancient-town-scenic-area'],
  'furong-towil': ['furong-town'],
  'trunkhill': ['elephant-trunk-hill'],
  'golden-horse-and': ['golden-horse-and-jade-rooster-archway'],
  'ade-rooster-archway': [],
  'lingyin-temple-feilai-peak': ['lingyin-temple', 'feilai-peak'],
  'xiaohe-zhi-street': ['xiaohe-zhijie'],
  'stone-forest': ['stone-forest'],
  'juxiang-caves': ['jiuxiang-caves'],
  'dianchi': ['dianchi-lake'],
  'cuihu-park': ['green-lake-park', 'cuihu-park']
};

const FILE_REPLACEMENTS = {
  '张家界/张家界1.1.png': ['wulingyuan'],
  '张家界/张家界1.2.png': ['tianmen-mountain'],
  '张家界/张家界1.3.png': ['zhangjiajie-grand-canyon', 'grand-canyon'],
  '上海/上海1.1.png': ['yu-garden', 'chenghuang-temple', 'lujiazui', 'bund'],
  '上海/上海1.2.png': ['tianzifang', 'xintiandi', 'wukang-road', 'jingan-temple'],
  '上海/上海1.3.png': ['shanghai-disneyland'],
  '上海/上海1.4.png': ['oriental-pearl', 'the-bund'],
  '上海/上海1.5.png': ['zhujiajiao'],
  '西安/西安1.1.png': ['terracotta-warriors', 'huaqing-palace'],
  '西安/西安1.2.png': ['city-wall', 'muslim-quarter', 'big-wild-goose-pagoda'],
  '西安/西安1.3.png': ['shaanxi-history-museum'],
  '西安/西安1.4.png': ['datang-everbright-city'],
  '西安/西安1.5.png': ['bell-tower', 'drum-tower'],
  '南京/南京1.1.png': ['sun-yat-sen-mausoleum', 'meiling-palace', 'linggu-temple'],
  '南京/南京1.2.png': ['presidential-palace', 'nanjing-museum', 'xuanwu-lake'],
  '南京/南京1.3.png': ['confucius-temple', 'grand-baoen-temple', 'laomendong', 'zhonghua-gate'],
  '南京/南京1.4.jpg': ['qinhuai-river'],
  '南京/南京1.5.png': ['niushoushan'],
  '苏州/苏州1.1.png': ['humble-administrators-garden', 'suzhou-museum', 'pingjiang-road'],
  '苏州/苏州1.2.png': ['tiger-hill', 'hanshan-temple', 'shantang-street', 'lion-grove-garden'],
  '苏州/苏州1.3.png': ['zhouzhuang'],
  '重庆/重庆1.1.png': ['jiefangbei', 'hongyadong'],
  '重庆/重庆1.2.png': ['shibati', 'yangtze-river-cableway', 'liziba'],
  '重庆/重庆1.3.png': ['ciqikou', 'zhazidong-prison', 'bai-mansion', 'gele-mountain'],
  '重庆/重庆1.4.png': ['raffles-city', 'wulong'],
  '义乌/义乌.png': ['yiwu-market', 'international-trade-city', 'fotang-ancient-town'],
  '香格里拉/香格里拉1.1.png': ['pudacuo-national-park'],
  '香格里拉/香格里拉1.2.png': ['balagezong'],
  '香格里拉/香格里拉1.3.png': ['napa-sea', 'songzanlin-monastery', 'duk-ezong-ancient-town'],
  '北京/北京1.4.png': ['universal-beijing-resort', 'universal-studios'],
  '凤凰古城/ 凤凰古城1.2.png': ['phoenix-ancient-town', 'fenghuang-ancient-town'],
  '凤凰古城/凤凰古城1.3.png': ['tuojiang-river'],
  '哈尔滨/哈尔滨1.2.png': ['harbin-ice-and-snow-world', 'winter-harbin'],
  '大理/大理1.4.png': ['shuanglang', 'ancient-town'],
  '广州/广州1.2.png': ['canton-tower', 'shangxiajiu-pedestrian-street', 'shamian-island'],
  '成都/成都1.1.png': ['wuhou-shrine', 'jinli', 'panda-base'],
  '成都/成都2.1.png': ['taikoo-li', 'chunxi-road'],
  '成都/成都2.2.png': ['jinli-night-view', 'jinli'],
  '昆明/昆明1.2.png': ['dianchi-lake', 'western-hills'],
  '杭州/杭州1.1.png': ['west-lake'],
  '杭州/杭州1.3.png': ['songcheng', 'xixi-wetland'],
  '芙蓉镇/芙蓉镇.png': ['furong-town', 'furong-ancient-town']
};

function orderedUnique(values) {
  const seen = new Set();
  const result = [];

  values.forEach((value) => {
    const normalized = String(value || '').trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    result.push(normalized);
  });

  return result;
}

function normalizeTag(tag) {
  return sanitizeDestinationSlug(tag);
}

function relativeLibraryPath(filePath) {
  const parts = filePath.split('/');
  const destination = parts[parts.length - 2];
  const fileName = parts[parts.length - 1].trim();
  return `${destination}/${fileName}`;
}

function applyReplacements(tags, relativePath) {
  const expanded = [];

  tags.forEach((tag) => {
    const normalized = normalizeTag(tag);
    if (!normalized || DROP_TAGS.has(tag) || DROP_TAGS.has(normalized)) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(GLOBAL_REPLACEMENTS, normalized)) {
      expanded.push(...GLOBAL_REPLACEMENTS[normalized]);
      return;
    }

    expanded.push(normalized);
  });

  if (Object.prototype.hasOwnProperty.call(FILE_REPLACEMENTS, relativePath)) {
    expanded.push(...FILE_REPLACEMENTS[relativePath]);
  }

  return orderedUnique(expanded.filter(Boolean));
}

function buildImageId(destinationEn, relativePath) {
  const fileName = path.basename(relativePath, path.extname(relativePath));
  const suffix = fileName
    .replace(/[^\d.]+/g, '')
    .replace(/\./g, '-')
    .replace(/^-|-$/g, '');

  return suffix ? `${destinationEn}-${suffix}` : `${destinationEn}-${Date.now()}`;
}

function buildEnglishTitle(tags) {
  const firstEnglish = tags.find((tag) => /^[a-z0-9-]+$/.test(tag) && !['beijing', 'chengdu', 'guilin', 'guangzhou', 'dali', 'harbin', 'kunming', 'hangzhou', 'lijiang', 'furong-town', 'fenghuang-ancient-town', 'nanjing', 'shanghai', 'suzhou', 'xian', 'shangri_la', 'yiwu', 'chongqing', 'zhangjiajie'].includes(tag));
  if (!firstEnglish) {
    return 'Travel Image';
  }

  return firstEnglish
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function main() {
  const raw = fs.readFileSync(INPUT_PATH, 'utf8');
  const records = JSON.parse(raw);

  const cleaned = records.map((record) => {
    const relativePath = relativeLibraryPath(record.file);
    const cleanedTags = applyReplacements(record.suggestedTags || [], relativePath);
    const destinationFolder = normalizeDestinationSlug(record.destinationEn || record.destinationZh);
    const extension = path.extname(relativePath).toLowerCase();
    const imageId = buildImageId(destinationFolder, relativePath);

    return {
      destinationZh: record.destinationZh,
      destinationEn: destinationFolder,
      sourceFile: record.file,
      relativePath,
      suggestedAssetPath: `assets/${destinationFolder}/library/${imageId}${extension}`,
      imageId,
      title: buildEnglishTitle(cleanedTags),
      titleZh: record.destinationZh,
      detectedText: record.detectedText || [],
      cleanedTags
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cleaned, null, 2), 'utf8');
  process.stdout.write(`Generated ${path.relative(PROJECT_ROOT, OUTPUT_PATH)} with ${cleaned.length} records.\n`);
}

main();
