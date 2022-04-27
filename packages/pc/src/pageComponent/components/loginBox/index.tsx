import { defineComponent, reactive, ref, PropType } from "vue";
import { Form, FormItem, Input, message } from "ant-design-vue";
import { phoneNumber } from "@/pageComponent/utils/validation";
import code from "@/pageComponent/assets/img/code.png";

type LoginType = 1 | 2;

// submit 参数
export interface EventBySubmitParams {
  password: string;
  username: string;
  loginType: LoginType;
  msg?: string;
}
// loginTab 数据格式
export type LoginTab<T = LoginType> = Array<{ name: string; id: T }>;
// props
const props = {
  loginTab: {
    type: Array as PropType<LoginTab>,
    default(): LoginTab {
      return [
        {
          name: "扫码登录",
          id: 1,
        },
        {
          name: "账号登录",
          id: 2,
        },
      ];
    },
  },
  password: {
    default: "",
  },
  username: {
    default: "",
  },
  autoMsg: Boolean,
};

export default defineComponent({
  props,
  emits: ["submit"],
  setup(prop, context) {
    const formRef = ref();

    const loginType = ref<LoginType>(2);
    const formVal = reactive({
      password: prop.password,
      username: prop.username,
    });

    const sendMsg = (msg: string, type: "error" | "success") => {
      if (!props.autoMsg) return;

      if (type === "error") {
        message.error(msg);
      }
      if (type === "success") {
        message.success(msg);
      }
    };
    const renderLoginTab = () => {
      return (
        <div class="login_tab">
          {prop.loginTab.map((item) => (
            <div
              class={["item", item.id === loginType.value ? "active" : ""]}
              onClick={() => {
                loginType.value = item.id as LoginType;
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      );
    };

    const handleSubmit = async () => {
      await formRef.value
        .validate(["username", "password"])
        .then()
        .catch((e: any) => {
          if (e.errorFields.length) {
            throw new Error();
          }
        });

      const data: EventBySubmitParams = {
        username: formVal.username,
        password: formVal.password,
        loginType: loginType.value,
      };

      // if (data.username === '' || !phoneNumber.test(data.username)) {
      //   data.msg = '手机号错误';
      // }

      // if (!data.password || data.password.length <= 7) {
      //   data.msg = `${data.msg} 密码输入错误`;
      // }

      if (data.msg) {
        sendMsg(data.msg, "error");
      }
      context.emit("submit", data);
    };

    const renderForm = () => {
      return (
        <Form
          ref={formRef}
          v-show={loginType.value === 2}
          onSubmit={handleSubmit}
          wrapper-col={{
            span: 24,
          }}
          model={formVal}
        >
          <FormItem
            name="username"
            wrapper-col={{ span: 50 }}
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input v-model={[formVal.username, "value"]}></Input>
          </FormItem>
          <FormItem
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              // { min: 8, max: 14, message: '密码长度在8-14个字符之间' },
            ]}
          >
            <Input
              type="password"
              v-model={[formVal.password, "value"]}
            ></Input>
          </FormItem>

          {/* <FormItem> */}
          <a-button type="primary" block html-type="submit">
            登录
          </a-button>
          {/* </FormItem> */}
        </Form>
      );
    };

    const renderLoginCode = () => {
      return (
        <div
          v-show={loginType.value === 1}
          style={{ width: "100%", textAlign: "center" }}
        >
          <img src={code} alt="" style={{ width: "60%" }} />
          <p style={{ marginTop: "1rem" }}>请使用智信APP扫描二维码登录</p>
        </div>
      );
    };

    return () => (
      <div class="login_box">
        {renderLoginTab()}
        <h3>智信PC客户端</h3>

        {renderForm()}
        {renderLoginCode()}
      </div>
    );
  },
});
