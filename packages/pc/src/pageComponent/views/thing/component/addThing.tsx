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
    const basicForm = ref<any[]>([]);
    // 全部属性
    const colArr = ref([]);
    // 动态表格
    const dynamicColumns = ref([
      // {
      //   title: "id",
      //   dataIndex: "id",
      // },
      {
        title: "属性名称",
        dataIndex: "displayLabel",
      },
      {
        title: "属性编码",
        dataIndex: "code",
      },
      {
        title: "preCode",
        dataIndex: "preCode",
      },
      {
        title: "prePointCode",
        dataIndex: "prePointCode",
      },
      {
        title: "resetInterval",
        dataIndex: "resetInterval",
      },
      {
        title: "resetValue",
        dataIndex: "resetValue",
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
          JSON.stringify(value.thingPropertyList || [])
        );
        basicForm.value = [];
        basicForm.value.push(
          {
            name: "name",
            value: "",
            displayType: "text",
          },
          {
            name: "code",
            value: "",
            displayType: "text",
          }
        );
        basicForm.value.push(
          ...colArr.value.filter((ele: any) => {
            ele.value = "";
            return (
              ele.propertyType === "property" &&
              ele.code !== "CODE" &&
              ele.code !== "NAME" &&
              ele.code !== "ID"
            );
          })
        );
        dynamicTableList.value = colArr.value.filter((ele: any) => {
          return ele.propertyType === "metric";
        });
      },
      {
        immediate: true,
      }
    );

    const save = async () => {
      const param: any = {
        dynamicProperties: [],
        staticMap: {
          map: {},
        },
        thingInst: {
          thing: props.data,
        },
      };
      param.thingInst.name = basicForm.value[0].value;
      param.thingInst.code = basicForm.value[1].value;
      basicForm.value.forEach((element: any, index: number) => {
        if (index !== 0 && index !== 1) {
          param.staticMap.map[element.code] = element.value;
        }
      });

      dynamicTableList.value.forEach((ele: any) => {
        ele.thingPropertyCode = ele.code;
      });
      param.dynamicProperties = dynamicTableList.value;
      const res: any = await thingApis.addThing(param);
      if (res.code === "M0000") {
        message.success("保存成功");
        context.emit("back");
      } else {
        message.error("服务异常");
      }
    };
    const folds = reactive({
      basic: false,
      dynamic: false,
      logic: false,
      action: false,
    });
    const renderSelect = (ele: any) => {
      const selectInfo = JSON.parse(ele.listInfo || "[]");
      const arr: any[] = [];
      for (const key in selectInfo) {
        arr.push({ key, value: selectInfo[key] });
      }
      return (
        <a-select v-model={[ele.value, "value"]} style="width: 120px">
          {arr.map((info: any) => {
            return (
              <a-select-option value={info.key}>{info.value}</a-select-option>
            );
          })}
        </a-select>
      );
    };
    return () => (
      <div class="editThing">
        <div class="header flex">
          <a-page-header
            class="flex1 "
            title="返回物实例列表"
            onBack={() => {
              context.emit("back");
            }}
          />
          <a-button
            type="primary"
            onClick={() => {
              save();
            }}
          >
            保存
          </a-button>
          <a-button
            onClick={() => {
              context.emit("back");
            }}
          >
            取消
          </a-button>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">基础属性</div>
            {/* <div class="fold flex">
              折叠
              <CaretUpOutlined />
            </div> */}
          </div>
          <div class="flex content">
            <div class="flex3 grid">
              {basicForm.value.map((ele: any) => {
                return (
                  <div class="flex element">
                    <div class="name">{ele.name}</div>
                    <div>
                      {ele.displayType === "text" ? (
                        <a-input v-model={[ele.value, "value"]}></a-input>
                      ) : (
                        ""
                      )}
                      {ele.displayType === "select" ? renderSelect(ele) : ""}
                    </div>
                  </div>
                );
              })}
            </div>
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
          </div>
          <a-table
            rowKey="code"
            columns={dynamicColumns.value}
            dataSource={dynamicTableList.value}
            pagination={false}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (
                  column.dataIndex === "preCode" ||
                  column.dataIndex === "prePointCode" ||
                  column.dataIndex === "resetInterval" ||
                  column.dataIndex === "resetValue"
                ) {
                  return (
                    <a-input
                      v-model={[record[column.dataIndex], "value"]}
                    ></a-input>
                  );
                }
              },
            }}
          ></a-table>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">逻辑</div>
          </div>
          <a-table
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
          </div>
          <a-table
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
