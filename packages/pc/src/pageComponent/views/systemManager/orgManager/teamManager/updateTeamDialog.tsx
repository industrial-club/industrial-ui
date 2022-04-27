/*
 * @Abstract: 新增、查看、编辑 班组信息
 * @Author: wang liang
 * @Date: 2022-04-01 18:10:19
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-24 13:46:27
 */

import { computed, defineComponent, nextTick, PropType, ref, watch } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useModalTitle from "@/pageComponent/hooks/manage-module/useModalTitle";
import useModalForm from "@/pageComponent/hooks/manage-module/useModalForm";
import api from "@/pageComponent/api/org/teamManager";
import { getRequiredRule } from "@/pageComponent/utils/validation";

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
    const isVisible = useVModel(props, "visible", emit);

    const modalTitle = useModalTitle(props.mode, "班组");

    const isView = computed(() => props.mode === "view");

    const { form, formRef } = useModalForm(
      isVisible,
      () => props.record,
      props.mode,
      (r) => {
        r.memberIds = (r?.memberIds?.split(",") ?? []).map(Number);
      }
    );

    watch(form, () => {
      getEmployeeList(false);
    });

    /* ===== 下拉列表 ===== */
    // 部门列表
    const depList = ref<any[]>([]);
    const getDepList = async () => {
      const list = await api.getDepList();
      depList.value = list;
    };
    getDepList();

    // 员工列表
    const employeeList = ref([]);
    // 选择部门列表时获取员工列表
    const getEmployeeList = async (isClean = true) => {
      if (!form.value.depId) return;
      const { data } = await api.getEmployeeList(form.value.depId);
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
        .getPostList({ depId: form.value.depId })
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
        await api.insertTeam(data);
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.edidTeamRecord(data);
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
                <Form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                  <FormItem
                    name="code"
                    required
                    label="班组编码"
                    rules={getRequiredRule("班组编码")}
                  >
                    {isView.value ? (
                      <span>{props.record.code}</span>
                    ) : (
                      <Input v-model={[form.value.code, "value"]} />
                    )}
                  </FormItem>
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
                        onChange={getEmployeeList}
                      ></TreeSelect>
                    )}
                  </FormItem>
                  <FormItem name="jobPostId" label="岗位名称">
                    {isView.value ? (
                      <span>{props.record.jobPostName}</span>
                    ) : (
                      <Select v-model={[form.value.jobPostId, "value"]}>
                        {postList.value.map((item: any) => (
                          <SelectOption key={item.id}>{item.name}</SelectOption>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    name="name"
                    required
                    label="班组名称"
                    rules={getRequiredRule("班组名称")}
                  >
                    {isView.value ? (
                      <span>{props.record.name}</span>
                    ) : (
                      <Input v-model={[form.value.name, "value"]} />
                    )}
                  </FormItem>
                  <FormItem
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
                        getUrl="/employee/all/summary"
                        extParams={{ departmentId: form.value.depId }}
                        excludeValues={[form.value.leaderId]}
                        v-model={[form.value.memberIds, "value"]}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    name="leaderId"
                    required
                    label="班组班长"
                    rules={getRequiredRule("班组班长")}
                  >
                    {isView.value ? (
                      <span>{props.record.leaderName}</span>
                    ) : (
                      <SearchSelect
                        getUrl="/employee/all/summary"
                        extParams={{ departmentId: form.value.depId }}
                        excludeValues={form.value.memberIds}
                        v-model={[form.value.leaderId, "value"]}
                      />
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

export default UpdatePostDialog;
