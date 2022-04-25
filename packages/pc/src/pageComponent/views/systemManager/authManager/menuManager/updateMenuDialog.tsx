/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-04-05 10:26:48
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:29:48
 */

import { defineComponent, ref, watch } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/auth/menuManager";

import { Modal, Form, FormItem, Input, Switch, message } from "ant-design-vue";
import IconSelect from "@/pageComponent/components/IconSelect";

const UpdateMenuDialog = defineComponent({
  emits: ["update:visible"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Object,
      required: true,
    },
    onRefresh: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const formRef = ref();

    const isVisible = useVModel(props, "visible", emit);

    const form = ref({
      code: "",
      name: "",
      url: "",
      valid: true,
      icon: undefined,
    });

    const handleCommit = async () => {
      await formRef.value.validate();
      await api.insertMenuRecord({
        ...form.value,
        valid: Number(form.value.valid),
        level: props.parent.level + 1,
        parentId: props.parent.id,
        softSysId: props.parent.softSysId,
      });
      message.success("添加成功");
      props.onRefresh?.();
      isVisible.value = false;
    };

    // 清空表单
    watch(isVisible, (val) => {
      if (!val) {
        formRef.value.resetFields();
      }
    });

    return () => (
      <div class="update-menu-dialog">
        <Modal
          title="添加菜单"
          v-model={[isVisible.value, "visible"]}
          onOk={handleCommit}
        >
          <Form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
            <FormItem
              label="菜单编码"
              name="code"
              required
              rules={getRequiredRule("菜单编码")}
            >
              <Input v-model={[form.value.code, "value"]}></Input>
            </FormItem>
            <FormItem
              label="页面名称"
              name="name"
              required
              rules={getRequiredRule("页面名称")}
            >
              <Input v-model={[form.value.name, "value"]}></Input>
            </FormItem>
            <FormItem
              label="页面URL"
              name="url"
              required
              rules={getRequiredRule("页面URL")}
            >
              <Input v-model={[form.value.url, "value"]}></Input>
            </FormItem>
            <FormItem label="启用状态" name="valid">
              <Switch v-model={[form.value.valid, "checked"]}></Switch>
            </FormItem>
            <FormItem label="ICON" name="icon">
              <IconSelect v-model={[form.value.icon, "value"]} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  },
});

export default UpdateMenuDialog;
