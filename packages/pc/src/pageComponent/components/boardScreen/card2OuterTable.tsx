import { getloopDetail } from "@/api/boardScreen/powersupply";
import { defineComponent, onMounted, PropType, ref } from "vue";

const props = {
  id: String,
};

export default defineComponent({
  name: "Card2OuterTable",
  props,
  setup(this, _props, ctx) {
    const data = ref<any>([]);
    const getBrandData = async () => {
      const res = await getloopDetail(_props.id);
      data.value = res.data;
    };
    onMounted(() => {
      getBrandData();
    });
    return () => (
      <div class="card2-outer-content-panel-table">
        {data.value.length > 0 ? (
          <>
            <a-row class="card2-outer-content-panel-table-header">
              <a-col
                span={18}
                class="card2-outer-content-panel-table-header-info"
              >
                <a-row>
                  <a-col span={8} style={{ textAlign: "center" }}>
                    申请人
                  </a-col>
                  <a-col span={8} style={{ textAlign: "center" }}>
                    挂锁
                  </a-col>
                  <a-col span={8} style={{ textAlign: "center" }}>
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
            {data.value.map((item) => (
              <>
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
                <div class="line">
                  <span></span>
                  <span></span>
                </div>
              </>
            ))}
          </>
        ) : null}
      </div>
    );
  },
});
