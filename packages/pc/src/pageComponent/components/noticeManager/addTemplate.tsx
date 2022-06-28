import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "AddTemplate",
  emits: ["close"],
  setup(_props, _context) {
    // 模板表单
    const form = reactive({
      input: "",
      textarea: "",
    });

    // 提交表单
    const submit = async () => {
      _context.emit("close");
    };

    return () => (
      <div class="addTemplate">
        <a-form
          model={form}
          name="basic"
          label-col={{ span: 8 }}
          wrapper-col={{ span: 16 }}
        >
          <a-form-item label="模板名称">
            <a-input v-model={[form.input, "value"]} placeholder="模板名称" />
          </a-form-item>
          <a-form-item label="模板内容">
            <a-textarea
              v-model={[form.textarea, "value"]}
              placeholder="模板内容"
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
