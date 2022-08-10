import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from "vue";
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

    const videoInfo = ref<videoInfo>({});

    // 停止播放
    const stopPlay = () => {
      if (play) {
        play.stopPlay(`videoPlayer${timer}`);
      }
    };

    // 初始化视频
    const init = () => {
      play = null;
      const camera = videoInfo.value;
      const { channel, streamType } = camera;
      let url = camera.webrtcTemplateMerged;
      url = (url as string).replaceAll("${channel}", channel as string);
      url = (url as string).replaceAll("${streamType}", streamType as string);
      play = new WebRtcMt({
        plays: {
          videoElm: `videoPlayer${timer}`,
          mediaServerAddr: (camera.mediaServerPo as videoInfo).url as string,
          cameraUserName: camera.user as string,
          cameraPwd: camera.pass as string,
          cameraIp: camera.ip as string,
          cameraRtspPort: camera.rtspPort as string,
          cameraChannel: camera.channel as string,
          cameraStream: camera.streamType as string,
          addRtspProxyUrl: url,
        },
      });
    };

    const stopV = (id: string) => {
      const videoElement: any = document.getElementById(id);
      videoElement.pause();
      videoElement.removeAttribute("src"); // empty source
      videoElement.load();
    };

    const timer = setInterval(() => {
      stopPlay();
      stopV(`videoPlayer${timer}`);
      init();
    }, 3600000);

    // 播放信息变化初始化视频
    watch(
      () => _prop.camera,
      async (e) => {
        stopPlay();
        if (e && typeof e === "object") {
          init();
        } else if (e && typeof e === "string") {
          const res = await api.getCameraByUuid(e as string);
          if (res.data) {
            videoInfo.value = res.data;
            init();
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    // 页面销毁时停止播放视频流
    onUnmounted(() => {
      stopPlay();
      clearInterval(timer);
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
