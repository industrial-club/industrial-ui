import { getInstance } from "@/api/axios";
import { AxiosInstance } from "axios";
import { encodeStr } from "@/pageComponent/utils/base64";
import { message } from "ant-design-vue";
import faceName from "@/api/faceName";

class Login {
  constructor() {
    this.getQueryInfo();
    this.config.axios = getInstance({
      serverName: this.config.faceName,
    });
    this.checkSystemInfo();
  }

  protected checkSystemInfo() {
    // 系统服务信息 用于切换智信 或平台登录信息
    const { userCode, token, appType } = this.config.queryInfo;
    // 智信环境
    if (appType === "zhixin") {
      // 智信微应用环境
      this.config.env = "zx-env";
    }

    // 平台微应用环境
    if (appType === "factory") {
      this.config.env = "mtip-app-env";
    }

    // 单机版微应用环境
    if (appType === "single") {
      this.config.env = "tpf-app-env";
    }

    // 第三方微应用环境
    if (appType === "third") {
      this.config.env = "other-app-env";
    }

    this.systemServerInfo = this.config.env;
  }

  systemServerInfo = "";

  protected config = {
    axios: {} as AxiosInstance,
    queryInfo: {} as Record<string, string>,
    faceName: faceName.common,
    api: "auth/login",
    env: "mtip-env",
  };

  protected saveInfo(key: string, val: string) {
    window.localStorage.setItem(key, val);
    window.sessionStorage.setItem(key, val);
  }

  protected getQueryInfo() {
    const url = window.location.hash;
    if (url.indexOf("?") != -1) {
      let obj = {};
      let arr = url.slice(url.indexOf("?") + 1).split("&");
      console.log(arr);
      arr.forEach((item) => {
        let param = item.split("=");
        obj[param[0]] = param[1];
      });
      this.config.queryInfo = obj;
      return obj;
    } else {
      console.log("没有参数");
      return null;
    }
  }

  public async refreshToken() {
    const res = await (this.config.axios.post(`auth/refreshToken`) as any);
    const { sysUser, token } = res.data;
    this.saveInfo("token", token);
    this.saveInfo("userinfo", JSON.stringify(sysUser));
  }

  public async getTokenByCode(e?: { username: string; password: string }) {
    const { userCode, token, userId, appType } = this.config.queryInfo;

    const data: { userName?: string; passWord?: string; userCode?: string } =
      {};

    if (userCode) {
      data.userCode = userCode;
    }

    if (e?.username && e.password) {
      data.passWord = encodeStr(e.password);
      data.userName = e.username;
    }

    if (!token) {
      const headers = {
        isMtip: true,
      };

      if (userCode) {
        headers.isMtip = false;
      }

      const res = (await this.config.axios.post(this.config.api, data, {
        headers,
      })) as any;
      const { sysUser, token } = res.data;
      this.saveInfo("token", token);
      this.saveInfo("userinfo", JSON.stringify(sysUser));

      if (!userCode) {
        message.success("登录成功");
      }
      return Promise.resolve(res);
      //    router.push("/");
    } else {
      window.sessionStorage.setItem("token", token);
      if (appType === "single") {
        const headers = {
          appType: "mtip-base-system",
        };
        const res = (await this.config.axios.post(this.config.api, data, {
          headers,
        })) as any;
        const { sysUser, token } = res.data;
        this.saveInfo("token", token);
        this.saveInfo("userinfo", JSON.stringify(sysUser));

        return Promise.resolve(res);
      } else {
        userId;
        this.saveInfo("token", token);
        this.saveInfo("userId", userId);
        return Promise.resolve({
          token,
          userId,
        });
      }
    }
  }
}
export default Login;
