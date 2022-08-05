import {
  defineComponent,
  PropType,
  ref,
  getCurrentInstance,
  computed,
  watch,
  nextTick,
  onMounted,
} from "vue";
import renderCabinet from "@/pageComponent/components/pss-cabinet/cabinetRender";
import Card2Outer from "@/pageComponent/components/boardScreen/Card2Outer";
import PopBox from "@/pageComponent/components/boardScreen/PopBox";

const props = {
  tupuData: {
    type: Object as PropType<any>,
  },
  tupuState: String,
  setCamera: Boolean,
};

export default defineComponent({
  components: {
    Card2Outer,
    PopBox,
  },
  props,
  setup(this, _props, _ctx) {
    const visible = ref(false);
    const loopInfo = ref<any>({});
    const point = ref({
      x: 0,
      y: 0,
    });
    let cabinet: any | null;
    const { proxy } = getCurrentInstance() as any;
    const tupuId = computed(() => {
      return `tupu-canvas-${proxy._.uid}`;
    });
    watch(
      () => _props.tupuData,
      (e) => {
        visible.value = false;

        nextTick(() => {
          const obj = {
            data: _props.tupuData,
            renderState: _props.tupuState as any,
          };
          if (!cabinet) {
            cabinet = new renderCabinet({
              domId: tupuId.value,
              ...obj,
            });
          } else {
            cabinet.setData(obj.data, obj.renderState);
          }

          if (_props.setCamera) {
            if (_props.tupuState === "group") {
              cabinet.moveCamera(
                [-808.2474023763542, 878.9056431567024, 429.75276695939766],
                [
                  21.279428160225734, -0.000017447926552449644,
                  -237.51014124864875,
                ],
                true
              );
            } else {
              cabinet.moveCamera(
                [-7.724165160503688, 164.98333183431518, 664.9434884712],
                [-10.705888481503514, 156.74101560047455, -269.40426442260787],
                true
              );
            }
          }
        });
      },
      {
        deep: true,
        immediate: true,
      }
    );
    watch(
      () => visible.value,
      (e) => {
        if (!visible.value) {
          loopInfo.value = {};
        }
      }
    );
    onMounted(() => {
      init();
    });
    const init = () => {
      new ht.DataModel();
      (window as any).cabinetLoopClick = loopClick;
      (window as any).rowClick = rowClick;

      nextTick(() => {
        const tupuCanvas = document.getElementById(tupuId.value);

        tupuCanvas!.onmousedown = () => {
          visible.value = false;
        };

        tupuCanvas!.onwheel = () => {
          visible.value = false;
        };
      });
    };
    const rowClick = (rowId: string) => {
      rowId = rowId.match(/\d+/)?.[0] || "";
      visible.value = false;
      _ctx.emit("rowClick", Number(rowId));
    };

    const loopClick = (event: MouseEvent, loopId: any) => {
      const info = JSON.parse(loopId);
      const { x, y } = event;

      point.value = {
        x,
        y,
      };
      visible.value = true;
      loopInfo.value = info;
    };
    return () => (
      <div class="tupu">
        <div class="tupu-3d-content">
          <div id={tupuId.value} class="tupu-canvas"></div>
        </div>
        <pop-box
          v-model={[visible.value, "visible"]}
          loopInfo={loopInfo.value}
          point={point.value}
        />
      </div>
    );
  },
});
