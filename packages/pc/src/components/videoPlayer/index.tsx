import { defineComponent, onMounted, onUnmounted, PropType, watch } from "vue";
import utils from "@/utils";
import api from "@/api/video";
import { videoInfo } from "./util/interface";
import { WebRtcMt } from "./util/video";

const props = {
  // 视频信息|视频源uuid
  camera: {
    type: [Object, String] as PropType<videoInfo | String>,
  },
};

const timer = new Date().getTime();
const VideoPlayer = defineComponent({
  name: "videoPlayer",
  props,
  setup(_prop, _context) {
    // 视频实例
    let play: WebRtcMt | null;

    // 初始化视频
    const init = (camera: videoInfo) => {
      play = null;
      const { channel, streamType } = camera;
      let url = camera.webrtcTemplateMerged;
      url = url.replaceAll("${channel}", channel);
      url = url.replaceAll("${streamType}", streamType);
      play = new WebRtcMt({
        plays: {
          videoElm: `videoPlayer${timer}`,
          mediaServerAddr: camera.mediaServerPo.url,
          cameraUserName: camera.user,
          cameraPwd: camera.pass,
          cameraIp: camera.ip,
          cameraRtspPort: `${camera.rtspPort}`,
          cameraChannel: camera.channel,
          cameraStream: camera.streamType,
          addRtspProxyUrl: url,
        },
      });
    };

    // 播放信息变化初始化视频
    watch(
      () => _prop.camera,
      async (e) => {
        stopPlay();
        if (e && typeof e === "object") {
          init(e as videoInfo);
        } else if (e && typeof e === "string") {
          const res = await api.getCameraByUuid(e as string);
          if (res.data) {
            init(res.data);
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    // 停止播放
    const stopPlay = () => {
      if (play) {
        play.stopPlay(`videoPlayer${timer}`);
      }
    };

    // 页面销毁时停止播放视频流
    onUnmounted(() => {
      stopPlay();
    });
    return () => (
      <video
        id={`videoPlayer${timer}`}
        style="height:100%;width:100%;position: relative;background-color: #000000;"
        muted
        autoplay
      ></video>
    );
  },
});

export default utils.installComponent(VideoPlayer, "video-player");
