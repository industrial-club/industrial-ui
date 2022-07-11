/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 10:44:08
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-19 16:10:57
 */
import axios from "axios";
import { omit, isPlainObject } from "lodash";
import { message } from "ant-design-vue";

const getInstance = (opt: { serverName?: string; prefix?: string }) => {
  const prefix = opt.prefix || "/api/";
  const instance = axios.create({
    baseURL: prefix + (opt.serverName || ""),
    timeout: 1000 * 10,
    headers: {
      "X-Custom-Header": "foobar",
      clientType: "app",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  const getToken = (): string => {
    return `${sessionStorage.getItem("token")}`;
  };

  const getUser = () => {
    const user = sessionStorage.getItem("userinfo");
    if (user) {
      return JSON.parse(user);
    }
  };

  instance.interceptors.request.use(
    (conf) => {
      const corpId = sessionStorage.getItem("corpId");
      conf.headers.token = getToken();
      conf.headers.userId =
        getUser()?.userId || localStorage.getItem("userId") || "-1";
      conf.headers.userName = getUser()?.userName;
      const { data = {} } = conf;
      if (isPlainObject(data)) {
        // 把undefined转换为null
        for (const key in data) {
          if (data[key] === undefined) {
            data[key] = null;
          }
        }
        // 去掉不需要的属性
        conf.data = omit(
          data,
          "createDt",
          "createUser",
          "updateDt",
          "updateUser"
        );
      }
      if (corpId) {
        conf.headers.corpId = corpId;
      }
      return conf;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      const resData = res.data;
      const status = resData.code === "M0000" || resData.code === "0"  || resData.code === "ok";
      if (resData.code === "M4003") {
        message.error("登陆已过期，请重新登陆");
        window.location.hash = "login";
        localStorage.clear();
        sessionStorage.clear();
        return Promise.reject(resData);
      }
      if (status || resData instanceof Blob) {
        return Promise.resolve(resData);
      }
      const msg = res.data?.msg ?? res.data?.message ?? "请求失败";
      message.error(msg);

      return Promise.reject(resData);
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return instance;
};

const instance = getInstance({});

export { instance, getInstance };

export default axios;
