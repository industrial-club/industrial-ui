import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  watch,
} from "vue";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue";
import { WebRtcMt } from "../utils/video";
import videoApi from "@/api/video";

export default defineComponent({
  props: {
    teams: {
      default: () => [],
    },
  },
  setup(props, context) {
    const players: any[] = []; // 正在播放的视频MAP
    let currentIndex = -1; // 正在播放组index
    let interval: ReturnType<typeof setInterval>;
    const data = reactive({
      pointList: [] as any[],
      showType: "type8",
      fullScreen: false,
    });
    let videoList: any[] = [];
    onMounted(async () => {
      const doc: any = document;
      window.onresize = () => {
        if (!doc.webkitIsFullScreen) {
          data.fullScreen = false;
        }
      };
    });
    onBeforeUnmount(() => {
      clearInterval(interval);
      players.forEach((play: any) => {
        play?.stopPlay();
        play = null;
      });
    });
    const playVideo = (video: any, id: any) => {
      const { channel, streamType } = video;
      let url = video.webrtcTemplateMerged;
      url = url.replaceAll("${channel}", channel);
      url = url.replaceAll("${streamType}", streamType);
      players.push(
        new WebRtcMt({
          plays: {
            videoElm: id,
            mediaServerAddr: video.mediaServerPo.url,
            cameraUserName: video.user,
            cameraPwd: video.pass,
            cameraIp: video.ip,
            cameraRtspPort: video.rtspPort,
            cameraChannel: video.channel,
            cameraStream: video.streamType,
            addRtspProxyUrl: url,
          },
        })
      );
    };
    const setCurrentVideos = (team: any) => {
      data.showType = `type${team.amount}`;
      data.pointList.length = 0;
      for (let i = 0; i < parseInt(team.amount, 10); i++) {
        const video = team.monitorPointPoList[i];
        const videoDetail = videoList.find(
          (ele: any) => ele.uuid === video?.cameraUuid
        );
        data.pointList.push(videoDetail || {});
        if (videoDetail) {
          playVideo(videoDetail, `video${i}`);
        }
      }
    };

    const findShouldPlay = () => {
      let resTeam: any = props.teams[0];
      for (let index = 0; index < props.teams.length; index++) {
        const team: any = props.teams[index];
        if (team.enabled === "1" && index > currentIndex) {
          resTeam = team;
          currentIndex = index;
          break;
        }
      }
      return resTeam;
    };
    const startRotation = () => {
      clearInterval(interval);
      players.forEach((play: any) => {
        play?.stopPlay();
        play = null;
      });

      const team: any = findShouldPlay();
      if (team) {
        setCurrentVideos(team);
      }
      interval = setInterval(
        startRotation,
        parseInt(team.pollingInterval, 10) * 1000
      );
    };
    watch(
      () => props.teams,
      async (val) => {
        if (!videoList.length) {
          const $: any = await videoApi.getVideoList({
            pageNo: 1,
            pageSize: 999,
          });
          $.data.list.forEach((video: any) => {
            if (video.mediaServerPo.$ref) {
              video.mediaServerPo = eval(video.mediaServerPo.$ref);
            }
          });
          videoList = $.data.list;
        }
        currentIndex = -1;
        startRotation();
      },
      {
        deep: true,
      }
    );
    return () => (
      <div class="playVideos">
        <div class="operation">
          <div
            class="btn"
            onClick={(e: any) => {
              data.fullScreen = true;
              const docElm: any = document.documentElement;
              if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
              } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
              } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
              } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
              }
            }}
          >
            <FullscreenOutlined class="icons" />
            全屏显示
          </div>
        </div>
        <div
          id="grid"
          class={["grid", data.showType, data.fullScreen ? "full" : ""]}
        >
          {data.pointList.map((item: any, index: number) => {
            return (
              <video id={`video${index}`} class="video" muted autoplay></video>
            );
          })}
        </div>
      </div>
    );
  },
});
