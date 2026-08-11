export async function runPlaywrightTests({ chromium, outputDir, pageUrl }) {
  const fs = await import('node:fs/promises');
  const os = await import('node:os');
  const path = await import('node:path');

  const projectPath = '/Users/apple/Desktop/salesmartly-assistant';
  const executablePath =
    '/Users/apple/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
  const profileDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'pw-salesmartly-profile-')
  );
  const targetUrl = pageUrl || 'http://127.0.0.1:3002/dev/mock-chat.html';

  const context = await chromium.launchPersistentContext(profileDir, {
    executablePath,
    headless: true,
    args: ['--headless=new', '--disable-gpu', '--no-sandbox']
  });

  async function injectScript(page, fileName) {
    const scriptContent = await fs.readFile(path.join(projectPath, fileName), 'utf8');
    await page.addScriptTag({ content: scriptContent });
  }

  try {
    const page = context.pages()[0] || (await context.newPage());
    await page.addInitScript(() => {
      window.chrome = window.chrome || {};
      window.chrome.runtime = window.chrome.runtime || {
        getURL(relativePath) {
          return new URL(relativePath, window.location.href).toString();
        }
      };
    });

    await page.goto(targetUrl, { waitUntil: 'load' });

    await injectScript(page, 'selectors.js');
    await injectScript(page, 'intent-rules.js');
    await injectScript(page, 'content-packs.js');
    await injectScript(page, 'content.js');

    await page.locator('#salesmartly-test-assistant-panel').waitFor({
      state: 'visible',
      timeout: 15000
    });

    const panel = page.locator('#salesmartly-test-assistant-panel');
    const readButton = panel.getByRole('button', { name: '读取当前聊天' });
    const result = { checks: [], screenshots: {} };

    await readButton.click();
    await page.waitForTimeout(800);

    const recommendationSection = panel.locator('.salesmartly-recommendation');
    const thumbs = recommendationSection.locator(
      '.salesmartly-image-card .salesmartly-image-thumb img'
    );
    result.checks.push({
      name: '默认用例能展示推荐图片',
      passed:
        (await recommendationSection.isVisible()) &&
        (await thumbs.count()) === 3
    });

    const destinationSwitch = panel.locator('[data-role="destination-switch"]');
    await destinationSwitch.selectOption('guilin');
    await page.waitForTimeout(400);
    const detailText = await recommendationSection
      .locator('.salesmartly-recommendation-details')
      .textContent();
    result.checks.push({
      name: '可手动切换目的地',
      passed: detailText.includes('桂林 / Guilin')
    });

    await destinationSwitch.selectOption('zhangjiajie');
    await page.waitForTimeout(300);

    const checkboxes = recommendationSection.locator(
      '.salesmartly-image-card input[type="checkbox"]'
    );
    await checkboxes.nth(2).uncheck();
    await recommendationSection.getByRole('button', { name: '加入发送区' }).click();
    await page.waitForTimeout(500);

    const pendingImages = page.locator(
      '[data-testid="pending-send-images"] .salesmartly-pending-card'
    );
    const chatInput = page.locator('[data-testid="chat-input"]');
    result.checks.push({
      name: 'mock 页面只加入勾选的图片',
      passed:
        (await pendingImages.count()) === 2 &&
        (await chatInput.inputValue()).includes('REVIEW_REQUIRED')
    });

    await recommendationSection
      .getByRole('button', { name: '清空待发送内容' })
      .click();
    await page.waitForTimeout(300);
    result.checks.push({
      name: '清空按钮可清掉 mock 输入框和待发送区',
      passed:
        (await pendingImages.count()) === 0 &&
        (await chatInput.inputValue()) === ''
    });

    await page.locator('[data-testid="test-case-select"]').selectOption('explicit-negative');
    await page.locator('[data-testid="apply-test-case"]').click();
    await readButton.click();
    await page.waitForTimeout(700);
    const negativeResult = await page.locator('[data-testid="test-case-result"]').textContent();
    result.checks.push({
      name: '否定用例会阻断推荐',
      passed: negativeResult.includes('"blockedReason": "negative_signal"')
    });

    await page.locator('[data-testid="bot-language"]').selectOption('es');
    await page.locator('[data-testid="bot-intent"]').selectOption('family');
    await page.locator('[data-testid="bot-apply"]').click();
    await readButton.click();
    await page.waitForTimeout(700);
    const botResult = await page.locator('[data-testid="test-case-result"]').textContent();
    result.checks.push({
      name: '图片 Bot 结果可覆盖本地规则',
      passed:
        botResult.includes('"destination": "zhangjiajie"') &&
        botResult.includes('"intent": "family"') &&
        botResult.includes('"source": "image_bot"')
    });

    const shotPath = path.join(outputDir, 'playwright-smoke-current-ui.png');
    await page.screenshot({ path: shotPath, fullPage: true });
    result.screenshots.final = shotPath;
    return result;
  } finally {
    await context.close();
  }
}
