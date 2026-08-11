/*
 * 固定目的地库。
 * 当前先收敛为业务确认过的目的地集合，便于扩展在真实页面中稳定识别。
 */
(function () {
  const DESTINATIONS = [
    {
      id: 'beijing',
      nameZh: '北京',
      nameEn: 'Beijing',
      aliases: ['beijing', 'peking', 'beijing city', '北京'],
      poiKeywords: [
        'tiananmen',
        'forbidden city',
        'jingshan park',
        'great wall',
        'summer palace',
        'temple of heaven',
        'mutianyu',
        'badaling',
        'universal beijing',
        'universal studios beijing',
        'wangfujing',
        'nanluoguxiang',
        'olympic park',
        '天安门',
        '故宫',
        '长城',
        '颐和园',
        '天坛',
        '慕田峪',
        '八达岭',
        '北京环球影城',
        '王府井',
        '南锣鼓巷',
        '奥林匹克公园',
        '景山公园'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'chengdu',
      nameZh: '成都',
      nameEn: 'Chengdu',
      aliases: ['chengdu', '成都'],
      poiKeywords: [
        'panda base',
        'giant panda',
        'chengdu research base of giant panda breeding',
        'jinli',
        'kuanzhai alley',
        'dujiangyan',
        'wuhou shrine',
        'wuhou temple',
        'taikoo li',
        'peoples park',
        'people\'s park',
        'chunxi road',
        'du fu thatched cottage',
        'qingcheng mountain',
        'sanxingdui museum',
        '熊猫基地',
        '成都大熊猫基地',
        '武侯祠',
        '锦里',
        '宽窄巷子',
        '都江堰',
        '太古里',
        '人民公园',
        '春熙路',
        '杜甫草堂',
        '青城山',
        '三星堆博物馆'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'dali',
      nameZh: '大理',
      nameEn: 'Dali',
      aliases: ['dali', '大理'],
      poiKeywords: [
        'erhai',
        'erhai lake',
        'dali ancient town',
        'shuanglang',
        'cangshan',
        'xizhou',
        'three pagodas',
        '洱海',
        '大理古城',
        '双廊',
        '苍山',
        '喜洲',
        '崇圣寺三塔'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'fenghuang-ancient-town',
      nameZh: '凤凰古城',
      nameEn: 'Fenghuang Ancient Town',
      aliases: [
        'fenghuang-ancient-town',
        'fenghuang',
        'fenghuang ancient town',
        'phoenix ancient town',
        '凤凰古城',
        '凤凰'
      ],
      poiKeywords: [
        'tuojiang river',
        'tuojiang river night view',
        'phoenix ancient town',
        'ancient town scenic area',
        'nanhua mountain',
        'qiliang cave',
        'hong bridge',
        'wanming tower',
        '沱江',
        '沱江夜景',
        '南华山',
        '奇梁洞',
        '虹桥',
        '万名塔'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'furong-town',
      nameZh: '芙蓉镇',
      nameEn: 'Furong Town',
      aliases: [
        'furong-town',
        'furong',
        'furong town',
        'furong ancient town',
        '芙蓉镇',
        '芙蓉'
      ],
      poiKeywords: [
        'waterfall town',
        'furong waterfall',
        'furong ancient town',
        'wang village',
        '瀑布镇',
        '芙蓉古镇',
        '王村'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'guangzhou',
      nameZh: '广州',
      nameEn: 'Guangzhou',
      aliases: ['guangzhou', 'canton', '广州'],
      poiKeywords: [
        'canton tower',
        'guangzhou tower',
        'pearl river',
        'pazhou',
        'shamian',
        'beijing road',
        'chen clan academy',
        '广州塔',
        '珠江',
        '琶洲',
        '沙面',
        '北京路',
        '陈家祠'
      ],
      businessKeywords: [
        'canton fair',
        'guangzhou fair',
        'trade fair',
        'china import and export fair',
        'pazhou complex',
        'exhibition',
        'expo',
        '广交会',
        '展会'
      ],
      hasAssets: true
    },
    {
      id: 'guilin',
      nameZh: '桂林',
      nameEn: 'Guilin',
      aliases: ['guilin', '桂林', 'yangshuo', '阳朔'],
      poiKeywords: [
        'li river',
        'yangshuo',
        'elephant trunk hill',
        'longji rice terraces',
        'reed flute cave',
        'two rivers four lakes',
        'ten-mile gallery',
        '漓江',
        '阳朔',
        '象鼻山',
        '龙脊梯田',
        '芦笛岩',
        '两江四湖',
        '十里画廊'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'harbin',
      nameZh: '哈尔滨',
      nameEn: 'Harbin',
      aliases: ['harbin', '哈尔滨'],
      poiKeywords: [
        'ice and snow world',
        'ice festival',
        'central street',
        'saint sophia cathedral',
        'st sophia cathedral',
        'sun island',
        '冰雪大世界',
        '中央大街',
        '圣索菲亚教堂',
        '太阳岛'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'hangzhou',
      nameZh: '杭州',
      nameEn: 'Hangzhou',
      aliases: ['hangzhou', 'hang zhou', '杭州'],
      poiKeywords: [
        'west lake',
        'westlake',
        'lingyin temple',
        'longjing tea',
        'songcheng',
        '西湖',
        '灵隐寺',
        '龙井',
        '宋城'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'kunming',
      nameZh: '昆明',
      nameEn: 'Kunming',
      aliases: ['kunming', '昆明'],
      poiKeywords: [
        'stone forest',
        'dianchi lake',
        'green lake',
        'yunnan ethnic village',
        'jiuxiang',
        '石林',
        '滇池',
        '翠湖',
        '云南民族村',
        '九乡'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'lijiang',
      nameZh: '丽江',
      nameEn: 'Lijiang',
      aliases: ['lijiang', '丽江'],
      poiKeywords: [
        'lijiang old town',
        'jade dragon snow mountain',
        'blue moon valley',
        'shuhe ancient town',
        'lashihai',
        '丽江古城',
        '玉龙雪山',
        '蓝月谷',
        '束河古镇',
        '拉市海'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'nanjing',
      nameZh: '南京',
      nameEn: 'Nanjing',
      aliases: ['nanjing', '南京'],
      poiKeywords: [
        'sun yat-sen mausoleum',
        'confucius temple',
        'qinhuai river',
        'presidential palace',
        'laomendong',
        'niushoushan',
        '中山陵',
        '夫子庙',
        '秦淮河',
        '总统府',
        '老门东',
        '牛首山'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'shanghai',
      nameZh: '上海',
      nameEn: 'Shanghai',
      aliases: ['shanghai', '上海'],
      poiKeywords: [
        'the bund',
        'lujiazui',
        'oriental pearl',
        'yu garden',
        'disneyland',
        'shanghai disney',
        'nanjing road',
        'xintiandi',
        'zhujiajiao',
        '外滩',
        '陆家嘴',
        '东方明珠',
        '豫园',
        '迪士尼',
        '南京路',
        '新天地',
        '朱家角'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'suzhou',
      nameZh: '苏州',
      nameEn: 'Suzhou',
      aliases: ['suzhou', '苏州'],
      poiKeywords: [
        "humble administrator's garden",
        'tiger hill',
        'pingjiang road',
        'zhouzhuang',
        'jinji lake',
        'shantang street',
        '拙政园',
        '虎丘',
        '平江路',
        '周庄',
        '金鸡湖',
        '山塘街'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'xian',
      nameZh: '西安',
      nameEn: "Xi'an",
      aliases: ['xian', "xi'an", '西安'],
      poiKeywords: [
        'terracotta warriors',
        'city wall',
        'big wild goose pagoda',
        'muslim quarter',
        'datang everbright city',
        'bell tower',
        'drum tower',
        '兵马俑',
        '城墙',
        '大雁塔',
        '回民街',
        '大唐不夜城',
        '钟楼',
        '鼓楼'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'shangri_la',
      nameZh: '香格里拉',
      nameEn: 'Shangri-La',
      aliases: ['shangri-la', 'shangri la', '香格里拉'],
      poiKeywords: [
        'songzanlin monastery',
        'pudacuo',
        'duk ezong',
        'napa sea',
        'balagezong',
        '松赞林寺',
        '普达措',
        '独克宗',
        '纳帕海',
        '巴拉格宗'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'yiwu',
      nameZh: '义乌',
      nameEn: 'Yiwu',
      aliases: ['yiwu', '义乌'],
      poiKeywords: [
        'yiwu market',
        'international trade city',
        'futian market',
        'district 1',
        'district 2',
        'district 3',
        'district 4',
        'district 5',
        '义乌市场',
        '国际商贸城',
        '福田市场'
      ],
      businessKeywords: [
        'wholesale',
        'sourcing',
        'commodity market',
        'small commodities',
        'factory visit',
        '批发',
        '采购',
        '小商品'
      ],
      hasAssets: true
    },
    {
      id: 'zhangjiajie',
      nameZh: '张家界',
      nameEn: 'Zhangjiajie',
      aliases: ['zhangjiajie', 'zhang jia jie', '张家界'],
      poiKeywords: [
        'avatar mountains',
        'tianmen mountain',
        'tianmen cave',
        'yuanjiajie',
        'tianzi mountain',
        'bailong elevator',
        'wulingyuan',
        'grand canyon',
        'glass bridge',
        'zhangjiajie national forest park',
        '阿凡达山',
        '天门山',
        '天门洞',
        '袁家界',
        '天子山',
        '百龙天梯',
        '武陵源',
        '张家界大峡谷',
        '大峡谷玻璃桥',
        '张家界国家森林公园'
      ],
      businessKeywords: [],
      hasAssets: true
    },
    {
      id: 'chongqing',
      nameZh: '重庆',
      nameEn: 'Chongqing',
      aliases: ['chongqing', 'chungking', '重庆'],
      poiKeywords: [
        'hongyadong',
        'jiefangbei',
        'yangtze river cableway',
        'liziba',
        'ciqikou',
        'raffles city',
        'shibati',
        'wulong',
        '洪崖洞',
        '解放碑',
        '长江索道',
        '李子坝',
        '磁器口',
        '来福士',
        '十八梯',
        '武隆'
      ],
      businessKeywords: [],
      hasAssets: true
    }
  ];

  const DESTINATION_MAP = DESTINATIONS.reduce((map, destination) => {
    map[destination.id] = destination;
    return map;
  }, {});

  function getDestinationById(destinationId) {
    return DESTINATION_MAP[destinationId] || null;
  }

  globalThis.DESTINATIONS = DESTINATIONS;
  globalThis.DESTINATIONS_API = {
    getDestinationById
  };
})();
