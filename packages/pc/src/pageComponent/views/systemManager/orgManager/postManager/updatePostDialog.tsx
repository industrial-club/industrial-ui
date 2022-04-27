/*
 * @Abstract: 新增、查看、编辑 岗位信息
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-14 14:31:57
 */

import { defineComponent, computed, ref, PropType } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import useModalForm from "@/pageComponent/hooks/manage-module/useModalForm";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/org/postManager";

import {
  Modal,
  Form,
  FormItem,
  TreeSelect,
  Input,
  Textarea,
  Space,
  Button,
  message,
} from "ant-design-vue";

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
    const isVisible = useVModel(props, "visible", emit);

    const modalTitle = useModalTitle(props.mode, "岗位");

    const isView = computed(() => props.mode === "view");

    /* ===== 部门列表 ===== */
    const depList = ref([]);
    const getDepList = async () => {
      const list = await api.getDepList();
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
        await api.insertPostRecord(form.value);
        message.success("新增成功");
      } else if (props.mode === "edit") {
        await api.updatePostRecord({
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
              <Form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                <FormItem
                  name="depId"
                  required
                  label="所属部门"
                  rules={getRequiredRule("所属部门")}
                >
                  {isView.value ? (
                    <span>{props.record.depName}</span>
                  ) : (
                    <TreeSelect
                      fieldNames={{
                        label: "name",
                        value: "id",
                        children: "subList",
                      }}
                      treeData={depList.value}
                      v-model={[form.value.depId, "value"]}
                    ></TreeSelect>
                  )}
                </FormItem>
                <FormItem
                  name="name"
                  required
                  label="岗位名称"
                  rules={getRequiredRule("岗位名称")}
                >
                  {isView.value ? (
                    <span>{props.record.name}</span>
                  ) : (
                    <Input v-model={[form.value.name, "value"]} />
                  )}
                </FormItem>
                <FormItem name="remark" label="岗位描述">
                  {isView.value ? (
                    <span>{props.record.remark}</span>
                  ) : (
                    <Textarea v-model={[form.value.remark, "value"]} />
                  )}
                </FormItem>
              </Form>
            ),
            footer: () => (
              <Space>
                <Button onClick={() => (isVisible.value = false)}>关闭</Button>
                {!isView.value && (
                  <Button type="primary" onClick={handleSave}>
                    保存
                  </Button>
                )}
              </Space>
            ),
          }}
        </Modal>
      </div>
    );
  },
});

export default UpdatePostDialog;
