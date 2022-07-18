import { defineComponent, reactive, watch, onMounted, inject } from "vue";
import { message } from "ant-design-vue";
import axios from "axios";
import videoApi from "@/api/video";
import "../../assets/styles/video/photo.less";

export default defineComponent({
  setup(props, context) {
    const diaState: any = inject("checkDia");
    const repair = async (uuid: string) => {
      const res = await videoApi.repair(uuid);
      message.success("下发修复成功");
    };
    const data = reactive({
      dataSource: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          key: "ip",
        },
        {
          title: "诊断结果",
          dataIndex: "info",
          key: "info",
          customRender: (param: any) => {
            let res: any = "";
            if (param.text.length === 0) {
              res = <div class="">正常</div>;
            } else {
              res = param.text.reduce((pre: string, cur: string) => {
                let str = "";
                if (cur === "encError") {
                  str = "视频压缩格式不支持;";
                } else if (cur === "ntpError") {
                  str = "时间不同步;";
                } else if (cur === "serverError") {
                  str = "服务异常;";
                } else if (cur === "timeOut") {
                  str = "超时未响应;";
                } else {
                  str = "未知错误;";
                }
                return pre + str;
              }, "");
            }
            return res;
          },
        },
        {
          title: "操作",
          dataIndex: "uuid",
          key: "uuid",
          customRender: (param: any) => {
            return param.record.info.length ? (
              <a-button
                onClick={() => {
                  repair(param.text);
                }}
              >
                远程修复
              </a-button>
            ) : (
              ""
            );
          },
        },
      ],
      loading: false,
    });
    watch(diaState, async (val: any) => {
      if (val) {
        data.loading = true;
        const res = await videoApi.getErrList();
        data.dataSource = res.data;
        data.loading = false;
      }
    });

    const repairAll = async () => {
      const res = await videoApi.repair();
      message.success("下发修复成功");
    };
    return () => (
      <div class="">
        <a-modal
          style="width:800px"
          v-model={[diaState.value, "visible"]}
          title="相机配置诊断"
          class="alarmDia"
          centered={true}
          footer={null}
          onOk={() => {
            diaState.value = false;
          }}
          onCancel={() => {
            diaState.value = false;
          }}
        >
          <div class="body">
            <a-table
              dataSource={data.dataSource}
              columns={data.columns}
              pagination={false}
              rowKey="id"
              loading={data.loading}
            ></a-table>
            <div class="center">
              <a-button
                type="primary"
                onClick={() => {
                  repairAll();
                }}
              >
                一键修复
              </a-button>
            </div>
          </div>
        </a-modal>
      </div>
    );
  },
});
