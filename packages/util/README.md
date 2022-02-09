# 工业 util 库

## WebRtc 视频播放[美腾]

```tsx
import { webrtc } from "inl-util";
import { WebRtc } from "inl-util/dist/types/src/webRtc";

// 自动播放 不需要手动播放
const wr = new webrtc(opt as WebRtc);

// 只提供了停止播放方法，可传入 视频id dom id，来关闭指定播放器，如果不传会关闭全部视频
// 停止播放
wr.stopPlay();
```
