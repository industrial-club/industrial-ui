import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import dayjs, { Dayjs } from "dayjs";
import noticeCenterApi from "@/api/noticeManager";
import { channelFilter, resendTypeFilter } from "@/pageComponent/utils/filter";

const props = {
  formData: Object,
};
interface reactiverInfoItem {
  deleted: boolean;
  failReason: null;
  id: string;
  platform: string;
  readState: string;
  receiverId: string;
  receiverName: string;
  recordId: string;
  sendState: null;
  sendTime: null;
}
export default defineComponent({
  name: "NotificationDetails",
  props,
  setup(_props, _context) {
    // 表单数据
    const formState = ref<{
      messageTitle?: string;
      receiverInfos?: Array<reactiverInfoItem>;
      receiverId?: Array<string | number>;
      receiverName?: string;
      sendType?: string | number;
      expectSendTime?: string | number | Dayjs;
      channelId?: string | number;
      level?: string | number;
      content?: string | number;
      messageContent?: string;
    }>({});

    // 通道数据
    const channelList = ref<Array<{ [key: string]: string | number }>>([]);

    // 获取通道数据
    const getChannelList = async () => {
      const res = await noticeCenterApi.getChannelList();
      channelList.value = res.data;
    };

    watch(
      () => _props.formData,
      (e) => {
        formState.value = {};
        if (e) {
          if (e.id) {
            formState.value.receiverId = [];
            for (const key in e) {
              if (key === "expectSendTime") {
                formState.value.expectSendTime = dayjs(e.expectSendTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              } else {
                formState.value[key] = e[key];
              }
            }
            const map = new Map();
            const qc = formState.value.receiverInfos?.filter(
              (key) =>
                !map.has(key.receiverName) && map.set(key.receiverName, 1)
            );
            formState.value.receiverName = qc
              ?.map((item: any) => {
                if (item.receiverName && item.receiverName !== null) {
                  return item.receiverName;
                }
              })
              .join(",");
            formState.value.content = "";
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(() => {
      getChannelList();
    });
    return () => (
      <div class="notificationDetails">
        <a-form
          model={formState.value}
          label-col={{ span: 4 }}
          wrapper-col={{ span: 20 }}
        >
          <a-form-item label="通知标题">
            <div>{formState.value.messageTitle}</div>
          </a-form-item>
          <a-form-item label="收件人">
            <div>{formState.value.receiverName}</div>
          </a-form-item>
          <a-form-item label="发送时间">
            <a-row grade={24}>
              <a-col span={formState.value.sendType === "TIMING" ? 10 : 24}>
                <div>{resendTypeFilter(formState.value.sendType)}</div>
              </a-col>
              {formState.value.sendType === "TIMING" ? (
                <a-col span={12} offset="2">
                  <div>{formState.value.expectSendTime}</div>
                </a-col>
              ) : null}
            </a-row>
          </a-form-item>
          <a-form-item label="通道">
            <div>
              {channelFilter(formState.value.channelId, channelList.value)}
            </div>
          </a-form-item>
          <a-form-item label="发送等级">
            <div>{formState.value.level}</div>
          </a-form-item>
          <a-form-item label="通知内容">
            <a-textarea
              v-model={[formState.value.messageContent, "value"]}
              bordered={false}
              rows={4}
              readonly
              autoSize
              style={{ resize: "none" }}
            />
          </a-form-item>
        </a-form>
      </div>
    );
  },
});
