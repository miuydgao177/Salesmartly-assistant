/*
 * 本地图片库索引。
 * 业务后续只需要按目录放图，并在这里补充元数据。
 */
(function () {
  const IMAGE_LIBRARY_ITEMS = [
    {
      "id": "beijing-forbidden-jingshan-01",
      "destination": "beijing",
      "title": "Tiananmen, Jingshan & Forbidden City",
      "titleZh": "天安门广场 / 景山公园 / 故宫",
      "file": "assets/beijing/library/beijing-forbidden-jingshan-01.png",
      "tags": [
        "beijing",
        "tiananmen",
        "jingshan park",
        "forbidden city",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "beijing-mutianyu-olympic-01",
      "destination": "beijing",
      "title": "Mutianyu Great Wall & Olympic Park",
      "titleZh": "慕田峪长城 / 奥林匹克公园",
      "file": "assets/beijing/library/beijing-mutianyu-olympic-01.png",
      "tags": [
        "beijing",
        "mutianyu",
        "great wall",
        "olympic park",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "beijing-nanluoguxiang-01",
      "destination": "beijing",
      "title": "Nanluoguxiang",
      "titleZh": "南锣鼓巷",
      "file": "assets/beijing/library/beijing-nanluoguxiang-01.png",
      "tags": [
        "beijing",
        "nanluoguxiang",
        "hutong",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "beijing-temple-summer-01",
      "destination": "beijing",
      "title": "Temple of Heaven & Summer Palace",
      "titleZh": "天坛 / 颐和园",
      "file": "assets/beijing/library/beijing-temple-summer-01.png",
      "tags": [
        "beijing",
        "temple of heaven",
        "summer palace",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "beijing-universal-01",
      "destination": "beijing",
      "title": "Universal Beijing Resort",
      "titleZh": "北京环球影城",
      "file": "assets/beijing/library/beijing-universal-01.png",
      "tags": [
        "beijing",
        "universal",
        "universal studios",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "beijing-wangfujing-01",
      "destination": "beijing",
      "title": "Wangfujing Pedestrian Street",
      "titleZh": "王府井步行街",
      "file": "assets/beijing/library/beijing-wangfujing-01.png",
      "tags": [
        "beijing",
        "wangfujing",
        "pedestrian street",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chengdu-jinli-night-01",
      "destination": "chengdu",
      "title": "Jinli Night View",
      "titleZh": "锦里夜景",
      "file": "assets/chengdu/library/chengdu-jinli-night-01.png",
      "tags": [
        "chengdu",
        "jinli",
        "night view",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chengdu-kuanzhai-park-dufu-01",
      "destination": "chengdu",
      "title": "Kuanzhai Alley, People's Park & Du Fu Thatched Cottage",
      "titleZh": "宽窄巷子 / 人民公园 / 杜甫草堂",
      "file": "assets/chengdu/library/chengdu-kuanzhai-park-dufu-01.png",
      "tags": [
        "chengdu",
        "kuanzhai alley",
        "people's park",
        "peoples park",
        "du fu thatched cottage",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chengdu-qingcheng-dujiangyan-01",
      "destination": "chengdu",
      "title": "Qingcheng Mountain & Dujiangyan",
      "titleZh": "青城山 / 都江堰",
      "file": "assets/chengdu/library/chengdu-qingcheng-dujiangyan-01.png",
      "tags": [
        "chengdu",
        "qingcheng mountain",
        "dujiangyan",
        "mountain",
        "river",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chengdu-sanxingdui-01",
      "destination": "chengdu",
      "title": "Sanxingdui Museum",
      "titleZh": "三星堆博物馆",
      "file": "assets/chengdu/library/chengdu-sanxingdui-01.png",
      "tags": [
        "chengdu",
        "sanxingdui museum",
        "museum",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chengdu-taikooli-chunxi-01",
      "destination": "chengdu",
      "title": "Taikoo Li & Chunxi Road",
      "titleZh": "太古里 / 春熙路",
      "file": "assets/chengdu/library/chengdu-taikooli-chunxi-01.png",
      "tags": [
        "chengdu",
        "taikoo li",
        "chunxi road",
        "shopping",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chengdu-wuhou-jinli-panda-01",
      "destination": "chengdu",
      "title": "Wuhou Shrine, Jinli & Panda Base",
      "titleZh": "武侯祠 / 锦里 / 成都大熊猫基地",
      "file": "assets/chengdu/library/chengdu-wuhou-jinli-panda-01.png",
      "tags": [
        "chengdu",
        "wuhou shrine",
        "wuhou temple",
        "jinli",
        "panda base",
        "giant panda",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chongqing-1-1",
      "destination": "chongqing",
      "title": "Jiefangbei & Hongyadong",
      "titleZh": "解放碑 / 洪崖洞",
      "file": "assets/chongqing/library/chongqing-1-1.png",
      "tags": [
        "重庆",
        "chongqing",
        "jiefangbei",
        "hongyadong"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chongqing-1-2",
      "destination": "chongqing",
      "title": "Shibati, Yangtze River Cableway & Liziba",
      "titleZh": "十八梯 / 长江索道 / 李子坝",
      "file": "assets/chongqing/library/chongqing-1-2.png",
      "tags": [
        "重庆",
        "chongqing",
        "shibati",
        "yangtze-river-cableway",
        "liziba"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chongqing-1-3",
      "destination": "chongqing",
      "title": "Ciqikou, Zhazidong, Bai Mansion & Gele Mountain",
      "titleZh": "磁器口 / 渣滓洞 / 白公馆 / 歌乐山",
      "file": "assets/chongqing/library/chongqing-1-3.png",
      "tags": [
        "重庆",
        "chongqing",
        "ciqikou",
        "zhazidong-prison",
        "bai-mansion",
        "gele-mountain"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "chongqing-1-4",
      "destination": "chongqing",
      "title": "Wulong & Dazu Rock Carvings",
      "titleZh": "武隆 / 大足石刻",
      "file": "assets/chongqing/library/chongqing-1-4.png",
      "tags": [
        "重庆",
        "chongqing",
        "wulong",
        "dazu-rock-carvings"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "dali-1-1",
      "destination": "dali",
      "title": "Erhai Lake",
      "titleZh": "洱海",
      "file": "assets/dali/library/dali-1-1.png",
      "tags": [
        "大理",
        "dali",
        "erhai-lake"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "dali-1-2",
      "destination": "dali",
      "title": "Dali Ancient Town, Three Pagodas & Cangshan",
      "titleZh": "大理古城 / 崇圣寺三塔 / 苍山",
      "file": "assets/dali/library/dali-1-2.png",
      "tags": [
        "大理",
        "dali",
        "ancient-town",
        "chongsheng",
        "three-pagodas",
        "chongsheng-temple",
        "cangshan"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "dali-1-3",
      "destination": "dali",
      "title": "Butterfly Spring, Zhoucheng Village & Tie-Dye",
      "titleZh": "蝴蝶泉 / 周城 / 扎染体验",
      "file": "assets/dali/library/dali-1-3.png",
      "tags": [
        "大理",
        "dali",
        "butterfly-spring",
        "zhoucheng-village",
        "tie-dye"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "dali-1-4",
      "destination": "dali",
      "title": "Shuanglang Ancient Town",
      "titleZh": "双廊古镇",
      "file": "assets/dali/library/dali-1-4.png",
      "tags": [
        "大理",
        "dali",
        "ancient-town",
        "shuanglang"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "fenghuang-ancient-town-1-1",
      "destination": "fenghuang-ancient-town",
      "title": "Nanhua Mountain & Qiliang Cave",
      "titleZh": "南华山 / 奇梁洞",
      "file": "assets/fenghuang-ancient-town/library/fenghuang-ancient-town-1-1.png",
      "tags": [
        "凤凰古城",
        "fenghuang-ancient-town",
        "fenghuang",
        "nanhua-mountain",
        "forest-park",
        "qiliang-cave"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "fenghuang-ancient-town-1-2",
      "destination": "fenghuang-ancient-town",
      "title": "Phoenix Ancient Town Scenic Area",
      "titleZh": "凤凰古城景区",
      "file": "assets/fenghuang-ancient-town/library/fenghuang-ancient-town-1-2.png",
      "tags": [
        "凤凰古城",
        "fenghuang-ancient-town",
        "fenghuang",
        "phoenix-ancient-town",
        "ancient-town-scenic-area"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "fenghuang-ancient-town-1-3",
      "destination": "fenghuang-ancient-town",
      "title": "Tuojiang River Night View",
      "titleZh": "沱江夜景",
      "file": "assets/fenghuang-ancient-town/library/fenghuang-ancient-town-1-3.png",
      "tags": [
        "凤凰古城",
        "fenghuang-ancient-town",
        "fenghuang",
        "tuojiang-river",
        "night-view"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "furong-town-1786084192159",
      "destination": "furong-town",
      "title": "Furong Ancient Town",
      "titleZh": "芙蓉古镇",
      "file": "assets/furong-town/library/furong-town-1786084192159.png",
      "tags": [
        "芙蓉镇",
        "furong",
        "furong-town",
        "furong-ancient-town",
        "waterfall-town"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guangzhou-1-1",
      "destination": "guangzhou",
      "title": "Chimelong Safari Park",
      "titleZh": "长隆野生动物世界",
      "file": "assets/guangzhou/library/guangzhou-1-1.png",
      "tags": [
        "广州",
        "guangzhou",
        "chimelong",
        "safari-park"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guangzhou-1-2",
      "destination": "guangzhou",
      "title": "Canton Tower, Shangxiajiu & Shamian",
      "titleZh": "广州塔 / 上下九步行街 / 沙面岛",
      "file": "assets/guangzhou/library/guangzhou-1-2.png",
      "tags": [
        "广州",
        "guangzhou",
        "canton-tower",
        "shangxiajiu-pedestrian-street",
        "pedestrian-street",
        "shamian",
        "island",
        "shamian-island"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guangzhou-1-3",
      "destination": "guangzhou",
      "title": "Sacred Heart Cathedral, Beijing Road & Yuexiu Park",
      "titleZh": "圣心大教堂 / 北京路 / 越秀公园",
      "file": "assets/guangzhou/library/guangzhou-1-3.png",
      "tags": [
        "广州",
        "guangzhou",
        "sacred-heart-cathedral",
        "beijing-road",
        "pedestrian-street",
        "yuexiu-park",
        "sun-yat-sen-memorial-hall"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guangzhou-1-4",
      "destination": "guangzhou",
      "title": "Yongqingfang, Huacheng Square & Pearl River Night Cruise",
      "titleZh": "永庆坊 / 花城广场 / 珠江夜游",
      "file": "assets/guangzhou/library/guangzhou-1-4.png",
      "tags": [
        "广州",
        "guangzhou",
        "yongqingfang",
        "huacheng-square",
        "pearl-river",
        "pearl-river-night-cruise"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guilin-1-1",
      "destination": "guilin",
      "title": "Li River & Yangshuo",
      "titleZh": "漓江 / 阳朔",
      "file": "assets/guilin/library/guilin-1-1.png",
      "tags": [
        "桂林",
        "guilin",
        "li-river",
        "yangshuo"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guilin-1-2",
      "destination": "guilin",
      "title": "Longji Rice Terraces, Pagodas & Elephant Trunk Hill",
      "titleZh": "龙脊梯田 / 日月双塔 / 象鼻山",
      "file": "assets/guilin/library/guilin-1-2.png",
      "tags": [
        "桂林",
        "guilin",
        "longji-rice-terraces",
        "sun-and-moon",
        "pagodas",
        "elephant",
        "elephant-trunk-hill"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guilin-1-3",
      "destination": "guilin",
      "title": "Xingping Ancient Town, Xianggong Hill & Yulong River",
      "titleZh": "兴坪古镇 / 相公山 / 遇龙河",
      "file": "assets/guilin/library/guilin-1-3.png",
      "tags": [
        "桂林",
        "guilin",
        "xingping-ancient-town",
        "xiangong-hill",
        "yulong-river",
        "bamboo-rafting"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "guilin-cover-01",
      "destination": "guilin",
      "title": "Guilin Cover 01",
      "titleZh": "桂林封面图 01",
      "file": "assets/guilin/library/guilin-cover-01.svg",
      "tags": [
        "guilin",
        "cover",
        "general",
        "landscape"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": true
    },
    {
      "id": "guilin-li-river-01",
      "destination": "guilin",
      "title": "Li River 01",
      "titleZh": "漓江 01",
      "file": "assets/guilin/library/guilin-li-river-01.svg",
      "tags": [
        "guilin",
        "li-river",
        "river",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": true
    },
    {
      "id": "guilin-yangshuo-01",
      "destination": "guilin",
      "title": "Yangshuo 01",
      "titleZh": "阳朔 01",
      "file": "assets/guilin/library/guilin-yangshuo-01.svg",
      "tags": [
        "guilin",
        "yangshuo",
        "river",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": true
    },
    {
      "id": "hangzhou-1-1",
      "destination": "hangzhou",
      "title": "West Lake",
      "titleZh": "西湖",
      "file": "assets/hangzhou/library/hangzhou-1-1.png",
      "tags": [
        "杭州",
        "hangzhou",
        "westlake",
        "west-lake"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "hangzhou-1-2",
      "destination": "hangzhou",
      "title": "Lingyin Temple & Feilai Peak",
      "titleZh": "灵隐寺 / 飞来峰",
      "file": "assets/hangzhou/library/hangzhou-1-2.png",
      "tags": [
        "杭州",
        "hangzhou",
        "lingyin-temple",
        "feilai-peak"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "hangzhou-1-3",
      "destination": "hangzhou",
      "title": "Songcheng & Xixi Wetland",
      "titleZh": "宋城 / 西溪湿地",
      "file": "assets/hangzhou/library/hangzhou-1-3.png",
      "tags": [
        "杭州",
        "hangzhou",
        "songcheng",
        "xixi-wetland"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "hangzhou-1-4",
      "destination": "hangzhou",
      "title": "Hefang Street & Xiaohe Zhijie",
      "titleZh": "河坊街 / 小河直街",
      "file": "assets/hangzhou/library/hangzhou-1-4.png",
      "tags": [
        "杭州",
        "hangzhou",
        "hefang-street",
        "xiaohe-zhijie"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "harbin-1-1",
      "destination": "harbin",
      "title": "Hongzhuan Street, Central Street & Sophia Cathedral",
      "titleZh": "红专街早市 / 中央大街 / 圣索菲亚教堂",
      "file": "assets/harbin/library/harbin-1-1.png",
      "tags": [
        "哈尔滨",
        "harbin",
        "hongzhuan-street",
        "morning-market",
        "saint-sophia",
        "saint-sophia-cathedral",
        "central-street",
        "yangmingtan",
        "bridge"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "harbin-1-2",
      "destination": "harbin",
      "title": "Harbin Ice and Snow World",
      "titleZh": "哈尔滨冰雪大世界",
      "file": "assets/harbin/library/harbin-1-2.png",
      "tags": [
        "哈尔滨",
        "harbin",
        "winter-harbin",
        "harbin-ice-and-snow-world"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "harbin-1-3",
      "destination": "harbin",
      "title": "Volga Manor",
      "titleZh": "伏尔加庄园",
      "file": "assets/harbin/library/harbin-1-3.png",
      "tags": [
        "哈尔滨",
        "harbin",
        "volga-manor"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "kunming-1-1",
      "destination": "kunming",
      "title": "Stone Forest & Jiuxiang Caves",
      "titleZh": "石林 / 九乡溶洞",
      "file": "assets/kunming/library/kunming-1-1.png",
      "tags": [
        "昆明",
        "kunming",
        "stone-forest",
        "jiuxiang-caves"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "kunming-1-2",
      "destination": "kunming",
      "title": "Dianchi Lake & Western Hills",
      "titleZh": "滇池 / 西山",
      "file": "assets/kunming/library/kunming-1-2.png",
      "tags": [
        "昆明",
        "kunming",
        "dianchi-lake",
        "western-hills"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "kunming-1-3",
      "destination": "kunming",
      "title": "Green Lake, Yuantong Temple & Old Street",
      "titleZh": "翠湖 / 圆通寺 / 昆明老街",
      "file": "assets/kunming/library/kunming-1-3.png",
      "tags": [
        "昆明",
        "kunming",
        "green-lake-park",
        "cuihu-park",
        "yuantong-temple",
        "kunming-old-street",
        "golden-horse-and-jade-rooster-archway"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "lijiang-1-1",
      "destination": "lijiang",
      "title": "Yulong Snow Mountain",
      "titleZh": "玉龙雪山",
      "file": "assets/lijiang/library/lijiang-1-1.png",
      "tags": [
        "丽江",
        "lijiang",
        "yulong-snow",
        "jade-dragon-snow-mountain"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "lijiang-1-2",
      "destination": "lijiang",
      "title": "Blue Moon Valley & Spruce Meadow",
      "titleZh": "蓝月谷 / 云杉坪",
      "file": "assets/lijiang/library/lijiang-1-2.png",
      "tags": [
        "丽江",
        "lijiang",
        "blue-moon-valley",
        "spruce-meadow"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "lijiang-1-3",
      "destination": "lijiang",
      "title": "Tiger Leaping Gorge & First Bend",
      "titleZh": "虎跳峡 / 长江第一湾",
      "file": "assets/lijiang/library/lijiang-1-3.png",
      "tags": [
        "丽江",
        "lijiang",
        "tiger-leaping",
        "gorge",
        "tiger-leaping-gorge",
        "first-bend-of-yangtze-river"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "lijiang-1-4",
      "destination": "lijiang",
      "title": "Baisha Ancient Town & Murals",
      "titleZh": "白沙古镇 / 白沙壁画",
      "file": "assets/lijiang/library/lijiang-1-4.png",
      "tags": [
        "丽江",
        "lijiang",
        "baisha-ancient-town",
        "baisha-mural"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "nanjing-1-1",
      "destination": "nanjing",
      "title": "Sun Yat-sen Mausoleum, Meiling Palace & Linggu Temple",
      "titleZh": "中山陵 / 美龄宫 / 灵谷寺",
      "file": "assets/nanjing/library/nanjing-1-1.png",
      "tags": [
        "南京",
        "nanjing",
        "sun-yat-sen-mausoleum",
        "meiling-palace",
        "linggu-temple"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "nanjing-1-2",
      "destination": "nanjing",
      "title": "Presidential Palace, Nanjing Museum & Xuanwu Lake",
      "titleZh": "总统府 / 南京博物院 / 玄武湖",
      "file": "assets/nanjing/library/nanjing-1-2.png",
      "tags": [
        "南京",
        "nanjing",
        "presidential-palace",
        "nanjing-museum",
        "xuanwu-lake"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "nanjing-1-3",
      "destination": "nanjing",
      "title": "Confucius Temple, Grand Baoen Temple, Laomendong & Zhonghua Gate",
      "titleZh": "夫子庙 / 大报恩寺 / 老门东 / 中华门",
      "file": "assets/nanjing/library/nanjing-1-3.png",
      "tags": [
        "南京",
        "nanjing",
        "confucius-temple",
        "grand-baoen-temple",
        "laomendong",
        "zhonghua-gate"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "nanjing-1-4",
      "destination": "nanjing",
      "title": "Qinhuai River",
      "titleZh": "秦淮河",
      "file": "assets/nanjing/library/nanjing-1-4.jpg",
      "tags": [
        "南京",
        "nanjing",
        "qinhuai-river"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "nanjing-1-5",
      "destination": "nanjing",
      "title": "Qinhuai River Night Tour",
      "titleZh": "秦淮河夜游",
      "file": "assets/nanjing/library/nanjing-1-5.png",
      "tags": [
        "南京",
        "nanjing",
        "qinhuai-river",
        "night-tour"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shanghai-1-1",
      "destination": "shanghai",
      "title": "Yu Garden, Chenghuang Temple, Lujiazui & The Bund",
      "titleZh": "豫园 / 城隍庙 / 陆家嘴 / 外滩",
      "file": "assets/shanghai/library/shanghai-1-1.png",
      "tags": [
        "上海",
        "shanghai",
        "yu-garden",
        "chenghuang-temple",
        "lujiazui",
        "bund"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shanghai-1-2",
      "destination": "shanghai",
      "title": "Tianzifang, Xintiandi, Wukang Road & Jingan Temple",
      "titleZh": "田子坊 / 新天地 / 武康路 / 静安寺",
      "file": "assets/shanghai/library/shanghai-1-2.png",
      "tags": [
        "上海",
        "shanghai",
        "tianzifang",
        "xintiandi",
        "wukang-road",
        "jingan-temple"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shanghai-1-3",
      "destination": "shanghai",
      "title": "Shanghai Disneyland",
      "titleZh": "上海迪士尼",
      "file": "assets/shanghai/library/shanghai-1-3.png",
      "tags": [
        "上海",
        "shanghai",
        "shanghai-disneyland"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shanghai-1-4",
      "destination": "shanghai",
      "title": "The Bund Night Tour & Oriental Pearl",
      "titleZh": "外滩夜景 / 东方明珠",
      "file": "assets/shanghai/library/shanghai-1-4.png",
      "tags": [
        "上海",
        "shanghai",
        "bund-night-tour",
        "bund",
        "oriental-pearl",
        "fuzhou-road"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shanghai-1-5",
      "destination": "shanghai",
      "title": "Nanjing Road",
      "titleZh": "南京路",
      "file": "assets/shanghai/library/shanghai-1-5.png",
      "tags": [
        "上海",
        "shanghai",
        "nanjing-road"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shangri_la-1-1",
      "destination": "shangri_la",
      "title": "Pudacuo National Park",
      "titleZh": "普达措国家公园",
      "file": "assets/shangri_la/library/shangri_la-1-1.png",
      "tags": [
        "香格里拉",
        "shangri-la",
        "pudacuo-national-park"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shangri_la-1-2",
      "destination": "shangri_la",
      "title": "Balagezong Grand Canyon",
      "titleZh": "巴拉格宗大峡谷",
      "file": "assets/shangri_la/library/shangri_la-1-2.png",
      "tags": [
        "香格里拉",
        "shangri-la",
        "balagezong"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "shangri_la-1-3",
      "destination": "shangri_la",
      "title": "Napa Sea, Songzanlin Monastery & Dukezong",
      "titleZh": "纳帕海 / 松赞林寺 / 独克宗古城",
      "file": "assets/shangri_la/library/shangri_la-1-3.png",
      "tags": [
        "香格里拉",
        "shangri-la",
        "napa-sea",
        "songzanlin-monastery",
        "duk-ezong-ancient-town"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "suzhou-1-1",
      "destination": "suzhou",
      "title": "Humble Administrator's Garden, Suzhou Museum & Pingjiang Road",
      "titleZh": "拙政园 / 苏州博物馆 / 平江路",
      "file": "assets/suzhou/library/suzhou-1-1.png",
      "tags": [
        "苏州",
        "suzhou",
        "humble-administrators-garden",
        "suzhou-museum",
        "pingjiang-road"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "suzhou-1-2",
      "destination": "suzhou",
      "title": "Tiger Hill, Hanshan Temple, Shantang Street & Lion Grove",
      "titleZh": "虎丘 / 寒山寺 / 山塘街 / 狮子林",
      "file": "assets/suzhou/library/suzhou-1-2.png",
      "tags": [
        "苏州",
        "suzhou",
        "tiger-hill",
        "hanshan-temple",
        "shantang-street",
        "lion-grove-garden"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "suzhou-1-3",
      "destination": "suzhou",
      "title": "Zhouzhuang",
      "titleZh": "周庄",
      "file": "assets/suzhou/library/suzhou-1-3.png",
      "tags": [
        "苏州",
        "suzhou",
        "zhouzhuang"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "xian-1-1",
      "destination": "xian",
      "title": "Terracotta Warriors & Huaqing Palace",
      "titleZh": "兵马俑 / 华清宫",
      "file": "assets/xian/library/xian-1-1.png",
      "tags": [
        "西安",
        "xian",
        "terracotta-warriors",
        "huaqing-palace"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "xian-1-2",
      "destination": "xian",
      "title": "Xi'an City Wall, Muslim Quarter & Big Wild Goose Pagoda",
      "titleZh": "西安城墙 / 回民街 / 大雁塔",
      "file": "assets/xian/library/xian-1-2.png",
      "tags": [
        "西安",
        "xian",
        "city-wall",
        "muslim-quarter",
        "big-wild-goose-pagoda"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "xian-1-3",
      "destination": "xian",
      "title": "Shaanxi History Museum",
      "titleZh": "陕西历史博物馆",
      "file": "assets/xian/library/xian-1-3.png",
      "tags": [
        "西安",
        "xian",
        "shaanxi-history-museum"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "xian-1-4",
      "destination": "xian",
      "title": "Datang Everbright City",
      "titleZh": "大唐不夜城",
      "file": "assets/xian/library/xian-1-4.png",
      "tags": [
        "西安",
        "xian",
        "datang-everbright-city"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "xian-1-5",
      "destination": "xian",
      "title": "Bell Tower & Drum Tower",
      "titleZh": "钟楼 / 鼓楼",
      "file": "assets/xian/library/xian-1-5.png",
      "tags": [
        "西安",
        "xian",
        "bell-tower",
        "drum-tower"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "yiwu-1786340553681",
      "destination": "yiwu",
      "title": "Yiwu Market & Fotang Ancient Town",
      "titleZh": "义乌国际商贸城 / 佛堂古镇",
      "file": "assets/yiwu/library/yiwu-1786340553681.png",
      "tags": [
        "义乌",
        "yiwu",
        "yiwu-market",
        "international-trade-city",
        "fotang-ancient-town"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "zhangjiajie-1-1",
      "destination": "zhangjiajie",
      "title": "Wulingyuan",
      "titleZh": "武陵源",
      "file": "assets/zhangjiajie/library/zhangjiajie-1-1.png",
      "tags": [
        "张家界",
        "zhangjiajie",
        "wulingyuan"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "zhangjiajie-1-2",
      "destination": "zhangjiajie",
      "title": "Tianmen Mountain",
      "titleZh": "天门山",
      "file": "assets/zhangjiajie/library/zhangjiajie-1-2.png",
      "tags": [
        "张家界",
        "zhangjiajie",
        "tianmen-mountain"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "zhangjiajie-1-3",
      "destination": "zhangjiajie",
      "title": "Zhangjiajie Grand Canyon",
      "titleZh": "张家界大峡谷",
      "file": "assets/zhangjiajie/library/zhangjiajie-1-3.png",
      "tags": [
        "张家界",
        "zhangjiajie",
        "grand-canyon",
        "zhangjiajie-grand-canyon"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "zhangjiajie-avatar-01",
      "destination": "zhangjiajie",
      "title": "Avatar Peaks 01",
      "titleZh": "阿凡达山峰 01",
      "file": "assets/zhangjiajie/library/zhangjiajie-avatar-01.svg",
      "tags": [
        "zhangjiajie",
        "avatar",
        "mountains",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": true
    },
    {
      "id": "zhangjiajie-cover-01",
      "destination": "zhangjiajie",
      "title": "Zhangjiajie Cover 01",
      "titleZh": "张家界封面图 01",
      "file": "assets/zhangjiajie/library/zhangjiajie-cover-01.svg",
      "tags": [
        "zhangjiajie",
        "cover",
        "general",
        "landscape"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": true
    },
    {
      "id": "zhangjiajie-hunan-collage-01",
      "destination": "zhangjiajie",
      "title": "Zhangjiajie Grand Canyon & Tianmen Cave",
      "titleZh": "张家界大峡谷 / 天门洞",
      "file": "assets/zhangjiajie/library/zhangjiajie-hunan-collage-01.png",
      "tags": [
        "zhangjiajie",
        "hunan",
        "canyon",
        "tianmen-cave",
        "tianmen",
        "大峡谷",
        "天门洞",
        "湖南张家界",
        "张家界大峡谷"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": false
    },
    {
      "id": "zhangjiajie-tianmen-01",
      "destination": "zhangjiajie",
      "title": "Tianmen Mountain 01",
      "titleZh": "天门山 01",
      "file": "assets/zhangjiajie/library/zhangjiajie-tianmen-01.svg",
      "tags": [
        "zhangjiajie",
        "tianmen",
        "mountain",
        "general"
      ],
      "languages": [
        "en",
        "id",
        "es"
      ],
      "enabled": true,
      "defaultSelected": true,
      "isPlaceholder": true
    }
  ];

  function normalizeLibraryItem(item) {
    return {
      id: item.id,
      destination: item.destination,
      englishName: item.title,
      chineseName: item.titleZh,
      alt: `${item.title} / ${item.titleZh}`,
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
