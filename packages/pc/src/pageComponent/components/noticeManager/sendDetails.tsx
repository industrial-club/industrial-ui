import {
  defineComponent,
  reactive,
  ref,
  PropType,
  watch,
  onMounted,
} from "vue";
import { message, Modal } from "ant-design-vue";
import { sendDetailsColumns } from "@/pageComponent/config/systemConfig";
import moment from "moment";
import {
  readStateFilter,
  sendMethodFilter,
  sendStatusFilter,
} from "@/pageComponent/utils/filter";
import noticeCenterApi from "@/api/noticeManager";
import noticeManagerApi from "@/api/noticeCenter";

interface sendDetailsItem {
  deleted: boolean;
  failReason: null;
  id: string;
  platform: string;
  readState: string;
  receiverId: string;
  receiverName: string;
  recordId: string;
  sendState: string;
  sendTime: string;
}

const props = {
  sendDetailsData: {
    type: Array as PropType<Array<sendDetailsItem>>,
  },
};

export default defineComponent({
  name: "SendDetails",
  props,
  setup(_props, _context) {
    // 查询表单
    const form = reactive({
      readState: "",
      receiverName: "",
    });

    // 方式
    const options = ref([]);
    const enumList = async () => {
      const res = await noticeCenterApi.getEnumList("PlatformEnum");
      options.value = res.data;
    };

    // 列表数据
    const noticeList = ref<Array<sendDetailsItem>>([]);

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
    });

    // 分页变化
    const tableChange = (page) => {
      const { current, pageSize, total } = page;
      pagination.current = current;
      pagination.pageSize = pageSize;
      pagination.total = total;
    };

    // 查询
    const query = () => {
      if (form.readState !== "" && form.receiverName !== "") {
        noticeList.value = noticeList.value
          .filter((n) => n.receiverName === form.receiverName)
          .filter((v) => v.readState === form.readState);
      } else if (form.receiverName !== "") {
        noticeList.value = noticeList.value.filter(
          (n) => n.receiverName === form.receiverName
        );
      } else if (form.readState !== "") {
        noticeList.value = noticeList.value.filter(
          (v) => v.readState === form.readState
        );
      }
    };
    watch(
      () => _props.sendDetailsData,
      (e) => {
        if (e) {
          noticeList.value = e;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(() => {
      enumList();
    });
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
                <a-form-item label="收件人">
                  <a-input
                    v-model={[form.receiverName, "value"]}
                    placeholder="收件人搜索"
                    allowClear
                  />
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="已读状态">
                  <a-select
                    ref="select"
                    v-model={[form.readState, "value"]}
                    allowClear
                  >
                    <a-select-option value="READ">已读</a-select-option>
                    <a-select-option value="UNREAD">未读</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col span={12} style={{ textAlign: "right" }}>
                <a-button type="primary" onClick={query}>
                  查询
                </a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="sendDetails-content">
          <a-table
            dataSource={noticeList.value}
            columns={sendDetailsColumns}
            scroll={{ y: 500 }}
            pagination={false}
            onChange={tableChange}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.key === "sendMethod") {
                  return sendMethodFilter(record.platform, options.value);
                }
                if (column.key === "sendStatus") {
                  return sendStatusFilter(record.sendState);
                }
                if (column.key === "readStatus") {
                  return readStateFilter(record.readState);
                }
                if (column.key === "date") {
                  return record.sendTime
                    ? moment(record.sendTime).format("YYYY-MM-DD HH:mm:ss")
                    : "--";
                }
                if (column.key === "action") {
                  return (
                    <div>
                      {record.sendState === "FAILURE" ? (
                        <a-button
                          type="link"
                          onClick={() => {
                            Modal.confirm({
                              title: "系统提示",
                              content: "请确定是否重新发送此消息？",
                              async onOk() {
                                const res = await noticeManagerApi.resendTouser(
                                  record
                                );
                                if (res.data) {
                                  message.success("发送成功");
                                  return true;
                                } else {
                                  message.error("发送失败");
                                  return false;
                                }
                              },
                              onCancel() {},
                            });
                          }}
                        >
                          重新发送
                        </a-button>
                      ) : null}
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
