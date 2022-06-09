# 报警记录

## 组件名称[**inl-alarm-record**]

## 使用方式

```jsx
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return () => (
      <inl-alarm-record></inl-alarm-record>;
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
  // 获取参数
  getEnum: string;
  // 手动消警
  clearAlarm: string;
  // 报警记录
  alarmList: string;
  // 语音播报记录
  speechList: string;
  // 切换是否静音
  switchVoice: string;
  // 获取视频
  getVideo: string;
  // 报警详情
  alarmDetail: string;
  // 报警类型列表
  alarmTypeList: string;
  // 视频的baseUrl
  videoBaseUrl: string;
}
```
