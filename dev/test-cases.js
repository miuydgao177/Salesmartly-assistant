/*
 * mock-chat.html 使用的本地测试用例。
 */
(function () {
  const TEST_CASES = [
    {
      id: 'en-general-worth-it',
      label: 'EN General 1',
      category: 'general',
      description: '英语景点泛问',
      messages: [
        'Is Zhangjiajie worth visiting for first-time travellers?',
        'Can you introduce the main highlights in Zhangjiajie?',
        'What makes Zhangjiajie special compared with other mountain parks?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'id-general-intro',
      label: 'ID General 1',
      category: 'general',
      description: '印尼语景点泛问',
      messages: [
        'Apakah Zhangjiajie layak dikunjungi untuk pertama kali?',
        'Bisa jelaskan daya tarik utama di Zhangjiajie?',
        'Seperti apa pemandangan di sana?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'id',
        intent: 'general'
      }
    },
    {
      id: 'es-general-intro',
      label: 'ES General 1',
      category: 'general',
      description: '西语景点泛问',
      messages: [
        '¿Vale la pena visitar Zhangjiajie?',
        '¿Puedes presentarme los principales atractivos?',
        '¿Cómo es el paisaje allí?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'es',
        intent: 'general'
      }
    },
    {
      id: 'en-senior-parents',
      label: 'EN Senior 1',
      category: 'senior',
      description: '英语适老需求',
      messages: [
        'Is Zhangjiajie suitable for my 70-year-old parents?',
        'We prefer less walking and an easy pace.',
        'Would it work for older people with limited mobility?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'senior'
      }
    },
    {
      id: 'id-senior-orang-tua',
      label: 'ID Senior 1',
      category: 'senior',
      description: '印尼语适老需求',
      messages: [
        'Apakah Zhangjiajie cocok untuk orang tua?',
        'Kami ingin perjalanan yang santai dan tidak banyak jalan kaki.',
        'Apakah nyaman untuk mobilitas terbatas?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'id',
        intent: 'senior'
      }
    },
    {
      id: 'es-senior-padres',
      label: 'ES Senior 1',
      category: 'senior',
      description: '西语适老需求',
      messages: [
        '¿Zhangjiajie es adecuado para mis padres mayores?',
        'Buscamos un ritmo relajado y menos caminata.',
        '¿Es cómodo para personas con movilidad reducida?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'es',
        intent: 'senior'
      }
    },
    {
      id: 'en-family-kids',
      label: 'EN Family 1',
      category: 'family',
      description: '英语亲子需求',
      messages: [
        'Is Zhangjiajie good for a family trip with kids?',
        'We need something suitable for children.',
        'Are there easy sightseeing options for a family?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'family'
      }
    },
    {
      id: 'id-family-anak',
      label: 'ID Family 1',
      category: 'family',
      description: '印尼语亲子需求',
      messages: [
        'Apakah Zhangjiajie cocok untuk keluarga dengan anak?',
        'Kami mencari wisata yang ramah anak.',
        'Apakah aman untuk liburan keluarga?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'id',
        intent: 'family'
      }
    },
    {
      id: 'es-family-ninos',
      label: 'ES Family 1',
      category: 'family',
      description: '西语亲子需求',
      messages: [
        '¿Zhangjiajie es bueno para viajar con niños?',
        'Buscamos algo apto para familia y peques.',
        '¿Es recomendable para un viaje familiar?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'es',
        intent: 'family'
      }
    },
    {
      id: 'destination-only',
      label: 'Destination Only',
      category: 'general',
      description: '只有地点，没有明确意图',
      messages: [
        'Zhangjiajie.',
        'Avatar Mountains.',
        'Tianmen Mountain.'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'need-only-senior',
      label: 'Need Only',
      category: 'blocked',
      description: '只有需求，没有地点',
      messages: [
        'My parents need less walking and a relaxed pace.',
        'They are older people.',
        'Do you have something senior-friendly?'
      ],
      expected: {
        blockedReason: 'missing_destination'
      }
    },
    {
      id: 'explicit-negative',
      label: 'Negative',
      category: 'blocked',
      description: '明确否定',
      messages: [
        'Please do not recommend Zhangjiajie.',
        'We are not interested in that destination.',
        'No need to suggest it again.'
      ],
      expected: {
        blockedReason: 'negative_signal'
      }
    },
    {
      id: 'already-been',
      label: 'Already Been',
      category: 'blocked',
      description: '已经去过',
      messages: [
        'We already visited Zhangjiajie last year.',
        'So please do not recommend it this time.',
        'We want a different place.'
      ],
      expected: {
        blockedReason: 'negative_signal'
      }
    },
    {
      id: 'mixed-language-family',
      label: 'Mixed Family',
      category: 'family',
      description: '混合语言亲子',
      messages: [
        'Is Zhangjiajie good untuk keluarga dengan kids?',
        'Kami butuh family-friendly route.',
        'Maybe something easy for children.'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'id',
        intent: 'family'
      }
    },
    {
      id: 'spelling-variation',
      label: 'Spelling Variation',
      category: 'general',
      description: '拼写差异',
      messages: [
        'Can you tell me about Zhang Jia Jie?',
        'Is Zhang Jia Jie worth it?',
        'What can we see there?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'origin-destination-routing',
      label: 'Route Mixed',
      category: 'general',
      description: '出发地 + 目的地混合',
      messages: [
        'We are leaving Guangzhou and going to Guilin next week.',
        'Could you show the pictures for Guilin?',
        'Guangzhou is only our departure city.'
      ],
      expected: {
        destination: 'guilin',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'guilin-sightseeing-poi',
      label: 'Guilin POI',
      category: 'general',
      description: '桂林景点词识别',
      messages: [
        'We want to visit Guilin and Yangshuo.',
        'Can you show me the Li River and Reed Flute Cave?',
        'Longji Rice Terraces also look interesting.'
      ],
      expected: {
        destination: 'guilin',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'beijing-classics-poi',
      label: 'Beijing Classics',
      category: 'general',
      description: '北京经典景点识别',
      messages: [
        'We plan to visit Beijing for the first time.',
        'Can you show me Tiananmen Square, the Forbidden City and Jingshan Park?',
        'We may also go to the Temple of Heaven and Summer Palace.'
      ],
      expected: {
        destination: 'beijing',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'beijing-universal-hutong',
      label: 'Beijing Universal',
      category: 'general',
      description: '北京环球影城和胡同识别',
      messages: [
        'We want pictures for Universal Studios Beijing.',
        'Maybe also Nanluoguxiang and Wangfujing Pedestrian Street.',
        'If possible, include Mutianyu Great Wall too.'
      ],
      expected: {
        destination: 'beijing',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'chengdu-classics',
      label: 'Chengdu Classics',
      category: 'general',
      description: '成都经典景点识别',
      messages: [
        'We are planning a Chengdu trip.',
        'Can you show Wuhou Shrine, Jinli and the Chengdu Panda Base?',
        'Maybe Taikoo Li and Chunxi Road too.'
      ],
      expected: {
        destination: 'chengdu',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'chengdu-mountain-museum',
      label: 'Chengdu Mountain',
      category: 'general',
      description: '成都山景与博物馆识别',
      messages: [
        'We also want Qingcheng Mountain and Dujiangyan.',
        'If possible, include Du Fu Thatched Cottage and Sanxingdui Museum.',
        '成都有什么推荐图片？'
      ],
      expected: {
        destination: 'chengdu',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'guangzhou-canton-fair',
      label: 'Guangzhou Fair',
      category: 'general',
      description: '广州广交会业务词识别',
      messages: [
        'Our team is coming to Guangzhou for the Canton Fair.',
        'We will stay near Pazhou Complex.',
        'Can you also suggest what to see around the Pearl River?'
      ],
      expected: {
        destination: 'guangzhou',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'yiwu-sourcing-trip',
      label: 'Yiwu Business',
      category: 'general',
      description: '义乌商贸城业务词识别',
      messages: [
        'We are planning a sourcing trip to Yiwu.',
        'Is the International Trade City close to the wholesale market area?',
        'Can you introduce the Futian Market?'
      ],
      expected: {
        destination: 'yiwu',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'chongqing-poi-request',
      label: 'Chongqing POI',
      category: 'general',
      description: '重庆景点词识别',
      messages: [
        'Can you show me Chongqing highlights?',
        'We want to see Hongyadong, Liziba and the Yangtze River Cableway.',
        'Maybe also Ciqikou if time allows.'
      ],
      expected: {
        destination: 'chongqing',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'avatar-mountains-family',
      label: 'Avatar Family',
      category: 'family',
      description: '景点别名 + 家庭意图',
      messages: [
        'Are the Avatar Mountains suitable for children?',
        'We are travelling as a family.',
        'Need easy options for kids.'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'family'
      }
    },
    {
      id: 'tianmen-senior-es',
      label: 'Tianmen Senior ES',
      category: 'senior',
      description: '别名 + 西语适老',
      messages: [
        '¿Tianmen Mountain es adecuada para personas mayores?',
        'Buscamos un ritmo tranquilo.',
        'Menos caminata sería mejor.'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'es',
        intent: 'senior'
      }
    },
    {
      id: 'unknown-language-default-en',
      label: 'Language Pending',
      category: 'general',
      description: '语言不明确，默认 en',
      messages: [
        'Zhangjiajie bagus ya?',
        'Worth pergi?',
        'Need intro please.'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'general'
      }
    },
    {
      id: 'en-family-counts',
      label: 'Count Family',
      category: 'family',
      description: '识别一家几口',
      messages: [
        'We are 4 people going to Zhangjiajie.',
        'There are 2 adults and 2 children.',
        'Is it suitable for a family trip with kids?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'family',
        travellerCounts: {
          total: 4,
          adults: 2,
          children: 2
        }
      }
    },
    {
      id: 'en-senior-counts',
      label: 'Count Senior',
      category: 'senior',
      description: '识别父母人数',
      messages: [
        'We are 3 people for Zhangjiajie.',
        'It will be 1 adult with 2 parents.',
        'We need a relaxed pace with less walking.'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'senior',
        travellerCounts: {
          total: 3,
          adults: 1,
          seniors: 2
        }
      }
    },
    {
      id: 'family-counts-incomplete',
      label: 'Count Incomplete',
      category: 'family',
      description: '人数不完整，触发追问建议',
      messages: [
        'We are going to Zhangjiajie as a family.',
        'There are 2 adults.',
        'Is it suitable for children?'
      ],
      expected: {
        destination: 'zhangjiajie',
        language: 'en',
        intent: 'family',
        travellerCounts: {
          adults: 2
        },
        travellerFollowUp: '建议追问：请补充总人数、儿童人数与年龄。'
      }
    }
  ];

  globalThis.TEST_CASES = TEST_CASES;
})();
