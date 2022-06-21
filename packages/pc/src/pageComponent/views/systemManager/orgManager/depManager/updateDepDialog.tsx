/*
 * @Abstract: 新建 更新 部门对话框
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-25 15:12:45
 */

import { computed, defineComponent, inject, PropType, ref, watch } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import useModalForm from "@/pageComponent/hooks/manage-module/useModalForm";
import { omit } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/api/org/depManager";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";
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
    const urlMap = inject<IUrlObj>("urlMap")!;

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
      const { data } = await api.getDepData(urlMap.tree)({});
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
      const { data } = await api.getDepEmployeeSelectList(urlMap.empSelect)(
        props.record.id,
        0
      );
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
        await api.insertDepRecord(urlMap.add)({
          ...data,
          parentId: isTopLevel ? null : props.parent.id,
          level: isTopLevel ? 1 : props.parent.level + 1,
          orgId: 1,
          valid: form.value.valid ?? 1,
        });
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.updateDepRecord(urlMap.update)({
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
                <a-form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                  <a-form-item
                    name="code"
                    required
                    label="部门编号"
                    rules={getRequiredRule("部门编号")}
                  >
                    {isView.value ? (
                      <span>{props.record.code}</span>
                    ) : (
                      <a-input v-model={[form.value.code, "value"]} />
                    )}
                  </a-form-item>
                  <a-form-item
                    name="name"
                    required
                    label="部门名称"
                    rules={getRequiredRule("部门名称")}
                  >
                    {isView.value ? (
                      <span>{props.record.name}</span>
                    ) : (
                      <a-input v-model={[form.value.name, "value"]} />
                    )}
                  </a-form-item>
                  {/* 新建部门 不选择上级部门 */}
                  {props.mode !== "add" && (
                    <a-form-item
                      name="parentId"
                      required
                      label="上级部门"
                      rules={getRequiredRule("上级部门")}
                    >
                      {isView.value ? (
                        <span>{props.record.parentName}</span>
                      ) : (
                        <a-tree-select
                          v-model={[form.value.parentId, "value"]}
                          treeData={filteredDepList.value}
                          treeDefaultExpandAll
                          fieldNames={{
                            value: "id",
                            label: "name",
                            children: "subList",
                          }}
                        ></a-tree-select>
                      )}
                    </a-form-item>
                  )}

                  {/* 新建部门 不选择负责人 */}
                  <a-form-item name="bossId" label="部门负责人">
                    {isView.value ? (
                      <span>{props.record.bossName}</span>
                    ) : (
                      <a-select v-model={[form.value.bossId, "value"]}>
                        {employeeList.value.map((item: any) => (
                          <a-select-option key={item.id}>
                            {item.name}
                          </a-select-option>
                        ))}
                      </a-select>
                    )}
                  </a-form-item>
                  <a-form-item name="valid" label="部门状态">
                    {isView.value ? (
                      <span>{props.record.valid ? "启用" : "禁用"}</span>
                    ) : (
                      <a-select
                        defaultValue={1}
                        v-model={[form.value.valid, "value"]}
                      >
                        <a-select-option key={1}>启用</a-select-option>
                        <a-select-option key={0}>禁用</a-select-option>
                      </a-select>
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
    };
  },
});

export default UpdateDepDialog;
