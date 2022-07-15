# 关于系统-新

## 组件名称[**inl-about-new**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-about-new></inl-about-new>;
    );
  },
});
```

## 参数

| 参数名称     | 类型   | 默认值 | 作用     |
| ------------ | ------ | ------ | -------- |
| summary      | string |        | 产品简介 |
| softwareList | Array  |        | 版本详情 |
| companyInfo  | Array  |        | 公司信息 |


