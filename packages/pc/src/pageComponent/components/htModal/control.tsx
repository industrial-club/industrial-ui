import { defineComponent, ref } from "vue";

const props = {
  isBelt: Boolean,
};
export default defineComponent({
  name: "Control",
  props,
  setup(_props, _ctx) {
    const formState = ref({
      equipmentControl: "",
      feedingMode: "",
      unloadingMode: "",
      programStart: false,
      suspend: false,
      faultReset: false,
    });
    const btnList = ref([
      {
        name: "压紧",
        v: false,
      },
      {
        name: "进料",
        v: false,
      },
      {
        name: "压榨",
        v: false,
      },
      {
        name: "吹风",
        v: false,
      },
      {
        name: "循环等待",
        v: false,
      },
      {
        name: "松开",
        v: false,
      },
      {
        name: "止销上移",
        v: false,
      },
      {
        name: "一次拉板",
        v: false,
      },
      {
        name: "二次拉板",
        v: false,
      },
      {
        name: "三次拉板",
        v: false,
      },
      {
        name: "合板",
        v: false,
      },
      {
        name: "止销下移",
        v: false,
      },
    ]);
    const camera = {
      user: "admin",
      mediaServerPo: {
        url: "http://192.168.5.43:10880",
      },
      pass: "zg123456",
      rtspPort: 554,
      ip: "172.16.110.19",
      channel: "1",
      streamType: "0",
    };
    return () => (
      <div class="control">
        <div class="control-left">
          {_props.isBelt ? (
            <a-form model={formState.value}>
              <a-form-item label="设备控制">
                <a-radio-group
                  style={{ width: "100%" }}
                  v-model={[formState.value.equipmentControl, "value"]}
                  button-style="solid"
                >
                  <a-radio-button value="0">自动</a-radio-button>
                  <a-radio-button value="1">手动</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-form>
          ) : (
            <a-form model={formState.value}>
              <a-form-item label="设备控制">
                <a-radio-group
                  style={{ width: "100%" }}
                  v-model={[formState.value.equipmentControl, "value"]}
                  button-style="solid"
                >
                  <a-radio-button value="0">自动</a-radio-button>
                  <a-radio-button value="1">手动</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="进料模式">
                <a-radio-group
                  style={{ width: "100%" }}
                  v-model={[formState.value.feedingMode, "value"]}
                  button-style="solid"
                >
                  <a-radio-button value="0">智能</a-radio-button>
                  <a-radio-button value="1">手动</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="卸料模式">
                <a-radio-group
                  style={{ width: "100%" }}
                  v-model={[formState.value.unloadingMode, "value"]}
                  button-style="solid"
                >
                  <a-radio-button value="0">智能</a-radio-button>
                  <a-radio-button value="1">手动</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item>
                <a-button
                  type={formState.value.programStart ? "primary" : ""}
                  onClick={() => {
                    formState.value.programStart =
                      !formState.value.programStart;
                  }}
                  style={{ width: "100%" }}
                >
                  程序启动
                </a-button>
              </a-form-item>
              <a-form-item>
                <a-button
                  type={formState.value.suspend ? "primary" : ""}
                  onClick={() => {
                    formState.value.suspend = !formState.value.suspend;
                  }}
                  style={{ width: "100%" }}
                >
                  暂停
                </a-button>
              </a-form-item>
              <a-form-item>
                <a-button
                  type={formState.value.faultReset ? "primary" : ""}
                  onClick={() => {
                    formState.value.faultReset = !formState.value.faultReset;
                  }}
                  style={{ width: "100%" }}
                >
                  故障复位
                </a-button>
              </a-form-item>
            </a-form>
          )}
        </div>
        <div class="control-right">
          {_props.isBelt ? (
            <inl-video-player camera={camera}></inl-video-player>
          ) : (
            <>
              <div class="control-right-title">手动操作</div>
              <div class="control-right-content">
                {btnList.value.map((item) => (
                  <div>
                    <a-button
                      type={item.v ? "primary" : ""}
                      onClick={() => {
                        item.v = !item.v;
                      }}
                    >
                      {item.name}
                    </a-button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
});
