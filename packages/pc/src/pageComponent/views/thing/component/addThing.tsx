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
    const headers = {
      "Content-Type": "multipart/form-data",
    };
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

    // form输入类型过滤
    const typeFilter = (val) => {
      switch (val) {
        case "string":
          return "text";
          break;
        case "long":
          return "number";
          break;
        case "double":
          return "number";
          break;
        case "boolean":
          return "boolean";
          break;
        default:
          return "";
          break;
      }
    };

    watch(
      () => props.data,
      (value: any) => {
        colArr.value = JSON.parse(
          JSON.stringify(value.thingPropertyList || [])
        );
        basicForm.value = [];
        basicForm.value.push(
          {
            name: "名称",
            value: null,
            displayType: "text",
            rules: [{ required: true, message: "请输入名称" }],
          },
          {
            name: "编码",
            value: null,
            displayType: "text",
            rules: [{ required: true, message: "请输入编码" }],
          }
        );
        basicForm.value.push(
          ...colArr.value.filter((ele: any) => {
            ele.value = null;
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
      const valid = await form.value.validateFields();
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
      param.thingInst.photo = formData.fileUrl;
      basicForm.value.forEach((element: any, index: number) => {
        if (index !== 0 && index !== 1) {
          if (
            element.value &&
            element.columnType === "long" &&
            element.value.indexOf(".") > -1 &&
            typeof element.value === "number"
          ) {
            message.error(`${element.name}应为整数`);
            return false;
          }
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
        context.emit("toDetail", res.data.staticMap.map);
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
        <a-select v-model={[ele.value, "value"]} style={{ width: "100%" }}>
          {arr.map((info: any) => {
            return (
              <a-select-option value={info.key}>{info.value}</a-select-option>
            );
          })}
        </a-select>
      );
    };

    const form = ref();
    const formData = reactive({
      name: null,
      code: null,
      fileUrl: null,
    });
    const customRequest = (options: any) => {
      const { file, onSuccess, onError } = options;
      const fileData = new FormData();
      fileData.append("file", file as any);
      thingApis.uploadCommon(fileData, headers).then((res: any) => {
        if (res.code === "M0000") {
          formData.fileUrl = res.data;
          onSuccess("response", file);
        } else {
          onError("error", file);
        }
      });
    };
    return () => (
      <div class="editThing">
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
          <div
            class="title flex"
            style={folds.basic ? "margin-bottom:10px" : ""}
          >
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
            <a-form class="flex3 grid" ref={form} model={formData}>
              {basicForm.value.map((ele: any) => {
                return (
                  <div class="flex element">
                    <a-form-item
                      label={ele.name}
                      name={ele.name}
                      rules={ele.rules}
                      style={{ width: "100%" }}
                      label-col={{ span: 8 }}
                      wrapper-col={{ span: 16 }}
                    >
                      {ele.displayType === "text" ? (
                        <a-input
                          v-model={[ele.value, "value"]}
                          disabled={ele.readonly}
                          type={typeFilter(ele.columnType)}
                          onChange={() => {
                            formData[ele.name] = ele.value;
                          }}
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
              <a-image
                src={formData.fileUrl || ""}
                preview={false}
                fallback="data:image/png;base64,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"
              />
              <a-upload
                headers={headers}
                showUploadList={false}
                customRequest={(e) => customRequest(e)}
              >
                <a-button type="primary">上传图片</a-button>
              </a-upload>
            </div>
          </div>
        </div>
        <div class="basic">
          <div
            class="title flex"
            style={folds.dynamic ? "margin-bottom:10px" : ""}
          >
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
                      type={typeFilter(record.columnType)}
                    ></a-input>
                  );
                }
              },
            }}
          ></a-table>
        </div>
        <div class="basic">
          <div
            class="title flex"
            style={folds.logic ? "margin-bottom:10px" : ""}
          >
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
          <div
            class="title flex"
            style={folds.action ? "margin-bottom:10px" : ""}
          >
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
      </div>
    );
  },
});
