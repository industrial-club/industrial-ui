import { computed, defineComponent, PropType, watch, inject, ref } from "vue";
import $store from "@/pageComponent/store";

// import NoticePeopleSelect from '@/components/notice-people-select';
import CheckPeople from "@/pageComponent/components/check-people";

const props = {
  enumObj: {
    type: Object as PropType<{ [key: string]: Array<any> }>,
  },
};
/**
 * 联动配置表单
 */
const LinkageForm = defineComponent({
  props,
  setup(_props, _ctx) {
    // 把formRef传给页面根组件
    const formRef = ref();
    const setFormRef: any = inject("setFormRef");
    setFormRef(formRef);

    // 报警类型是否为阈值类
    const isThread = computed(
      () => $store.state.basicForm.alarmType === "THRESHOLD"
    );

    const linkageForm = ref<any>({
      videoAvailable: false, // 联动视频
      audioAvailable: true, // 语音播报
      notificationStageList: ["CREATE"], // 通知阶段
      notificationUserList: [], // 通知人员
    });

    // 表单回显
    watch(
      () => $store.state.linkageForm,
      (val) => {
        linkageForm.value = val;
      }
    );

    watch(
      () => linkageForm,
      (e) => {
        if (e) {
          $store.commit("setLinkageForm", e);
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return () => (
      <div class="linkage-form form">
        <h2 class="form-title">联动配置</h2>
        <div class="form-container">
          <a-form
            ref={formRef}
            colon={false}
            label-col={{ span: 2 }}
            wrapper-col={{ span: 22 }}
            model={linkageForm.value}
          >
            <a-row gutter={16}>
              <a-col span={24}>
                <a-form-item label="是否录像">
                  <a-switch
                    v-model={[linkageForm.value.videoAvailable, "checked"]}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </a-form-item>
              </a-col>
              <a-col span={24}>
                <a-form-item label="是否抓拍">
                  <a-switch
                    v-model={[linkageForm.value.videoAvailable, "checked"]}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </a-form-item>
              </a-col>
              <a-col span={24}>
                <a-form-item label="语音播报">
                  <a-switch
                    v-model={[linkageForm.value.audioAvailable, "checked"]}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                  />
                </a-form-item>
              </a-col>
              <a-col span={24}>
                <a-form-item label="通知阶段">
                  <a-checkbox-group
                    v-model={[linkageForm.value.notificationStageList, "value"]}
                    options={(
                      (isThread.value
                        ? _props.enumObj?.AlarmActionEnum
                        : _props.enumObj?.AlarmActionEnum?.slice(0, 2)) as any[]
                    ).map((item) => ({
                      label: item.name,
                      value: item.code,
                    }))}
                  />
                </a-form-item>
              </a-col>
              <a-col span={24}>
                <a-form-item label="通知人员">
                  <CheckPeople
                    v-model={[linkageForm.value.notificationUserList, "value"]}
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    );
  },
});

export default LinkageForm;
