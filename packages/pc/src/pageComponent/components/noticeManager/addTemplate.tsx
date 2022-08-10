import {
  defineComponent,
  reactive,
  ref,
  watch,
  PropType,
  onMounted,
} from "vue";
import noticeCenterApi from "@/api/noticeCenter";
import { message } from "ant-design-vue";

const props = {
  formData: {
    type: Object as PropType<{ [key: string]: string }>,
  },
  channelId: String,
};

// 表单校验
const rules = {
  templateName: [
    { required: true, message: "请输入模板名称", trigger: "blur" },
  ],
  templateContent: [
    { required: true, max: 500, message: "请输入模板内容", trigger: "blur" },
  ],
};

export default defineComponent({
  name: "AddTemplate",
  emits: ["close"],
  props,
  setup(_props, _context) {
    const formRef = ref();
    // 模板表单
    const form = ref<{
      [key: string]: string;
    }>({
      templateName: "",
      templateContent: "",
    });

    // 提交表单
    const submit = () => {
      formRef.value.validateFields().then(async () => {
        const res = await noticeCenterApi.getChannelTemplateAdd(form.value);
        if (res.data) {
          message.success("保存成功");
          _context.emit("close");
        }
      });
    };
    watch(
      () => _props.formData,
      (e) => {
        if (e && e.id) {
          for (const key in _props.formData) {
            form.value[key] = _props.formData[key];
          }
        } else {
          form.value = {
            channelId: _props.channelId || "",
          };
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <div class="addTemplate">
        <a-form
          model={form.value}
          ref={formRef}
          rules={rules}
          label-col={{ span: 8 }}
          wrapper-col={{ span: 16 }}
        >
          <a-form-item label="模板名称" name="templateName">
            <a-input
              v-model={[form.value.templateName, "value"]}
              placeholder="模板名称"
            />
          </a-form-item>
          <a-form-item label="模板内容" name="templateContent">
            <a-textarea
              v-model={[form.value.templateContent, "value"]}
              placeholder="模板内容"
              showCount
              maxlength={500}
              rows={8}
            />
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
      </div>
    );
  },
});
