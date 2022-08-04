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
    const { userCode, token } = this.config.queryInfo;
    // 智信环境
    if (userCode) {
      // 智信微应用环境
      this.config.env = "zx-env";
    }

    // 平台微应用环境
    if (token) {
      this.config.env = "mtip-app-env";
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

  public async getTokenByCode(
    e: { username: string; password: string } | string = "mtip-factory"
  ) {
    const { userCode, token } = this.config.queryInfo;

    if (token) {
      this.saveInfo("token", token);
    }

    const data: { userName?: string; passWord?: string; userCode?: string } =
      {};

    const headers: { appType: string } = { appType: "" };

    if (userCode) {
      data.userCode = userCode;
    }

    if (typeof e === "object" && e.username && e.password) {
      // 如果 e 是对象,为用户名密码登陆
      data.passWord = encodeStr(e.password);
      data.userName = e.username;
    } else if (typeof e === "string") {
      // 如果 e 是字符串,为免登
      headers.appType = e;
    }
    const res = (await this.config.axios.post(this.config.api, data, {
      headers,
    })) as any;

    this.saveInfo("token", res.data.token);
    this.saveInfo("userinfo", JSON.stringify(res.data.sysUser));

    return Promise.resolve(res);
  }
}
export default Login;
