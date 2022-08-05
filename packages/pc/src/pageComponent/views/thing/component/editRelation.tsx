import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import * as thingApis from "@/api/thingInstance";

export default defineComponent({
  props: {
    ele: Object,
  },
  setup(props, context) {
    watch(
      () => props.ele?.THING_CODE,
      async (value: any) => {
        const resTab1 = await thingApis.getTabs("a_2_z", props.ele?.THING_CODE);

        const resTab2 = await thingApis.getTabs("z_2_a", props.ele?.THING_CODE);
        // const resdata2 = await thingApis.getRelationA(
        //   props.ele?.ID,
        //   resTab2.data[0].athingCode
        // );
        tabs.value = [];
        resTab1.data.forEach((ele: any) => {
          tabs.value.push({
            type: 1,
            athingCode: ele.athingCode,
            zthingCode: ele.zthingCode,
            name: ele.relaName,
            key: ele.athingCode + ele.zthingCode,
          });
        });
        resTab2.data.forEach((ele: any) => {
          tabs.value.push({
            type: 2,
            athingCode: ele.athingCode,
            zthingCode: ele.zthingCode,
            name: ele.relaName,
            key: ele.athingCode + ele.zthingCode,
          });
        });
        if (tabs.value.length) {
          tabKey.value = tabs.value[0].key;
          getTableData(tabKey.value);
        }
      },
      {
        immediate: true,
      }
    );

    const getTableData = async (key: string) => {
      const tab = tabs.value.find((ele: any) => {
        return ele.key === key;
      });
      let res: any;
      if (tab.type === 1) {
        res = await thingApis.getRelationZ(props.ele?.ID, tab.zthingCode);
      } else {
        res = await thingApis.getRelationA(props.ele?.ID, tab.athingCode);
      }
      tableList.value = [];
      res.data.forEach((ele: any) => {
        tableList.value.push({
          id: ele.thingInst.id,
          name: ele.thingInst.name,
          code: ele.thingInst.code,
          objName: ele.thingInst.thing.name,
          objCode: ele.thingInst.thing.code,
        });
      });
    };

    const tabs = ref<any>([]);
    const tabKey = ref("");
    const columns = ref<any>([
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "编码",
        dataIndex: "code",
      },
      {
        title: "物规格名称",
        dataIndex: "objName",
      },
      {
        title: "物规格编码",
        dataIndex: "objCode",
      },
    ]);
    const tableList = ref([]);
    // 弹窗表格
    const selColumns = ref([]);
    const selTableList = ref([]);

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
              columns={selColumns.value}
              dataSource={selTableList.value}
              pagination={null}
            ></a-table>
          </a-modal>
        </div>
      );
    };
    return () => (
      <div>
        <div>
          <a-tabs
            v-model:activeKey={[tabKey.value, "activeKey"]}
            onChange={(key) => {
              getTableData(key);
            }}
          >
            {tabs.value.map((tab: any, index: number) => {
              return <a-tab-pane key={tab.key} tab={tab.name}></a-tab-pane>;
            })}
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
