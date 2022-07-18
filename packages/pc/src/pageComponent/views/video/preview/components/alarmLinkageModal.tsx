import { defineComponent, PropType, ref, watch } from "vue";
import videoPlayer from "../../components/videoPlayer";
import { videoInfo } from "../../components/videoPlayer/util/byUuid";

const props = {
  visible: {
    type: Boolean,
    default: false,
  },
  camera: {
    type: Object as PropType<videoInfo>,
  },
  titleName: String,
};
export default defineComponent({
  name: "AlarmLinkageModal",
  components: {
    videoPlayer,
  },
  props,
  emits: ["update:visible"],
  setup(_props, { emit }) {
    const visible = ref(false);
    const camera = ref({});
    watch(
      () => _props.visible,
      (e) => {
        visible.value = e;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => _props.camera,
      (e) => {
        if (e) {
          camera.value = e;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <a-modal
        v-model={[visible.value, "visible"]}
        wrapClassName="alarmLinkageModal"
        title={_props.titleName}
        footer={null}
        width="70%"
        centered
        onCancel={() => {
          emit("update:visible", false);
        }}
      >
        <videoPlayer camera={camera.value}></videoPlayer>
      </a-modal>
    );
  },
});
