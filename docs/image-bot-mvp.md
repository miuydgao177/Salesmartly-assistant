# 发图 Bot 产品定义 v1

发图 Bot 只做一件事：

- 识别目的地
- 推荐对应图片
- 交给销售手动勾选与复制

当前范围：

- 只按 `destination` 工作
- 不区分 `language`
- 不区分 `intent`
- 不自动发送

建议输出：

```json
{
  "destination": "zhangjiajie",
  "confidence": "high",
  "matchedTerms": {
    "destination": {
      "zhangjiajie": ["zhangjiajie"]
    }
  },
  "blockedReason": null
}
```

图片库结构：

```text
assets/
  zhangjiajie/
    library/
```

真实页面流程：

1. 读取当前聊天
2. 识别目的地
3. 展示推荐图片
4. 勾选图片
5. 逐张复制和手动粘贴

