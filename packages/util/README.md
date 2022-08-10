# 工业 util 库

## WebRtc 视频播放[美腾]

```tsx
import { webRtcMt } from "inl-util";
import { WebRtc } from "inl-util/dist/types/src/webRtc";

// 自动播放 不需要手动播放
const wr = new webRtcMt(opt as WebRtc);

// 只提供了停止播放方法，可传入 视频id dom id，来关闭指定播放器，如果不传会关闭全部视频
// 停止播放
wr.stopPlay();
```

### 参数描述(WebRtc)

```ts
export interface WebRtc {
  el: HTMLElement;
  w?: number;
  h?: number;
  autoPlay: boolean;
  plays: PlayVideoArgs | Array<PlayVideoArgs>;
  endpointConfig?: EndpointConfig;
}
```

|      参数      | 说明                                                   |                   类型                   | 默认值 |
| :------------: | :----------------------------------------------------- | :--------------------------------------: | ------ |
|       el       | 父级别盒子(暂时无效，可用 body 代替)                   |              `HTMLElement`               | 必填   |
|       w        | 视频窗口宽度                                           |                 `Number`                 | `auto` |
|       h        | 视频窗口高度                                           |                 `Number`                 | `auto` |
|    autoPlay    | 自动播放（目前无法更改，全部自动播放）                 |                `boolean`                 | true   |
|     plays      | 播放视频源信息 [PlayVideoArgs](#参数描述playvideoargs) | ` PlayVideoArgs 、 Array<PlayVideoArgs>` | null   |
| endpointConfig | 视频配置[类型](#参数描述endpointconfig)                |             `EndpointConfig`             | {}     |

### 参数描述(PlayVideoArgs)

```ts
export interface PlayVideoArgs {
  videoElm: string;
  mediaServerAddr: string;
  cameraUserName: string;
  cameraPwd: string;
  cameraIp: string;
  cameraRtspPort: string;
  cameraChannel: string;
  cameraStream: string;
  codeStream: string;
}
```

|      参数       | 说明         |      类型       | 默认值 |
| :-------------: | :----------- | :-------------: | ------ |
|    videoElm     | domId        |    `string`     |        |
| mediaServerAddr | 媒体服务地址 |    `string`     |        |
| cameraUserName  | 用户名       |    `string`     |        |
|    cameraPwd    | 密码         |    `string`     |        |
|    cameraIp     | 相机 Ip      |    ` string`    |        |
| cameraRtspPort  | 相机 端口    |    ` Number`    |        |
|  cameraChannel  | 相机 通道    |    ` string`    |        |
|  cameraStream   | 相机 Stream  |    `string`     |        |
|   codeStream    | 相机 码流    | 'main' \| 'sub' |        |

### 参数描述(EndpointConfig)

```ts
export interface EndpointConfig {
  debug: boolean;
  simulcast: boolean;
  useCamera: boolean;
  audioEnable: boolean;
  videoEnable: boolean;
  recvOnly: boolean;
}
```

|    参数     | 说明                       |    类型    | 默认值 |
| :---------: | :------------------------- | :--------: | ------ |
|    debug    | 是否输出 log               | `boolean`  |        |
|  simulcast  | 是否本地流和远程流同时播放 | `boolean`  |        |
|  useCamera  | 是否使用用户相机           | `boolean`  |        |
| audioEnable | 是否启用音频               | `boolean`  |        |
| videoEnable | 是否启用视频               | ` boolean` |        |
|  recvOnly   | 只接收数据                 | `boolean`  |        |
