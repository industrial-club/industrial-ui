import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
  nextTick,
  reactive,
} from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { cloneDeep } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import { transformMenuTree } from "@/pageComponent/utils/transform";

import {
  Modal,
  Form,
  FormItem,
  Input,
  Textarea,
  Space,
  Button,
  Tree,
  message,
} from "ant-design-vue";
import api from "@/pageComponent/api/auth/roleManager";

const UpdateRoleDialog = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<"add" | "edit" | "view">,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    onRefresh: {
      type: Function,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const isVisible = useVModel(props, "visible", emit);

    // 树结构数据
    const treeData = ref<any[]>([]);

    // 选中的权限列表
    const checkedPermissionList = ref([]);

    /* ===== 初始化表单 ===== */
    const formRef = ref();
    const form = ref<any>({});
    watch(isVisible, async (val) => {
      // 等待record赋值 / 完全关闭
      await nextTick();
      checkedPermissionList.value = [];
      // 打开对话框时复制表单 新建用户时不用
      if (val) {
        if (props.mode === "add") {
          const { data } = await api.getRoleTree();
          treeData.value = transformMenuTree(data);
          return;
        } else if (props.mode === "edit" || props.mode === "view") {
          const { data } = await api.getRoleTreeEdit({
            roleTypeId: props.record.roleTypeId,
          });

          treeData.value = transformMenuTree(data.roleMenuVoList);
          checkedPermissionList.value = data.checkedMenuIds;
        }
        form.value = cloneDeep(props.record);

        // state.treeData = sysMenuVoList.map((item) => {
        //   return {};
        // });
      } else {
        // 清空表单
        formRef.value.resetFields();
      }
    });

    /* 对话框标题 */
    const modalTitle = computed(() => {
      if (props.mode === "add") return "新建角色";
      else if (props.mode === "edit") return "编辑角色";
      return "查看角色";
    });

    /* 是否查看模式 */
    const isView = computed(() => props.mode === "view");

    const cancel = () => {
      isVisible.value = false;
    };

    // 验证权限列表 至少选择一个权限
    const validatePermission = async (rule: any, value: any) => {
      if (checkedPermissionList.value.length) {
        return true;
      } else {
        return new Error("请选择权限");
      }
    };

    const handleCommit = async () => {
      await formRef.value.validate();
      const res = {
        ...form.value,
        checkedMenuIds: checkedPermissionList.value,
      };
      if (props.mode === "add") {
        await api.insertRole(res);
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.insertRole(res);
        message.success("修改成功");
      }
      props.onRefresh?.();
      isVisible.value = false;
    };

    return () => (
      <div class="update-role-dialog">
        <Modal
          title={modalTitle.value}
          centered
          v-model={[isVisible.value, "visible"]}
        >
          {{
            default: () => (
              <Form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                <FormItem
                  label="角色编码"
                  name="roleCode"
                  required
                  rules={getRequiredRule("角色编码")}
                >
                  {isView.value ? (
                    <span>{form.value.roleCode}</span>
                  ) : (
                    <Input v-model={[form.value.roleCode, "value"]} />
                  )}
                </FormItem>
                <FormItem
                  label="角色名称"
                  name="roleTypeName"
                  required
                  rules={getRequiredRule("角色名称")}
                >
                  {isView.value ? (
                    <span>{form.value.roleTypeName}</span>
                  ) : (
                    <Input v-model={[form.value.roleTypeName, "value"]} />
                  )}
                </FormItem>
                <FormItem label="角色描述" name="roleDesc">
                  {isView.value ? (
                    <span>{form.value.roleDesc}</span>
                  ) : (
                    <Textarea v-model={[form.value.roleDesc, "value"]} />
                  )}
                </FormItem>
                <FormItem
                  name="abc"
                  rules={{ validator: validatePermission }}
                  label="角色权限"
                >
                  {treeData.value.length > 0 && (
                    <Tree
                      defaultExpandAll
                      fieldNames={{
                        key: "id",
                        children: "subList",
                        title: "name",
                      }}
                      disabled={isView.value}
                      checkable
                      tree-data={treeData.value}
                      v-model={[checkedPermissionList.value, "checkedKeys"]}
                    />
                  )}
                </FormItem>
              </Form>
            ),
            footer: () => (
              <Space>
                <Button onClick={cancel}>关闭</Button>
                {!isView.value && (
                  <Button type="primary" onClick={handleCommit}>
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

export default UpdateRoleDialog;