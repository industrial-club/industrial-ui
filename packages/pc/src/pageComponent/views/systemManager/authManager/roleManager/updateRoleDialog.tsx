import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
  nextTick,
  inject,
} from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { cloneDeep } from "lodash";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import { transformMenuTree } from "@/pageComponent/utils/transform";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";
import api from "@/api/auth/roleManager";

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
    const urlMap = inject<IUrlObj>("urlMap")!;

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
          const { data } = await api.getRoleTree(urlMap.addPermission)();
          treeData.value = transformMenuTree(data);
          return;
        } else if (props.mode === "edit" || props.mode === "view") {
          const { data } = await api.getRoleTreeEdit(urlMap.editPermission)({
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
        await api.insertRole(urlMap.save)(res);
        message.success("添加成功");
      } else if (props.mode === "edit") {
        await api.insertRole(urlMap.save)(res);
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
              <a-form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                <a-form-item
                  label="角色编码"
                  name="roleCode"
                  required
                  rules={getRequiredRule("角色编码")}
                >
                  {isView.value ? (
                    <span>{form.value.roleCode}</span>
                  ) : (
                    <a-input v-model={[form.value.roleCode, "value"]} />
                  )}
                </a-form-item>
                <a-form-item
                  label="角色名称"
                  name="roleTypeName"
                  required
                  rules={getRequiredRule("角色名称")}
                >
                  {isView.value ? (
                    <span>{form.value.roleTypeName}</span>
                  ) : (
                    <a-input v-model={[form.value.roleTypeName, "value"]} />
                  )}
                </a-form-item>
                <a-form-item label="角色描述" name="roleDesc">
                  {isView.value ? (
                    <span>{form.value.roleDesc}</span>
                  ) : (
                    <a-textarea v-model={[form.value.roleDesc, "value"]} />
                  )}
                </a-form-item>
                <a-form-item
                  name="abc"
                  rules={{ validator: validatePermission }}
                  label="角色权限"
                >
                  {treeData.value.length > 0 && (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <a-tree
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
                    </div>
                  )}
                </a-form-item>
              </a-form>
            ),
            footer: () => (
              <a-space>
                <a-button onClick={cancel}>关闭</a-button>
                {!isView.value && (
                  <a-button type="primary" onClick={handleCommit}>
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

export default UpdateRoleDialog;
