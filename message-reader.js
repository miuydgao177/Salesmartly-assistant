(function () {
  'use strict';

  function createMessageReader(options) {
    const {
      selectors,
      getMessageLimit,
      panelUiTexts = []
    } = options || {};

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

    function cleanText(text) {
      return String(text || '').replace(/\s+/g, ' ').trim();
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

      return panelUiTexts.some((uiText) => normalized.includes(uiText));
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

      return trimMessages(
        dedupeMessages([...primaryMatches, ...elementTextNodes, ...textNodeMessages])
      );
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

    return {
      firstMatchingElement,
      firstMatchingElementAcrossDocuments,
      getRecentCustomerMessages
    };
  }

  globalThis.SALESMARTLY_MESSAGE_READER = {
    createMessageReader
  };
})();
