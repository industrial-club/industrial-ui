import { defineComponent, onMounted, reactive, ref } from "vue";
import { message, Modal } from "ant-design-vue";
import moment from "moment";
import utils from "@/utils";
import { managerColumns } from "@/pageComponent/config/systemConfig";
import addNotice from "@/pageComponent/components/noticeManager/addNotice";
import sendDetails from "@/pageComponent/components/noticeManager/sendDetails";
import notificationDetails from "@/pageComponent/components/noticeManager/notificationDetails";
import noticeCenterApi from "@/api/noticeCenter";
import noticeManagerApi from "@/api/noticeManager";
import "../../../assets/styles/systemManager/noticeManager/noticeManager.less";
import {
  resendTypeFilter,
  sendStateFilter,
} from "@/pageComponent/utils/filter";

const noticeCenter = defineComponent({
  components: {
    addNotice,
    sendDetails,
    notificationDetails,
  },
  setup() {
    // 查询表单
    const form = reactive<{
      channelId?: number;
      messageTitle?: "";
    }>({});

    // 发送明细数据
    const sendDetailsData = ref([]);

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30", "50", "100"],
      total: 0,
      showQuickJumper: true,
    });

    // 通道列表
    const channelList = ref<
      Array<{
        id?: number;
        corpId?: string;
        channelName?: string;
        available?: boolean;
        notificationChannelConfigList?: null;
      }>
    >([]);

    // 列表数据
    const noticeList = ref([]);

    const options = ref([]);

    // 消息详情
    const data = ref({});

    // 获取通知方式
    const enumList = async () => {
      const res = await noticeManagerApi.getEnumList("SendStateEnum");
      options.value = res.data;
    };

    // 获取通道列表
    const getChannelList = async () => {
      const res = await noticeManagerApi.getChannelList();
      channelList.value = res.data;
    };

    // 新增/修改通知弹窗显示
    const managerVisible = ref(false);

    // 新增/修改通知弹窗title
    const managerTitle = ref("");

    // 发送明细弹窗显示
    const sendDetailsVisible = ref(false);

    // 详情弹窗
    const detailsVisible = ref(false);

    // 获取数据
    const http = async () => {
      const res = await noticeCenterApi.getRecordList({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...form,
      });
      if (res.data) {
        pagination.current = res.data.current;
        pagination.total = res.data.total;
        noticeList.value = res.data.records;
      }
    };

    // 分页变化
    const tableChange = (page) => {
      const { current, pageSize, total } = page;
      pagination.current = current;
      pagination.pageSize = pageSize;
      pagination.total = total;
      http();
    };
    const recordItem = (val) => {
      if (val.sendState === "PENDING") {
        return (
          <>
            <a-button
              type="link"
              onClick={() => {
                managerTitle.value = "修改通知";
                data.value = val;
                managerVisible.value = true;
              }}
            >
              编辑
            </a-button>
            <a-button
              type="text"
              danger
              onClick={() => {
                Modal.confirm({
                  title: "系统提示",
                  content: "请确定是否删除此任务？",
                  async onOk() {
                    const res = await noticeCenterApi.recordDelete(val.id);
                    if (res.data) {
                      message.success("删除成功");
                      http();
                      return true;
                    } else {
                      message.success("删除失败");
                      return false;
                    }
                  },
                  onCancel() {},
                });
              }}
            >
              删除
            </a-button>
          </>
        );
      }
      if (val.sendState === "PROCESSED") {
        return (
          <a-button
            type="link"
            onClick={() => {
              data.value = val;
              detailsVisible.value = true;
            }}
          >
            详情
          </a-button>
        );
      }
      if (val.sendState === "FAILURE") {
        return (
          <a-button
            type="link"
            onClick={() => {
              Modal.confirm({
                title: "系统提示",
                content: "请确定是否重新发送此消息？",
                async onOk() {
                  const res = await noticeCenterApi.resend(val);
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
        );
      }
    };
    onMounted(() => {
      http();
      getChannelList();
      enumList();
    });
    return () => (
      <div class="noticeCenter">
        <div class="noticeCenter-top">
          <a-form
            label-col={{ span: 8 }}
            wrapper-col={{ span: 16 }}
            model={form}
          >
            <a-row grade={24}>
              <a-col span={6}>
                <a-form-item label="选择通道">
                  <a-select
                    allowClear
                    ref="select"
                    placeholder="选择通道搜索"
                    v-model={[form.channelId, "value"]}
                  >
                    {channelList.value.map((item) => (
                      <a-select-option value={item.id}>
                        {item.channelName}
                      </a-select-option>
                    ))}
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span={6}>
                <a-form-item label="通知标题">
                  <a-input
                    v-model={[form.messageTitle, "value"]}
                    placeholder="通知标题搜索"
                  />
                </a-form-item>
              </a-col>
              <a-col span={12} style={{ textAlign: "right" }}>
                <a-button
                  type="primary"
                  onClick={() => {
                    pagination.current = 1;
                    http();
                  }}
                >
                  查询
                </a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="noticeCenter-content">
          <div style={"margin-bottom: 20px;"}>
            <a-button
              type="primary"
              onClick={() => {
                managerTitle.value = "新增通知";
                data.value = {};
                managerVisible.value = true;
              }}
            >
              新增通知
            </a-button>
          </div>
          <a-table
            dataSource={noticeList.value}
            columns={managerColumns}
            onChange={tableChange}
            pagination={pagination}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.key === "sendType") {
                  return resendTypeFilter(record.sendType);
                }
                if (column.key === "recordStatus") {
                  return sendStateFilter(record.sendState, options.value);
                }
                if (column.key === "volumeSent") {
                  return (
                    <a-button
                      type="link"
                      onClick={() => {
                        sendDetailsData.value = record.receiverInfos;
                        sendDetailsVisible.value = true;
                      }}
                    >
                      {record.totalReceiverCount}({record.failReceiverCount})
                    </a-button>
                  );
                }
                if (column.key === "creationTime") {
                  return moment(record.createDt).format("YYYY-MM-DD HH:mm:ss");
                }
                if (column.key === "action") {
                  return <div>{recordItem(record)}</div>;
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
          keyboard={false}
          width={600}
          maskClosable={false}
        >
          {managerVisible.value ? (
            <addNotice
              formData={data.value}
              onClose={() => {
                managerVisible.value = false;
                data.value = {};
                http();
              }}
            ></addNotice>
          ) : null}
        </a-modal>
        <a-modal
          v-model={[sendDetailsVisible.value, "visible"]}
          title="发送明细"
          centered={true}
          footer={false}
          width={1200}
          keyboard={false}
          maskClosable={false}
        >
          <sendDetails sendDetailsData={sendDetailsData.value}></sendDetails>
        </a-modal>
        <a-modal
          v-model={[detailsVisible.value, "visible"]}
          title="通知详情"
          centered={true}
          footer={false}
          width={800}
          keyboard={false}
          maskClosable={false}
        >
          <notificationDetails formData={data.value}></notificationDetails>
        </a-modal>
      </div>
    );
  },
});
export default utils.installComponent(noticeCenter, "notice-center");
