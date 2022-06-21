import { defineComponent } from "vue";
import noticeGrade from "@/pageComponent/components/noticeManager/noticeGrade";
import noticeTemplate from "@/pageComponent/components/noticeManager/noticeTemplate";

export default defineComponent({
  name: "MaintainModal",
  components: {
    noticeGrade,
    noticeTemplate,
  },
  setup() {
    return () => (
      <div class="noticeMaintain">
        <div class="noticeMaintain-content">
          <a-tabs>
            <a-tab-pane key="1" tab="通知等级">
              <noticeGrade></noticeGrade>
            </a-tab-pane>
            <a-tab-pane key="2" tab="通知模板">
              <noticeTemplate></noticeTemplate>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    );
  },
});
