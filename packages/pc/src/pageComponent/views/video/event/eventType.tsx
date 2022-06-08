import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import eventApi from "@/api/event";
import "../assets/styles/video/event.less";
import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const data = reactive<{
      pagination: {
        name: string;
        code: string;
        pageNum: number;
        pageSize: number;
        current: number;
        total: number;
      };
      dataSource: Array<any>;
      columns: any;
      param: any;
      rules: any;
      dialog: boolean;
      typeList: Array<any>;
    }>({
      pagination: {
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 8,
        current: 1,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          align: "left",
          width: "40%",
        },
        {
          title: "编码",
          dataIndex: "code",
          align: "left",
          width: "40%",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          align: "left",
          width: 300,
        },
      ],
      param: {
        id: "", // id为空格则为新增,不为空是修改
        code: "", // 事件code
        name: "", // 事件名称
        algoList: "",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: "此项必填" }],
        code: [{ required: true, message: "此项必填" }],
      },
      dialog: false,
      typeList: [],
    });

    const getData = async () => {
      data.pagination.pageNum = data.pagination.current;
      const res = await eventApi.getEventTypeListPage(data.pagination);
      data.pagination.total = res.data.total;
      data.dataSource = res.data.list;
    };

    const pageChange = (page: any) => {
      data.pagination = { ...data.pagination, ...page };
      getData();
    };

    onMounted(() => {
      getData();
    });
    // 新建事件-编辑
    const open = async () => {
      data.dialog = true;
      if (data.param.id === "") {
        data.param = {
          id: "", // id为空格则为新增,不为空是修改
          code: "", // 事件code
          algoList: "",
          name: "", // 事件名称
          remark: "",
        };
      } else {
        const res = await eventApi.getEventTypeById(data.param.id);
        data.param = res.data;
        if (res.data.algoList) {
          data.param.type = res.data.algoList.split(",");
        }
      }
    };
    // 删除
    const handledelete = async (id: string) => {
      await eventApi.deleteEventType(id);
      data.pagination.pageNum = 1;
      getData();
    };
    const tableSlot = () => {
      const obj: any = {};
      obj.bodyCell = (param: any) => {
        if (param.column.dataIndex === "operation") {
          return (
            <div class="flex tableOpera">
              <div
                class="text"
                onClick={() => {
                  data.param.id = param.record.id;
                  open();
                }}
              >
                编辑
              </div>
              <a-popconfirm
                title="确定删除？"
                onConfirm={() => {
                  data.pagination.current = 1;
                  handledelete(param.record.id);
                }}
              >
                <div class="text">删除</div>
              </a-popconfirm>
            </div>
          );
        }
        return true;
      };
      return obj;
    };
    const formRef = ref();

    // 保存
    const handleSave = async () => {
      formRef.value
        .validate()
        .then(async () => {
          await eventApi.saveEventType(data.param);
          getData();
          data.dialog = false;
          formRef.value.resetFields();
        })
        .catch((error: any) => {});
    };

    watch(
      () => data.dialog,
      async () => {
        if (data.dialog) {
          const res = await eventApi.getAlgorithmTypeList();
          data.typeList = res.data;
        }
      }
    );

    return () => (
      <div class="event">
        <div class="header flex">
          <div class="">
            <span class="label">名称</span>
            <a-input
              class="param"
              v-model={[data.pagination.name, "value"]}
              placeholder="请输入搜索内容"
            ></a-input>
          </div>
          <div class="flex1 flex">
            <span class="label">编码</span>
            <a-input
              class="param"
              v-model={[data.pagination.code, "value"]}
              placeholder="请输入搜索内容"
            ></a-input>
          </div>
          <div class="flex3 btns">
            <a-button
              type="primary"
              onClick={() => {
                data.pagination.current = 1;
                getData();
              }}
            >
              查询
            </a-button>
            <a-button
              type="primary"
              onClick={() => {
                data.pagination.name = "";
                data.pagination.code = "";
                data.pagination.current = 1;
                getData();
              }}
            >
              重置
            </a-button>
          </div>
        </div>
        <div class="header flex">
          <div class="flex3">
            <a-button
              type="primary"
              onClick={() => {
                data.param.id = "";
                open();
              }}
            >
              新建事件
            </a-button>
          </div>
        </div>
        <div class="body">
          <a-table
            class="algorithmTypeTable"
            dataSource={data.dataSource}
            columns={data.columns}
            pagination={data.pagination}
            show-size-changer
            onChange={pageChange}
            rowKey="code"
            v-slots={tableSlot()}
          ></a-table>
        </div>
        <a-modal
          class="algorithmTypeModal"
          title={`${data.param.id ? "编辑" : "添加"}事件`}
          v-model={[data.dialog, "visible"]}
          onOk={() => {
            handleSave();
          }}
          okText="保存"
          onCancel={() => {
            formRef.value.resetFields();
            data.dialog = false;
          }}
        >
          <a-form ref={formRef} model={data.param} rules={data.rules}>
            <a-form-item label="名称" name="name">
              <a-input
                v-model={[data.param.name, "value"]}
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item label="编码" name="code">
              <a-input
                v-model={[data.param.code, "value"]}
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item label="算法类型">
              <a-select
                placeholder="请选择"
                mode="multiple"
                v-model={[data.param.type, "value"]}
                onChange={(e: Array<string>) => {
                  data.param.algoList = e.join(",");
                }}
              >
                {data.typeList.map((item) => (
                  <a-select-option value={item.code}>
                    {item.name}
                  </a-select-option>
                ))}
              </a-select>
            </a-form-item>
            <a-form-item label="备注">
              <a-textarea v-model={[data.param.remark, "value"]} />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-eventType");
