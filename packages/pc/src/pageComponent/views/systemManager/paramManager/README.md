# 参数管理

## 组件名称[**inl-param-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-param-manager></inl-param-manager>;
    );
  },
});
```

## 参数

| 参数名称   | 类型   | 默认值    | 作用         |
| ---------- | ------ | --------- | ------------ |
| url        | 见下方 | {}        | 网络请求路径 |
| prefix     | string | /api/     | 网络请求前缀 |
| serverName | string | common/v1 | 服务端名称   |

### url

```typescript
export interface IUrlObj {
  // 参数列表
  list: string;
  // 参数定义对象
  define: string;
  // 批量保存
  save: string;
}
```
