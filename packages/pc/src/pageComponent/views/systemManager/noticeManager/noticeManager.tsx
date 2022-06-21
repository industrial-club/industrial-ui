import { defineComponent, reactive, ref } from "vue";
import { Modal } from "ant-design-vue";
import utils from "@/utils";
import { managerColumns } from "@/pageComponent/config/systemConfig";
import addNotice from "@/pageComponent/components/noticeManager/addNotice";
import sendDetails from "@/pageComponent/components/noticeManager/sendDetails";
import "../../../assets/styles/systemManager/noticeManager/noticeManager.less";

const noticeManager = defineComponent({
  components: {
    addNotice,
    sendDetails,
  },
  setup() {
    const form = reactive({
      selectChannel: "",
      notificationTitle: "",
    });
    const noticeList = ref([
      {
        passageway: "通知",
        notificationTitle: "验证码",
        notificationLevel: "重要",
        sender: "李师傅",
        sendType: "立即发送",
        creationTime: "2022-3-4 12:23:23",
        recordStatus: "已发送",
        volumeSent: "9(2)",
      },
    ]);
    const managerVisible = ref(false);
    const managerTitle = ref("");
    const sendDetailsVisible = ref(false);
    return () => (
      <div class="noticeManager">
        <div class="noticeManager-top">
          <a-form
            label-col={{ span: 8 }}
            wrapper-col={{ span: 16 }}
            model={form}
          >
            <a-row grade={24}>
              <a-col span={6}>
                <a-form-item label="选择通道">
                  <a-select
                    ref="select"
                    v-model={[form.selectChannel, "value"]}
                  >
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="通知标题">
                  <a-input
                    v-model={[form.notificationTitle, "value"]}
                    placeholder="模板编号搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col span={12} style={{ textAlign: "right" }}>
                <a-button type="primary">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="noticeManager-content">
          <div>
            <a-button
              type="primary"
              onClick={() => {
                managerTitle.value = "新增通知";
                managerVisible.value = true;
              }}
            >
              新增通知
            </a-button>
          </div>
          <a-table
            dataSource={noticeList.value}
            columns={managerColumns}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "volumeSent") {
                  return (
                    <div>
                      <span
                        class="volumeSent"
                        onClick={() => {
                          sendDetailsVisible.value = true;
                        }}
                      >
                        {record.volumeSent}
                      </span>
                    </div>
                  );
                }
                if (column.dataIndex === "secretKey") {
                  return (
                    <div class="secretKey">
                      <p>{record.secretKey}</p>
                      <a-button
                        type="text"
                        v-slots={{
                          icon: () => <copy-outlined />,
                        }}
                      ></a-button>
                    </div>
                  );
                }
                if (column.dataIndex === "action") {
                  return (
                    <div>
                      <a-button type="text" onClick={() => {}}>
                        详情
                      </a-button>
                      <a-button type="text" onClick={() => {}}>
                        编辑
                      </a-button>
                      <a-button
                        type="text"
                        onClick={() => {
                          Modal.confirm({
                            title: "系统提示",
                            content: "请确定是否重新发送此消息？",
                            onOk() {
                              return false;
                            },
                            onCancel() {},
                          });
                        }}
                      >
                        重新发送
                      </a-button>
                      <a-button
                        type="text"
                        danger
                        onClick={() => {
                          Modal.confirm({
                            title: "系统提示",
                            content: "请确定是否删除此任务？",
                            onOk() {
                              return false;
                            },
                            onCancel() {},
                          });
                        }}
                      >
                        删除
                      </a-button>
                    </div>
                  );
                }
              },
            }}
          ></a-table>
        </div>
        <a-modal
          v-model={[managerVisible.value, "visible"]}
          title={managerTitle.value}
          centered={true}
          footer={false}
        >
          <addNotice></addNotice>
        </a-modal>
        <a-modal
          v-model={[sendDetailsVisible.value, "visible"]}
          title="发送明细"
          centered={true}
          footer={false}
          width={1200}
        >
          <sendDetails></sendDetails>
        </a-modal>
      </div>
    );
  },
});
export default utils.installComponent(noticeManager, "notice-manager");
