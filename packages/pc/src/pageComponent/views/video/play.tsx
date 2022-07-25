import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { login as Login } from "@/utils/publicUtil";
import socket from "./utils/webSocket";
import "./assets/styles/play.less";
import PlayVideos from "./components/videoPlayer";

import utils from "@/utils";

const loginUtil = new Login();

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const route = useRoute();
    // 相机id列表(默认携带)
    // 模式code
    const {
      modeCode,
      groupCode,
      cameraUuids,
      splicingId: layoutCount,
    } = route.query as any;

    // 视频播放列表
    const playList = ref<any[]>([]);

    // 初始化播放列表
    onMounted(() => {
      const cameraUuidsList = cameraUuids.split(",");
      const groupCodeList = groupCode.split(",");
      cameraUuidsList.forEach((item: any, index: number) => {
        playList.value.push({
          layout: Number(groupCodeList[index]),
          uuid: item,
        });
      });
    });

    onMounted(() => {
      // 通过socket接收播放列表变化
      if (modeCode) {
        socket.initSocket(
          `http://${window.location.host}`,
          `/vmsWebsocket/associatedWebSocket/${modeCode}`,
          5000,
          "1",
          (data) => {
            if (data === 1 || !data?.list) return;
            playList.value = data.list.map((item: any) => ({
              layout: Number(item.posId),
              uuid: item.cameraUuid,
            }));
          },
          (e) => {
            //
          }
        );
      }
    });
    onBeforeUnmount(socket.closeSocket);

    // 刷新token
    const timer = setInterval(() => {
      loginUtil.refreshToken();
    }, 1000 * 60 * 5);
    onBeforeUnmount(() => {
      timer && clearInterval(timer);
    });

    return {
      layoutCount: Number(layoutCount),
      playList,
    };
  },
  render() {
    return (
      <div class="play">
        <div class={["layout", `layout${this.layoutCount}`]}>
          {Array.from({ length: this.layoutCount }).map((_, index) => {
            const play = this.playList.find(
              (item: any) => item.layout === index + 1
            );
            return (
              <div class="layout-item">
                <div class={["camera", `camera${index + 1}`]}>
                  {play ? (
                    <PlayVideos key={play.uuid} cameraUuid={play.uuid} />
                  ) : (
                    <div class="layout-item placeholder"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-play");
