// import SockJs from 'sockjs-client/dist/sockjs.min.js';

const SockJs = {} as any;

var webSocket: WebSocket;
var timeOutObj!: NodeJS.Timer; // 心跳倒计时
var delayTimeObj!: NodeJS.Timer; // 响应倒计时
var reconnectTimeObj!: NodeJS.Timer; // 重连倒计时

const getUrl = (urlHttp: string, urlPath: string) => {
  if (urlPath.indexOf("sockjs") != -1) {
    return `${urlHttp}${urlPath}`;
  } else {
    const protocol = window.location.protocol.replace("http", "ws"); // https -> wss: 、http -> ws:
    const Http =
      protocol == "ws:"
        ? urlHttp.replace("http", "ws")
        : urlHttp.replace("http", "wss");
    return `${Http}${urlPath}`;
  }
};
/*
 *初始化
 * @params { String } urlHttp 域名      https:// xxxx.xxx.com/xx
 * @params { String } urlPath 接口Api   /xx/xxx/xx
 * @params { String } token 用户token
 * @params { * } sendMessage 发送心跳的信息，可以不传递
 * @params { Function } successCallback 连接成功回调函数
 * @params { Function } errorCallback 连接失败回调函数
 * */
const initSocket = (
  urHttp: string,
  urlPath: string,
  timer: number,
  sendMessage: string,
  successCallback: (event: any) => void,
  errorCallback: (event: any) => void
) => {
  let heartbeat = {
    reset() {
      // 重新开启心跳
      timeOutObj && clearTimeout(timeOutObj);
      delayTimeObj && clearTimeout(delayTimeObj);
      this.start();
    },
    start() {
      // 开启心跳
      timeOutObj = setTimeout(() => {
        if (webSocket.readyState == 1) {
          //WebSocket的链接已经建立，发送心跳
          console.log("send heartbeat Message");
          webSocket.send(sendMessage || "send Heart");
        } else {
          // 连接尚未建立、连接正在关闭、连接已经关闭或不可用 重新建立连接
          this.reconnect();
        }
        delayTimeObj = setTimeout(() => {
          // 响应超时关闭
          webSocket.close();
        }, timer);
      }, timer);
    },
    reconnect() {
      // 重新连接
      reconnectTimeObj = setTimeout(() => {
        initSocket(
          urHttp,
          urlPath,
          timer,
          sendMessage,
          successCallback,
          errorCallback
        );
        reconnectTimeObj && clearTimeout(reconnectTimeObj);
      }, timer);
    },
  };
  if ("WebSocket" in window) {
    // 根据浏览器兼容性问题进行不同的socket初始化
    webSocket = new WebSocket(getUrl(urHttp, urlPath));
  } else {
    webSocket = new SockJs(getUrl(urlPath, urlPath));
  }
  webSocket.onopen = () => {
    console.log("webSocket 链接成功");
    heartbeat.start(); // 开启心跳
  };
  webSocket.onmessage = (event) => {
    if (typeof successCallback == "function") {
      // 成功回调
      successCallback(JSON.parse(event.data));
    }
    heartbeat.reset(); // 重新开启心跳
  };
  webSocket.onerror = (e) => {
    if (typeof errorCallback == "function") {
      // 连接失败回调
      errorCallback(e);
    }
    console.log("连接失败");
    heartbeat.reconnect(); // 重连
  };
};
const closeSocket = () => {
  webSocket.close();
  timeOutObj && clearTimeout(timeOutObj);
  delayTimeObj && clearTimeout(delayTimeObj);
  reconnectTimeObj && clearTimeout(reconnectTimeObj);
};

const socket = {
  closeSocket,
  initSocket,
};
export default socket;
