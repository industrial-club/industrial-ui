/*
 * @Abstract: 新建 更新 部门对话框
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-25 15:12:45
 */

import { computed, defineComponent, PropType, ref, watch } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import useModalForm from "@/pageComponent/hooks/manage-module/useModalForm";
import { omit } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/org/depManager";

import {
  Modal,
  Form,
  FormItem,
  Select,
  SelectOption,
  Input,
  TreeSelect,
  Space,
  Button,
  message,
} from "ant-design-vue";
import { isEmpty } from "lodash";

const UpdateDepDialog = defineComponent({
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
    parent: {
      type: Object,
      default: () => ({}),
    },
    onRefresh: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const isVisible = useVModel(props, "visible", emit);

    const modalTitle = useModalTitle(props.mode, "部门");

    const isView = computed(() => props.mode === "view");

    const { form, formRef } = useModalForm(
      isVisible,
      () => props.record,
      props.mode
    );

    /* ===== 下拉列表 ===== */
    // 部门列表
    const depList = ref<any[]>([]);
    const getDepList = async () => {
      const { data } = await api.getDepData({});
      depList.value = [data].map((item) => {
        item.subList = item.departmentList;
        item.id = `sys${item.id}`;
        // item.disabled = true;
        return item;
      });
    };
    // 过滤的部门列表 过滤当前部门id
    const filteredDepList = computed(() => {
      function fDep(dep: any) {
        return dep
          .map((item: any) => {
            if (item.id !== form.value.id) {
              return {
                ...item,
                subList: fDep(item.subList),
              };
            }
          })
          .filter(Boolean);
      }
      return fDep(depList.value);
    });
    getDepList();

    // 员工列表
    const employeeList = ref([]);
    // 选择部门列表时获取员工列表 (当前部门和上一级部门)
    const getEmployeeList = async () => {
      if (!props.record.id) return;
      const { data } = await api.getDepEmployeeSelectList(props.record.id, 0);
      employeeList.value = data;
    };

    watch(isVisible, async () => {
      if (isEmpty(props.record) || !isVisible.value) return;
      await Promise.resolve();
      getEmployeeList();
      await Promise.resolve();
      if (props.mode === "edit" && form.value.parentId === null) {
        form.value.parentId = depList.value[0]?.id;
      }
    });

    /* 保存 */
    const handleSave = async () => {
      await formRef.value.validate();

      const data = { ...form.value };
      const isTopLevel = `${props.parent.id}`.startsWith("sys");
      if (props.mode === "add") {
        await api.insertDepRecord({
          ...data,
          parentId: isTopLevel ? null : props.parent.id,
          level: isTopLevel ? 1 : props.parent.level + 1,
          orgId: 1,
          valid: form.value.valid ?? 1,
        });
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.updateDepRecord({
          ...omit(data, "subList"),
          parentId: isTopLevel ? null : props.parent.id,
        });
        message.success("修改成功");
      }
      props.onRefresh?.();
      isVisible.value = false;
    };

    return () => {
      return (
        <div class="update-dep-dialog">
          <Modal
            title={modalTitle.value}
            centered
            v-model={[isVisible.value, "visible"]}
          >
            {{
              default: () => (
                <Form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                  <FormItem
                    name="code"
                    required
                    label="部门编号"
                    rules={getRequiredRule("部门编号")}
                  >
                    {isView.value ? (
                      <span>{props.record.code}</span>
                    ) : (
                      <Input v-model={[form.value.code, "value"]} />
                    )}
                  </FormItem>
                  <FormItem
                    name="name"
                    required
                    label="部门名称"
                    rules={getRequiredRule("部门名称")}
                  >
                    {isView.value ? (
                      <span>{props.record.name}</span>
                    ) : (
                      <Input v-model={[form.value.name, "value"]} />
                    )}
                  </FormItem>
                  {/* 新建部门 不选择上级部门 */}
                  {props.mode !== "add" && (
                    <FormItem
                      name="parentId"
                      required
                      label="上级部门"
                      rules={getRequiredRule("上级部门")}
                    >
                      {isView.value ? (
                        <span>{props.record.parentName}</span>
                      ) : (
                        <TreeSelect
                          v-model={[form.value.parentId, "value"]}
                          treeData={filteredDepList.value}
                          treeDefaultExpandAll
                          fieldNames={{
                            value: "id",
                            label: "name",
                            children: "subList",
                          }}
                        ></TreeSelect>
                      )}
                    </FormItem>
                  )}

                  {/* 新建部门 不选择负责人 */}
                  <FormItem name="bossId" label="部门负责人">
                    {isView.value ? (
                      <span>{props.record.bossName}</span>
                    ) : (
                      <Select v-model={[form.value.bossId, "value"]}>
                        {employeeList.value.map((item: any) => (
                          <SelectOption key={item.id}>{item.name}</SelectOption>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem name="valid" label="部门状态">
                    {isView.value ? (
                      <span>{props.record.valid ? "启用" : "禁用"}</span>
                    ) : (
                      <Select
                        defaultValue={1}
                        v-model={[form.value.valid, "value"]}
                      >
                        <SelectOption key={1}>启用</SelectOption>
                        <SelectOption key={0}>禁用</SelectOption>
                      </Select>
                    )}
                  </FormItem>
                </Form>
              ),
              footer: () => (
                <Space>
                  <Button onClick={() => (isVisible.value = false)}>
                    关闭
                  </Button>
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
    };
  },
});

export default UpdateDepDialog;
