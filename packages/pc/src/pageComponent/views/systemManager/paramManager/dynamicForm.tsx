/*
 * @Abstract: 动态表单
 * @Author: wang liang
 * @Date: 2022-03-25 09:02:59
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-31 10:38:03
 */
import { computed, defineComponent, inject, ref, unref, watch } from "vue";
import useProxy from "@/pageComponent/hooks/useProxy";
import { api } from "@/pageComponent/api/param";
import { IUrlObj } from "./index";

import ProFormItem from "@/pageComponent/components/ProFormItem";

const DynamicForm = defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const urmMap = inject<IUrlObj>("urlMap")!;

    const proxy = useProxy();

    /* ===== 获取表单描述列表 ===== */
    const formDescList = ref([]);
    const getFormDescList = async () => {
      const { data } = await api.getParamDefineList(urmMap.define)(props.id);
      formDescList.value = data.paramDefineValueVoList;
    };
    getFormDescList();

    /* ===== 表单相关逻辑 ===== */
    const formRef = ref();
    const form = ref();
    const valueDefineMap = ref(new Map());
    watch(formDescList, (val) => {
      valueDefineMap.value = new Map();
      // 设置表单的初始值
      form.value = val.reduce((prev: any, curr: any) => {
        prev[curr.paramDefine.code] = curr.paramDefineValue.value;
        valueDefineMap.value.set(curr.paramDefine.code, curr.paramDefineValue);
        return prev;
      }, {});
    });
    // 表单元素变化 更新form
    const handleFieldChange = (name: string, value: any) => {
      form.value[name] = value;
    };
    // 表单提交 暴露给父组件的方法
    proxy._confirm = async () => {
      await formRef.value.validate();
      // 组合value以及对应的valueDefine对象 (接口需要)
      const res: any[] = [];
      for (const key in form.value) {
        res.push({
          key,
          value: form.value[key],
          valueDefine: valueDefineMap.value.get(key),
        });
      }
      return res;
    };

    // 刷新表单  用于更新之后
    proxy._update = async () => {
      await getFormDescList();
    };

    return () => (
      <div class="dynamic-form">
        <a-form ref={formRef} labelCol={{ span: 10 }} model={form.value}>
          <a-row gutter={16}>
            {formDescList.value.map((item: any, index) => (
              <a-col key={index} xl={6} lg={8} md={12} xs={24}>
                <ProFormItem description={item} onChange={handleFieldChange} />
              </a-col>
            ))}
          </a-row>
        </a-form>
      </div>
    );
  },
});

export default DynamicForm;
