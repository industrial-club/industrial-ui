import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "AddNotice",
  emits: ["close"],
  setup(_props, _context) {
    // 表单数据
    const formState = reactive({
      title: "",
      addressee: "",
      date: "",
      time: "",
      level: "",
      content: "",
      text: "",
    });

    // 提交
    const submit = async () => {
      _context.emit("close");
    };

    return () => (
      <a-form
        model={formState}
        label-col={{ span: 8 }}
        wrapper-col={{ span: 16 }}
      >
        <a-form-item label="通知标题">
          <a-input
            v-model={[formState.title, "value"]}
            placeholder="请输入通道名称"
          />
        </a-form-item>
        <a-form-item label="收件人">
          <a-select v-model={[formState.addressee, "value"]}>
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled" disabled>
              Disabled
            </a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发送时间">
          <a-row grade={24}>
            <a-col span={formState.date === "lucy" ? 10 : 24}>
              <a-select v-model={[formState.date, "value"]}>
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </a-col>
            {formState.date === "lucy" ? (
              <a-col span={12} offset="2">
                <a-date-picker show-time v-model={[formState.time, "value"]} />
              </a-col>
            ) : null}
          </a-row>
        </a-form-item>
        <a-form-item label="发送等级">
          <a-select v-model={[formState.level, "value"]}>
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled" disabled>
              Disabled
            </a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="通知内容">
          <a-select v-model={[formState.content, "value"]}>
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled" disabled>
              Disabled
            </a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label colon={false}>
          <a-textarea v-model={[formState.text, "value"]} rows={4} />
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
