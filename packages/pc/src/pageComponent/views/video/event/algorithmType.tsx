import { defineComponent, onMounted, reactive, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import { message } from "ant-design-vue";
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
    const data = reactive({
      pagination: {
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 10,
        current: 1,
        total: 0,
        showTotal: (total: number) => `共 ${total} 条`,
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
        code: "", // 算法code
        name: "", // 算法名称
        remark: "",
      },
      rules: {
        name: [{ required: true, message: "此项必填" }],
        code: [{ required: true, message: "此项必填" }],
      },
      dialog: false,
    });

    const router = useRouter();
    const getData = async () => {
      data.pagination.pageNum = data.pagination.current;
      const res = await eventApi.getAlgorithmTypeListPage(data.pagination);
      data.pagination.total = res.data.total;
      data.dataSource = res.data.list;
    };
    onMounted(() => {
      getData();
    });

    const pageChange = (page: any) => {
      data.pagination = { ...data.pagination, ...page };
      getData();
    };
    // 新建算法-编辑
    const open = async () => {
      data.dialog = true;
      if (data.param.id === "") {
        data.param = {
          id: "", // id为空格则为新增,不为空是修改
          code: "", // 算法code
          name: "", // 算法名称
          remark: "",
        };
      } else {
        const res = await eventApi.getEventAlgoTypeById(data.param.id);
        data.param = res.data;
      }
    };
    // 删除
    const handledelete = async (id: string) => {
      await eventApi.deleteEventAlgoType(id);
      data.pagination.pageNum = 1;
      getData();
    };
    const tableSlot = () => {
      const obj: any = {};
      obj.bodyCell = (param: any) => {
        if (param.column.dataIndex === "operation") {
          return (
            <div class="flex tableOpera">
              <a
                onClick={() => {
                  data.param.id = param.record.id;
                  open();
                }}
              >
                编辑
              </a>
              <a-popconfirm
                title="确定删除？"
                onConfirm={() => {
                  data.pagination.current = 1;
                  handledelete(param.record.id);
                }}
              >
                <a>删除</a>
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
          const res = await eventApi.saveEventAlgoType(data.param);
          if (res.data === "repeat") {
            message.error("数据重复，保存失败");
            return;
          }
          getData();
          data.dialog = false;
          formRef.value.resetFields();
        })
        .catch((error: any) => {});
    };

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
              class="reset"
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
              新建算法
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
          title={`${data.param.id ? "编辑" : "添加"}算法`}
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
            <a-form-item label="备注">
              <a-textarea v-model={[data.param.remark, "value"]} />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    );
  },
});
export default utils.installComponent(com, "video-algorithmType");
