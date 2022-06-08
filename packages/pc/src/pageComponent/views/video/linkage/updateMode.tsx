/**
 * 更新/新增 模式
 */

import { defineComponent, PropType, ref, watch, nextTick } from 'vue';
import useVModel from '@/hooks/userVModel';
import linkApi from '@/api/linkage';

import InputText from '@/components/inputText';

const rules = {
  modeName: { required: true, message: '模式名称是必填项' },
  modeCode: { required: true, message: '模式编码是必填项' },
};

const UpdateMode = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<'add' | 'update'>,
      required: true,
    },
    record: {
      type: Object,
    },
  },
  emits: ['update:visible', 'refresh'],
  setup(props, { emit }) {
    const formRef = ref();

    const isVisble = useVModel(props, 'visible', emit);

    // 拼接方式下拉列表
    const splicingList = ref<any[]>([]);
    const getSplicingList = async () => {
      const { data } = await linkApi.getSplicingList();
      splicingList.value = data;
    };
    getSplicingList();

    const form = ref<any>({
      modeName: '',
      modeCode: '',
      splicingId: 4,
    });
    const codeGroup = ref([]);

    // 视频布局编码list
    const spiceGroupList = ref<string[]>([]);
    const resetSpliceList = () => {
      spiceGroupList.value = Array.from({ length: form.value.splicingId }).map(
        (item, index) => `${index + 1}`,
      );
    };

    watch(() => form.value.splicingId, resetSpliceList, { immediate: true });

    // 保存
    const handleCommit = async () => {
      await formRef.value.validate();
      const data = {
        ...form.value,
        itemCodeGroup: spiceGroupList.value,
        splicingName: splicingList.value.find(
          (item) => item.id === form.value.splicingId,
        ).splicingName,
      };

      if (props.mode === 'add') {
        await linkApi.insertMode(data);
      } else {
        await linkApi.updateMode(data);
      }
      isVisble.value = false;
      emit('refresh');
    };

    // 打开时复制表单信息 关闭时重置表单
    watch(isVisble, async (val) => {
      if (val) {
        if (props.mode === 'update' && props.record) {
          const [data] = (await linkApi.getModeDetail(props.record.id)).data;
          form.value = {
            id: data.id,
            modeCode: data.modeCode,
            modeName: data.modeName,
            splicingId: Number(data.splicingId),
          };
          spiceGroupList.value = data.itemCodeGroup;
        }
      } else {
        formRef.value.resetFields();
        resetSpliceList();
      }
    });

    return {
      formRef,
      isVisble,
      form,
      codeGroup,
      splicingList,
      spiceGroupList,
      handleCommit,
    };
  },
  render() {
    return (
      <a-modal
        wrapClassName='update-mode-modal'
        title={`${this.mode === 'add' ? '添加' : '编辑'}窗口模式`}
        centered
        width={800}
        v-model={[this.isVisble, 'visible']}
        onOk={this.handleCommit}
      >
        {/* 表单 */}
        <a-form
          ref={(refs: any) => {
            this.formRef = refs;
          }}
          layout='inline'
          rules={rules}
          model={this.form}
        >
          <a-row>
            <a-col span={12}>
              <a-form-item name='modeName' label='模式名称'>
                <a-input
                  placeholder='输入模式名称'
                  v-model={[this.form.modeName, 'value']}
                />
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item name='modeCode' label='模式编码'>
                <a-input
                  placeholder='输入模式编码'
                  v-model={[this.form.modeCode, 'value']}
                />
              </a-form-item>
            </a-col>
            <a-col span={12}>
              <a-form-item name='splicingId' label='拼接方式'>
                <a-select v-model={[this.form.splicingId, 'value']}>
                  {this.splicingList.map((item) => (
                    <a-select-option key={item.id}>
                      {item.splicingName}
                    </a-select-option>
                  ))}
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        {/* 视频布局 */}
        <ul class={['layout', `layout${this.spiceGroupList.length}`]}>
          {this.spiceGroupList.map((item, index) => (
            <li class='layout-item'>
              <InputText
                style={{ width: '150px', height: '40px', textAlign: 'center' }}
                v-model={[this.spiceGroupList[index], 'value']}
              />
            </li>
          ))}
        </ul>
      </a-modal>
    );
  },
});

export default UpdateMode;
