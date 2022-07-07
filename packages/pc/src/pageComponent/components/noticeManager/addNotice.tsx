import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import getDepPeopleTreeList from "@/api/enumList";
import { fomatDepPeopleTree } from "@/pageComponent/utils/format";
import noticeCenterApi from "@/api/noticeCenter";
import noticeManagerApi from "@/api/noticeManager";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";

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
const rules = {
  messageTitle: [
    { required: true, message: "请输入通知标题", trigger: "blur" },
  ],
  receiverId: [{ required: true, message: "请选择收件人", trigger: "change" }],
  sendType: [{ required: true, message: "请选择发送时间", trigger: "change" }],
  channelId: [{ required: true, message: "请选择通道", trigger: "change" }],
  level: [{ required: true, message: "请选择等级", trigger: "change" }],
  messageContent: [{ required: true, message: "请输入内容", trigger: "blur" }],
};

export default defineComponent({
  name: "AddNotice",
  props,
  emits: ["close"],
  setup(_props, _context) {
    const formRef = ref();
    const loading = ref(false);
    // 表单数据
    const formState = ref<{
      id?: string;
      messageTitle?: string;
      receiverInfos?: Array<reactiverInfoItem>;
      receiverName?: string;
      receiverId?: Array<string | number>;
      receiverIds?: Array<string | number>;
      sendType?: string | number;
      expectSendTime?: string | number;
      channelId?: string | number;
      level?: string | number;
      content?: string | number;
      messageContent?: string;
    }>({});

    // 收件人数据
    const options = ref([]);

    // 通知等级数据
    const channelDetailList = ref<Array<{ [key: string]: string | number }>>(
      []
    );

    // 通道数据
    const channelList = ref<Array<{ [key: string]: string | number }>>([]);

    // 模板数据
    const channelTemplateList = ref<Array<{ [key: string]: string }>>([]);

    // 获取组织机构数据
    const depPeopleTreeList = async () => {
      const { data } = await getDepPeopleTreeList();
      if (data.departmentList && data.departmentList.length > 0) {
        const res = fomatDepPeopleTree(data.departmentList);
        options.value = res;
      } else {
        options.value = [];
      }
    };

    // 获取等级数据
    const getChannelDetail = async (id) => {
      const res = await noticeCenterApi.getChannelDetail(id);
      if (res.data && res.data.length > 0) {
        channelDetailList.value = res.data.filter((n) => n.available);
        formState.value.level = channelDetailList.value[0].level;
      } else {
        channelDetailList.value = [];
      }
    };

    // 获取通道数据
    const getChannelList = async () => {
      const res = await noticeCenterApi.getChannelList();
      if (res.data && res.data.length > 0) {
        channelList.value = res.data.filter((n) => n.available);
      } else {
        channelList.value = [];
      }
    };

    // 获取模板数据
    const getChannelTemplateList = async (id) => {
      const res = await noticeCenterApi.getChannelTemplateList({
        pageNum: 1,
        pageSize: 9999,
        channelId: id,
      });
      if (res.data && res.data.records.length > 0) {
        channelTemplateList.value = res.data.records;
      } else {
        channelTemplateList.value = [];
      }
    };

    // 提交
    const submit = () => {
      formRef.value.validateFields().then(async () => {
        console.log(formState.value.expectSendTime);
        if (
          formState.value.sendType === "DELAY" &&
          !formState.value.expectSendTime
        ) {
          message.error("请选择时间");
          return false;
        }
        if (
          formState.value.sendType === "DELAY" &&
          dayjs(formState.value.expectSendTime).valueOf() < dayjs().valueOf()
        ) {
          message.error("请正确选择时间");
          return false;
        }
        loading.value = true;
        const res = await noticeManagerApi.sendMessage(formState.value);
        if (res.data) {
          const codes = [-1, -2, -3];
          if (codes.indexOf(res.data) > -1) {
            message.error("通道不可用");
            loading.value = false;
          } else {
            message.success("保存成功");
            _context.emit("close");
            loading.value = false;
          }
        }
      });
    };

    const reactiverChange = (value, selectedOptions) => {
      let list: any = [];
      formState.value.receiverId = [];
      selectedOptions.forEach((item) => {
        if (item.children) {
          list = [...list, ...item[item.length - 1]];
        } else {
          list.push(item[item.length - 1]);
        }
      });
      reactiver(list);
    };
    // receiverId
    const reactiver = (val) => {
      val.forEach((item) => {
        if (item.children) {
          reactiver(item.children);
        } else {
          formState.value.receiverId?.push(item.value);
        }
      });
    };
    watch(
      () => _props.formData,
      (e) => {
        formState.value = {};
        if (e) {
          if (e.id) {
            formState.value.receiverId = [];
            for (const key in e) {
              formState.value[key] = e[key];
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
            formState.value.receiverId = qc?.map((item: any) => {
              if (item.receiverId && item.receiverId !== null) {
                return item.receiverId;
              }
            });
            formState.value.content = "";
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    const range = (start: number, end: number) => {
      const result: Array<number> = [];

      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };
    const disabledDate = (current) => {
      return current < dayjs().subtract(1, "days");
    };
    const disabledDateTime = (date) => {
      if (dayjs(date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")) {
        return {
          disabledHours: () => range(0, dayjs().hour() + 1),
        };
      }
    };
    onMounted(() => {
      depPeopleTreeList();
      getChannelList();
    });
    return () => (
      <a-form
        ref={formRef}
        model={formState.value}
        label-col={{ span: 4 }}
        wrapper-col={{ span: 20 }}
        rules={rules}
      >
        <a-form-item label="通知标题" name="messageTitle">
          <a-input
            v-model={[formState.value.messageTitle, "value"]}
            placeholder="请输入通知标题"
          />
        </a-form-item>
        <a-form-item label="收件人" name="receiverId">
          {formState.value.id ? (
            <div>{formState.value.receiverName}</div>
          ) : (
            <a-cascader
              v-model={[formState.value.receiverIds, "value"]}
              options={options.value}
              multiple
              placeholder="请选择收件人"
              onChange={reactiverChange}
            />
          )}
        </a-form-item>
        <a-form-item label="发送时间" name="sendType">
          <a-row grade={24}>
            <a-col span={formState.value.sendType === "DELAY" ? 10 : 24}>
              <a-select
                v-model={[formState.value.sendType, "value"]}
                placeholder="请选择发送时间"
              >
                <a-select-option value="IMMEDIATELY">立即发送</a-select-option>
                <a-select-option value="DELAY">延迟发送</a-select-option>
                {/* <a-select-option value="TIMING">定时发送</a-select-option> */}
              </a-select>
            </a-col>
            {formState.value.sendType === "DELAY" ? (
              <a-col span={12} offset="2">
                <a-date-picker
                  show-time
                  showNow={false}
                  onChange={(date, dateString) => {
                    if (dayjs(dateString).valueOf() < dayjs().valueOf()) {
                      message.error("请正确选择时间");
                    }
                  }}
                  disabled-date={disabledDate}
                  disabled-time={disabledDateTime}
                  v-model={[formState.value.expectSendTime, "value"]}
                />
              </a-col>
            ) : null}
          </a-row>
        </a-form-item>
        <a-form-item label="通道" name="channelId">
          <a-select
            v-model={[formState.value.channelId, "value"]}
            placeholder="请选择通道"
            onChange={(e) => {
              getChannelDetail(e);
              getChannelTemplateList(e);
              formState.value.level = undefined;
              formState.value.content = undefined;
            }}
          >
            {channelList.value.map((item) => (
              <a-select-option value={item.id}>
                {item.channelName}
              </a-select-option>
            ))}
          </a-select>
        </a-form-item>
        <a-form-item label="发送等级" name="level">
          <a-select
            v-model={[formState.value.level, "value"]}
            placeholder="请先选择通道"
            disabled={!formState.value.channelId}
          >
            {channelDetailList.value.map((item) => (
              <a-select-option value={item.level}>{item.level}</a-select-option>
            ))}
          </a-select>
        </a-form-item>
        <a-form-item label="通知内容" name="messageContent">
          <a-select
            v-model={[formState.value.content, "value"]}
            placeholder="导入模板内容"
            disabled={!formState.value.channelId}
            style={{ marginBottom: "10px" }}
            onChange={(e) => {
              const messageContent = channelTemplateList.value.find(
                (n) => n.id === e
              );
              formState.value.messageContent =
                messageContent?.templateContent || "";
            }}
          >
            {channelTemplateList.value.map((item) => (
              <a-select-option value={item.id}>
                {item.templateName}
              </a-select-option>
            ))}
          </a-select>
          <a-textarea
            v-model={[formState.value.messageContent, "value"]}
            rows={4}
          />
        </a-form-item>
        <a-form-item label colon={false}></a-form-item>
        <a-form-item
          label
          colon={false}
          style={{ textAlign: "right", marginBottom: "0" }}
        >
          <a-button
            style={{ marginRight: "20px" }}
            onClick={() => {
              _context.emit("close");
            }}
          >
            取消
          </a-button>
          <a-button type="primary" loading={loading.value} onClick={submit}>
            确定
          </a-button>
        </a-form-item>
      </a-form>
    );
  },
});
