# 发图 Bot 对接说明

对接目标：

- 只返回目的地识别结果
- 前端据此推荐图片
- 销售手动勾选后复制

标准输出：

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

当前前端优先级：

1. 图片 Bot 结果
2. 本地规则兜底

page bridge 示例：

```js
window.SaleSmartlyImageBot = {
  async getRecommendation() {
    return {
      destination: 'zhangjiajie',
      confidence: 'medium',
      matchedTerms: {},
      blockedReason: null
    };
  }
};
```

