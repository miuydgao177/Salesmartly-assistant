(function () {
  'use strict';

  const PANEL_ID = 'salesmartly-test-assistant-panel';
  const DEFAULT_MAX_MESSAGES = 5;
  const TEST_TEXT = 'Test recommendation';
  const MOCK_ASSET_LIBRARY_KEY = 'salesmartly_mock_asset_library_v1';
  const selectors = globalThis.getPageSelectors();
  const packApi = globalThis.CONTENT_PACKS_API;
  const rulesApi = globalThis.INTENT_RULES;
  const destinationsApi = globalThis.DESTINATIONS_API;
  const imageSelectionRules = globalThis.SALESMARTLY_IMAGE_SELECTION_RULES;
  const imageBotClient = globalThis.SALESMARTLY_IMAGE_BOT_CLIENT;
  const isMockPage = selectors === globalThis.MOCK_SELECTORS;
  const state = {
    currentMessages: [],
    analysis: null,
    activePackId: null,
    imageSelection: {},
    destinationOverride: null,
    analysisSource: 'rules',
    messageScope: 'recent-5',
    currentPageUrl: window.location.href,
    clipboardFlow: {
      images: [],
      currentIndex: -1
    }
  };

  const UI_LABELS = {
    messageScope: {
      'recent-5': '最近 5 条',
      'recent-10': '最近 10 条',
      all: '全部可见消息'
    },
    source: {
      image_bot: '图片 Bot',
      rules: '本地规则兜底'
    }
  };

  function getMessageLimit() {
    if (state.messageScope === 'all') {
      return null;
    }

    if (state.messageScope === 'recent-10') {
      return 10;
    }

    return DEFAULT_MAX_MESSAGES;
  }

  function trimMessages(messages, limit = getMessageLimit()) {
    if (limit === null) {
      return messages;
    }

    return messages.slice(-limit);
  }

  function firstMatchingElement(selectorList, root = document) {
    if (!Array.isArray(selectorList)) {
      return null;
    }

    for (const selector of selectorList) {
      const element = root.querySelector(selector);
      if (element) {
        return element;
      }
    }

    return null;
  }

  function allMatchingElements(selectorList, root = document) {
    if (!Array.isArray(selectorList)) {
      return [];
    }

    const elements = [];
    const seen = new Set();

    for (const selector of selectorList) {
      root.querySelectorAll(selector).forEach((element) => {
        if (!seen.has(element)) {
          seen.add(element);
          elements.push(element);
        }
      });
    }

    return elements;
  }

  function getAccessibleDocuments() {
    const documents = [document];
    const queue = [document];

    while (queue.length > 0) {
      const currentDocument = queue.shift();
      currentDocument.querySelectorAll('iframe, frame').forEach((frame) => {
        try {
          const childDocument = frame.contentDocument || frame.contentWindow?.document;
          if (childDocument && !documents.includes(childDocument)) {
            documents.push(childDocument);
            queue.push(childDocument);
          }
        } catch (error) {
          // Ignore cross-origin frames.
        }
      });
    }

    return documents;
  }

  function firstMatchingElementAcrossDocuments(selectorList) {
    for (const currentDocument of getAccessibleDocuments()) {
      const element = firstMatchingElement(selectorList, currentDocument);
      if (element) {
        return element;
      }
    }

    return null;
  }

  function allMatchingElementsAcrossDocuments(selectorList) {
    const elements = [];
    const seen = new Set();

    getAccessibleDocuments().forEach((currentDocument) => {
      allMatchingElements(selectorList, currentDocument).forEach((element) => {
        if (!seen.has(element)) {
          seen.add(element);
          elements.push(element);
        }
      });
    });

    return elements;
  }

  function getChatRoots() {
    const selectorsToTry = [
      '#chatPageLayout .chat-panel',
      '#chatPageLayout [class*="message-list"]',
      '#chatPageLayout [class*="conversation"]',
      '#chatPageLayout [role="log"]',
      '#chatPageLayout'
    ];

    const roots = [];
    getAccessibleDocuments().forEach((currentDocument) => {
      selectorsToTry.forEach((selector) => {
        currentDocument.querySelectorAll(selector).forEach((element) => {
          if (!roots.includes(element)) {
            roots.push(element);
          }
        });
      });
    });

    return roots;
  }

  function isVisible(element) {
    if (!element) {
      return false;
    }

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function cleanText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function getMessageText(messageElement) {
    const textElement = firstMatchingElement(selectors.messageText, messageElement);
    return cleanText((textElement || messageElement).innerText || '');
  }

  function dedupeMessages(messages) {
    const seen = new Set();
    return messages.filter((message) => {
      const normalized = cleanText(message);
      if (!normalized || seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
  }

  function splitCandidateText(text) {
    return String(text || '')
      .split(/\n+/)
      .map((part) => cleanText(part))
      .filter(Boolean)
      .filter((part) => part.length >= 2 && part.length <= 400);
  }

  function isElementActuallyVisible(element) {
    if (!element) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }

  function isLikelyUiText(text) {
    const normalized = cleanText(text);
    if (!normalized) {
      return true;
    }

    return (
      normalized.includes('SaleSmartly 发图助手') ||
      normalized.includes('读取当前聊天') ||
      normalized.includes('不自动发送') ||
      normalized.includes('missing_destination') ||
      normalized.includes('本地规则兜底') ||
      normalized.includes('加入发送区') ||
      normalized.includes('清空待发送内容')
    );
  }

  function inferVisibleMessageCandidates() {
    const primaryMatches = getChatRoots()
      .flatMap((root) => allMatchingElements(selectors.messageItems, root))
      .filter(isVisible)
      .flatMap((element) => splitCandidateText(getMessageText(element)))
      .filter((text) => !isLikelyUiText(text));

    const elementTextNodes = [];
    const textNodeMessages = [];

    getAccessibleDocuments().forEach((currentDocument) => {
      const chatRoot =
        currentDocument.querySelector('#chatPageLayout .chat-panel') ||
        currentDocument.querySelector('#chatPageLayout [class*="message-list"]') ||
        currentDocument.querySelector('#chatPageLayout [class*="conversation"]') ||
        currentDocument.querySelector('#chatPageLayout [role="log"]') ||
        currentDocument.querySelector('#chatPageLayout') ||
        currentDocument.body;
      if (!chatRoot) {
        return;
      }

      elementTextNodes.push(
        ...Array.from(chatRoot.querySelectorAll('span, p, article, section, li, div'))
          .filter(isVisible)
          .filter((element) => {
            const childTextBlocks = Array.from(element.children || []).filter((child) =>
              cleanText(child.innerText || '').length > 0
            );
            return childTextBlocks.length === 0 || element.tagName !== 'DIV';
          })
          .flatMap((element) => splitCandidateText(element.innerText || ''))
          .filter((text) => !isLikelyUiText(text))
      );

      const walker = currentDocument.createTreeWalker(chatRoot, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const value = cleanText(node.nodeValue || '');
          if (!value || value.length < 2 || value.length > 400) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = node.parentElement;
          if (!parent || !isElementActuallyVisible(parent)) {
            return NodeFilter.FILTER_REJECT;
          }

          if (isLikelyUiText(value)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      });

      let currentNode = walker.nextNode();
      while (currentNode) {
        textNodeMessages.push(...splitCandidateText(currentNode.nodeValue || ''));
        currentNode = walker.nextNode();
      }
    });

    const mergedCandidates = dedupeMessages([
      ...primaryMatches,
      ...elementTextNodes,
      ...textNodeMessages
    ]);

    return trimMessages(mergedCandidates);
  }

  function mergeRecentMessages(primaryMessages, fallbackMessages) {
    const merged = [];
    const seen = new Set();

    [...fallbackMessages, ...primaryMessages].forEach((message) => {
      const normalized = cleanText(message);
      if (!normalized || seen.has(normalized)) {
        return;
      }

      seen.add(normalized);
      merged.push(normalized);
    });

    return trimMessages(merged);
  }

  function createDefaultImageSelection(images) {
    return images.reduce((selection, image) => {
      selection[image.id] = false;
      return selection;
    }, {});
  }

  function resetClipboardFlow() {
    state.clipboardFlow = {
      images: [],
      currentIndex: -1
    };
  }

  function getClipboardFlowCurrentImage() {
    const { images, currentIndex } = state.clipboardFlow;
    if (!Array.isArray(images) || currentIndex < 0 || currentIndex >= images.length) {
      return null;
    }

    return images[currentIndex];
  }

  function getClipboardFlowProgress() {
    const { images, currentIndex } = state.clipboardFlow;
    const total = Array.isArray(images) ? images.length : 0;

    return {
      total,
      current: total > 0 && currentIndex >= 0 ? currentIndex + 1 : 0,
      hasNext: total > 0 && currentIndex >= 0 && currentIndex < total - 1
    };
  }

  function readMockAssetLibrary() {
    if (!isMockPage) {
      return {};
    }

    try {
      const raw = window.localStorage.getItem(MOCK_ASSET_LIBRARY_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function deriveBotContentPackId(payload) {
    if (!payload) {
      return null;
    }

    if (payload.contentPackId) {
      return payload.contentPackId;
    }

    const destination = payload.destinationOverride || payload.destination;
    if (!destination) {
      return null;
    }

    const pack = packApi.getPackBySignature(destination);
    return pack ? pack.id : null;
  }

  function normalizeBotAnalysis(payload, fallbackMessages) {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const destination = payload.destination || null;
    const destinationMeta = getDestinationMeta(destination);
    const contentPackId = deriveBotContentPackId({
      ...payload,
      destination
    });
    const matchedTerms = payload.matchedTerms && typeof payload.matchedTerms === 'object'
      ? payload.matchedTerms
      : {};
    return {
      destination,
      confidence: payload.confidence || 'medium',
      contentPackId,
      matchedTerms: {
        source: ['mock_image_bot'],
        ...matchedTerms
      },
      blockedReason: payload.blockedReason || null,
      hasAssets:
        typeof payload.hasAssets === 'boolean'
          ? payload.hasAssets
          : Boolean(destinationMeta && destinationMeta.hasAssets),
      destinationCandidates: Array.isArray(payload.destinationCandidates)
        ? payload.destinationCandidates
        : destination
          ? [
              {
                id: destination,
                nameZh: destinationMeta ? destinationMeta.nameZh : destination,
                nameEn: destinationMeta ? destinationMeta.nameEn : destination,
                score: 0,
                matchedAliases: [],
                matchedPoiKeywords: [],
                matchedBusinessKeywords: [],
                routeBoost: 0,
                hasAssets: Boolean(destinationMeta && destinationMeta.hasAssets)
              }
            ]
      : [],
      source: 'image_bot',
      rawBotPayload: payload,
      fallbackMessages: fallbackMessages || []
    };
  }

  function getResolvedImageSrc(imageMeta) {
    if (!imageMeta) {
      return '';
    }

    if (imageMeta.dataUrl) {
      return imageMeta.dataUrl;
    }

    if (imageMeta.path) {
      return chrome.runtime.getURL(imageMeta.path);
    }

    return '';
  }

  async function imageMetaToFile(imageMeta, index = 0) {
    const fallbackName = imageMeta.fileName || imageMeta.englishName || `image-${index + 1}`;
    const safeName = String(fallbackName)
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const ext = (safeName.includes('.') ? safeName.split('.').pop() : 'png').toLowerCase();
    const name = safeName.includes('.') ? safeName : `${safeName}.${ext}`;

    if (imageMeta.dataUrl) {
      const dataUrl = String(imageMeta.dataUrl);
      const base64 = dataUrl.split(',')[1] || '';
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new File([bytes], name, {
        type: dataUrl.split(';')[0].split(':')[1] || 'image/png'
      });
    }

    const sourceUrl = getResolvedImageSrc(imageMeta);
    if (!sourceUrl) {
      return null;
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    return new File([blob], name, {
      type: blob.type || 'image/png'
    });
  }

  function setInputFiles(input, files) {
    if (!input || !files || files.length === 0) {
      return false;
    }

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    try {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
      if (descriptor && typeof descriptor.set === 'function') {
        descriptor.set.call(input, dataTransfer.files);
      } else {
        input.files = dataTransfer.files;
      }
    } catch (error) {
      return false;
    }

    if (!input.files || input.files.length !== files.length) {
      return false;
    }

    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    return true;
  }

  function dispatchPasteFiles(target, files) {
    if (!target || !files || files.length === 0) {
      return false;
    }

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    let event;
    try {
      event = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
      });
    } catch (error) {
      event = new Event('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'clipboardData', {
        value: dataTransfer
      });
    }

    target.dispatchEvent(event);
    return true;
  }

  function dispatchDropFiles(target, files) {
    if (!target || !files || files.length === 0) {
      return false;
    }

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    let event;
    try {
      event = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      });
    } catch (error) {
      event = new Event('drop', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'dataTransfer', {
        value: dataTransfer
      });
    }

    target.dispatchEvent(event);
    return true;
  }

  function createFilesFromImages(images) {
    return Promise.all(
      (images || []).map((imageMeta, index) => imageMetaToFile(imageMeta, index))
    ).then((files) => files.filter(Boolean));
  }

  async function injectImagesIntoChat(images) {
    const files = await createFilesFromImages(images);
    if (files.length === 0) {
      return {
        ok: false,
        reason: 'file_conversion_failed'
      };
    }

    const imageInput = findBestImageInput();
    if (imageInput && setInputFiles(imageInput, files)) {
      return {
        ok: true,
        mode: 'file_input'
      };
    }

    const { input, root } = getChatComposerContext();
    if (!input) {
      return {
        ok: false,
        reason: 'chat_input_not_found'
      };
    }

    if (root && dispatchDropFiles(root, files)) {
      return {
        ok: true,
        mode: 'drop_root'
      };
    }

    input.focus();
    if (dispatchPasteFiles(input, files)) {
      return {
        ok: true,
        mode: 'paste_input'
      };
    }

    if (root && root !== input) {
      if (dispatchDropFiles(root, files)) {
        return {
          ok: true,
          mode: 'drop_root_fallback'
        };
      }
      if (dispatchPasteFiles(root, files)) {
        return {
          ok: true,
          mode: 'paste_root'
        };
      }
    }

    return {
      ok: false,
      reason: 'no_supported_injection_path'
    };
  }

  function getUploadedImagesForPack(destination) {
    const library = readMockAssetLibrary();
    const destinationLibrary = library[destination];
    const images = Array.isArray(destinationLibrary)
      ? destinationLibrary
      : destinationLibrary && typeof destinationLibrary === 'object'
        ? Object.values(destinationLibrary).flatMap((bucket) =>
            Array.isArray(bucket) ? bucket : []
          )
      : [];

    return images.map((image, index) => ({
      id: image.id || `uploaded-${destination}-${index + 1}`,
      path: '',
      dataUrl: image.dataUrl || '',
      englishName: image.englishName || image.fileName || `Uploaded Image ${index + 1}`,
      chineseName: image.chineseName || '业务上传图片',
      alt: image.alt || image.fileName || `Uploaded image ${index + 1}`,
      defaultSelected: image.defaultSelected !== false,
      isPlaceholder: false,
      sourceType: 'uploaded',
      fileName: image.fileName || `${destination}-${index + 1}`
    }));
  }

  function resolvePackImages(pack) {
    if (!pack) {
      return [];
    }

    const uploadedImages = getUploadedImagesForPack(pack.destination);
    if (uploadedImages.length > 0) {
      return uploadedImages;
    }

    if (
      imageSelectionRules &&
      typeof imageSelectionRules.selectImages === 'function' &&
      state.currentMessages.length > 0
    ) {
      const selectedLibraryImages = imageSelectionRules.selectImages({
        destination: pack.destination,
        messages: state.currentMessages
      });

      if (selectedLibraryImages.length > 0) {
        return selectedLibraryImages.map((image) => ({
          ...image,
          sourceType: image.sourceType || 'library'
        }));
      }
    }

    return (pack.images || []).map((image) => ({
      ...image,
      sourceType: image.sourceType || 'placeholder'
    }));
  }

  function resolveRuntimePack(pack) {
    if (!pack) {
      return null;
    }

    const images = resolvePackImages(pack);
    return {
      ...pack,
      images,
      imageSourceSummary:
        images.length > 0 && images.every((image) => !image.isPlaceholder)
          ? '已使用业务上传图片'
          : '当前使用测试占位图'
    };
  }

  function getDestinationMeta(destinationId) {
    if (!destinationId || !destinationsApi) {
      return null;
    }

    return destinationsApi.getDestinationById(destinationId);
  }

  function formatDestinationLabel(destinationId) {
    const meta = getDestinationMeta(destinationId);
    if (!meta) {
      return destinationId || '未识别';
    }

    return `${meta.nameZh} / ${meta.nameEn}`;
  }

  function getEffectiveDestination(analysis) {
    if (!analysis) {
      return null;
    }

    return state.destinationOverride || analysis.destination || null;
  }

  function getDestinationCandidates(analysis) {
    if (!analysis) {
      return [];
    }

    if (Array.isArray(analysis.destinationCandidates) && analysis.destinationCandidates.length > 0) {
      return analysis.destinationCandidates;
    }

    if (analysis.destination) {
      const meta = getDestinationMeta(analysis.destination);
      return [
        {
          id: analysis.destination,
          nameZh: meta ? meta.nameZh : analysis.destination,
          nameEn: meta ? meta.nameEn : analysis.destination,
          score: 0,
          hasAssets: Boolean(meta && meta.hasAssets)
        }
      ];
    }

    return [];
  }

  function formatBlockedReason(blockedReason) {
    const labels = {
      negative_signal: '命中否定表达，当前不推荐',
      missing_destination: '未识别到目的地',
      destination_has_no_assets: '已识别到目的地，但当前还没有对应图片素材包',
      missing_content_pack: '已识别到目的地，但图文包配置不完整',
      no_visible_customer_messages: '未找到当前可见的客户消息'
    };

    return labels[blockedReason] || blockedReason || '无';
  }

  function getActivePack() {
    if (!state.activePackId) {
      return null;
    }

    return resolveRuntimePack(packApi.getPackById(state.activePackId));
  }

  function ensureDraftFromPack(pack) {
    if (!pack) {
      state.imageSelection = {};
      return;
    }

    state.imageSelection = createDefaultImageSelection(pack.images);
  }

  function setStatus(message, type = 'info') {
    const status = document.querySelector(`#${PANEL_ID} .salesmartly-status`);
    if (!status) {
      return;
    }

    status.textContent = message;
    status.className = `salesmartly-status salesmartly-status-${type}`;
  }

  function resetPanelState(statusMessage = '已重置面板，请重新读取当前聊天。') {
    state.currentMessages = [];
    state.analysis = null;
    state.activePackId = null;
    state.imageSelection = {};
    state.destinationOverride = null;
    state.analysisSource = 'rules';
    resetClipboardFlow();

    renderRecommendation(null);
    renderMockTestCaseResult({
      destination: null,
      confidence: null,
      contentPackId: null,
      matchedTerms: {},
      blockedReason: null,
      source: null
    });
    renderClipboardFlow();
    setStatus(statusMessage, 'info');
  }

  function setPanelMode() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) {
      return;
    }

    panel.setAttribute('data-page-mode', isMockPage ? 'mock' : 'real');

    panel.querySelectorAll('.salesmartly-mock-only').forEach((element) => {
      element.hidden = !isMockPage;
    });

    panel.querySelectorAll('.salesmartly-real-only').forEach((element) => {
      element.hidden = isMockPage;
    });

    const addPendingButton = panel.querySelector('[data-action="add-pending"]');
    if (addPendingButton) {
      addPendingButton.textContent = isMockPage ? '加入发送区' : '复制所选内容';
    }
  }

  function clampPanelPosition(position, panel) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const panelWidth = panel.offsetWidth || 344;
    const panelHeight = panel.offsetHeight || 560;
    const margin = 12;

    const left = Math.min(
      Math.max(position.left, margin),
      Math.max(margin, viewportWidth - panelWidth - margin)
    );
    const top = Math.min(
      Math.max(position.top, margin),
      Math.max(margin, viewportHeight - panelHeight - margin)
    );

    return { left, top };
  }

  function convertPanelPositionToDock(position, panel) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const panelWidth = panel.offsetWidth || 344;
    const panelHeight = panel.offsetHeight || 560;
    const margin = 12;
    const clamped = clampPanelPosition(position, panel);
    const right = Math.min(
      Math.max(viewportWidth - clamped.left - panelWidth, margin),
      Math.max(margin, viewportWidth - panelWidth - margin)
    );
    const bottom = Math.min(
      Math.max(viewportHeight - clamped.top - panelHeight, margin),
      Math.max(margin, viewportHeight - panelHeight - margin)
    );

    return { right, bottom };
  }

  function applyPanelDockPosition(position) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel || !position) {
      return;
    }

    panel.style.removeProperty('left');
    panel.style.removeProperty('top');
    panel.style.right = `${position.right}px`;
    panel.style.bottom = `${position.bottom}px`;
    panel.style.transform = 'none';
  }

  function resetPanelDock(panel) {
    if (!panel) {
      return;
    }

    panel.style.removeProperty('left');
    panel.style.removeProperty('top');
    panel.style.right = '20px';
    panel.style.bottom = '20px';
    panel.style.transform = 'none';
  }

  function enablePanelDragging() {
    const panel = document.getElementById(PANEL_ID);
    const handle = panel && panel.querySelector('.salesmartly-panel-header');
    if (!panel || !handle) {
      return;
    }

    let dragState = null;

    function stopDragging() {
      if (!dragState) {
        return;
      }

      panel.classList.remove('salesmartly-panel-dragging');
      const nextPosition = convertPanelPositionToDock(
        { left: dragState.left, top: dragState.top },
        panel
      );
      applyPanelDockPosition(nextPosition);
      dragState = null;
    }

    function handlePointerMove(event) {
      if (!dragState) {
        return;
      }

      dragState.left = event.clientX - dragState.offsetX;
      dragState.top = event.clientY - dragState.offsetY;

      if (dragState.rafId) {
        return;
      }

      dragState.rafId = window.requestAnimationFrame(() => {
        dragState.rafId = 0;
        const nextPosition = clampPanelPosition(
          { left: dragState.left, top: dragState.top },
          panel
        );
        panel.style.transform = `translate3d(${
          nextPosition.left - dragState.originLeft
        }px, ${nextPosition.top - dragState.originTop}px, 0)`;
      });
    }

    handle.addEventListener('pointerdown', (event) => {
      if (
        event.button !== 0 ||
        event.target.closest('button, select, textarea, input, option, summary')
      ) {
        return;
      }

      const rect = panel.getBoundingClientRect();
      dragState = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        left: rect.left,
        top: rect.top,
        originLeft: rect.left,
        originTop: rect.top,
        rafId: 0
      };

      panel.classList.add('salesmartly-panel-dragging');
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener('pointermove', handlePointerMove);
    handle.addEventListener('pointerup', stopDragging);
    handle.addEventListener('pointercancel', stopDragging);

  }

  function updateSourceBadge(analysis) {
    const badge = document.querySelector(`#${PANEL_ID} .salesmartly-source-badge`);
    if (!badge) {
      return;
    }

    const sourceKey = analysis && analysis.source === 'image_bot' ? 'image_bot' : 'rules';
    badge.textContent = UI_LABELS.source[sourceKey];
    badge.setAttribute('data-source', sourceKey);
  }

  function updateUploadHint(message) {
    return message;
  }

  async function imageMetaToBlob(imageMeta) {
    const sourceUrl = getResolvedImageSrc(imageMeta);
    if (!sourceUrl) {
      return null;
    }

    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        return null;
      }

      return await response.blob();
    } catch (error) {
      return null;
    }
  }

  async function copyImageToClipboard(imageMeta) {
    if (
      !navigator.clipboard ||
      typeof navigator.clipboard.write !== 'function' ||
      typeof ClipboardItem !== 'function'
    ) {
      return {
        ok: false,
        reason: 'unsupported'
      };
    }

    const blob = await imageMetaToBlob(imageMeta);
    if (!blob) {
      return {
        ok: false,
        reason: 'blob_unavailable'
      };
    }

    try {
      const clipboardItem = new ClipboardItem({
        [blob.type || 'image/png']: blob
      });
      await navigator.clipboard.write([clipboardItem]);
      return {
        ok: true,
        imageName: imageMeta.englishName
      };
    } catch (error) {
      return {
        ok: false,
        reason: 'write_failed'
      };
    }
  }

  async function startImageCopyFlow() {
    const selectedImages = getSelectedPackImages();
    if (selectedImages.length === 0) {
      setStatus('未选图片', 'info');
      return;
    }

    state.clipboardFlow.images = selectedImages.slice();
    state.clipboardFlow.currentIndex = 0;
    updateUploadHint(
      selectedImages.length > 1
        ? '当前将只处理已勾选图片，并按顺序逐张复制。请每次先回到 SaleSmartly 聊天框按 Cmd+V，再点击“复制下一张”。'
        : '复制图片后，请在 SaleSmartly 聊天框里手动 Cmd+V。'
    );

    if (selectedImages.length > 1) {
      setStatus(`已选 ${selectedImages.length} 张`, 'info');
    }

    const result = await runClipboardFlowStep();
    if (!result.ok) {
      setStatus('复制失败，请重试', 'error');
    }
  }

  async function copyCurrentFlowImageToClipboard() {
    const currentImage = getClipboardFlowCurrentImage() || getSelectedPackImages()[0];
    if (!currentImage) {
      return {
        ok: false,
        reason: 'no_images'
      };
    }

    const copied = await copyImageToClipboard(currentImage);
    if (!copied.ok) {
      return copied;
    }

    const progress = getClipboardFlowProgress();
    return {
      ok: true,
      imageName: currentImage.englishName,
      hasMore: progress.hasNext
    };
  }

  function renderClipboardFlow() {
    const nextButton = document.querySelector(`#${PANEL_ID} [data-action="copy-next-image"]`);
    if (!nextButton) {
      return;
    }

    const progress = getClipboardFlowProgress();
    if (progress.total === 0) {
      nextButton.hidden = true;
      return;
    }

    nextButton.hidden = !progress.hasNext;
    nextButton.textContent = `复制下一张（${progress.current + 1}/${progress.total}）`;
  }

  async function runClipboardFlowStep() {
    const currentImage = getClipboardFlowCurrentImage();
    if (!currentImage) {
      renderClipboardFlow();
      return {
        ok: false,
        reason: 'missing_current_image'
      };
    }

    const clipboardFallback = await copyCurrentFlowImageToClipboard();
    if (!clipboardFallback.ok) {
      renderClipboardFlow();
      return clipboardFallback;
    }

    const progress = getClipboardFlowProgress();

    updateUploadHint(
      `已复制 ${progress.current}/${progress.total}`
    );
    setStatus(
      progress.hasNext
        ? `已复制 ${progress.current}/${progress.total}`
        : '已复制完成',
      'success'
    );

    renderClipboardFlow();
    return {
      ok: true,
      pasted: false
    };
  }

  async function copyNextFlowImage() {
    const progress = getClipboardFlowProgress();
    if (!progress.hasNext) {
      setStatus('没有下一张', 'info');
      return;
    }

    state.clipboardFlow.currentIndex += 1;
    const result = await runClipboardFlowStep();
    if (!result.ok) {
      setStatus('下一张复制失败', 'error');
    }
  }

  function showImageFallback(container, label) {
    const image = container.querySelector('img');
    const fallback = container.querySelector('.salesmartly-image-fallback');

    if (image) {
      image.hidden = true;
    }

    if (fallback) {
      fallback.hidden = false;
      fallback.textContent = `${label} 加载失败`;
    }
  }

  function renderSelectOptions(select, values, labelMap, selectedValue) {
    if (!select) {
      return;
    }

    select.replaceChildren();

    if (!values || values.length === 0) {
      select.disabled = true;
      return;
    }

    select.disabled = false;
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = labelMap[value] || value;
      option.selected = value === selectedValue;
      select.appendChild(option);
    });
  }

  function renderRecommendationImages(images) {
    const imageList = document.querySelector(
      `#${PANEL_ID} .salesmartly-recommendation-images`
    );

    if (!imageList) {
      return;
    }

    imageList.replaceChildren();

    images.forEach((imageMeta) => {
      const card = document.createElement('label');
      card.className = 'salesmartly-image-card';
      card.setAttribute('data-image-id', imageMeta.id);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(state.imageSelection[imageMeta.id]);
      checkbox.addEventListener('change', () => {
        state.imageSelection[imageMeta.id] = checkbox.checked;
        resetClipboardFlow();
        renderClipboardFlow();
      });

      const content = document.createElement('div');

      const thumbButton = document.createElement('div');
      thumbButton.className = 'salesmartly-image-thumb';

      const image = document.createElement('img');
      image.src = getResolvedImageSrc(imageMeta);
      image.alt = imageMeta.alt;
      image.addEventListener('error', () => {
        showImageFallback(thumbButton, imageMeta.englishName);
      });

      const fallback = document.createElement('div');
      fallback.className = 'salesmartly-image-fallback';
      fallback.hidden = true;

      const meta = document.createElement('div');
      meta.className = 'salesmartly-image-meta';
      meta.innerHTML = `
        <strong>${imageMeta.englishName}</strong>
        <span>${imageMeta.chineseName}</span>
        <span>${imageMeta.isPlaceholder ? '测试占位图' : '业务上传图片'}</span>
      `;

      thumbButton.appendChild(image);
      thumbButton.appendChild(fallback);
      content.appendChild(thumbButton);
      content.appendChild(meta);
      card.appendChild(checkbox);
      card.appendChild(content);
      imageList.appendChild(card);
    });
  }

  function renderAnalysisSummary(analysis) {
    return analysis;
  }

  function renderSelectors(analysis) {
    const destinationSelect = document.querySelector(
      `#${PANEL_ID} [data-role="destination-switch"]`
    );

    if (!destinationSelect) {
      return;
    }

    if (!analysis || !analysis.destination) {
      renderSelectOptions(destinationSelect, [], {}, '');
      return;
    }

    const destinationCandidates = getDestinationCandidates(analysis);
    const effectiveDestination = getEffectiveDestination(analysis);
    const destinationLabelMap = destinationCandidates.reduce((map, candidate) => {
      map[candidate.id] = `${candidate.nameZh} / ${candidate.nameEn}`;
      return map;
    }, {});

    renderSelectOptions(
      destinationSelect,
      destinationCandidates.map((candidate) => candidate.id),
      destinationLabelMap,
      effectiveDestination
    );
  }

  function syncPackSelection(nextPack) {
    if (!nextPack) {
      state.activePackId = null;
      state.imageSelection = {};
      resetClipboardFlow();
      renderClipboardFlow();
      return;
    }

    const runtimePack = resolveRuntimePack(nextPack);
    state.activePackId = runtimePack.id;
    ensureDraftFromPack(runtimePack);
    resetClipboardFlow();
    renderClipboardFlow();
    renderRecommendationImages(runtimePack.images);
  }

  function resolvePackFromAnalysis(analysis) {
    if (!analysis || analysis.blockedReason || !analysis.destination) {
      return null;
    }

    const destination = getEffectiveDestination(analysis);
    return packApi.getPackBySignature(destination);
  }

  function renderRecommendation(analysis) {
    const recommendation = document.querySelector(
      `#${PANEL_ID} .salesmartly-recommendation`
    );
    if (!recommendation) {
      return;
    }

    const activePack = resolvePackFromAnalysis(analysis);
    recommendation.hidden = !analysis;
    updateSourceBadge(analysis);
    updateUploadHint('复制图片后，请在 SaleSmartly 聊天框里手动 Cmd+V。');
    renderAnalysisSummary(analysis);

    if (!activePack) {
      syncPackSelection(null);
      renderRecommendationImages([]);
      renderSelectors(analysis);
      return;
    }

    syncPackSelection(activePack);
    renderSelectors(analysis);
    renderClipboardFlow();
  }

  function getRecentCustomerMessages() {
    const explicitCustomerMessages = getChatRoots()
      .flatMap((root) => allMatchingElements(selectors.customerMessageItems, root))
      .filter(isVisible)
      .map(getMessageText)
      .flatMap((text) => splitCandidateText(text))
      .filter(Boolean)
      .filter((text) => !isLikelyUiText(text));

    const fallbackMessages = inferVisibleMessageCandidates();
    const limit = getMessageLimit();

    if (limit !== null && explicitCustomerMessages.length >= limit) {
      return trimMessages(dedupeMessages(explicitCustomerMessages), limit);
    }

    if (explicitCustomerMessages.length > 0) {
      return mergeRecentMessages(explicitCustomerMessages, fallbackMessages);
    }

    return fallbackMessages;
  }

  async function readCurrentChat() {
    const messages = getRecentCustomerMessages();
    state.currentMessages = messages;
    state.destinationOverride = null;
    state.analysisSource = 'rules';

    if (messages.length === 0) {
      renderRecommendation({
        destination: null,
        confidence: 'low',
        contentPackId: null,
        matchedTerms: {},
        blockedReason: 'no_visible_customer_messages',
        source: 'rules'
      });
      setStatus('未找到客户消息', 'error');
      return;
    }

    let analysis = null;

    if (imageBotClient && typeof imageBotClient.resolveRecommendation === 'function') {
      const resolved = await imageBotClient.resolveRecommendation(messages, {
        pageUrl: window.location.href,
        pageType: isMockPage ? 'mock' : 'salesmartly',
        maxMessages: getMessageLimit()
      });

      if (resolved && resolved.payload) {
        analysis = normalizeBotAnalysis(resolved.payload, messages);
      }
    }

    if (!analysis) {
      analysis = rulesApi.analyzeRecommendation(messages);
    }

    state.analysisSource = analysis && analysis.source === 'image_bot' ? 'image_bot' : 'rules';
    state.analysis = analysis;
    renderRecommendation(analysis);
    renderMockTestCaseResult(analysis);

    if (analysis.blockedReason) {
      setStatus(`不推荐：${formatBlockedReason(analysis.blockedReason)}`, 'info');
      return;
    }

    setStatus(`已识别：${formatDestinationLabel(analysis.destination)}`, 'success');
  }

  function handleMessageScopeChange(event) {
    state.messageScope = event.target.value;
    setStatus(`读取范围：${UI_LABELS.messageScope[state.messageScope]}`, 'info');
  }

  function setNativeValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

    if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }
  }

  function dispatchInputEvent(input, value) {
    input.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: value
      })
    );
  }

  function insertTextIntoChat(text, successMessage) {
    const input = firstMatchingElementAcrossDocuments(selectors.chatInput);

    if (!input || !isVisible(input)) {
      setStatus('未找到输入框', 'error');
      return false;
    }

    input.focus();
    if (input.isContentEditable) {
      input.textContent = text;
    } else {
      setNativeValue(input, text);
    }

    dispatchInputEvent(input, text);
    setStatus(successMessage, 'success');
    return true;
  }

  function clearChatInput() {
    const input = firstMatchingElementAcrossDocuments(selectors.chatInput);

    if (!input) {
      return false;
    }

    if (input.isContentEditable) {
      input.textContent = '';
    } else {
      setNativeValue(input, '');
    }

    dispatchInputEvent(input, '');
    return true;
  }

  function getSelectedPackImages() {
    const activePack = getActivePack();
    if (!activePack) {
      return [];
    }

    return activePack.images.filter((image) => state.imageSelection[image.id]);
  }

  function buildPendingImageCard(imageMeta) {
    const card = document.createElement('article');
    card.className = 'salesmartly-pending-card';
    card.setAttribute('data-ext-image-id', imageMeta.id);
    card.setAttribute('data-placeholder-image', String(Boolean(imageMeta.isPlaceholder)));

    const image = document.createElement('img');
    image.src = getResolvedImageSrc(imageMeta);
    image.alt = imageMeta.alt;
    image.addEventListener('error', () => {
      image.hidden = true;
      fallback.hidden = false;
    });

    const fallback = document.createElement('div');
    fallback.className = 'salesmartly-pending-fallback';
    fallback.hidden = true;
    fallback.textContent = `${imageMeta.englishName} 加载失败`;

    const caption = document.createElement('div');
    caption.className = 'salesmartly-pending-caption';
    caption.textContent = `${imageMeta.englishName} / ${imageMeta.chineseName}`;

    if (imageMeta.isPlaceholder) {
      const badge = document.createElement('div');
      badge.className = 'salesmartly-pending-warning';
      badge.textContent = '测试占位图，禁止正式发送';
      card.appendChild(badge);
    }

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'salesmartly-pending-remove';
    removeButton.textContent = '删除图片';
    removeButton.addEventListener('click', () => {
      card.remove();
      syncPendingAreaEmptyState();
      setStatus('已移除图片', 'info');
    });

    card.appendChild(image);
    card.appendChild(fallback);
    card.appendChild(caption);
    card.appendChild(removeButton);
    return card;
  }

  function syncPendingAreaEmptyState() {
    const pendingImages = firstMatchingElement(selectors.pendingSendImages);
    const pendingEmpty = firstMatchingElement(selectors.pendingSendEmpty);
    const warning = document.querySelector('[data-testid="placeholder-warning"]');

    if (!pendingImages || !pendingEmpty) {
      return;
    }

    pendingEmpty.hidden = pendingImages.children.length > 0;
    if (warning) {
      const hasPlaceholder = Boolean(
        pendingImages.querySelector('[data-placeholder-image="true"]')
      );
      warning.hidden = !hasPlaceholder;
    }
  }

  function renderPendingSendArea(images) {
    const pendingArea = firstMatchingElement(selectors.pendingSendArea);
    const pendingImages = firstMatchingElement(selectors.pendingSendImages);
    const pendingEmpty = firstMatchingElement(selectors.pendingSendEmpty);

    if (!pendingArea || !pendingImages || !pendingEmpty) {
      return false;
    }

    pendingImages.replaceChildren();
    const uniqueImages = images.filter(
      (image, index, list) => list.findIndex((item) => item.id === image.id) === index
    );

    uniqueImages.forEach((imageMeta) => {
      pendingImages.appendChild(buildPendingImageCard(imageMeta));
    });

    pendingArea.hidden = false;
    pendingEmpty.hidden = uniqueImages.length > 0;
    return true;
  }

  function clearPendingSendArea() {
    const pendingArea = firstMatchingElement(selectors.pendingSendArea);
    const pendingImages = firstMatchingElement(selectors.pendingSendImages);
    const pendingEmpty = firstMatchingElement(selectors.pendingSendEmpty);

    if (pendingImages) {
      pendingImages.replaceChildren();
    }

    if (pendingArea) {
      pendingArea.hidden = false;
    }

    if (pendingEmpty) {
      pendingEmpty.hidden = false;
    }
  }

  function insertTestText() {
    insertTextIntoChat(TEST_TEXT, '已填入测试文字，未点击发送。');
  }

  async function addToPendingArea() {
    const activePack = getActivePack();

    if (!activePack) {
      setStatus(isMockPage ? '没有可加入的内容' : '没有可复制的图片', 'error');
      return;
    }

    if (isMockPage) {
      const inserted = insertTextIntoChat(
        activePack.message,
        '已填入推荐文案，未点击发送。'
      );

      if (!inserted) {
        return;
      }
    }

    const selectedImages = getSelectedPackImages();

    if (!isMockPage) {
      await startImageCopyFlow();
      return;
    }

    const pendingAreaRendered = renderPendingSendArea(selectedImages);

    if (!pendingAreaRendered) {
      setStatus(
        isMockPage
          ? '已填入文案'
          : '已完成选择',
        'info'
      );
      return;
    }

    if (selectedImages.length === 0) {
      setStatus(isMockPage ? '已填入文案' : '未选图片', 'info');
      return;
    }

    if (selectedImages.some((image) => image.isPlaceholder)) {
      setStatus(`已加入 ${selectedImages.length} 张占位图`, 'error');
      return;
    }

    setStatus(`已加入 ${selectedImages.length} 张图片`, 'success');
  }

  function clearPendingContent() {
    clearPendingSendArea();
    resetClipboardFlow();
    renderClipboardFlow();
    if (isMockPage) {
      clearChatInput();
    }
    setStatus('已清空', 'info');
  }

  function returnToPanelStart() {
    resetPanelState('已返回助手初始状态，请重新读取当前聊天。');

    const panel = document.getElementById(PANEL_ID);
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleRouteLikeChange() {
    const nextUrl = window.location.href;
    if (nextUrl === state.currentPageUrl) {
      return;
    }

    state.currentPageUrl = nextUrl;
    resetPanelState('检测到页面已切换，请重新读取当前聊天。');
  }

  function installRouteChangeListeners() {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    if (typeof originalPushState === 'function') {
      window.history.pushState = function patchedPushState() {
        const result = originalPushState.apply(this, arguments);
        window.setTimeout(handleRouteLikeChange, 0);
        return result;
      };
    }

    if (typeof originalReplaceState === 'function') {
      window.history.replaceState = function patchedReplaceState() {
        const result = originalReplaceState.apply(this, arguments);
        window.setTimeout(handleRouteLikeChange, 0);
        return result;
      };
    }

    window.addEventListener('popstate', handleRouteLikeChange);
    window.addEventListener('hashchange', handleRouteLikeChange);
  }

  function applyManualSelection(triggerRole) {
    if (!state.analysis || !state.analysis.destination) {
      return;
    }

    const destinationSelect = document.querySelector(
      `#${PANEL_ID} [data-role="destination-switch"]`
    );

    if (destinationSelect) {
      state.destinationOverride = destinationSelect.value || null;
    }

    let nextPack = null;
    if (!nextPack) {
      nextPack = packApi.getPackBySignature(getEffectiveDestination(state.analysis));
    }

    if (!nextPack) {
      renderRecommendation(state.analysis);
      setStatus(`已切换到 ${formatDestinationLabel(getEffectiveDestination(state.analysis))}`, 'info');
      return;
    }

    syncPackSelection(nextPack);
    renderSelectors(state.analysis);
    renderAnalysisSummary(state.analysis);
    setStatus(`已切换到 ${nextPack.title}`, 'success');
  }

  function renderMockTestCaseResult(analysis) {
    if (!isMockPage) {
      return;
    }

    const resultOutput = firstMatchingElement(selectors.testCaseResult);
    if (!resultOutput) {
      return;
    }

    resultOutput.textContent = JSON.stringify(
      {
        destination: analysis.destination,
        confidence: analysis.confidence,
        matchedTerms: analysis.matchedTerms,
        blockedReason: analysis.blockedReason,
        source: analysis.source || 'rules'
      },
      null,
      2
    );
  }

  function createPanel() {
    const existingPanel = document.getElementById(PANEL_ID);
    if (existingPanel) {
      resetPanelDock(existingPanel);
      return;
    }

    const panel = document.createElement('aside');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="salesmartly-panel-header">
        <button
          type="button"
          data-action="panel-back"
          class="salesmartly-panel-back-icon salesmartly-real-only"
          aria-label="返回助手初始状态"
          title="返回助手初始状态"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </button>
        <div class="salesmartly-panel-title">
          <strong>SaleSmartly 发图助手</strong>
          <p class="salesmartly-panel-subtitle">仅处理图片推荐与半自动复制，不自动发送</p>
        </div>
        <span class="salesmartly-source-badge" data-source="rules">本地规则兜底</span>
      </div>
      <div class="salesmartly-panel-body">
        <div class="salesmartly-panel-toolbar">
          <div class="salesmartly-panel-actions">
            <button type="button" data-action="read" class="salesmartly-primary-action">读取当前聊天</button>
            <button type="button" data-action="reset" class="salesmartly-secondary-action">重置面板</button>
            <button type="button" data-action="insert" class="salesmartly-mock-only salesmartly-secondary-action">插入测试文字</button>
          </div>
        </div>
        <div class="salesmartly-panel-controls">
          <label class="salesmartly-message-scope">
            <span>读取范围</span>
            <select data-role="message-scope">
              <option value="recent-5">最近 5 条</option>
              <option value="recent-10">最近 10 条</option>
              <option value="all">全部可见消息</option>
            </select>
          </label>
        </div>
        <section class="salesmartly-recommendation" hidden>
          <div class="salesmartly-recommendation-heading">
            <div class="salesmartly-recommendation-heading-main">
              <strong>目的地与图片</strong>
            </div>
          </div>
          <div class="salesmartly-switch-grid">
            <label>
              <span>目的地切换</span>
              <select data-role="destination-switch"></select>
            </label>
          </div>
          <p class="salesmartly-recommendation-label">推荐图片</p>
          <div class="salesmartly-recommendation-images"></div>
          <div class="salesmartly-recommendation-actions">
            <button type="button" data-action="add-pending" class="salesmartly-primary-action">复制所选内容</button>
            <button type="button" data-action="copy-next-image" class="salesmartly-secondary-action salesmartly-real-only" hidden>复制下一张已勾选图片</button>
            <button type="button" data-action="clear-pending" class="salesmartly-secondary-action">清空待发送内容</button>
          </div>
        </section>
      </div>
    `;

    panel.querySelector('[data-action="read"]').addEventListener('click', readCurrentChat);
    panel.querySelector('[data-action="insert"]').addEventListener('click', insertTestText);
    panel.querySelector('[data-action="reset"]').addEventListener('click', () => {
      resetPanelState();
    });
    panel
      .querySelector('[data-action="panel-back"]')
      .addEventListener('click', returnToPanelStart);
    panel
      .querySelector('[data-action="add-pending"]')
      .addEventListener('click', addToPendingArea);
    panel
      .querySelector('[data-action="copy-next-image"]')
      .addEventListener('click', copyNextFlowImage);
    panel
      .querySelector('[data-action="clear-pending"]')
      .addEventListener('click', clearPendingContent);
    panel
      .querySelector('[data-role="destination-switch"]')
      .addEventListener('change', () => applyManualSelection('destination-switch'));

    panel
      .querySelector('[data-role="message-scope"]')
      .addEventListener('change', handleMessageScopeChange);

    document.body.appendChild(panel);
    resetPanelDock(panel);
    setPanelMode();
    enablePanelDragging();
    renderClipboardFlow();
  }

  function initialize() {
    if (!document.body) {
      return;
    }

    createPanel();
    clearPendingSendArea();
    installRouteChangeListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
