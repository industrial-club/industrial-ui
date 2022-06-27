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
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "张三",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
      {
        addressee: "李四",
        date: "2021-3-2 12:12:12",
        sendMethod: "智信通知",
        sendStatus: "已发送",
        readStatus: "已读",
      },
    ]);
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
    });
    const tableChange = (page) => {
      const { current, pageSize, total } = page;
      pagination.current = current;
      pagination.pageSize = pageSize;
      pagination.total = total;
      console.log(page);
    };
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
            scroll={{ y: 500 }}
            pagination={pagination}
            onChange={tableChange}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "action") {
                  return (
                    <div>
                      <a-button
                        type="link"
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
