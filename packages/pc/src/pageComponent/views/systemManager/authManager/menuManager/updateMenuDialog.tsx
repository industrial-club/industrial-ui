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
import api from "@/api/auth/menuManager";
import { IUrlObj, openMode } from "./index";

import { Modal, message } from "ant-design-vue";
import IconSelect from "@/pageComponent/components/IconSelect";
import MenuForm from "./menuForm";

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
      mode: 0,
    });

    const handleCommit = async () => {
      const data = await formRef.value._validate();
      const isSystemParent = props.parent.id.startsWith("sys");
      await api.insertMenuRecord(urlMap.add)({
        ...data,
        valid: Number(data.valid),
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
        formRef.value._resetFields();
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
          <MenuForm ref={formRef} form={form.value} />
        </Modal>
      </div>
    );
  },
});

export default UpdateMenuDialog;
