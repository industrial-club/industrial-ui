import { defineComponent, onMounted, onUnmounted, PropType, watch } from "vue";
import { getByUuid, videoInfo } from "./util/byUuid";
import { WebRtcMt } from "./util/video";

const props = {
  // 视频信息
  camera: {
    type: Object as PropType<videoInfo>,
  },
  // 视频uuid
  cameraUuid: String,
};
const VideoPlayer = defineComponent({
  name: "VideoPlayer",
  props,
  setup(_prop, _context) {
    const randomId = Math.floor(Math.random() * 10 ** 16);
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
          videoElm: `videoPlayer${randomId}`,
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
    // 停止播放
    const stopPlay = () => {
      if (play) {
        play.stopPlay(`videoPlayer${randomId}`);
      }
    };
    // 播放 uuid 变化, 获取播放信息, 初始化视频
    watch(
      () => _prop.cameraUuid,
      async (e) => {
        if (e) {
          const res = await getByUuid(e);
          if (res.data) {
            init(res.data);
          }
        }
      },
      {
        immediate: true,
      }
    );

    // 播放信息变化初始化视频
    watch(
      () => _prop.camera,
      (e) => {
        if (e) {
          stopPlay();
          init(e);
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
    });
    return () => (
      <video
        id={`videoPlayer${randomId}`}
        style="height:100%;width:100%;position: relative;background-color: #000000;"
        muted
        autoplay
      ></video>
    );
  },
});
export default VideoPlayer;
