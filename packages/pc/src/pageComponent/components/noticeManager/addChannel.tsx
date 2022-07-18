import { defineComponent, reactive, ref, watch } from "vue";
import noticeCenterApi from "@/api/noticeCenter";
import { message } from "ant-design-vue";

const props = {
  formData: Object,
};
export default defineComponent({
  name: "AddChannel",
  props,
  emits: ["close"],
  setup(_props, _context) {
    // 表单数据
    const formState = ref<{
      id?: number;
      corpId?: string;
      channelName: string;
      available: boolean;
      notificationChannelConfigList?: null;
    }>({
      channelName: "",
      available: true,
    });

    // 提交表单
    const submit = async () => {
      if (formState.value.id) {
        const res = await noticeCenterApi.getChannelUpdate(formState.value);
        if (res.data) {
          message.success("保存成功");
          _context.emit("close");
        }
      } else {
        const res = await noticeCenterApi.getChannelAdd(formState.value);
        if (res.data) {
          message.success("保存成功");
          _context.emit("close");
        }
      }
    };

    watch(
      () => _props.formData,
      (e) => {
        if (e && e.id) {
          for (const key in e) {
            formState.value[key] = e[key];
          }
        } else {
          formState.value = {
            channelName: "",
            available: true,
          };
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <a-form
        model={formState.value}
        label-col={{ span: 8 }}
        wrapper-col={{ span: 16 }}
      >
        <a-form-item label="通道名称">
          <a-input
            v-model={[formState.value.channelName, "value"]}
            placeholder="请输入通道名称"
          />
        </a-form-item>
        <a-form-item label="通道状态">
          <a-switch v-model={[formState.value.available, "checked"]} />
        </a-form-item>
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
          <a-button type="primary" onClick={submit}>
            确定
          </a-button>
        </a-form-item>
      </a-form>
    );
  },
});
