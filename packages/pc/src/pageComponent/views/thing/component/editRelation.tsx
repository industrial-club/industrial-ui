import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import * as thingApis from "@/api/thingInstance";
import { message } from "ant-design-vue";

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

        tabs.value = [];
        for (const key in resTab1.data) {
          const ele = resTab1.data[key];
          tabs.value.push({
            type: 1,
            name: ele[0].relaName,
            relaClass: ele[0].relaClass,
            key: ele[0].athingCode + ele[0].zthingCode,
            arr: ele,
          });
        }
        for (const key in resTab2.data) {
          const ele = resTab2.data[key];
          tabs.value.push({
            type: 2,
            name: ele[0].relaName,
            relaClass: ele[0].relaClass,
            key: ele[0].athingCode + ele[0].zthingCode,
            arr: ele,
          });
        }

        // resTab1.data.forEach((ele: any) => {
        //   tabs.value.push({
        //     type: 1,
        //     athingCode: ele.athingCode,
        //     zthingCode: ele.zthingCode,
        //     name: ele.relaName,
        //     key: ele.athingCode + ele.zthingCode,
        //   });
        // });
        // resTab2.data.forEach((ele: any) => {
        //   tabs.value.push({
        //     type: 2,
        //     athingCode: ele.athingCode,
        //     zthingCode: ele.zthingCode,
        //     name: ele.relaName,
        //     key: ele.athingCode + ele.zthingCode,
        //   });
        // });

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
        res = await thingApis.getRelationZ(props.ele?.ID, tab.relaClass);
      } else {
        res = await thingApis.getRelationA(props.ele?.ID, tab.relaClass);
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
    const resetOption = () => {
      modelOption.value.forEach((ele) => {
        ele.value = "";
        ele.operation = "";
      });
      getModalData();
    };
    const getModalData = async () => {
      const param: any = {};
      param.wherePojoList = [];
      modelOption.value.forEach((ele: any) => {
        if (ele.value) {
          param.wherePojoList.push({
            column: ele.columnName,
            operation: ele.operation,
            valueList: [ele.value],
          });
        }
      });
      param.thingCodeList = [];
      const tab = tabs.value.find((ele: any) => {
        return ele.key === tabKey.value;
      });
      tab.arr.forEach((ele: any) => {
        if (ele.type === 1) {
          param.thingCodeList.push(ele.zthingCode);
        } else {
          param.thingCodeList.push(ele.athingCode);
        }
      });
      const res = await thingApis.findThingByParams(param);
      modalTableList.value = [];

      res.data.forEach((ele: any) => {
        const have = tableList.value.find((exist: any) => {
          return exist.id === ele.id;
        });
        if (!have) {
          modalTableList.value.push({
            id: ele.id,
            name: ele.name,
            code: ele.code,
            objName: ele.thing.name,
            objCode: ele.thing.code,
          });
        }
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
    const tableList = ref<any[]>([]);
    // 弹窗表格
    const modalTableList = ref<any[]>([]);
    let modalSelects: any[] = [];
    const modalSelection = {
      onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
        modalSelects = selectedRows;
      },
    };
    let selects: any[] = [];
    const selection = {
      onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
        selects = selectedRows;
      },
    };
    const addRelation = async () => {
      const param: any = {};
      const tab = tabs.value.find((ele: any) => {
        return ele.key === tabKey.value;
      });
      param.relaClass = tab.relaClass;
      for (const ele of modalSelects) {
        if (tab.type === 1) {
          param.aid = props.ele!.ID.toString();
          param.zid = ele.id.toString();
        } else {
          param.zid = props.ele!.ID.toString();
          param.aid = ele.id.toString();
        }
        const res = await thingApis.addRelation(param);
      }
      message.success("保存成功");
      showModel.value = false;
      getTableData(tabKey.value);
    };
    const deleteRelation = async () => {
      const param: any = {};
      const tab = tabs.value.find((ele: any) => {
        return ele.key === tabKey.value;
      });
      param.relaClass = tab.relaClass;
      for (const ele of selects) {
        if (tab.type === 1) {
          param.aid = props.ele!.ID.toString();
          param.zid = ele.id.toString();
        } else {
          param.zid = props.ele!.ID.toString();
          param.aid = ele.id.toString();
        }
        const res = await thingApis.deleteRelation(param);
      }
      message.success("删除成功");
      getTableData(tabKey.value);
    };
    const showModel = ref(false);
    const modelOption = ref<any[]>([
      {
        name: "id",
        columnName: "id",
        value: "",
      },
      {
        name: "编码",
        columnName: "code",
        value: "",
      },
      {
        name: "名称",
        columnName: "name",
        value: "",
      },
    ]);
    const renderModal = () => {
      return (
        <div>
          <a-modal
            v-model={[showModel.value, "visible"]}
            title="关联物实例"
            class="thingRelationDia"
            width={800}
            onOk={addRelation}
            onCancel={() => {
              showModel.value = false;
            }}
          >
            <div class="flex tools">
              <div class="inputs flex1">
                {modelOption.value.map((option: any) => {
                  return (
                    <div class="flex element">
                      <div class="name">{option.name}</div>
                      <div class="flex">
                        <a-select
                          style="width:80px"
                          v-model={[option.operation, "value"]}
                        >
                          <a-select-option value="EQ">{"="}</a-select-option>
                          <a-select-option value="NE">{"!="}</a-select-option>
                          <a-select-option value="GT">{">"}</a-select-option>
                          <a-select-option value="GTE">{">="}</a-select-option>
                          <a-select-option value="LT">{"<"}</a-select-option>
                          <a-select-option value="LTE">{"<="}</a-select-option>
                          <a-select-option value="LIKE">
                            {"like"}
                          </a-select-option>
                        </a-select>
                        <a-input v-model={[option.value, "value"]}></a-input>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div class="btns">
                <div>
                  <a-button
                    type="primary"
                    onClick={() => {
                      getModalData();
                    }}
                  >
                    搜索
                  </a-button>
                </div>
                <div>
                  <a-button
                    type="primary"
                    onClick={() => {
                      resetOption();
                    }}
                  >
                    重置
                  </a-button>
                </div>
              </div>
            </div>
            <a-table
              rowSelection={modalSelection}
              rowKey="code"
              columns={columns.value}
              dataSource={modalTableList.value}
              pagination={false}
              scroll={{ x: 700, y: 500 }}
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
            <a-button
              type="primary"
              onClick={() => {
                getModalData();
                showModel.value = true;
              }}
            >
              新建
            </a-button>
            <a-popconfirm
              title="确认删除?"
              ok-text="确定"
              cancel-text="取消"
              onConfirm={() => {
                deleteRelation();
              }}
            >
              <a-button>删除</a-button>
            </a-popconfirm>
          </div>
          <a-table
            rowKey="code"
            rowSelection={selection}
            columns={columns.value}
            dataSource={tableList.value}
            pagination={false}
            v-slots={{
              action: (row: any) => {
                return (
                  <a-space>
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
