# 日志管理

## 组件名称[**inl-log-manager**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <div>
        <inl-log-manager></inl-log-manager>;
      </div>
    );
  },
});
```

## 参数

| 参数名称   | 类型   | 默认值     | 作用         |
| ---------- | ------ | ---------- | ------------ |
| url        | 见下方 | {}         | 网络请求路径 |
| prefix     | string | /api/      | 网络请求前缀 |
| serverName | string | comlite/v1 | 服务端名称   |

### url

```typescript
export interface IUrlObj {
  // 日志列表
  list: string;
  // 筛选列表
  searchList: string;
}
```
