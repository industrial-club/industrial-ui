import { Component, defineComponent } from "vue";
import { instance } from "@/pageComponent/api";
import { encodeStr } from "@/pageComponent/utils/base64";
import { useRouter } from "vue-router";
import logo from "@/pageComponent/assets/img/logo.png";
import loginBox, {
  EventBySubmitParams,
} from "@/pageComponent/components/loginBox";
import { message } from "ant-design-vue";

const components: Component = {
  components: { loginBox },
};

export default defineComponent({
  components,
  setup() {
    const name = "";
    const password = "";
    const router = useRouter();

    /**
     * 登录动作
     */
    const handleSubmit = async (e: EventBySubmitParams) => {
      const { data } = await instance.post("/auth/login", {
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
      <div class="login">
        <div class="title">
          <img src={logo} alt="" />
          <span>智信PC客户端</span>
        </div>
        <div class="content_login">
          <loginBox
            v-models={[
              [name, "username"],
              [password, "password"],
            ]}
            onSubmit={handleSubmit}
            autoMsg
          />
        </div>
        <p class="copyright-information">
          Copyright © 2021 天津中新智冠信息技术有限公司
          <a href="http://www.beian.miit.gov.cn/" target="_blank">
            津ICP备16005187号-1
          </a>
        </p>
      </div>
    );
  },
});
