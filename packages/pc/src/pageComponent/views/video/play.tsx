import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import socket from "./utils/webSocket";
import "./assets/styles/play.less";
import PlayVideos from "./components/videoPlayer";

import utils from "@/utils";

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
    const cameraUuids = ref(
      (route.query.uuid as string | undefined)?.split(",") ?? []
    );
    // 模式code
    const { modeCode } = route.query;

    onMounted(() => {
      if (modeCode) {
        // ws = new WebSocket(
        //   `ws://${window.location.host}/api/vms/v1/associatedWebSocket/${modeCode}`,
        // );
        // ws.onmessage = ({ data }) => {
        //   const camaraList = JSON.parse(data).list;
        //   cameraUuids.value = camaraList.map((item: any) => item.cameraUuid);
        // };
        socket.initSocket(
          `http://${window.location.host}`,
          `/vmsWebsocket/associatedWebSocket/${modeCode}`,
          5000,
          "1",
          (data) => {
            if (data === 1) return;
            const camaraList = data.list;
            cameraUuids.value = camaraList.map((item: any) => item.cameraUuid);
          },
          (e) => {
            //
          }
        );
      }
    });
    onBeforeUnmount(socket.closeSocket);

    return {
      cameraUuids,
    };
  },
  render() {
    return (
      <div class="play">
        {this.cameraUuids?.length ? (
          <div class={["layout", `layout${this.cameraUuids.length}`]}>
            {this.cameraUuids.map((item, index) => (
              <div key={item} class={["camera", `camera${index + 1}`]}>
                {item ? (
                  <PlayVideos key={item} cameraUuid={item} />
                ) : (
                  <div class="placeholder"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <a-empty description="视频列表为空"></a-empty>
        )}
      </div>
    );
  },
});

export default utils.installComponent(com, "video-play");
