import { Component, defineComponent, nextTick, PropType, provide } from "vue";
import { useRouter } from "vue-router";
import utils from "@/utils";
import { getInstance } from "@/api/axios";
import { login } from "@/utils/publicUtil";
import faceName from "@/api/faceName";
import loginBox, { EventBySubmitParams } from "./box";
import leftImg from "./leftImg";
import topTitle from "./top-title";
import { message } from "ant-design-vue";

const components: Component = {
  components: { loginBox, leftImg, topTitle },
};

const Login = defineComponent({
  emits: ["login"],
  components,
  props: {
    serverName: {
      default: faceName.common,
      type: String,
    },
    isClould: {
      default: false,
      type: Boolean,
    },
    prefix: {
      default: "",
      type: String,
    },
    titleLogo: String, // 公司 集团logo
    loginMainImg: String,
    systemLogo: String, // 登录框上的logo
    ms: String, // 登录框下方的img
    status: {
      default: "platform",
      type: String as PropType<"platform" | "system">,
    },
    systemName: String,
    systemDescribe: String,
    copyright: {
      type: String,
      default: "天津美腾科技股份有限公司 Tianjin Meiteng Technology Co.,Itd",
    },
    projectName: {
      default: "系统登录",
    },
    bg: {
      default: "",
      type: String,
    },
  },
  setup(prop, { emit }) {
    const router = useRouter();

    // 将相关数据注入到所有子组件中
    provide("status", prop.status);
    provide("isClould", prop.isClould);
    provide("corpLogo", prop.titleLogo);
    provide("ms", prop.ms);
    provide("productLogo", prop.loginMainImg);
    provide("leftTitle", prop.systemName);
    provide("systemTitle", prop.projectName);
    provide("leftText", prop.systemDescribe);
    provide("platformLogo", prop.systemLogo);
    provide("serverName", prop.serverName);
    provide("prefix", prop.prefix);

    const instance = getInstance({
      serverName: prop.serverName,
      prefix: prop.prefix,
    });
    /**
     * 登录动作
     */

    const handleSubmit = async (e: EventBySubmitParams) => {
      const LoginFun = new login();
      const res = await LoginFun.getTokenByCode({
        username: e.username,
        password: e.password,
      });
      if (res.data) {
        message.success("登录成功");
        emit("login");
      }
      await nextTick();
      router.push("/");
    };

    return () => (
      <div
        class="login"
        style={{
          background: `url(${prop.bg})`,
          backgroundSize: "100% 100%",
        }}
      >
        <topTitle corpLogo={prop.titleLogo} />
        <div class={["content_login flex-center", prop.status]}>
          {prop.status === "platform" ? (
            <div class={"left"}>
              <img class="left_img" src={prop.loginMainImg} alt="" />
            </div>
          ) : (
            <leftImg />
          )}

          <loginBox onSubmit={handleSubmit} autoMsg />
        </div>

        <p class="copyright-information">{prop.copyright}</p>
      </div>
    );
  },
});

export default utils.installComponent(Login, "login");
