import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  PropType,
  ref,
  watch,
} from "vue";
import dayjs from "dayjs";
import lodash from "lodash";
import Card2Outer from "@/pageComponent/components/boardScreen/Card2Outer";
import { message } from "ant-design-vue";
import { getloopDetail } from "@/api/boardScreen/powersupply";

const props = {
  point: {
    type: Object as PropType<any>,
    default: {
      x: 0,
      y: 0,
    },
  },
  visible: Boolean,
  loopId: String,
};

export default defineComponent({
  components: {
    Card2Outer,
  },
  props,
  setup(this, _props, _ctx) {
    const pathD = ref("");
    const offset = ref({
      x: 64,
      y: 92,
    });
    const list = ref([]);
    watch(
      () => _props.loopId,
      (e) => {
        console.log(_props.visible);
        if (e && _props.visible) {
          getData();
        }
      },
      {
        immediate: true,
      }
    );
    const closePop = () => {
      _ctx.emit("update:visible", false);
    };
    const setLinePath = () => {
      const { proxy } = getCurrentInstance() as any;
      nextTick(() => {
        const popBox: any = proxy.$el;

        if (popBox && popBox.getBoundingClientRect) {
          const { left, top } = popBox.getBoundingClientRect();

          const line1 = `L${left + offset.value.x} ${_props.point.y}`;
          const line2 = `L${left + offset.value.x} ${top}`;

          pathD.value = `M${_props.point.x} ${_props.point.y} ${line1} ${line2}`;
        }
      });
    };
    const getBrandData = async () => {
      list.value = [];
      const res = await getloopDetail(_props.loopId);
      if (res) {
        list.value = ((res as any).records || []).map((item) => {
          if (item.record) {
            const poweroffDate = item.record.poweroffDate;
            item.record.time = poweroffDate
              ? dayjs(poweroffDate).format("YYYY.MM.DD HH:mm")
              : "-";
          }

          return {
            ...item,
          };
        });
        setLinePath();
      }
    };
    const getData = () => {
      pathD.value = "";
      getBrandData();
    };
    return () => (
      <>
        {_props.visible ? (
          <div class="pop-box">
            {/* <div class="path-line">
              <svg
                width="100%"
                height="100%"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={pathD.value}
                  stroke-dasharray="5,5"
                  style="fill: transparent; stroke-width: 1.5; stroke: #fff;"
                />
              </svg>
            </div> */}
            <div class="close-btn" onClick={closePop}>
              <img
                src="/micro-assets/platform-web/close.png"
                style={{ width: "24px" }}
                alt=""
              />
            </div>
            <div class="board-list">
              {list.value?.map((item, index) => (
                <div class="board-item">
                  <card2-outer title={`挂锁/牌 ${index + 1}`}>
                    <a-row gutter={[0, 6]}>
                      <a-col span={24}>
                        回路名称：{lodash.get(item, "record.loopName")}
                      </a-col>
                      <a-col span={12}>
                        停送电状态：{lodash.get(item, "record.progress")}
                      </a-col>
                      <a-col span={12}>
                        停电申请人：{lodash.get(item, "record.applyUserName")}
                      </a-col>
                      <a-col span={12}>
                        挂锁/牌操作人：
                        {lodash.get(item, "record.poweroffUserName")}
                      </a-col>
                      <a-col span={12}>
                        挂锁/牌时间：{lodash.get(item, "record.time")}
                      </a-col>
                      <a-col span={12}>
                        {lodash.get(item, "nearestOnPO.msg") || "距送电："}
                      </a-col>
                      <a-col span={12}>
                        停电原因：{lodash.get(item, "record.powerOffCause")}
                      </a-col>
                    </a-row>
                  </card2-outer>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </>
    );
  },
});
