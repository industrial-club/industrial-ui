import { defineComponent, reactive, ref } from "vue";
import { Modal } from "ant-design-vue";
import { sendDetailsColumns } from "@/pageComponent/config/systemConfig";

export default defineComponent({
  name: "SendDetails",
  setup() {
    const form = reactive({
      selectChannel: "",
      notificationTitle: "",
    });
    const noticeList = ref([
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
    ]);
    return () => (
      <div class="sendDetails">
        <div class="sendDetails-top">
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
        <div class="sendDetails-content">
          <a-table
            dataSource={noticeList.value}
            columns={sendDetailsColumns}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "index") {
                  return index + 1;
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
                    </div>
                  );
                }
              },
            }}
          ></a-table>
        </div>
      </div>
    );
  },
});
