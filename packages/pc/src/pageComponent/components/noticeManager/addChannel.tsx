import { defineComponent, reactive, watch } from 'vue';

const props = {
  formData: Object,
};
export default defineComponent({
  name: 'AddChannel',
  props,
  setup(_props, _context) {
    const formState = reactive({
      name: '',
      state: true,
    });
    watch(
      () => _props.formData,
      (e) => {
        if (e) {
          formState.name = e.name;
          formState.state = e.state;
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );
    return () => (
      <a-form
        model={formState}
        label-col={{ span: 8 }}
        wrapper-col={{ span: 16 }}
      >
        <a-form-item label='通道名称'>
          <a-input
            v-model={[formState.name, 'value']}
            placeholder='请输入通道名称'
          />
        </a-form-item>
        <a-form-item label='通道状态'>
          <a-switch v-model={[formState.state, 'checked']} />
        </a-form-item>
      </a-form>
    );
  },
});
