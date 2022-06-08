# 报警配置

## 组件名称[**inl-alarm-configure**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-alarm-configure></inl-alarm-configure>;
    );
  },
});
```

## 参数

| 参数名称   | 类型   | 默认值       | 作用         |
| ---------- | ------ | ------------ | ------------ |
| url        | 见下方 | {}           | 网络请求路径 |
| prefix     | string | /api/        | 网络请求前缀 |
| serverName | string | alarmlite/v1 | 服务端名称   |

### url

```typescript
export interface IUrlObj {
  // 规则列表
  ruleList: string;
  // 规则详情
  getDetail: string;
  // 更新规则/新增规则
  updateRule: string;
  // 启用/禁用
  switchEnable: string;
  // 删除规则
  deleteRule: string;
  // 批量上传规则
  upload: string;
  // 获取所有系统
  baseAll: string;
  // 获取系统下的设备列表
  instanceList: string;
  // 获取设备对应的信号列表
  propertiesList: string;
  // 部门人员树结构
  depTree: string;
  // 获取参数
  getEnum: string;
}
```
