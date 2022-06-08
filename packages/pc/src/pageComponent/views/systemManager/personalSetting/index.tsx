import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  watch,
  PropType,
} from "vue";
import { Modal, message } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { encodeStr } from "@/pageComponent/utils/base64";
import { getRequiredRule, getMaxRule } from "@/pageComponent/utils/validation";
import api, { setInstance } from "@/pageComponent/api/personalSetting";
import utils from "@/utils";

import EditPasswordForm, {
  IEditPasswordForm,
} from "@/pageComponent/components/EditPasswordForm";

export interface IUrlObj {
  // 当前用户详情
  detail: string;
  // 更新当前用户信息
  update: string;
  // 修改密码
  updatePass: string;
}

interface ModalFormState {
  oldPwd: string;
  newPwd: string;
  newPwd2: string;
}

const PersonalSetting = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => ({}),
    },
    prefix: {
      type: String,
    },
    serverName: {
      type: String,
    },
  },
  setup(prop, context) {
    setInstance({ prefix: prop.prefix, serverName: prop.serverName });
    const urlMap = { ...prop.url };

    const formRef = ref();
    const passwordFormRef = ref();

    const state = reactive({
      canEdit: false,
    });

    const formState = ref<any>({});
    const copyForm = ref<any>({});

    const passwordForm = ref<IEditPasswordForm>({
      checkPassWord: "",
      oldPassWord: "",
      passWord: "",
    });

    onMounted(async () => {
      const resp = await api.detail(urlMap.detail)({});
      formState.value = resp.data;
      copyForm.value = cloneDeep(formState.value);
    });

    const handleSubmit = async () => {
      await formRef.value.validate();
      const resp = await api.editUserRecord(urlMap.update)({
        ...formState.value,
        oldPassWord: formState.value.passWord,
      });

      state.canEdit = false;
      message.success(resp.data);
    };

    /* 修改密码 */
    const visible = ref(false);
    const handleSavePassword = async () => {
      await passwordFormRef.value._validate();
      const resp = await api.changePassword(urlMap.updatePass)({
        oldPassWord: encodeStr(passwordForm.value.oldPassWord),
        passWord: encodeStr(passwordForm.value.passWord),
        userId: formState.value.userId,
      });
      message.info(resp?.data);

      visible.value = false;
    };
    watch(visible, (val) => {
      if (!val) {
        passwordFormRef.value._reset();
      }
    });

    // 点击取消
    const handleCancelClick = () => {
      state.canEdit = false;
      formState.value = copyForm.value;
      formRef.value.clearValidate();
    };

    return () => (
      <div class="personalSetting">
        <div class="titleLine">
          <div class="title">基本信息</div>
          <a-space>
            <a-button
              type="primary"
              onClick={() => {
                state.canEdit = true;
              }}
            >
              修改信息
            </a-button>
            <a-button
              onClick={() => {
                visible.value = true;
              }}
            >
              修改密码
            </a-button>
          </a-space>
        </div>

        <a-form
          ref={formRef}
          model={formState.value}
          label-col={{ style: { width: "100px" } }}
          name="basic"
          onSubmit={handleSubmit}
          style="min-width: 400px; width: 50%"
        >
          <a-form-item
            name="userName"
            label="用户名"
            rules={[getRequiredRule("用户名"), getMaxRule("用户名", 32)]}
          >
            {state.canEdit ? (
              <a-input
                v-model={[formState.value.userName, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.userName || "-"}</span>
            )}
          </a-form-item>

          <a-form-item
            name="roleTypeNames"
            label="所属角色"
            rules={[{ required: true }]}
          >
            {state.canEdit ? (
              <a-input
                disabled
                v-model={[formState.value.roleTypeNames, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.roleTypeNames || "-"}</span>
            )}
          </a-form-item>

          <a-form-item
            name="phone"
            label="电话"
            rules={[getRequiredRule("电话"), getMaxRule("电话", 16)]}
          >
            {state.canEdit ? (
              <a-input
                v-model={[formState.value.phone, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.phone || "-"}</span>
            )}
          </a-form-item>

          <a-form-item
            name="zhixin"
            label="智信"
            rules={[getMaxRule("智信", 16)]}
          >
            {state.canEdit ? (
              <a-input
                v-model={[formState.value.zhixin, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.zhixin || "-"}</span>
            )}
          </a-form-item>

          <a-form-item
            name="wechat"
            label="微信"
            rules={[getMaxRule("微信", 16)]}
          >
            {state.canEdit ? (
              <a-input
                v-model={[formState.value.wechat, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.wechat || "-"}</span>
            )}
          </a-form-item>

          <a-form-item
            name="mail"
            label="邮箱"
            rules={[
              getMaxRule("邮箱", 32),
              { type: "email", message: "请输入正确的邮箱" },
            ]}
          >
            {state.canEdit ? (
              <a-input
                v-model={[formState.value.mail, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.mail || "-"}</span>
            )}
          </a-form-item>

          {state.canEdit && (
            <a-form-item>
              <div style="text-align: center;">
                <a-button type="primary" onClick={handleSubmit}>
                  保存
                </a-button>

                <a-button
                  html-type="button"
                  style="margin: 0 8px"
                  onClick={handleCancelClick}
                >
                  取消
                </a-button>
              </div>
            </a-form-item>
          )}
        </a-form>

        <Modal
          title="修改密码"
          width="400px"
          v-model={[visible.value, "visible"]}
          onOk={handleSavePassword}
        >
          <div style="padding: 0 0 10px 10px">
            设置密码需要6-18位数字和字母组合
          </div>
          <EditPasswordForm ref={passwordFormRef} form={passwordForm.value} />
        </Modal>
      </div>
    );
  },
});

export default utils.installComponent(PersonalSetting, "personal-setting");
