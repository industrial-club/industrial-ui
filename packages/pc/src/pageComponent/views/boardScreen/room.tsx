import { defineComponent, PropType, ref, watch } from "vue";
import Card1Outer from "@/pageComponent/components/boardScreen/Card1Outer";
import PowerCut from "@/pageComponent/components/boardScreen/PowerCut";
import PowerSupply from "@/pageComponent/components/boardScreen/PowerSupply";

const props = {
  roomData: {
    type: Object as PropType<any>,
  },
  powerData: {
    type: Array as PropType<Array<any>>,
    default: [],
  },
};

// const tabConfig = [
//   {
//     name: "待停电",
//     key: "powersupply_off_execute",
//     componentName: "power-cut",
//   },
//   {
//     name: "待送电",
//     key: "powersupply_on_execute",
//     componentName: "power-supply",
//   },
// ];

export default defineComponent({
  name: "Room",
  components: {
    Card1Outer,
    PowerCut,
    PowerSupply,
  },
  props,
  setup(this, _props, _ctx) {
    const roomData = ref<any>({});
    const powerData = ref<Array<any>>([]);
    const roomChange = () => {
      _ctx.emit("roomChange");
    };
    // const rowChange = () => {
    //   _ctx.emit("rowChange");
    // };
    watch(
      () => _props.roomData,
      (e) => {
        if (e) {
          roomData.value = e;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      () => _props.powerData,
      (e) => {
        if (e) {
          powerData.value = e;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <div class="room">
        <div class="room-header">
          <card1-outer
            v-slots={{
              header: () => (
                <div class="select-header">
                  <div class="select-active-bar">
                    <div class="select-item">
                      <a-select
                        v-model={[roomData.value.roomValue, "value"]}
                        dropdownClassName="screen-select"
                        bordered={false}
                        onChange={roomChange}
                        style={{ width: "70%" }}
                        v-slots={{
                          suffixIcon: () => <caret-down-outlined />,
                        }}
                      >
                        {roomData.value.roomOptions?.map((item) => (
                          <a-select-option value={item.roomId}>
                            {item.name}
                          </a-select-option>
                        ))}
                      </a-select>
                    </div>
                    {/* <div class="select-item">
                      <a-select
                        v-model={[roomData.value.rowValue, "value"]}
                        dropdownClassName="screen-select"
                        onChange={rowChange}
                      >
                        {roomData.value.rowOptions?.map((item) => (
                          <a-select-option value={item.value}>
                            {item.name}
                          </a-select-option>
                        ))}
                      </a-select>
                    </div> */}
                  </div>
                </div>
              ),
            }}
          ></card1-outer>
        </div>
        {powerData.value.length > 0 && (
          <div class="room-content">
            <div class="room-content-panel">
              {powerData.value.map((item) => (
                <div
                  class={[
                    "room-content-panel-item",
                    roomData.value.rowValue === item.row
                      ? "room-content-panel-item-active"
                      : "",
                  ]}
                  onClick={() => {
                    roomData.value.rowValue = item.row;
                    _ctx.emit("rowChange");
                  }}
                >
                  <div class="room-content-panel-item-title">
                    第{item.row}排/配电柜{item.cabinetListDtos.length}列:
                    控制回路 共{item.loopTotal}个
                  </div>
                  <div class="room-content-panel-item-content">
                    <div class="room-content-panel-item-content-state">
                      <div class="room-content-panel-item-content-state-col">
                        <span class="green"></span>
                        分闸
                      </div>
                      {item.openTotal}
                    </div>
                    <div class="room-content-panel-item-content-state">
                      <img
                        src="/micro-assets/platform-web/breakBrakePadlock.png"
                        alt=""
                      />
                      {item.lockTotal}
                    </div>
                    <div class="room-content-panel-item-content-state">
                      <div class="room-content-panel-item-content-state-col">
                        <span class="white"></span>
                        断连
                      </div>
                      {item.disconnectionTotal}
                    </div>
                    <div class="room-content-panel-item-content-state">
                      <div class="room-content-panel-item-content-state-col">
                        <span class="red"></span>
                        合闸
                      </div>
                      {item.closeTotal}
                    </div>
                    <div class="room-content-panel-item-content-state">
                      <div class="room-content-panel-item-content-state-col">
                        <span class="grey"></span>
                        备用
                      </div>
                      {item.reserveTotal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
});
