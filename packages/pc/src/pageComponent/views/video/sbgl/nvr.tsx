import { defineComponent, reactive, ref, onMounted } from "vue";
import videoApi from "@/api/video";
import "../assets/styles/video/photo.less";

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
      dataSource: [],
      columns: [
        {
          title: "NVR名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "品牌",
          dataIndex: "brandName",
          key: "brandName",
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          key: "ip",
        },
        {
          title: "网络状态",
          dataIndex: "onlineStatus",
          key: "onlineStatus",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
        },
      ],

      dialog: false,
      param: {
        name: "",
        ip: "",
        pageNo: 1,
        pageSize: 10,
        current: 1,
        total: 0,
      },
      formState: {
        name: "",
        ip: "",
        rtspPort: "",
        user: "",
        pass: "",
        brandTypeCode: "",
      },
    });
    let nvrList: any = reactive([]);
    const formRef = ref();
    const rules = {
      name: [{ required: true, message: "此项必填" }],
      ip: [{ required: true, message: "此项必填" }],
      rtspPort: [{ required: true, message: "此项必填" }],
      user: [{ required: true, message: "此项必填" }],
      pass: [{ required: true, message: "此项必填" }],
      brandTypeCode: [{ required: true, message: "此项必填" }],
    };
    const getData = async () => {
      data.param.pageNo = data.param.current;
      const res = await videoApi.getNvrList(data.param);
      data.param.total = res.data.total;
      data.dataSource = res.data.list;
    };

    const deleteAlarm = async (param: any) => {
      const res = await videoApi.deleteNvr(param.record);
      getData();
    };
    const newAlarm = () => {
      data.formState = {
        name: "",
        ip: "",
        rtspPort: "",
        user: "",
        pass: "",
        brandTypeCode: "",
      };
      data.dialog = true;
    };
    const editAlarm = (param: any) => {
      data.formState = param.record;
      data.dialog = true;
    };
    const tableSlot = () => {
      const obj: any = {};
      obj.bodyCell = (param: any) => {
        if (param.column.dataIndex === "onlineStatus") {
          return param.text === "ONLINE" ? (
            <span style="color:#22CC83">在线</span>
          ) : (
            <span style="color:#EA5858">离线</span>
          );
        }
        if (param.column.dataIndex === "operation") {
          return (
            <div class="flex tableOpera">
              <div
                class="text"
                onClick={() => {
                  editAlarm(param);
                }}
              >
                编辑
              </div>
              <a-popconfirm
                title="确定删除？"
                onConfirm={() => {
                  deleteAlarm(param);
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

    const saveSetting = () => {
      formRef.value
        .validate()
        .then(async () => {
          const res = await videoApi.saveNvr(data.formState);
          getData();
          data.dialog = false;
        })
        .catch((error: any) => {});
    };
    const pageChange = (page: any) => {
      data.param = { ...data.param, ...page };
      getData();
    };
    const getVideoBrand = async () => {
      const res = await videoApi.findByProdType("NVR");
      nvrList = res.data;
    };
    onMounted(() => {
      getVideoBrand();
      getData();
    });
    return () => (
      <div class="photoPage">
        <a-modal
          v-model={[data.dialog, "visible"]}
          title="NVR设置"
          class="alarmDia"
          centered={true}
          onOk={() => {
            saveSetting();
          }}
          onCancel={() => {
            data.dialog = false;
          }}
        >
          <a-form
            ref={formRef}
            labelCol={{ span: 6 }}
            model={data.formState}
            rules={rules}
          >
            <a-formItem label="NVR名称" name="name">
              <a-input v-model={[data.formState.name, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="品牌" name="brandTypeCode">
              <a-select
                class="param"
                v-model={[data.formState.brandTypeCode, "value"]}
              >
                {nvrList.map((item: any) => {
                  return (
                    <a-selectOption value={item.code}>
                      {item.name}
                    </a-selectOption>
                  );
                })}
              </a-select>
            </a-formItem>
            <a-formItem label="IP地址" name="ip">
              <a-input v-model={[data.formState.ip, "value"]}></a-input>
            </a-formItem>

            <a-formItem label="RTSP端口" name="rtspPort">
              <a-input v-model={[data.formState.rtspPort, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="用户名" name="user">
              <a-input v-model={[data.formState.user, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="密码" name="pass">
              <a-input v-model={[data.formState.pass, "value"]}></a-input>
            </a-formItem>
          </a-form>
        </a-modal>
        <div class="header flex">
          <div class="flex1 flex">
            <span class="lable">名称</span>
            <a-input
              class="param"
              v-model={[data.param.name, "value"]}
              placeholder="请输入名称"
            ></a-input>
          </div>

          <div class="flex1 flex">
            <span class="lable">IP地址</span>
            <a-input
              class="param"
              v-model={[data.param.ip, "value"]}
              placeholder="请输入IP地址"
            ></a-input>
          </div>
          <div class="flex2 btns">
            <a-button
              type="primary"
              onClick={() => {
                data.param.current = 1;
                getData();
              }}
            >
              查询
            </a-button>
          </div>
        </div>
        <div class="header">
          <div>
            <a-button
              type="primary"
              onClick={() => {
                newAlarm();
              }}
            >
              新建
            </a-button>
          </div>
        </div>
        <div class="body">
          <a-table
            class="alarmTable"
            dataSource={data.dataSource}
            columns={data.columns}
            v-slots={tableSlot()}
            pagination={data.param}
            onChange={pageChange}
            rowKey="id"
          ></a-table>
        </div>
      </div>
    );
  },
});
export default utils.installComponent(com, "video-nvr");
