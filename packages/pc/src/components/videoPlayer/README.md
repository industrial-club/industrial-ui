# 登录组件

> 为方便开发调试，特推出播放视频组件。

## 组件名称 [inl-video-player] 可根据引入进行自定义修改

```tsx
import { defineComponent, reactive } from "vue";
import { videoInfo } from "inl-ui/src/components/videoPlayer/util/byUuid";

export default defineComponent({
  setup() {
    const camera = reactive<videoInfo>({
      pass: "password01",
      rtspPort: 554,
      ip: "172.16.202.53",
      channel: "1",
      remark: "能用",
      rtspTemplateMerged:
        "rtsp://admin:password01@172.16.202.53:554/H264/ch${channel}/${streamType}/av_stream",
      uuid: "uu1",
      webrtcTemplateMerged:
        "http://192.168.5.43:880/index/api/addStreamProxy?vhost=__defaultVhost__&app=live&stream=v172.16.202.53-554-${channel}-${streamType}&url=rtsp://admin:password01@172.16.202.53:554/H264/ch${channel}/${streamType}/av_stream",
      nvrBo: {
        brandTypePo: {
          code: "HIK",
          name: "海康",
          rtspTemplate:
            "rtsp://${user}:${pass}@${ip}:${rtspPort}/Streaming/tracks/${nvr_channel}01",
          id: 8,
          prodType: "NVR",
        },
        pass: "pass",
        brandTypeCode: "HIK",
        rtspPort: 22,
        ip: "192.168.5.24",
        name: "na",
        remark: "r1",
        id: 7,
        user: "user",
        uuid: "N343329610971430912",
      },
      brandTypePo: {
        streamTypeDict:
          '[\n    {\n      "code": "main",\n      "name": "主码流"\n    },\n    {\n      "code": "sub",\n      "name": "子码流"\n    }]',
        code: "HIK",
        name: "海康",
        rtspTemplate:
          "rtsp://${user}:${pass}@${ip}:${rtspPort}/H264/ch${channel}/${streamType}/av_stream",
        remark: "主流版本",
        id: 1,
        prodType: "IPC",
        streamTypeDictList: [
          {
            code: "main",
            name: "主码流",
          },
          {
            code: "sub",
            name: "子码流",
          },
        ],
      },
      streamType: "0",
      brandTypeCode: "HIK",
      mediaServerPo: {
        name: "n1",
        remark: "r2",
        id: 3,
        secret: "035c73f7-bb6b-4889-a715-d9eb2d1925cc",
        uuid: "u1",
        url: "http://192.168.5.43:880",
      },
      name: "172.16.202.53",
      nvrChannel: "1",
      id: 1,
      nvrUuid: "N343329610971430912",
      user: "admin",
      mediaServerUuid: "u1",
    });
    return () => <inl-video-player camera={camera}></inl-video-player>;
  },
});
```

## 参数

| 参数名称 | 类型             | 默认值 | 作用                     |
| -------- | ---------------- | ------ | ------------------------ |
| camera   | Object \| String |        | 视频信息或视频 uuid 必填 |
