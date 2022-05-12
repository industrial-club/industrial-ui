/*
 * @Abstract: 新增、查看、编辑 岗位信息
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-14 14:31:57
 */

import { defineComponent, computed, ref, PropType, inject } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import useModalForm from "@/pageComponent/hooks/manage-module/useModalForm";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/org/postManager";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";

const UpdatePostDialog = defineComponent({
  emits: ["update:visible"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<"view" | "add" | "edit">,
      required: true,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    onRefresh: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const urlMap = inject<IUrlObj>("urlMap")!;

    const isVisible = useVModel(props, "visible", emit);

    const modalTitle = useModalTitle(props.mode, "岗位");

    const isView = computed(() => props.mode === "view");

    /* ===== 部门列表 ===== */
    const depList = ref([]);
    const getDepList = async () => {
      const list = await api.getDepList(urlMap.depList)();
      depList.value = list;
    };
    getDepList();

    const { form, formRef } = useModalForm(
      isVisible,
      () => props.record,
      props.mode
    );

    /* 保存 */
    const handleSave = async () => {
      await formRef.value.validate();
      if (props.mode === "add") {
        await api.insertPostRecord(urlMap.add)(form.value);
        message.success("新增成功");
      } else if (props.mode === "edit") {
        await api.updatePostRecord(urlMap.update)({
          ...form.value,
          createDt: null,
        });
        message.success("修改成功");
      }
      isVisible.value = false;
      props.onRefresh?.();
    };

    return () => (
      <div class="update-post-dialog">
        <Modal
          title={modalTitle.value}
          centered
          v-model={[isVisible.value, "visible"]}
        >
          {{
            default: () => (
              <a-form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                <a-form-item
                  name="depId"
                  required
                  label="所属部门"
                  rules={getRequiredRule("所属部门")}
                >
                  {isView.value ? (
                    <span>{props.record.depName}</span>
                  ) : (
                    <a-tree-select
                      fieldNames={{
                        label: "name",
                        value: "id",
                        children: "subList",
                      }}
                      treeData={depList.value}
                      v-model={[form.value.depId, "value"]}
                    ></a-tree-select>
                  )}
                </a-form-item>
                <a-form-item
                  name="name"
                  required
                  label="岗位名称"
                  rules={getRequiredRule("岗位名称")}
                >
                  {isView.value ? (
                    <span>{props.record.name}</span>
                  ) : (
                    <a-input v-model={[form.value.name, "value"]} />
                  )}
                </a-form-item>
                <a-form-item name="remark" label="岗位描述">
                  {isView.value ? (
                    <span>{props.record.remark}</span>
                  ) : (
                    <a-textarea v-model={[form.value.remark, "value"]} />
                  )}
                </a-form-item>
              </a-form>
            ),
            footer: () => (
              <a-space>
                <a-button onClick={() => (isVisible.value = false)}>
                  关闭
                </a-button>
                {!isView.value && (
                  <a-button type="primary" onClick={handleSave}>
                    保存
                  </a-button>
                )}
              </a-space>
            ),
          }}
        </Modal>
      </div>
    );
  },
});

export default UpdatePostDialog;
