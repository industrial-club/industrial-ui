import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  ref,
  watch,
  inject,
} from "vue";
import useModalVisibleControl from "@/pageComponent/hooks/manage-module/useModalVisibleControl";
import useVModel from "@/pageComponent/hooks/useVModel";
import { cloneDeep, omit } from "lodash";
import { encodeStr } from "@/pageComponent/utils/base64";
import { getRequiredRule } from "@/pageComponent/utils/validation";
import api from "@/pageComponent/api/auth/userManager";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";
import UserProfileDialog from "./userProfileDialog";
import SearchSelect from "@/pageComponent/components/SearchSelect";

const UpdateUserDialog = defineComponent({
  emits: ["update:visible"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /* 表单类型 add: 新增用户 edit: 编辑用户 view: 查看用户信息 */
    mode: {
      type: String as PropType<"add" | "edit" | "view">,
      default: "view",
    },
    /* 需要编辑或查看的用户数据 */
    record: {
      type: Object,
      default: () => ({}),
    },
    /* 新增或修改结束后 刷新列表 */
    onRefresh: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const urlMap = inject<IUrlObj>("urlMap")!;

    const isVisible = useVModel(props, "visible", emit);

    /* ===== 初始化表单 ===== */
    const formRef = ref();
    const form = ref<any>({});
    watch(isVisible, async (val) => {
      // 等待record赋值 / 完全关闭
      await nextTick();
      // 打开对话框时复制表单 新建用户时不用
      if (val) {
        if (props.mode === "add") return;
        form.value = cloneDeep(props.record);
        // 转换角色列表
        form.value.roleIds = form.value.roleIds.split(",");
      } else {
        // 清空表单
        formRef.value.resetFields();
      }
    });

    // 获取员工列表
    const employeeList = ref([]);
    api
      .getEmployeeList(urlMap.employeeList)()
      .then(({ data }) => (employeeList.value = data));

    /* 对话框标题 */
    const modalTitle = computed(() => {
      if (props.mode === "add") return "新建用户";
      else if (props.mode === "edit") return "编辑用户";
      return "用户详情";
    });

    /* 是否查看模式 */
    const isView = computed(() => props.mode === "view");

    const cancel = () => {
      isVisible.value = false;
    };

    /* 查看模式点击员工姓名 展示员工详情 */
    const [isProfileShow, handleProfileClick] = useModalVisibleControl();

    // 重置密码
    const handleResetPassword = async () => {
      Modal.confirm({
        title: "密码重置",
        content: "确定重置密码?",
        async onOk() {
          await api.resetPassword(urlMap.resetPass)(form.value.userId);
          message.success("重置密码！");
        },
      });
    };

    /* 新增用户的密码验证 */
    const validatePassword = async (rule: any, value: string) => {
      if (!value) return;
      if (value.length < 8 || value.length > 14) {
        throw new Error("请输入长度为8-14的字符");
      }
      if (form.value.checkPass && value !== form.value.checkPass) {
        throw new Error("两次输入密码不一致");
      }
      return true;
    };
    const validateCheckPass = async (rule: any, value: string) => {
      if (!value) return;
      if (form.value.passWord && value !== form.value.passWord) {
        throw new Error("两次输入密码不一致");
      }
      return true;
    };

    /* 点击保存按钮回调 */
    const handleCommit = async () => {
      await formRef.value.validate();
      const data = {
        ...form.value,
        roleIds: form.value.roleIds.join(","),
      };
      let res;
      if (props.mode === "add") {
        res = await api.insertOneUserRecord(urlMap.add)({
          ...omit(data, "checkPass"),
          passWord: encodeStr(data.passWord),
        });
      } else if (props.mode === "edit") {
        res = await api.editUserRecord(urlMap.update)(data);
      }

      cancel();
      props.onRefresh?.();
    };

    return () => (
      <div class="update-user-dialog">
        <Modal
          title={modalTitle.value}
          centered
          v-model={[isVisible.value, "visible"]}
        >
          {{
            default: () => (
              <a-form ref={formRef} labelCol={{ span: 4 }} model={form.value}>
                <a-form-item
                  name="userName"
                  label="用户名"
                  required
                  rules={getRequiredRule("用户名")}
                >
                  {isView.value ? (
                    <span>{form.value.userName}</span>
                  ) : (
                    <a-input v-model={[form.value.userName, "value"]} />
                  )}
                </a-form-item>
                <a-form-item
                  name="employeeId"
                  label="员工姓名"
                  help={
                    props.mode === "add" &&
                    "中英文均可，最长14个英文或者7个汉字"
                  }
                >
                  {isView.value ? (
                    <a-button type="link" onClick={handleProfileClick}>
                      {form.value.employeeName}
                    </a-button>
                  ) : (
                    <a-select
                      allowClear
                      v-model={[form.value.employeeId, "value"]}
                    >
                      {employeeList.value.map((item: any) => (
                        <a-select-option key={item.id}>
                          {item.name}
                        </a-select-option>
                      ))}
                    </a-select>
                  )}
                </a-form-item>
                {props.mode === "add" ? (
                  // 新增用户 展示新建密码 和 确认密码
                  <>
                    <a-form-item
                      name="passWord"
                      label="新建密码"
                      required
                      help="长度为8-14个字符，支持数字、大小写字母和特殊字符"
                      rules={[
                        { validator: validatePassword },
                        { required: true, message: "请输入密码" },
                      ]}
                    >
                      <a-input-password
                        placeholder="输入密码"
                        v-model={[form.value.passWord, "value"]}
                      ></a-input-password>
                    </a-form-item>
                    <a-form-item
                      name="checkPass"
                      label="确认密码"
                      required
                      rules={[
                        { validator: validateCheckPass },
                        { required: true, message: "请确认密码" },
                      ]}
                    >
                      <a-input-password
                        v-model={[form.value.checkPass, "value"]}
                      ></a-input-password>
                    </a-form-item>
                  </>
                ) : (
                  // 查看和编辑用户 展示重置密码
                  <a-form-item required label="密码">
                    <span>●●●●●●●●</span>
                    {props.mode === "edit" && (
                      <a-button type="link" onClick={handleResetPassword}>
                        重置密码
                      </a-button>
                    )}
                  </a-form-item>
                )}
                <a-form-item
                  name="roleIds"
                  label="所属角色"
                  required
                  rules={getRequiredRule("所属角色")}
                >
                  {isView.value ? (
                    <span>{form.value.roleTypeNames}</span>
                  ) : (
                    <SearchSelect
                      getUrl="/role/list"
                      {...{ mode: "multiple" }}
                      valuePorp={{ key: "roleId", label: "roleName" }}
                      v-model={[form.value.roleIds, "value"]}
                    ></SearchSelect>
                  )}
                </a-form-item>
                <a-form-item
                  name="phone"
                  label="电话"
                  required
                  rules={getRequiredRule("电话")}
                >
                  {isView.value ? (
                    <span>{form.value.phone}</span>
                  ) : (
                    <a-input v-model={[form.value.phone, "value"]} />
                  )}
                </a-form-item>
                <a-form-item name="zhixin" label="智信">
                  {isView.value ? (
                    <span>{form.value.zhixin}</span>
                  ) : (
                    <a-input v-model={[form.value.zhixin, "value"]} />
                  )}
                </a-form-item>
                <a-form-item name="wechat" label="微信">
                  {isView.value ? (
                    <span>{form.value.wechat}</span>
                  ) : (
                    <a-input v-model={[form.value.wechat, "value"]} />
                  )}
                </a-form-item>
                <a-form-item name="mail" label="邮箱">
                  {isView.value ? (
                    <span>{form.value.mail}</span>
                  ) : (
                    <a-input v-model={[form.value.mail, "value"]} />
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
        <UserProfileDialog
          record={props.record}
          v-model={[isProfileShow.value, "visible"]}
        />
      </div>
    );
  },
});

export default UpdateUserDialog;
