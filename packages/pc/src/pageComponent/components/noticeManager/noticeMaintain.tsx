import { defineComponent } from "vue";
import noticeGrade from "@/pageComponent/components/noticeManager/noticeGrade";
import noticeTemplate from "@/pageComponent/components/noticeManager/noticeTemplate";

const props = {
  formData: Object,
};

export default defineComponent({
  name: "MaintainModal",
  components: {
    noticeGrade,
    noticeTemplate,
  },
  props,
  setup(_props, _context) {
    return () => (
      <div class="noticeMaintain">
        <div class="noticeMaintain-content">
          <a-tabs>
            <a-tab-pane key="1" tab="通知等级">
              <noticeGrade formData={_props.formData}></noticeGrade>
            </a-tab-pane>
            <a-tab-pane key="2" tab="通知模板">
              <noticeTemplate formData={_props.formData}></noticeTemplate>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    );
  },
});
