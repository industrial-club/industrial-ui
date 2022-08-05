import { defineComponent, nextTick, PropType, ref, watch } from "vue";
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
  loopInfo: {
    type: Object as PropType<any>,
    default: {},
  },
};

export default defineComponent({
  components: {
    Card2Outer,
  },
  props,
  setup(this, _props, _ctx) {
    const pathD = ref("");
    const cabinetName = ref("");
    const index = ref(0);
    const offset = ref({
      x: 0,
      y: 92,
    });
    const list = ref<any>([]);
    watch(
      () => _props.loopInfo,
      (e) => {
        if (e && _props.visible) {
          console.log(e);
          getData();
          list.value = e.loopIds;
          cabinetName.value = e.cabinetName;
          index.value = e.index;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    const closePop = () => {
      _ctx.emit("update:visible", false);
    };
    const setLinePath = () => {
      nextTick(() => {
        const popBox: any = document.getElementById("popBox");
        if (popBox && popBox.getBoundingClientRect) {
          const { left, top } = popBox.getBoundingClientRect();

          const line1 = `L${left + offset.value.x} ${_props.point.y}`;
          // const line2 = `L${left + offset.value.x} ${top}`;

          pathD.value = `M${_props.point.x} ${_props.point.y} ${line1}`;
          console.log(pathD.value);
        }
      });
    };
    const getBrandData = async (loopId) => {
      const res = await getloopDetail(loopId);
      return (
        <>
          {res.data.length > 0 &&
            res.data.map((item) => (
              <a-row class="card2-outer-content-panel-table-body">
                <a-col
                  span={18}
                  style={{
                    background: "rgba(158, 183, 234, 0.1)",
                  }}
                >
                  <a-row gutter={24}>
                    <a-col span={8} style={{ textAlign: "center" }}>
                      {item.applyUser}
                    </a-col>
                    <a-col span={8} style={{ textAlign: "center" }}>
                      <img
                        src="/micro-assets/platform-web/breakBrakePadlock.png"
                        style={{ width: "13px" }}
                        alt=""
                      />
                    </a-col>
                    <a-col span={8} style={{ textAlign: "center" }}>
                      {item.operationUser}
                    </a-col>
                  </a-row>
                </a-col>
                <a-col
                  span={5}
                  offset={1}
                  style={{
                    textAlign: "center",
                    background: "rgba(158, 183, 234, 0.2)",
                  }}
                >
                  {item.taskStatus}
                </a-col>
              </a-row>
            ))}
        </>
      );
    };
    const statusEle = (status) => {
      switch (status) {
        case 0 || "0":
          return (
            <div class="card2-outer-content-panel-content-state-col">
              <span class="green"></span>
              分闸
            </div>
          );
          break;

        default:
          return null;
          break;
      }
    };
    const getData = () => {
      pathD.value = "";
      setLinePath();
    };
    return () => (
      <>
        {_props.visible ? (
          <div class="pop-box" id="popBox">
            <div class="path-line">
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
            </div>
            <div class="close-btn" onClick={closePop}>
              <img
                src="/micro-assets/platform-web/close.png"
                style={{ width: "24px" }}
                alt=""
              />
            </div>
            <div class="pop-box-title">
              挂锁信息-{cabinetName.value}配电柜/第{index.value}个抽屉
            </div>
            <div class="board-list">
              {list.value?.map((item) => (
                <div class="board-item">
                  <card2-outer
                    title={item.name}
                    v-slots={{
                      content: () => (
                        <div class="card2-outer-content-panel">
                          <div class="card2-outer-content-panel-content">
                            <div class="card2-outer-content-panel-content-state">
                              {statusEle(item.status)}
                            </div>
                            <div class="card2-outer-content-panel-content-state">
                              <img
                                src="/micro-assets/platform-web/breakBrakePadlock.png"
                                alt=""
                              />
                              {item.lockCount}
                            </div>
                          </div>
                          <div class="card2-outer-content-panel-table">
                            <a-row class="card2-outer-content-panel-table-header">
                              <a-col
                                span={18}
                                class="card2-outer-content-panel-table-header-info"
                              >
                                <a-row gutter={24}>
                                  <a-col
                                    span={8}
                                    style={{ textAlign: "center" }}
                                  >
                                    申请人
                                  </a-col>
                                  <a-col
                                    span={8}
                                    style={{ textAlign: "center" }}
                                  >
                                    挂锁
                                  </a-col>
                                  <a-col
                                    span={8}
                                    style={{ textAlign: "center" }}
                                  >
                                    当前操作人
                                  </a-col>
                                </a-row>
                              </a-col>
                              <a-col
                                span={5}
                                offset={1}
                                class="card2-outer-content-panel-table-header-state"
                              >
                                当前状态
                              </a-col>
                            </a-row>
                            {getBrandData(item.id)}
                            <div class="line">
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      ),
                    }}
                  ></card2-outer>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </>
    );
  },
});
