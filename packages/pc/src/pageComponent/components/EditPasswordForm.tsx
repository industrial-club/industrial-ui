/*
 * @Abstract: 修改密码表单
 * @Author: wang liang
 * @Date: 2022-04-14 16:10:51
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-27 11:30:29
 */

import { defineComponent, PropType, ref } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import useProxy from "@/pageComponent/hooks/useProxy";

export interface IEditPasswordForm {
  oldPassWord: string;
  passWord: string;
  checkPassWord: string;
}

const Editpasswordform = defineComponent({
  emits: ["udpate:form"],
  props: {
    form: {
      type: Object as PropType<IEditPasswordForm>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const proxy = useProxy();
    const formModel = useVModel(props, "form", emit);

    const rules = {
      passWord: {
        async validator(rule: any, value: string) {
          if (!value) throw new Error("请输入新密码");
          if (value.length < 8 || value.length > 16)
            throw new Error("请输入长度为8-14的字符");
          if (!formModel.value.checkPassWord) return true;
          if (value !== formModel.value.checkPassWord) {
            throw new Error("新旧密码不一致");
          }
          return true;
        },
        trigger: "blur",
      },
      checkPassWord: {
        async validator(rule: any, value: string) {
          if (!value) throw new Error("请确认密码");
          if (value.length < 8 || value.length > 16)
            throw new Error("请输入长度为8-14的字符");
          if (!formModel.value.passWord) return true;
          if (value !== formModel.value.passWord) {
            throw new Error("新旧密码不一致");
          }
          return true;
        },
        trigger: "blur",
      },
    };

    const formRef = ref();

    proxy._validate = async () => {
      await formRef.value.validate();
    };

    proxy._reset = () => {
      formRef.value.resetFields();
    };

    return () => (
      <a-form
        ref={formRef}
        labelCol={{ style: { width: "100px" } }}
        model={formModel.value}
        rules={rules}
      >
        <a-form-item
          name="oldPassWord"
          rules={[{ required: true, message: "请输入原密码" }]}
          label="原密码"
        >
          <a-input-password v-model={[formModel.value.oldPassWord, "value"]} />
        </a-form-item>
        <a-form-item name="passWord" label="新密码">
          <a-input-password v-model={[formModel.value.passWord, "value"]} />
        </a-form-item>
        <a-form-item name="checkPassWord" label="确认新密码">
          <a-input-password
            v-model={[formModel.value.checkPassWord, "value"]}
          />
        </a-form-item>
      </a-form>
    );
  },
});

export default Editpasswordform;
