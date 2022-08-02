import { defineComponent, onMounted, reactive, ref } from "vue";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  emits: ["fullType"],
  setup(props, context) {
    const sizeData: any = reactive({
      fullScreen: false,
    });
    const setWindowFullScreen = () => {
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
    };
    const windowExitFullScreen = () => {
      const docu: any = document;
      if (docu.exitFullscreen) {
        docu.exitFullscreen();
      } else if (docu.msExitFullscreen) {
        docu.msExitFullscreen();
      } else if (docu.mozCancelFullScreen) {
        docu.mozCancelFullScreen();
      } else if (docu.webkitCancelFullScreen) {
        docu.webkitCancelFullScreen();
      }
    };
    const setZoomType = () => {
      sizeData.fullScreen = !sizeData.fullScreen;
      context.emit("fullType", sizeData.fullScreen);
      if (sizeData.fullScreen) {
        setWindowFullScreen();
      } else {
        windowExitFullScreen();
      }
    };

    context.expose({
      sizeData,
    });
    return () => (
      <div class="zoom-min" onClick={() => setZoomType()}>
        {sizeData.fullScreen ? (
          <FullscreenExitOutlined class="icons" />
        ) : (
          <FullscreenOutlined class="icons" />
        )}
        <span class="text">
          {sizeData.fullScreen ? "缩小展示" : "全屏显示"}
        </span>
      </div>
    );
  },
});
