# SaleSmartly 发图助手

`SaleSmartly 发图助手` 是一个 Chrome 扩展，用来在 SaleSmartly 聊天页面中做最小可用的发图辅助：

- 识别聊天中的目的地关键词
- 推荐对应目的地图片
- 业务手动勾选图片
- 逐张复制图片到剪贴板
- 手动粘贴到聊天输入框

当前版本已经刻意收敛，不再保留多余分支逻辑。

## 当前产品边界

当前只做：

- 按目的地识别图片需求
- 展示推荐图片
- 支持手动切换目的地
- 支持逐张复制已勾选图片

当前不做：

- 不自动发送
- 不区分 `family / senior / general`
- 不区分语言分类
- 不依赖 SaleSmartly 私有上传接口
- 不自动把多图塞进待发送区

## 真实使用流程

在真实 SaleSmartly 页面里，推荐业务按下面顺序操作：

1. 打开客户聊天
2. 点击 `读取当前聊天`
3. 核对识别出的目的地
4. 勾选需要发送的图片
5. 点击 `复制所选内容`
6. 回到输入框手动粘贴
7. 如果勾选了多张图，继续点击 `复制下一张已勾选图片`

这是当前最稳定、也最适合业务落地的使用方式。

## 安装方式

1. 打开 Chrome，进入 `chrome://extensions/`
2. 打开右上角“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择项目目录

如果使用打包版本：

1. 先解压 `发图插件.zip`
2. 再按上面的步骤加载解压后的文件夹

## 本地开发

项目根目录：

```bash
/Users/apple/Desktop/salesmartly-assistant
```

如果要联调 mock 页面：

```bash
python3 -m http.server 3002
```

然后访问：

- [http://127.0.0.1:3002/dev/mock-chat.html](http://127.0.0.1:3002/dev/mock-chat.html)

## 目录结构

```text
├── manifest.json
├── content.js
├── message-reader.js
├── clipboard-flow.js
├── panel-layout.js
├── styles.css
├── selectors.js
├── destinations.js
├── destination-rules.js
├── image-selection-rules.js
├── image-library.js
├── image-bot-client.js
├── content-packs.js
├── assets/
├── dev/
├── docs/
├── generated/
├── data/
└── scripts/
```

主要文件说明：

- `content.js`：插件总控层，负责串联“读取聊天 -> 识别目的地 -> 选择图片 -> 复制流程 -> 渲染面板”
- `message-reader.js`：聊天消息提取模块，负责从真实页面或 mock 页面读取客户消息
- `clipboard-flow.js`：剪贴板流程模块，负责已勾选图片的逐张复制逻辑
- `panel-layout.js`：面板布局模块，负责拖拽、底部停靠和缩放后的定位稳定
- `destination-rules.js`：目的地关键词识别和否定规则
- `destinations.js`：目的地词库
- `image-library.js`：正式图片索引
- `image-selection-rules.js`：按目的地和消息关键词选图
- `content-packs.js`：目的地图片包定义
- `styles.css`：面板样式
- `dev/mock-chat.html`：本地联调用页面

## 图片库维护

正式图片放在：

```text
assets/<destination>/library/
```

例如：

```text
assets/beijing/library/
assets/chengdu/library/
assets/zhangjiajie/library/
```

相关文件：

- [image-library.js](/Users/apple/Desktop/salesmartly-assistant/image-library.js)
- [image-selection-rules.js](/Users/apple/Desktop/salesmartly-assistant/image-selection-rules.js)

## 常用脚本

生成图片库索引草稿：

```bash
node scripts/generate-image-library-snippet.js
```

只输出到终端：

```bash
node scripts/generate-image-library-snippet.js --stdout
```

OCR 清洗和导入：

```bash
node scripts/normalize-ocr-tags.js
node scripts/import-ocr-library.js
```

图片库自检：

```bash
node scripts/audit-image-library.js
```

## mock 页面说明

`dev/mock-chat.html` 只用于本地联调，不代表真实 SaleSmartly 页面能力。

它主要用来：

- 切换测试消息
- 查看识别结果
- 模拟图片 Bot 返回
- 验证推荐图片在 mock 待发送区里的表现

mock 页里的“加入发送区”只是测试动作，不会真实发送。

## 当前代码思路

现在这版代码遵循的是“适度拆分，主流程集中”的思路：

- 把不稳定、容易变复杂的能力单独拆出去
- 把真正的业务主线保留在 `content.js`
- 避免为了形式上的模块化而过度细分文件

当前主流程可以概括为：

1. `message-reader.js` 读取当前聊天里的客户消息
2. `destination-rules.js` 或图片 Bot 识别目的地
3. `content.js` 根据识别结果选中对应内容包与图片
4. `clipboard-flow.js` 处理“复制所选内容 / 复制下一张”
5. `panel-layout.js` 保证面板拖拽和定位表现稳定

这样做的目标不是把文件拆得越多越好，而是让每个文件只负责一种稳定职责，同时让主流程还能一眼看懂。

## 测试

本地冒烟脚本：

- [dev/playwright-smoke.mjs](/Users/apple/Desktop/salesmartly-assistant/dev/playwright-smoke.mjs)

当前主要覆盖：

- 读取聊天后展示推荐图片
- 手动切换目的地
- mock 页面加入待发送区
- 清空内容
- 否定用例阻断推荐
- 图片 Bot 结果覆盖本地规则

## 文档

交付文档：

- [发图插件操作说明.html](/Users/apple/Desktop/salesmartly-assistant/docs/发图插件操作说明.html)
- [发图插件操作说明.md](/Users/apple/Desktop/salesmartly-assistant/docs/发图插件操作说明.md)

产品和对接说明：

- [docs/image-bot-mvp.md](/Users/apple/Desktop/salesmartly-assistant/docs/image-bot-mvp.md)
- [docs/image-bot-integration.md](/Users/apple/Desktop/salesmartly-assistant/docs/image-bot-integration.md)

## 当前限制

- 真实页面仍然是逐张复制、逐张粘贴
- 多图不能稳定自动进入待发送区
- 面板是辅助工具，不替代业务最终确认
- 当前没有自动发送闭环
