(function () {
  'use strict';

  const MOCK_IMAGE_BOT_RESULT_KEY = 'salesmartly_mock_image_bot_result_v1';
  const DEFAULT_CONFIG = {
    endpoint: '',
    timeoutMs: 4000,
    providerOrder: ['pageBridge', 'windowResult', 'mockStorage', 'http']
  };

  function getConfig() {
    const runtimeConfig = globalThis.__SALESMARTLY_IMAGE_BOT_CONFIG__ || {};
    return {
      ...DEFAULT_CONFIG,
      ...runtimeConfig
    };
  }

  function normalizePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return {
      destination: payload.destination || null,
      confidence: payload.confidence || 'medium',
      contentPackId: payload.contentPackId || null,
      matchedTerms: payload.matchedTerms || {},
      blockedReason: payload.blockedReason || null,
      hasAssets: typeof payload.hasAssets === 'boolean' ? payload.hasAssets : null,
      destinationCandidates: Array.isArray(payload.destinationCandidates)
        ? payload.destinationCandidates
        : []
    };
  }

  async function fromPageBridge(messages, context) {
    const bridge = globalThis.SaleSmartlyImageBot;
    if (!bridge || typeof bridge.getRecommendation !== 'function') {
      return null;
    }

    const result = await bridge.getRecommendation(messages, context);
    return normalizePayload(result);
  }

  async function fromWindowResult() {
    return normalizePayload(globalThis.__SALESMARTLY_IMAGE_BOT_RESULT__);
  }

  async function fromMockStorage() {
    try {
      const raw = window.localStorage.getItem(MOCK_IMAGE_BOT_RESULT_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.enabled) {
        return null;
      }

      return normalizePayload(parsed.payload);
    } catch (error) {
      return null;
    }
  }

  async function fromHttp(messages, context, config) {
    if (!config.endpoint || typeof fetch !== 'function') {
      return null;
    }

    const controller = typeof AbortController === 'function'
      ? new AbortController()
      : null;
    const timeoutId = controller
      ? window.setTimeout(() => controller.abort(), config.timeoutMs)
      : null;

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          context
        }),
        signal: controller ? controller.signal : undefined
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      return normalizePayload(payload);
    } catch (error) {
      return null;
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }
  }

  async function resolveRecommendation(messages, context) {
    const config = getConfig();
    const providers = {
      pageBridge: () => fromPageBridge(messages, context),
      windowResult: () => fromWindowResult(),
      mockStorage: () => fromMockStorage(),
      http: () => fromHttp(messages, context, config)
    };

    for (const providerName of config.providerOrder) {
      const provider = providers[providerName];
      if (!provider) {
        continue;
      }

      const result = await provider();
      if (result) {
        return {
          provider: providerName,
          payload: result
        };
      }
    }

    return null;
  }

  globalThis.SALESMARTLY_IMAGE_BOT_CLIENT = {
    getConfig,
    resolveRecommendation
  };
})();
