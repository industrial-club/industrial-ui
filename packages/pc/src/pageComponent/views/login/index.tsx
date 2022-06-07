import { Component, defineComponent, ref, PropType, provide } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import utils from "@/utils";
import { getInstance } from "@/api/axios";
import { encodeStr } from "@/pageComponent/utils/base64";
import loginBox, { EventBySubmitParams } from "./box";
import leftImg from "./leftImg";
import topTitle from "./top-title";

const components: Component = {
  components: { loginBox, leftImg, topTitle },
};

const Login = defineComponent({
  components,
  props: {
    serverName: {
      default: "comlite/v1/",
      type: String,
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
      default: "工业物联平台",
    },
    bg: {
      default: "",
      type: String,
    },
  },
  setup(prop) {
    const router = useRouter();

    // 是否验证图片验证码
    const imgVerifyStatus = ref<boolean>(false);

    // 将相关数据注入到所有子组件中
    provide("status", prop.status);
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

    // 弹出图形验证码
    const Verifymode = () => {};

    //

    const handleSubmit = async (e: EventBySubmitParams) => {
      const { data } = await instance.post("auth/login", {
        userName: e.username,
        passWord: encodeStr(e.password),
      });
      if (!data) {
        message.error("用户名或密码错误，请重试");
      } else {
        // 保存登录信息
        const { sysUser, token } = data;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userinfo", JSON.stringify(sysUser));
        message.success("登录成功");
        router.push("/");
      }
    };

    return () => (
      <div
        class="login"
        style={{
          background: `url(${prop.bg})`,
        }}
      >
        <topTitle corpLogo={prop.titleLogo} />
        <div class={["content_login flex-center", prop.status]}>
          {prop.status === "platform" ? (
            <img class="left" src={prop.loginMainImg} alt="" />
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
