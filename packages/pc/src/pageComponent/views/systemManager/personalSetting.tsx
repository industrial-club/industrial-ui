import { defineComponent, reactive, ref, onMounted } from "vue";
import {
  Form,
  FormItem,
  Input,
  Button,
  Modal,
  Space,
  message,
} from "ant-design-vue";
import { cloneDeep } from "lodash";
import { encodeStr } from "@/pageComponent/utils/base64";
import api from "@/pageComponent/api/auth/userManager";

import EditPasswordForm, {
  IEditPasswordForm,
} from "@/pageComponent/components/EditPasswordForm";

interface ModalFormState {
  oldPwd: string;
  newPwd: string;
  newPwd2: string;
}

export default defineComponent({
  setup(prop, context) {
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
      const resp = await api.detail({});
      formState.value = resp.data;
      copyForm.value = cloneDeep(formState.value);
    });

    const handleSubmit = async () => {
      console.log(formState.value);

      const resp = await api.editUserRecord({
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
      const resp = await api.changePassword({
        oldPassWord: encodeStr(passwordForm.value.oldPassWord),
        passWord: encodeStr(passwordForm.value.passWord),
        userId: formState.value.userId,
      });
      message.info(resp?.data);

      visible.value = false;
    };

    return () => (
      <div class="personalSetting">
        <div class="titleLine">
          <div class="title">基本信息</div>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                state.canEdit = true;
              }}
            >
              修改信息
            </Button>
            <Button
              onClick={() => {
                visible.value = true;
              }}
            >
              修改密码
            </Button>
          </Space>
        </div>

        <Form
          v-model={formState.value}
          label-col={{ style: { width: "100px" } }}
          name="basic"
          onSubmit={handleSubmit}
          style="min-width: 400px; width: 50%"
        >
          <FormItem label="用户名" rules={[{ required: true }]}>
            {state.canEdit ? (
              <Input
                v-model={[formState.value.userName, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.userName || "-"}</span>
            )}
          </FormItem>

          <FormItem label="所属角色" rules={[{ required: true }]}>
            {state.canEdit ? (
              <Input
                disabled
                v-model={[formState.value.roleTypeNames, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.roleTypeNames || "-"}</span>
            )}
          </FormItem>

          <FormItem label="电话" rules={[{ required: true }]}>
            {state.canEdit ? (
              <Input
                v-model={[formState.value.phone, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.phone || "-"}</span>
            )}
          </FormItem>

          <FormItem label="智信">
            {state.canEdit ? (
              <Input
                v-model={[formState.value.zhixin, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.zhixin || "-"}</span>
            )}
          </FormItem>

          <FormItem label="微信">
            {state.canEdit ? (
              <Input
                v-model={[formState.value.wechat, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.wechat || "-"}</span>
            )}
          </FormItem>

          <FormItem label="邮箱">
            {state.canEdit ? (
              <Input
                v-model={[formState.value.mail, "value"]}
                placeholder="请输入"
              />
            ) : (
              <span>{formState.value.mail || "-"}</span>
            )}
          </FormItem>

          {state.canEdit && (
            <FormItem>
              <div style="text-align: center;">
                <Button type="primary" html-type="submit">
                  保存
                </Button>

                <a-button
                  html-type="button"
                  style="margin: 0 8px"
                  onClick={() => {
                    state.canEdit = false;
                  }}
                >
                  取消
                </a-button>
              </div>
            </FormItem>
          )}
        </Form>

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
