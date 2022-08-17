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
    const userinfo = JSON.parse(window.sessionStorage.getItem("userinfo")!);
    const headers = {
      "Content-Type": "multipart/form-data",
      userId: userinfo.userId,
      corpId: userinfo.corpId,
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
              <img src={formData.fileUrl || ""} />
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
