import axios from "axios";

const instance = axios.create({
  baseURL: "/api/",
  timeout: 5000,
  headers: {
    "X-Custom-Header": "foobar",
    clientType: "webapp",
    "Content-Type": "application/json;charset=UTF-8",
    userId: "-1",
  },
});

const getToken = (): string => {
  return `${sessionStorage.getItem("token")}`;
};

instance.interceptors.request.use(
  (conf) => {
    if (conf.method === "get") {
      conf.paramsSerializer = (params) => {
        return JSON.stringify(params);
      };
    }
    // const corpId = sessionStorage.getItem('corpId');
    conf.headers.token = getToken();
    // if (corpId) {
    //   conf.headers.corpId = corpId;
    // }
    return conf;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    const resData = res.data;
    const status = resData.code === "M0000";
    if (status) {
      return Promise.resolve(resData);
    }
    return Promise.resolve(res);
  },
  (err) => {
    return Promise.reject(err);
  }
);

export { instance };

export default axios;
