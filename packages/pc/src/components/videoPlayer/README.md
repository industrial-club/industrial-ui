# 播放视频组件

> 为方便开发调试，特推出播放视频组件。

## 组件名称 [inl-video-player] 可根据引入进行自定义修改

```tsx
import { defineComponent, reactive } from "vue";
import { videoInfo } from "inl-ui";

export default defineComponent({
  setup() {
    const camera = reactive<videoInfo>({
      user: "admin",
      mediaServerPo: {
        url: "http://192.168.5.43:880",
      },
      pass: "password01",
      rtspPort: 554,
      ip: "172.16.202.53",
      channel: "1",
      streamType: "0",
      webrtcTemplateMerged:
        "http://192.168.5.43:880/index/api/addStreamProxy?vhost=__defaultVhost__&app=live&stream=v172.16.202.53-554-${channel}-${streamType}&url=rtsp://admin:password01@172.16.202.53:554/H264/ch${channel}/${streamType}/av_stream",
    });
    return () => <inl-video-player camera={camera}></inl-video-player>;
  },
});
```

## 参数

| 参数名称 | 类型             | 默认值 | 作用                     |
| -------- | ---------------- | ------ | ------------------------ |
| camera   | Object \| String |        | 视频信息或视频 uuid 必填 |
