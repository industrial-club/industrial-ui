import { defineComponent, reactive, ref } from 'vue';
import * as thingApis from '@/api/developerCenter/thingInstance';

interface ModalStateI {
  visible: boolean;
  title: string;
  activeKey: string;
  thingCode: string;
  thingType: string;
  info: any;
}
export default defineComponent({
  setup(_, { expose }) {
    const state = reactive<ModalStateI>({
      visible: false,
      title: '实例',
      activeKey: 'property', //Tab
      thingCode: 'property',
      thingType: '',
      info: {},
    });
    const formRefProp = ref();
    const formRefMetric = ref();
    const propertyState = reactive({
      property: [],
      metric: [],
    });
    const showModal = (row: any, thingCode: string) => {
      if (row) {
        state.title = '编辑';
        findThingProperties(row.id);
      } else {
        state.title = '新增';
      }
      state.thingCode = thingCode;
      findTypeProperties(thingCode);
      findByCode(thingCode);
      state.visible = true;
    };
    const findTypeProperties = (thingCode: string) => {
      thingApis.findTypeProperties(thingCode).then((res) => {
        const { property, metric } = res.data;
        propertyState.property = property;
        propertyState.metric = metric;
      });
    };
    const findByCode = (thingCode: string) => {
      thingApis.findByCode(thingCode).then((res) => {
        state.thingType = res.data.thingType;
      });
    };
    const findThingProperties = (id: string) => {
      thingApis.findThingProperties(id).then((res) => {
        state.info = res.data;
      });
    };
    expose({
      showModal,
    });
    return () => (
      <a-modal
        v-model={[state.visible, 'visible']}
        width='1100px'
        class='instance_modal'
        title={state.title}
      >
        <div class='base_wrap'>
          <img src='' alt='' />
          <div class='base_info'>
            <div class='flex_lr_c'>
              <h3>主选两产品重介旋流器</h3>
              <a-button type='primary'>编辑</a-button>
            </div>
            <div class='base_info_list mar-t-20'>
              <div>
                <a-space>
                  <span class='color-6'>名称：</span>
                  <span class='color-3'>3104</span>
                </a-space>
              </div>
              <div class='mar-t-10'>
                <a-space>
                  <span class='color-6'>编码：</span>
                  <span class='color-3'>3104</span>
                </a-space>
              </div>
              {(state.thingType === 'device' ||
                state.thingType === 'component' ||
                state.thingType === 'system_it') && (
                <div class='mar-t-10'>
                  <a-space>
                    <span class='color-6'>厂家/品牌/型号：</span>
                    <span class='color-3'>3104</span>
                  </a-space>
                </div>
              )}
            </div>
          </div>
        </div>
        <div class='param_wrap border-10-gray'>
          <a-tabs v-model={[state.activeKey, 'activeKey']}>
            <a-tab-pane key='property' tab='基础属性'>
              <a-form ref={formRefProp}>
                <a-row></a-row>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key='metric' tab='动态属性' force-render>
              Content of Tab Pane 2
            </a-tab-pane>
            <a-tab-pane key='alarm' tab='报警'>
              Content of Tab Pane 3
            </a-tab-pane>
            <a-tab-pane key='action' tab='动作'>
              Content of Tab Pane 3
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-modal>
    );
  },
});
