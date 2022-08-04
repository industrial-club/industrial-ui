import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import * as thingApis from "@/api/thingInstance";

export default defineComponent({
  props: {
    thingCode: String,
  },
  setup(props, context) {
    watch(
      () => props.thingCode,
      async (value: any) => {
        const res1 = thingApis.getTabs("a_2_z", props.thingCode!);
      },
      {
        immediate: true,
      }
    );
    // 弹窗表格
    const columns = ref([]);
    const tableList = ref([]);
    const tabKey = ref("1");
    const showModel = ref(false);
    const renderModal = () => {
      return (
        <div>
          <a-modal
            v-model={[showModel.value, "visible"]}
            title="关联物实例"
            class="thingRelationDia"
            width={600}
          >
            <div class="flex tools">
              <div class="inputs flex1">
                <div class="flex element">
                  <div class="name">类目</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
                <div class="flex element">
                  <div class="name">编码</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
                <div class="flex element">
                  <div class="name">名称</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
                <div class="flex element">
                  <div class="name">ID</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
              </div>
              <div class="btns">
                <div>
                  <a-button type="primary">搜索</a-button>
                </div>
                <div>
                  <a-button type="primary">重置</a-button>
                </div>
              </div>
            </div>
            <a-table
              rowKey="code"
              columns={columns.value}
              dataSource={tableList.value}
              pagination={null}
            ></a-table>
          </a-modal>
        </div>
      );
    };
    return () => (
      <div>
        <div>
          <a-tabs v-model:activeKey={[tabKey.value, "activeKey"]}>
            <a-tab-pane key="1" tab="系统包"></a-tab-pane>
            <a-tab-pane key="2" tab="系统大包"></a-tab-pane>
            <a-tab-pane key="3" tab="系统小包"></a-tab-pane>
          </a-tabs>
          <div class="tableTool">
            <a-button type="primary">新建</a-button>
            <a-button>删除</a-button>
          </div>
          <a-table
            rowKey="code"
            columns={columns.value}
            dataSource={tableList.value}
            pagination={null}
            v-slots={{
              action: (row: any) => {
                return (
                  <a-space>
                    <a
                      onClick={() => {
                        // updateModal(row);
                      }}
                    >
                      编辑
                    </a>
                    <span
                      class="red pointer"
                      onClick={() => {
                        //   deleteThing(row);
                      }}
                    >
                      删除
                    </span>
                  </a-space>
                );
              },
            }}
          ></a-table>
        </div>
        {renderModal()}
      </div>
    );
  },
});
