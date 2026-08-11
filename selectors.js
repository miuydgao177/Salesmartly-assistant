/*
 * 所有目标页面 DOM 选择器集中在这里。
 * 后续适配页面结构时，优先只修改本文件。
 */
const SALESMARTLY_SELECTORS = {
  messageItems: [
    '[data-testid="message"]',
    '[data-testid*="message-item"]',
    '[data-message-id]',
    '[class*="message-item"]',
    '[class*="messageItem"]',
    '[class*="chat-message"]',
    '[class*="chatMessage"]',
    '[class*="conversation-message"]',
    '[class*="conversationMessage"]'
  ],
  customerMessageItems: [
    '[data-testid="message"][data-role="customer"]',
    '[data-testid*="message-item"][data-role="customer"]',
    '[data-message-role="customer"]',
    '[data-role="customer"]'
  ],
  messageText: [
    '[data-testid="message-content"]',
    '[data-testid*="message-content"]',
    '[class*="message-content"]',
    '[class*="messageContent"]',
    '[class*="text-content"]',
    '[class*="textContent"]',
    '[class*="content"]'
  ],
  chatInput: [
    'textarea',
    '[contenteditable="true"]',
    '[role="textbox"]',
    'input[type="text"]'
  ],
  chatInputContainer: [
    '[data-testid*="composer"]',
    '[data-testid*="input"]',
    '[class*="composer"]',
    '[class*="input-area"]',
    '[class*="inputArea"]',
    '[class*="chat-input"]',
    '[class*="chatInput"]'
  ],
  imageInput: [
    'input[type="file"][accept*="image"]',
    'input[type="file"][accept*="png"]',
    'input[type="file"][accept*="jpg"]',
    'input[type="file"][accept*="jpeg"]',
    'input[type="file"]'
  ],
  imageUploadTrigger: [
    '[data-testid*="upload"] button',
    '[data-testid*="image"] button',
    '[data-testid*="upload"]',
    '[data-testid*="image"]',
    '[class*="upload"] button',
    '[class*="image"] button',
    '[class*="attach"] button',
    '[class*="toolbar"] button',
    '[class*="editor"] button',
    '[class*="footer"] button',
    '[class*="action"] button',
    '[aria-label*="upload" i]',
    '[aria-label*="image" i]',
    '[aria-label*="photo" i]',
    '[aria-label*="attach" i]',
    '[title*="upload" i]',
    '[title*="image" i]',
    '[title*="photo" i]',
    '[title*="attach" i]',
    'button[class*="upload"]',
    'button[class*="image"]',
    'button[class*="attach"]',
    'button svg',
    '[role="button"] svg'
  ]
};

const MOCK_SELECTORS = {
  messageItems: ['[data-testid="message-item"]'],
  customerMessageItems: [
    '[data-testid="message-item"][data-role="customer"]'
  ],
  customerMessageMeta: ['[data-testid="message-meta"]'],
  messageText: ['[data-testid="message-text"]'],
  chatInput: ['[data-testid="chat-input"]'],
  chatInputContainer: ['[data-testid="chat-input-area"]'],
  imageInput: ['[data-testid="image-upload"]'],
  sendButton: ['[data-testid="send-button"]'],
  pendingSendArea: ['[data-testid="pending-send-area"]'],
  pendingSendImages: ['[data-testid="pending-send-images"]'],
  pendingSendEmpty: ['[data-testid="pending-send-empty"]'],
  testCaseSelect: ['[data-testid="test-case-select"]'],
  testCaseApply: ['[data-testid="apply-test-case"]'],
  testCaseExpected: ['[data-testid="test-case-expected"]'],
  testCaseResult: ['[data-testid="test-case-result"]']
};

function getPageSelectors() {
  const isMockPage =
    (window.location.protocol === 'file:' &&
      window.location.pathname.endsWith('/mock-chat.html')) ||
    ((window.location.hostname === '127.0.0.1' ||
      window.location.hostname === 'localhost') &&
      window.location.pathname.endsWith('/mock-chat.html'));

  return isMockPage ? MOCK_SELECTORS : SALESMARTLY_SELECTORS;
}

globalThis.SALESMARTLY_SELECTORS = SALESMARTLY_SELECTORS;
globalThis.MOCK_SELECTORS = MOCK_SELECTORS;
globalThis.getPageSelectors = getPageSelectors;
