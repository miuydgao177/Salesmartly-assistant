const DESTINATION_SLUG_MAP = {
  北京: 'beijing',
  beijing: 'beijing',
  成都: 'chengdu',
  chengdu: 'chengdu',
  重庆: 'chongqing',
  chongqing: 'chongqing',
  大理: 'dali',
  dali: 'dali',
  凤凰古城: 'fenghuang-ancient-town',
  'fenghuang-ancient-town': 'fenghuang-ancient-town',
  芙蓉镇: 'furong-town',
  'furong-town': 'furong-town',
  广州: 'guangzhou',
  guangzhou: 'guangzhou',
  桂林: 'guilin',
  guilin: 'guilin',
  杭州: 'hangzhou',
  hangzhou: 'hangzhou',
  哈尔滨: 'harbin',
  harbin: 'harbin',
  昆明: 'kunming',
  kunming: 'kunming',
  丽江: 'lijiang',
  lijiang: 'lijiang',
  南京: 'nanjing',
  nanjing: 'nanjing',
  上海: 'shanghai',
  shanghai: 'shanghai',
  香格里拉: 'shangri_la',
  shangri_la: 'shangri_la',
  'shangri-la': 'shangri_la',
  苏州: 'suzhou',
  suzhou: 'suzhou',
  西安: 'xian',
  xian: 'xian',
  义乌: 'yiwu',
  yiwu: 'yiwu',
  张家界: 'zhangjiajie',
  zhangjiajie: 'zhangjiajie'
};

function sanitizeDestinationSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeDestinationSlug(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return 'unknown';
  }

  if (DESTINATION_SLUG_MAP[trimmed]) {
    return DESTINATION_SLUG_MAP[trimmed];
  }

  const sanitized = sanitizeDestinationSlug(trimmed);
  return DESTINATION_SLUG_MAP[sanitized] || sanitized;
}

module.exports = {
  DESTINATION_SLUG_MAP,
  normalizeDestinationSlug,
  sanitizeDestinationSlug
};
