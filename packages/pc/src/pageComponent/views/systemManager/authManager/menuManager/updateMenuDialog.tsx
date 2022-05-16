/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-04-05 10:26:48
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 11:29:48
 */

import { defineComponent, inject, ref, watch } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/auth/menuManager";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";
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
    const urlMap = inject<IUrlObj>("urlMap")!;

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
      const isSystemParent = props.parent.id.startsWith("sys");
      await api.insertMenuRecord(urlMap.add)({
        ...form.value,
        valid: Number(form.value.valid),
        level: isSystemParent ? 1 : props.parent.level + 1,
        parentId: isSystemParent ? null : props.parent.id,
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
          centered
          v-model={[isVisible.value, "visible"]}
          onOk={handleCommit}
        >
          <a-form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
            <a-form-item
              label="菜单编码"
              name="code"
              required
              rules={getRequiredRule("菜单编码")}
            >
              <a-input v-model={[form.value.code, "value"]}></a-input>
            </a-form-item>
            <a-form-item
              label="页面名称"
              name="name"
              required
              rules={getRequiredRule("页面名称")}
            >
              <a-input v-model={[form.value.name, "value"]}></a-input>
            </a-form-item>
            <a-form-item
              label="页面URL"
              name="url"
              required
              rules={getRequiredRule("页面URL")}
            >
              <a-input v-model={[form.value.url, "value"]}></a-input>
            </a-form-item>
            <a-form-item label="启用状态" name="valid">
              <a-switch v-model={[form.value.valid, "checked"]}></a-switch>
            </a-form-item>
            <a-form-item label="ICON" name="icon">
              <IconSelect v-model={[form.value.icon, "value"]} />
            </a-form-item>
          </a-form>
        </Modal>
      </div>
    );
  },
});

export default UpdateMenuDialog;
