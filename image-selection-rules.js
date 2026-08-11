/*
 * 图片选择规则。
 * 当前先按目的地 + 对话关键词做简单筛选，后续可继续扩展。
 */
(function () {
  const imageLibraryApi = globalThis.SALESMARTLY_IMAGE_LIBRARY_API;

  function normalizeText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/[’']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function canonicalizeTag(tag) {
    return normalizeText(tag).trim();
  }

  function canonicalizeTextList(values) {
    return (values || [])
      .map((value) => canonicalizeTag(value))
      .filter(Boolean);
  }

  function collectMessageTags(messages) {
    const text = normalizeText((messages || []).join(' '));
    const tags = [];

    const rules = [
      { tag: 'temple of heaven', keywords: ['temple of heaven', '天坛'] },
      { tag: 'summer palace', keywords: ['summer palace', '颐和园'] },
      { tag: 'tiananmen', keywords: ['tiananmen', 'tiananmen square', '天安门', '天安门广场'] },
      { tag: 'forbidden city', keywords: ['forbidden city', 'palace museum', '故宫', '紫禁城'] },
      { tag: 'jingshan park', keywords: ['jingshan park', '景山公园'] },
      { tag: 'mutianyu', keywords: ['mutianyu', '慕田峪'] },
      { tag: 'great wall', keywords: ['great wall', '长城'] },
      { tag: 'olympic park', keywords: ['olympic park', 'bird nest', 'water cube', '奥林匹克公园', '鸟巢', '水立方'] },
      { tag: 'universal', keywords: ['universal', 'universal studios', 'universal beijing resort', '北京环球影城', '环球影城'] },
      { tag: 'nanluoguxiang', keywords: ['nanluoguxiang', 'hutong', '南锣鼓巷', '胡同'] },
      { tag: 'wangfujing', keywords: ['wangfujing', 'pedestrian street', '王府井', '王府井步行街'] },
      { tag: 'wuhou shrine', keywords: ['wuhou shrine', 'wuhou temple', '武侯祠'] },
      { tag: 'jinli', keywords: ['jinli', '锦里'] },
      { tag: 'panda base', keywords: ['panda base', 'giant panda', '熊猫基地', '成都大熊猫基地'] },
      { tag: 'kuanzhai alley', keywords: ['kuanzhai alley', '宽窄巷子'] },
      { tag: 'people\'s park', keywords: ['people\'s park', 'peoples park', '人民公园'] },
      { tag: 'du fu thatched cottage', keywords: ['du fu thatched cottage', '杜甫草堂'] },
      { tag: 'qingcheng mountain', keywords: ['qingcheng mountain', '青城山'] },
      { tag: 'dujiangyan', keywords: ['dujiangyan', '都江堰'] },
      { tag: 'sanxingdui museum', keywords: ['sanxingdui museum', 'sanxingdui', '三星堆博物馆', '三星堆'] },
      { tag: 'taikoo li', keywords: ['taikoo li', 'taikooli', '太古里'] },
      { tag: 'chunxi road', keywords: ['chunxi road', '春熙路'] },
      { tag: 'erhai lake', keywords: ['erhai', 'erhai lake', '洱海'] },
      { tag: 'dali ancient town', keywords: ['dali ancient town', '大理古城'] },
      { tag: 'three pagodas', keywords: ['three pagodas', 'chongsheng temple', '崇圣寺三塔'] },
      { tag: 'cangshan', keywords: ['cangshan', '苍山'] },
      { tag: 'butterfly spring', keywords: ['butterfly spring', '蝴蝶泉'] },
      { tag: 'zhoucheng village', keywords: ['zhoucheng village', '周城'] },
      { tag: 'tie dye', keywords: ['tie dye', 'tie-dye', '扎染'] },
      { tag: 'shuanglang', keywords: ['shuanglang', '双廊'] },
      { tag: 'phoenix ancient town', keywords: ['phoenix ancient town', 'fenghuang ancient town', '凤凰古城'] },
      { tag: 'tuojiang river', keywords: ['tuojiang river', '沱江'] },
      { tag: 'nanhua mountain', keywords: ['nanhua mountain', '南华山'] },
      { tag: 'qiliang cave', keywords: ['qiliang cave', '奇梁洞'] },
      { tag: 'furong town', keywords: ['furong town', 'furong ancient town', '芙蓉镇', '芙蓉古镇'] },
      { tag: 'waterfall town', keywords: ['waterfall town', 'furong waterfall', '瀑布镇'] },
      { tag: 'wang village', keywords: ['wang village', '王村'] },
      { tag: 'chimelong', keywords: ['chimelong', '长隆'] },
      { tag: 'safari park', keywords: ['safari park', 'wildlife world', '野生动物世界'] },
      { tag: 'canton tower', keywords: ['canton tower', 'guangzhou tower', '广州塔'] },
      { tag: 'shangxiajiu pedestrian street', keywords: ['shangxiajiu', 'shangxiajiu pedestrian street', '上下九', '上下九步行街'] },
      { tag: 'shamian island', keywords: ['shamian', 'shamian island', '沙面', '沙面岛'] },
      { tag: 'sacred heart cathedral', keywords: ['sacred heart cathedral', '圣心大教堂', '石室圣心大教堂'] },
      { tag: 'beijing road', keywords: ['beijing road', '北京路'] },
      { tag: 'yuexiu park', keywords: ['yuexiu park', '越秀公园'] },
      { tag: 'sun yat-sen memorial hall', keywords: ['sun yat-sen memorial hall', '中山纪念堂'] },
      { tag: 'yongqingfang', keywords: ['yongqingfang', '永庆坊'] },
      { tag: 'huacheng square', keywords: ['huacheng square', '花城广场'] },
      { tag: 'pearl river night cruise', keywords: ['pearl river night cruise', 'pearl river cruise', '珠江夜游'] },
      { tag: 'hongzhuan street', keywords: ['hongzhuan street', 'hongzhuan morning market', '红专街', '红专街早市'] },
      { tag: 'saint sophia cathedral', keywords: ['saint sophia cathedral', 'st sophia cathedral', '圣索菲亚教堂'] },
      { tag: 'central street', keywords: ['central street', '中央大街'] },
      { tag: 'yangmingtan bridge', keywords: ['yangmingtan bridge', '阳明滩大桥'] },
      { tag: 'harbin ice and snow world', keywords: ['harbin ice and snow world', 'ice and snow world', '冰雪大世界'] },
      { tag: 'volga manor', keywords: ['volga manor', '伏尔加庄园'] },
      { tag: 'jade dragon snow mountain', keywords: ['jade dragon snow mountain', 'yulong snow mountain', '玉龙雪山'] },
      { tag: 'blue moon valley', keywords: ['blue moon valley', '蓝月谷'] },
      { tag: 'spruce meadow', keywords: ['spruce meadow', '云杉坪'] },
      { tag: 'tiger leaping gorge', keywords: ['tiger leaping gorge', '虎跳峡'] },
      { tag: 'first bend of yangtze river', keywords: ['first bend of yangtze', '长江第一湾'] },
      { tag: 'baisha ancient town', keywords: ['baisha ancient town', '白沙古镇'] },
      { tag: 'baisha mural', keywords: ['baisha mural', '白沙壁画'] },
      { tag: 'stone forest', keywords: ['stone forest', '石林'] },
      { tag: 'jiuxiang caves', keywords: ['jiuxiang caves', 'jiuxiang', '九乡', '九乡溶洞'] },
      { tag: 'dianchi lake', keywords: ['dianchi lake', 'dianchi', '滇池'] },
      { tag: 'western hills', keywords: ['western hills', '西山'] },
      { tag: 'green lake park', keywords: ['green lake park', 'cuihu park', '翠湖'] },
      { tag: 'yuantong temple', keywords: ['yuantong temple', '圆通寺'] },
      { tag: 'kunming old street', keywords: ['kunming old street', '昆明老街'] },
      { tag: 'golden horse and jade rooster archway', keywords: ['golden horse and jade rooster archway', '金马碧鸡坊'] },
      { tag: 'west lake', keywords: ['west lake', 'westlake', '西湖'] },
      { tag: 'lingyin temple', keywords: ['lingyin temple', '灵隐寺'] },
      { tag: 'feilai peak', keywords: ['feilai peak', '飞来峰'] },
      { tag: 'songcheng', keywords: ['songcheng', '宋城'] },
      { tag: 'xixi wetland', keywords: ['xixi wetland', '西溪湿地'] },
      { tag: 'hefang street', keywords: ['hefang street', '河坊街'] },
      { tag: 'xiaohe zhijie', keywords: ['xiaohe zhijie', 'xiaohe zhi street', '小河直街'] },
      { tag: 'yu garden', keywords: ['yu garden', 'yuyuan', '豫园'] },
      { tag: 'chenghuang temple', keywords: ['chenghuang temple', 'chenghuangmiao', '城隍庙'] },
      { tag: 'lujiazui', keywords: ['lujiazui', '陆家嘴'] },
      { tag: 'bund', keywords: ['the bund', 'bund', '外滩'] },
      { tag: 'tianzifang', keywords: ['tianzifang', '田子坊'] },
      { tag: 'xintiandi', keywords: ['xintiandi', '新天地'] },
      { tag: 'wukang road', keywords: ['wukang road', '武康路'] },
      { tag: 'jingan temple', keywords: ['jingan temple', '静安寺'] },
      { tag: 'shanghai disneyland', keywords: ['shanghai disneyland', 'shanghai disney', 'disneyland', '上海迪士尼', '迪士尼'] },
      { tag: 'oriental pearl', keywords: ['oriental pearl', '东方明珠'] },
      { tag: 'zhujiajiao', keywords: ['zhujiajiao', '朱家角'] },
      { tag: 'terracotta warriors', keywords: ['terracotta warriors', 'terracotta army', '兵马俑'] },
      { tag: 'huaqing palace', keywords: ['huaqing palace', '华清宫'] },
      { tag: 'city wall', keywords: ['xian ancient wall', 'city wall', '西安城墙', '城墙'] },
      { tag: 'big wild goose pagoda', keywords: ['big wild goose pagoda', 'dayan tower', '大雁塔'] },
      { tag: 'muslim quarter', keywords: ['muslim quarter', 'huimin street', '回民街'] },
      { tag: 'shaanxi history museum', keywords: ['shaanxi history museum', '陕西历史博物馆'] },
      { tag: 'datang everbright city', keywords: ['datang everbright city', '大唐不夜城'] },
      { tag: 'bell tower', keywords: ['bell tower', '钟楼'] },
      { tag: 'drum tower', keywords: ['drum tower', '鼓楼'] },
      { tag: 'sun yat-sen mausoleum', keywords: ['sun yat-sen mausoleum', '中山陵'] },
      { tag: 'meiling palace', keywords: ['meiling palace', '美龄宫'] },
      { tag: 'linggu temple', keywords: ['linggu temple', '灵谷寺'] },
      { tag: 'presidential palace', keywords: ['presidential palace', '总统府'] },
      { tag: 'nanjing museum', keywords: ['nanjing museum', '南京博物院', '南京博物馆'] },
      { tag: 'xuanwu lake', keywords: ['xuanwu lake', '玄武湖'] },
      { tag: 'confucius temple', keywords: ['confucius temple', '夫子庙'] },
      { tag: 'grand baoen temple', keywords: ['grand baoen temple', '大报恩寺'] },
      { tag: 'laomendong', keywords: ['laomendong', 'lao men dong', '老门东'] },
      { tag: 'zhonghua gate', keywords: ['zhonghua gate', '中华门'] },
      { tag: 'qinhuai river', keywords: ['qinhuai river', '秦淮河'] },
      { tag: 'niushoushan', keywords: ['niushoushan', '牛首山'] },
      { tag: 'humble administrators garden', keywords: ['humble administrators garden', 'humble administrator s garden', '拙政园'] },
      { tag: 'suzhou museum', keywords: ['suzhou museum', '苏州博物馆'] },
      { tag: 'pingjiang road', keywords: ['pingjiang road', '平江路'] },
      { tag: 'tiger hill', keywords: ['tiger hill', '虎丘'] },
      { tag: 'hanshan temple', keywords: ['hanshan temple', '寒山寺'] },
      { tag: 'shantang street', keywords: ['shantang street', '七里山塘', '山塘街'] },
      { tag: 'lion grove garden', keywords: ['lion grove garden', '狮子林'] },
      { tag: 'zhouzhuang', keywords: ['zhouzhuang', '周庄'] },
      { tag: 'jiefangbei', keywords: ['jiefangbei', '解放碑'] },
      { tag: 'hongyadong', keywords: ['hongyadong', '洪崖洞'] },
      { tag: 'shibati', keywords: ['shibati', 'eighteen ladders', '十八梯'] },
      { tag: 'yangtze river cableway', keywords: ['yangtze river cableway', 'river cableway', '长江索道'] },
      { tag: 'liziba', keywords: ['liziba', 'light rail through building', '李子坝'] },
      { tag: 'ciqikou', keywords: ['ciqikou', '磁器口'] },
      { tag: 'zhazidong prison', keywords: ['zhazidong prison', '渣滓洞'] },
      { tag: 'bai mansion', keywords: ['bai mansion', '白公馆'] },
      { tag: 'gele mountain', keywords: ['gele mountain', '歌乐山'] },
      { tag: 'raffles city', keywords: ['raffles city', '来福士'] },
      { tag: 'wulong', keywords: ['wulong', '武隆'] },
      { tag: 'yiwu market', keywords: ['yiwu market', '义乌市场'] },
      { tag: 'international trade city', keywords: ['international trade city', 'trade city', '国际商贸城'] },
      { tag: 'fotang ancient town', keywords: ['fotang ancient town', '佛堂古镇'] },
      { tag: 'pudacuo national park', keywords: ['pudacuo national park', 'pudacuo', '普达措'] },
      { tag: 'balagezong', keywords: ['balagezong', '巴拉格宗'] },
      { tag: 'napa sea', keywords: ['napa sea', 'napahai', '纳帕海'] },
      { tag: 'songzanlin monastery', keywords: ['songzanlin monastery', '松赞林寺'] },
      { tag: 'duk ezong ancient town', keywords: ['duk ezong ancient town', 'dukezong', '独克宗'] },
      { tag: 'wulingyuan', keywords: ['wulingyuan', '武陵源'] },
      { tag: 'hunan', keywords: ['hunan', '湖南', '湖南张家界'] },
      { tag: 'yangshuo', keywords: ['yangshuo', '阳朔'] },
      { tag: 'li-river', keywords: ['li river', '漓江'] },
      { tag: 'tianmen', keywords: ['tianmen', '天门山'] },
      { tag: 'tianmen-cave', keywords: ['tianmen cave', 'tianmen gate', '天门洞'] },
      { tag: 'avatar', keywords: ['avatar', '阿凡达'] },
      { tag: 'canyon', keywords: ['canyon', '大峡谷'] },
      { tag: 'river', keywords: ['river', '江', '水'] },
      { tag: 'mountain', keywords: ['mountain', 'mountains', '山'] }
    ];

    rules.forEach((rule) => {
      if (rule.keywords.some((keyword) => text.includes(normalizeText(keyword)))) {
        tags.push(rule.tag);
      }
    });

    return tags;
  }

  function scoreImage(image, context) {
    let score = 0;
    const imageTags = new Set((image.tags || []).map(canonicalizeTag));
    const messageText = canonicalizeTag(context.messageText || '');
    const englishName = canonicalizeTag(image.englishName || image.title || '');
    const chineseName = canonicalizeTag(image.chineseName || image.titleZh || '');
    const exactPhrases = new Set(
      canonicalizeTextList([
        image.englishName,
        image.chineseName,
        image.title,
        image.titleZh,
        ...(image.tags || [])
      ])
    );

    if (image.destination === context.destination) {
      score += 10;
    }

    (context.tags || []).forEach((tag) => {
      if (imageTags.has(canonicalizeTag(tag))) {
        score += 3;
      }
    });

    exactPhrases.forEach((phrase) => {
      if (!phrase || phrase.length < 4) {
        return;
      }

      if (messageText === phrase) {
        score += 18;
        return;
      }

      if (messageText.includes(phrase)) {
        score += 8;
      }
    });

    if (englishName && messageText === englishName) {
      score += 12;
    }

    if (chineseName && messageText === chineseName) {
      score += 12;
    }

    if (imageTags.has('cover')) {
      score += 1;
    }

    if (!image.isPlaceholder) {
      score += 100;
    }

    return score;
  }

  function selectImages(context) {
    if (!context || !context.destination || !imageLibraryApi) {
      return [];
    }

    const tags = context.tags && context.tags.length > 0
      ? context.tags
      : collectMessageTags(context.messages || []);

    const ranked = imageLibraryApi
      .getImagesByDestination(context.destination)
      .map((image) => ({
        ...image,
        score: scoreImage(image, {
          destination: context.destination,
          tags,
          messageText: (context.messages || []).join(' ')
        })
      }))
      .sort((left, right) => right.score - left.score);

    const realImages = ranked.filter((image) => !image.isPlaceholder);
    const chosenImages = realImages.length > 0 ? realImages : ranked;

    return chosenImages.map(({ score, ...image }) => image);
  }

  globalThis.SALESMARTLY_IMAGE_SELECTION_RULES = {
    collectMessageTags,
    selectImages
  };
})();
