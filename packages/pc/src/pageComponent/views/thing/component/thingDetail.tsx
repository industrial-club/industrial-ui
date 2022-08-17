import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import * as thingApis from "@/api/thingInstance";
import { CaretUpOutlined, CaretRightOutlined } from "@ant-design/icons-vue";
import "../less/editThing.less";
import { message } from "ant-design-vue";
import editRelation from "./editRelation";

export default defineComponent({
  components: { editRelation },
  props: {
    data: Object,
  },
  setup(props, context) {
    // 基础属性
    const basicForm = ref([]);
    // 全部属性
    const colArr = ref([]);
    // 动态表格
    const dynamicColumns = ref([
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "属性名称",
        dataIndex: "id",
      },
      {
        title: "属性编码",
        dataIndex: "thingPropertyCode",
      },
      {
        title: "preCode",
        dataIndex: "preCode",
      },
      {
        title: "prePointCode",
        dataIndex: "prePointCode",
      },
    ]);
    const dynamicTableList = ref([]);
    // 逻辑表格
    const LoginColumns = ref([]);
    const LoginTableList = ref([]);

    // 动作表格
    const actionColumns = ref([]);
    const actionCTableList = ref([]);
    watch(
      () => props.data,
      (value: any) => {
        colArr.value = JSON.parse(
          JSON.stringify(value.thingInst?.thing.thingPropertyList || [])
        );
        basicForm.value = colArr.value.filter((ele: any) => {
          ele.value = value.staticMap.map[ele.code];
          return ele.propertyType === "property";
        });
        dynamicTableList.value = value.dynamicProperties?.filter((ele: any) => {
          const pro: any = colArr.value.find((col: any) => {
            return col.code === ele.thingPropertyCode;
          });

          return pro.propertyType === "metric";
        });
      },
      {
        immediate: true,
      }
    );
    const renderSelect = (ele: any) => {
      const selectInfo = JSON.parse(ele.listInfo || "[]");
      const arr: any[] = [];
      if (ele.columnType === "long") {
        for (const key in selectInfo) {
          arr.push({ key: Number(key), value: selectInfo[key] });
        }
      } else if (ele.columnType === "string") {
        for (const key in selectInfo) {
          arr.push({ key: key.toString(), value: selectInfo[key] });
        }
      }
      return (
        <a-select
          v-model={[ele.value, "value"]}
          style={{ width: "100%" }}
          disabled={true}
        >
          {arr.map((info: any) => {
            return (
              <a-select-option value={info.key}>{info.value}</a-select-option>
            );
          })}
        </a-select>
      );
    };

    const folds = reactive({
      basic: false,
      dynamic: false,
      logic: false,
      action: false,
    });
    return () => (
      <div class="editThing" style={{ height: "100%", overflow: "auto" }}>
        <div class="header flex">
          <a-page-header
            class="flex1 "
            title="返回物实例列表"
            onBack={() => {
              context.emit("backList");
            }}
          />
          <a-button
            type="primary"
            onClick={() => {
              context.emit("toEdit", props.data!.staticMap.map);
            }}
          >
            编辑
          </a-button>
          <a-button
            onClick={() => {
              context.emit("back");
            }}
          >
            返回
          </a-button>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">基础属性</div>
            <div
              class="fold flex"
              onClick={() => {
                folds.basic = !folds.basic;
              }}
            >
              {folds.basic ? "展开" : "折叠"}
              {folds.basic ? <CaretRightOutlined /> : <CaretUpOutlined />}
            </div>
          </div>
          <div class="flex content" style={folds.basic ? "display:none" : ""}>
            <a-form class="flex3 grid">
              {basicForm.value.map((ele: any) => {
                return (
                  <div class="flex element">
                    <a-form-item
                      label={ele.name}
                      name={ele.code}
                      rules={ele.rules}
                      style={{ width: "100%" }}
                      label-col={{ span: 8 }}
                      wrapper-col={{ span: 16 }}
                    >
                      {ele.displayType === "text" ? (
                        <a-input
                          v-model={[ele.value, "value"]}
                          disabled={true}
                        ></a-input>
                      ) : (
                        ""
                      )}
                      {ele.displayType === "select" ? renderSelect(ele) : ""}
                    </a-form-item>
                  </div>
                );
              })}
            </a-form>
            <div class="flex1 pic">
              <img src="https://dss2.bdstatic.com/5bVYsj_p_tVS5dKfpU_Y_D3/res/r/image/2022-8-1/0801ban.png" />
              <a-button type="primary">修改图片</a-button>
            </div>
          </div>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">动态属性</div>
            <div
              class="fold flex"
              onClick={() => {
                folds.dynamic = !folds.dynamic;
              }}
            >
              {folds.dynamic ? "展开" : "折叠"}
              {folds.dynamic ? <CaretRightOutlined /> : <CaretUpOutlined />}
            </div>
          </div>
          <a-table
            style={folds.dynamic ? "display:none" : ""}
            rowKey="code"
            columns={dynamicColumns.value}
            dataSource={dynamicTableList.value}
            pagination={false}
          ></a-table>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">逻辑</div>
            <div
              class="fold flex"
              onClick={() => {
                folds.logic = !folds.logic;
              }}
            >
              {folds.logic ? "展开" : "折叠"}
              {folds.logic ? <CaretRightOutlined /> : <CaretUpOutlined />}
            </div>
          </div>
          <a-table
            style={folds.logic ? "display:none" : ""}
            rowKey="code"
            columns={actionColumns.value}
            dataSource={actionCTableList.value}
            pagination={false}
          ></a-table>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">动作</div>
            <div
              class="fold flex"
              onClick={() => {
                folds.action = !folds.action;
              }}
            >
              {folds.action ? "展开" : "折叠"}
              {folds.action ? <CaretRightOutlined /> : <CaretUpOutlined />}
            </div>
          </div>
          <a-table
            style={folds.action ? "display:none" : ""}
            rowKey="code"
            columns={actionColumns.value}
            dataSource={actionCTableList.value}
            pagination={false}
          ></a-table>
        </div>
        <editRelation ele={props.data?.staticMap?.map} />
      </div>
    );
  },
});
