# SaleSmartly 发图助手

这是一个 Chrome Manifest V3 扩展，用来在 SaleSmartly 或本地 mock 页面里做“识别目的地 -> 推荐图片 -> 手动勾选 -> 逐张复制 -> 手动粘贴”的半自动发图流程验证。

当前版本的原则很明确：

- 不自动发送消息
- 不依赖 SaleSmartly 私有接口
- 真实页面只走“复制图片到剪贴板 + 人工粘贴”
- mock 页面保留待发送区，仅用于本地联调

## 当前能力

- 识别 19 个目的地
- 只根据关键词目的地识别并推荐图片
- 支持插件内置图片库
- 支持本地 OCR 清洗结果导入图片元数据
- 支持 mock 页面测试用例和图片 Bot 模拟结果
- 支持真实页面逐张复制已勾选图片

## 当前真实业务流程

在真实 SaleSmartly 页面里，稳定可用的流程是：

1. 点击 `读取当前聊天`
2. 面板识别目的地并展示推荐图片
3. 手动勾选需要发送的图片
4. 点击 `复制所选内容`
5. 扩展先复制第 1 张图片
6. 在 SaleSmartly 输入区手动 `Cmd+V` 或 `Ctrl+V`
7. 如还有下一张，点击 `复制下一张已勾选图片`
8. 重复粘贴，直到完成

这套流程是当前真正对业务负责、也最稳定的交付范围。

## 项目结构

```text
├── manifest.json
├── content.js
├── styles.css
├── selectors.js
├── destinations.js
├── intent-rules.js
├── image-selection-rules.js
├── image-library.js
├── image-bot-client.js
├── content-packs.js
├── dev/
│   ├── mock-chat.html
│   ├── test-cases.js
│   └── playwright-smoke.mjs
├── docs/
│   ├── image-bot-mvp.md
│   └── image-bot-integration.md
├── generated/
│   ├── image-library.generated.js
│   └── image-library.import.json
├── data/
│   └── ocr/
│       ├── ocr-image-tags-results.json
│       └── ocr-image-tags-cleaned.json
├── scripts/
└── assets/
```

各目录职责：

- `content.js`：主运行时，负责识别、面板渲染、图片勾选、复制流程
- `selectors.js`：页面选择器集中定义
- `destinations.js`：目的地和别名词库
- `intent-rules.js`：目的地和否定判断规则
- `image-library.js`：正式图片库索引
- `image-selection-rules.js`：按关键词选图
- `dev/`：本地联调用页面、测试用例、冒烟脚本
- `generated/`：脚本生成物，不手改
- `data/ocr/`：OCR 原始结果和清洗结果
- `docs/`：产品边界和对接说明

## 本地开发

加载扩展：

1. 打开 `chrome://extensions/`
2. 开启“开发者模式”
3. 选择“加载已解压的扩展程序”
4. 选择项目根目录 `/Users/apple/Desktop/salesmartly-assistant`

打开 mock 页面：

```bash
python3 -m http.server 3002
```

然后访问：

- [http://127.0.0.1:3002/dev/mock-chat.html](http://127.0.0.1:3002/dev/mock-chat.html)

## mock 页面用途

`dev/mock-chat.html` 只服务于本地联调，不代表真实业务页面。

它保留这些能力：

- 切换测试消息
- 查看规则识别结果
- 模拟图片 Bot 返回结果
- 用待发送区验证“推荐图片写入 mock 页”的行为

mock 页面里的 `加入发送区` 只是测试动作，不会真的发送。

## 图片库维护

正式图片放在：

- `assets/<destination>/library/`

示例：

```text
assets/
  beijing/
    library/
  chengdu/
    library/
  zhangjiajie/
    library/
```

图片索引主要看这两个文件：

- [image-library.js](/Users/apple/Desktop/salesmartly-assistant/image-library.js)
- [image-selection-rules.js](/Users/apple/Desktop/salesmartly-assistant/image-selection-rules.js)

## 批量建库脚本

扫描图片目录并生成索引草稿：

```bash
node scripts/generate-image-library-snippet.js
```

输出位置：

- `generated/image-library.generated.js`

只打印不落盘：

```bash
node scripts/generate-image-library-snippet.js --stdout
```

OCR 清洗和导入：

```bash
node scripts/normalize-ocr-tags.js
node scripts/import-ocr-library.js
```

相关文件：

- `data/ocr/ocr-image-tags-results.json`
- `data/ocr/ocr-image-tags-cleaned.json`
- `generated/image-library.import.json`

图片库自检：

```bash
node scripts/audit-image-library.js
```

这个脚本会检查三类问题：

- `image-library.js` 里的 `destination` 和素材目录是否一致
- `assets/*/library/` 里是否存在完全没有被任何索引引用的旧文件
- 哪些图片目前只在 `generated/image-library.import.json` 里，还没有进入主索引

2026-08-10 这轮整理里，已归档的无引用旧文件放在：

- `/Users/apple/Desktop/salesmartly-assistant/.backups/2026-08-10-unused-library-assets/`
- `/Users/apple/Desktop/salesmartly-assistant/.backups/2026-08-10-unused-library-assets-manifest.json`

## 冒烟测试

本地冒烟脚本：

- [dev/playwright-smoke.mjs](/Users/apple/Desktop/salesmartly-assistant/dev/playwright-smoke.mjs)

它现在只校验当前仍在维护的能力：

- 读取聊天后能展示推荐图片
- 可手动切换目的地
- mock 页面可把选中图片加入待发送区
- 清空按钮可清掉输入框和待发送区
- 否定用例会阻断推荐
- 图片 Bot 结果能覆盖本地规则

## 当前边界

- 真实 SaleSmartly 页面不支持自动把多图塞进待发送区
- 当前稳定方案仍然是勾选后逐张复制、逐张粘贴
- mock 页的待发送区能力不能等同于真实页面能力
- 没有自动点击发送
- 没有后端数据库依赖
- 没有用户反馈闭环

## 备份基线

当前整理前的可回退基线在：

- `/Users/apple/Desktop/salesmartly-assistant/.backups/2026-08-10-baseline/`
