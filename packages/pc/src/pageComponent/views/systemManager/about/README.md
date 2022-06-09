# 关于系统

## 组件名称[**inl-about**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-about></inl-about>;
    );
  },
});
```

## 参数

| 参数名称  | 类型                   | 默认值 | 作用                                      |
| --------- | ---------------------- | ------ | ----------------------------------------- |
| summary   | string                 |        | 产品简介                                  |
| hardware  | IVersionDetail(见下方) |        | 硬件版本                                  |
| software  | IVersionDetail(见下方) |        | 软件版本                                  |
| database  | IVersionDetail(见下方) |        | 数据库版本                                |
| manualUrl | String                 |        | 系统说明书下载链接 （不传不展示下载链接） |

### IVersionDetail

```typescript
export interface IVersionDetail {
  // 版本号
  version: string | number;
  // 版本概述
  summary?: string;
}
```
