/*
 * @Abstract: 新增、查看、编辑 班组信息
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 13:46:27
 */

import { computed, defineComponent, inject, PropType, ref, watch } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import useModalForm from "@/pageComponent/hooks/manage-module/useModalForm";
import api from "@/pageComponent/api/org/teamManager";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";
import SearchSelect from "@/pageComponent/components/SearchSelect";

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

    const modalTitle = useModalTitle(props.mode, "班组");

    const isView = computed(() => props.mode === "view");

    const { form, formRef } = useModalForm(
      isVisible,
      () => props.record,
      props.mode,
      (r) => {
        r.memberIds = r?.memberIds?.split(",") ?? [];
      }
    );

    watch(form, () => {
      getEmployeeList(false);
    });

    /* ===== 下拉列表 ===== */
    // 部门列表
    const depList = ref<any[]>([]);
    const getDepList = async () => {
      const list = await api.getDepList(urlMap.depList)();
      depList.value = list;
    };
    getDepList();

    // 员工列表
    const employeeList = ref([]);
    // 选择部门列表时获取员工列表
    const getEmployeeList = async (isClean = true) => {
      if (!form.value.depId) return;
      const { data } = await api.getEmployeeList(urlMap.empList)(
        form.value.depId
      );
      employeeList.value = data;
      // 清空选中的员工和班长
      if (isClean) {
        form.value.memberIds = [];
        form.value.leaderId = undefined;
      }
    };

    // 岗位列表
    const postList = ref([]);
    const getPostList = () => {
      api
        .getPostList(urlMap.postList)({ depId: form.value.depId })
        .then(({ data }) => (postList.value = data));
    };

    watch(
      () => form.value.depId,
      (val) => {
        if (val) getPostList();
      },
      { immediate: true }
    );

    /* 保存 */
    const handleSave = async () => {
      await formRef.value.validate();
      const data = {
        ...form.value,
        memberIds: form.value?.memberIds?.join(",") ?? "",
      };
      if (props.mode === "add") {
        await api.insertTeam(urlMap.add)(data);
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.edidTeamRecord(urlMap.update)(data);
        message.success("修改成功");
      }
      props.onRefresh?.();
      isVisible.value = false;
    };

    return () => {
      return (
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
                    name="code"
                    required
                    label="班组编码"
                    rules={getRequiredRule("班组编码")}
                  >
                    {isView.value ? (
                      <span>{props.record.code}</span>
                    ) : (
                      <a-input v-model={[form.value.code, "value"]} />
                    )}
                  </a-form-item>
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
                        onChange={getEmployeeList}
                      ></a-tree-select>
                    )}
                  </a-form-item>
                  <a-form-item name="jobPostId" label="岗位名称">
                    {isView.value ? (
                      <span>{props.record.jobPostName}</span>
                    ) : (
                      <a-select
                        allowClear
                        v-model={[form.value.jobPostId, "value"]}
                      >
                        {postList.value.map((item: any) => (
                          <a-select-option key={item.id}>
                            {item.name}
                          </a-select-option>
                        ))}
                      </a-select>
                    )}
                  </a-form-item>
                  <a-form-item
                    name="name"
                    required
                    label="班组名称"
                    rules={getRequiredRule("班组名称")}
                  >
                    {isView.value ? (
                      <span>{props.record.name}</span>
                    ) : (
                      <a-input v-model={[form.value.name, "value"]} />
                    )}
                  </a-form-item>
                  <a-form-item
                    name="memberIds"
                    required
                    label="班组成员"
                    rules={getRequiredRule("班组成员")}
                  >
                    {isView.value ? (
                      <span>{props.record.memberNames}</span>
                    ) : (
                      <SearchSelect
                        {...{ mode: "multiple" }}
                        getUrl={urlMap.empList ?? "/employee/all/summary"}
                        extParams={{ departmentId: form.value.depId }}
                        excludeValues={[form.value.leaderId]}
                        v-model={[form.value.memberIds, "value"]}
                      />
                    )}
                  </a-form-item>
                  <a-form-item
                    name="leaderId"
                    required
                    label="班组班长"
                    rules={getRequiredRule("班组班长")}
                  >
                    {isView.value ? (
                      <span>{props.record.leaderName}</span>
                    ) : (
                      <SearchSelect
                        getUrl={urlMap.empList}
                        extParams={{ departmentId: form.value.depId }}
                        excludeValues={form.value.memberIds}
                        v-model={[form.value.leaderId, "value"]}
                      />
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

export default UpdatePostDialog;
