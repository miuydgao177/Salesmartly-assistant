/*
 * 固定规则识别模块。
 * 所有判断拆分为独立步骤，便于后续维护和扩展。
 */
(function () {
  const DESTINATION_ENTRIES = Array.isArray(globalThis.DESTINATIONS)
    ? globalThis.DESTINATIONS
    : [];

  const DESTINATION_RULES = DESTINATION_ENTRIES.reduce((rules, destination) => {
    rules[destination.id] = [
      ...(destination.aliases || []),
      ...(destination.poiKeywords || []),
      ...(destination.businessKeywords || [])
    ];
    return rules;
  }, {});

  const NEGATIVE_RULES = [
    'do not recommend',
    'not interested',
    'no need to suggest',
    'do not suggest',
    'already visited',
    'already been',
    'different place',
    'jangan rekomendasikan',
    'tidak tertarik',
    'sudah pernah',
    'ya fui',
    'no recomiendes',
    'no estamos interesados',
    'ya visitamos'
  ];

  function normalizeText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function collectMatches(text, keywordMap) {
    return Object.entries(keywordMap).reduce((matches, [key, keywords]) => {
      const foundTerms = keywords.filter((keyword) =>
        text.includes(normalizeText(keyword))
      );
      if (foundTerms.length > 0) {
        matches[key] = foundTerms;
      }
      return matches;
    }, {});
  }

  function findKeywordOccurrences(text, keyword) {
    const normalizedText = normalizeText(text);
    const normalizedKeyword = normalizeText(keyword);
    const occurrences = [];
    let startIndex = 0;

    while (startIndex < normalizedText.length) {
      const index = normalizedText.indexOf(normalizedKeyword, startIndex);
      if (index === -1) {
        break;
      }

      occurrences.push(index);
      startIndex = index + normalizedKeyword.length;
    }

    return occurrences;
  }

  function scoreRouteContext(text, index, keywordLength) {
    const windowStart = Math.max(0, index - 30);
    const contextBefore = text.slice(windowStart, index);
    let bonus = 0;

    if (/(to|towards|go to|travel to|visit|去|到|前往|目的地是|destinasi)\s*$/.test(contextBefore)) {
      bonus += 4;
    }

    if (/(from|from\s+|从|出发|starting from|berangkat dari)\s*$/.test(contextBefore)) {
      bonus -= 2;
    }

    return bonus;
  }

  function detectDestination(text) {
    const normalizedText = normalizeText(text);
    const candidates = DESTINATION_ENTRIES.map((destination) => {
      const matchedAliases = (destination.aliases || []).filter((keyword) =>
        normalizedText.includes(normalizeText(keyword))
      );
      const matchedPoiKeywords = (destination.poiKeywords || []).filter((keyword) =>
        normalizedText.includes(normalizeText(keyword))
      );
      const matchedBusinessKeywords = (destination.businessKeywords || []).filter((keyword) =>
        normalizedText.includes(normalizeText(keyword))
      );
      const score =
        matchedAliases.length * 3 +
        matchedPoiKeywords.length * 2 +
        matchedBusinessKeywords.length;

      const routeBoost = [...(destination.aliases || []), ...(destination.poiKeywords || []), ...(destination.businessKeywords || [])]
        .reduce((total, keyword) => {
          const occurrences = findKeywordOccurrences(normalizedText, keyword);
          return (
            total +
            occurrences.reduce(
              (innerTotal, index) =>
                innerTotal + scoreRouteContext(normalizedText, index, normalizeText(keyword).length),
              0
            )
          );
        }, 0);

      return {
        destination,
        score: score + routeBoost,
        matchedAliases,
        matchedPoiKeywords,
        matchedBusinessKeywords,
        routeBoost
      };
    })
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score);

    if (candidates.length === 0) {
      return {
        destination: null,
        normalizedDestination: null,
        rawDestination: null,
        matchedTerms: {},
        hasAssets: false
      };
    }

    const winner = candidates[0];
    return {
      destination: winner.destination.id,
      normalizedDestination: winner.destination.id,
      rawDestination: winner.destination.nameEn,
      candidates: candidates.map((candidate) => ({
        id: candidate.destination.id,
        nameZh: candidate.destination.nameZh,
        nameEn: candidate.destination.nameEn,
        score: candidate.score,
        matchedAliases: candidate.matchedAliases,
        matchedPoiKeywords: candidate.matchedPoiKeywords,
        matchedBusinessKeywords: candidate.matchedBusinessKeywords,
        routeBoost: candidate.routeBoost,
        hasAssets: Boolean(candidate.destination.hasAssets)
      })),
      matchedTerms: {
        [winner.destination.id]: {
          aliases: winner.matchedAliases,
          poiKeywords: winner.matchedPoiKeywords,
          businessKeywords: winner.matchedBusinessKeywords,
          routeBoost: winner.routeBoost
        }
      },
      hasAssets: Boolean(winner.destination.hasAssets)
    };
  }

  function detectNegative(text) {
    const matches = NEGATIVE_RULES.filter((keyword) =>
      text.includes(normalizeText(keyword))
    );
    return {
      isNegative: matches.length > 0,
      matchedTerms: matches
    };
  }

  function buildConfidence(destination) {
    if (!destination) {
      return 'low';
    }
    return 'high';
  }

  function analyzeRecommendation(messages) {
    const mergedText = normalizeText(messages.join(' '));
    const destinationResult = detectDestination(mergedText);
    const negativeResult = detectNegative(mergedText);

    let blockedReason = null;
    if (negativeResult.isNegative) {
      blockedReason = 'negative_signal';
    } else if (!destinationResult.destination) {
      blockedReason = 'missing_destination';
    }

    const contentPack =
      !blockedReason &&
      globalThis.CONTENT_PACKS_API.getPackBySignature(destinationResult.destination);

    if (!blockedReason && destinationResult.destination && !contentPack) {
      blockedReason = destinationResult.hasAssets
        ? 'missing_content_pack'
        : 'destination_has_no_assets';
    }

    return {
      destination: destinationResult.destination,
      confidence: buildConfidence(destinationResult.destination),
      matchedTerms: {
        destination: destinationResult.matchedTerms,
        negative: negativeResult.matchedTerms
      },
      destinationCandidates: destinationResult.candidates || [],
      blockedReason,
      hasAssets: destinationResult.hasAssets
    };
  }

  globalThis.INTENT_RULES = {
    normalizeText,
    detectDestination,
    detectNegative,
    analyzeRecommendation,
    DESTINATION_RULES,
    NEGATIVE_RULES
  };
})();
