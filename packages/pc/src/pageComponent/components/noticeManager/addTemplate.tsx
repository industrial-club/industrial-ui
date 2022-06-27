import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "AddTemplate",
  setup() {
    const form = reactive({
      input: "",
      textarea: "",
    });
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
            <a-button style={{ marginRight: "20px" }}>取消</a-button>
            <a-button type="primary">确定</a-button>
          </a-form-item>
        </a-form>
      </div>
    );
  },
});
