import { computed, defineComponent, PropType, ref } from "vue";
import { getVideoBaseUrl } from "@/pageComponent/api/alarm/alarmRecord";

import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";

export interface IVideo {
  cameraUuid: string;
  streamUuid: string;
  drSec: number;
  relatedPath: string;
  id: number;
}

/**
 * 视频播放组件(多个视频)
 */
const VideoPlay = defineComponent({
  props: {
    videoList: {
      type: Object as PropType<{ [key: string]: IVideo }>,
      default: {},
    },
  },
  setup(props, { emit }) {
    const CarouselRef = ref();

    const baseUrl = ref("");
    const getBaseUrl = async () => {
      const ip = await getVideoBaseUrl();
      baseUrl.value = ip;
    };
    getBaseUrl();

    const videoObjList = computed(() => Object.values(props.videoList));

    // url列表
    const urlList = computed(() => {
      if (!baseUrl.value) return [];
      return videoObjList.value.map(
        (item) => `${baseUrl.value}${item.relatedPath}`
      );
    });

    return {
      urlList,
      CarouselRef,
    };
  },
  render() {
    return (
      <div class="video-play">
        {/* 视频 */}
        {this.urlList.length ? (
          <div class="container">
            <a-carousel ref="CarouselRef">
              {this.urlList.map((item) => (
                <video key={item} autoplay muted loop src={item}></video>
              ))}
            </a-carousel>
            <button
              class="btn btn-prev"
              onClick={() => (this.$refs.CarouselRef as any).prev()}
            >
              <LeftOutlined style={{ fontSize: "20px" }} />
            </button>
            <button
              class="btn btn-next"
              onClick={() => (this.$refs.CarouselRef as any).next()}
            >
              <RightOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
        ) : (
          <a-empty description="暂无视频" />
        )}
      </div>
    );
  },
});

export default VideoPlay;
