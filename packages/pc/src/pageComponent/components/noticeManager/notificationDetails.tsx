import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "NotificationDetails",
  setup() {
    // 表单数据
    const formState = reactive({
      title: "通知标题",
      addressee: "收件人",
      date: "lucy",
      time: "2022-6-27",
      level: "1",
      content: "",
      text: "全体厂矿人员, 生产系统计划定于6月23日15:00-15:30进行系统升级, 请相关人员做好准备。",
    });

    return () => (
      <div class="notificationDetails">
        <a-form
          model={formState}
          label-col={{ span: 4 }}
          wrapper-col={{ span: 20 }}
        >
          <a-form-item label="通知标题">
            <div>{formState.title}</div>
          </a-form-item>
          <a-form-item label="收件人">
            <div>{formState.addressee}</div>
          </a-form-item>
          <a-form-item label="发送时间">
            <a-row grade={24}>
              <a-col span={formState.date === "lucy" ? 10 : 24}>
                <div>{formState.date}</div>
              </a-col>
              {formState.date === "lucy" ? (
                <a-col span={12} offset="2">
                  <div>{formState.time}</div>
                </a-col>
              ) : null}
            </a-row>
          </a-form-item>
          <a-form-item label="发送等级">
            <div>{formState.level}</div>
          </a-form-item>
          <a-form-item label="通知内容">
            <a-textarea
              v-model={[formState.text, "value"]}
              bordered={false}
              rows={4}
              readonly
              autosize
              style={{ resize: "none" }}
            />
          </a-form-item>
        </a-form>
      </div>
    );
  },
});
