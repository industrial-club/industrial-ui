# 个人设置

## 组件名称[**inl-personal-setting**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-personal-setting></inl-personal-setting>;
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
  // 当前用户详情
  detail: string;
  // 更新当前用户信息
  update: string;
  // 修改密码
  updatePass: string;
}
```
