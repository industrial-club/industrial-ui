import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  provide,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import {
  PicLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons-vue";
import videoApi from "@/api/video";
import { WebRtcMt } from "../utils/video";
import "../assets/styles/video/preview.less";
import socket from "../utils/webSocket";
import { videoInfo } from "../components/videoPlayer/util/byUuid";
import treeItem from "./components/treeItem";
import fullScreen from "./components/fullScreen";
import followItem from "./components/followItem";
import alarmLinkageModal from "./components/alarmLinkageModal";
import utils from "@/utils";
import moment from "moment";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  components: { treeItem, fullScreen, followItem, alarmLinkageModal },
  setup(props) {
    const selectedKeys: any = ref<(string | number)[]>([]);
    const listData: any = ref([]);
    // 已选择相机
    provide("cameraKeys", selectedKeys);
    // 关注的
    provide("attentions", listData);

    const route = useRoute();

    const playVideo: any = reactive({
      play: [],
    });
    // 报警联动弹窗
    const alarmLinkageVisible = ref(false);

    const data = reactive({
      videoList: [],
      alarm: true,
    });
    const imgType: any = reactive({
      num: 4,
      numList: [],
      type: false,
      acitveClass: null,
      videoActiveList: [],
    });
    const imgList = reactive([
      {
        id: 1,
        img: "/micro-assets/inl/video/number/num1.png",
      },
      {
        id: 4,
        img: "/micro-assets/inl/video/number/num4.png",
      },
      {
        id: 8,
        img: "/micro-assets/inl/video/number/num8.png",
      },
      {
        id: 9,
        img: "/micro-assets/inl/video/number/num9.png",
      },
      {
        id: 13,
        img: "/micro-assets/inl/video/number/num13.png",
      },
      {
        id: 16,
        img: "/micro-assets/inl/video/number/num16.png",
      },
    ]);
    const treeItemRef = ref();

    const videoPlay = (video: any, stream: string, id: any, index: any) => {
      const { channel } = video;
      let url = video.webrtcTemplateMerged;
      url = url.replaceAll("${channel}", channel);
      url = url.replaceAll("${streamType}", stream);

      playVideo.play[index] = new WebRtcMt({
        plays: {
          videoElm: id,
          mediaServerAddr: video.mediaServerPo.url,
          cameraUserName: video.user,
          cameraPwd: video.pass,
          cameraIp: video.ip,
          cameraRtspPort: video.rtspPort,
          cameraChannel: video.channel,
          cameraStream: stream,
          addRtspProxyUrl: url,
        },
      });
    };
    const initVideo = () => {
      for (let i = 0; i < imgType.videoActiveList.length; i++) {
        if (imgType.videoActiveList[i]) {
          videoPlay(
            imgType.videoActiveList[i].data,
            imgType.videoActiveList[i].data.streamType,
            imgType.videoActiveList[i].id,
            i
          );
          treeItemRef.value.addSelectValue(
            imgType.videoActiveList[i]?.eventKey
          );
        }
      }
    };
    const getVideoData = async () => {
      const $: any = await videoApi.getVideoList({
        pageNo: 1,
        pageSize: 999,
      });
      $.data.list.forEach((video: any) => {
        if (video.mediaServerPo.$ref) {
          video.mediaServerPo = eval(video.mediaServerPo.$ref);
        }
      });
      data.videoList = $.data.list;
    };
    const stopV = (id: any) => {
      const videoElement: any = document.getElementById(id);
      videoElement.pause();
      videoElement.removeAttribute("src"); // empty source
      videoElement.load();
    };
    const setImgType = (id: number) => {
      imgType.num = `min${id}`;
      const list: any[] = [];
      for (let i = 0; i < id; i++) {
        list.push({
          id: `video${i + 1}`,
        });
      }
      imgType.numList = list;

      for (let i = 0; i < 16; i++) {
        if (id < i + 1) {
          if (imgType.videoActiveList[i]) {
            treeItemRef.value.remoSelectValue(
              imgType.videoActiveList[i].eventKey
            );
            playVideo.play[i].stopPlay(imgType.videoActiveList[i].id);
            stopV(imgType.videoActiveList[i].id);
            imgType.videoActiveList[i] = null;
          }
        }
      }

      localStorage.setItem("videoNum", id.toString());
      const videoList = {
        tempArr: imgType.videoActiveList,
      };
      localStorage.setItem("videoDataList", JSON.stringify(videoList));
    };
    const loadHistory = () => {
      const jsonStr: any = localStorage.getItem("videoDataList");
      const trans = JSON.parse(jsonStr);
      trans?.tempArr.forEach((ele: any, index: number) => {
        let have = false;
        data.videoList.forEach((video: any) => {
          if (ele && ele.data?.uuid === video?.uuid) {
            ele.data = video;
            have = true;
          }
        });
        if (!have) {
          trans.tempArr[index] = null;
        }
      });
      if (trans && trans.tempArr) {
        imgType.videoActiveList = trans.tempArr;
      } else {
        imgType.videoActiveList = [];
      }
      initVideo();
      if (localStorage.getItem("videoNum")) {
        setImgType(Number(localStorage.getItem("videoNum")));
      } else {
        setImgType(4);
      }
    };

    let interval: any;
    // 更新在线状态
    const updateVideoState = async () => {
      await getVideoData();
      imgType.videoActiveList.forEach((ele: any) => {
        if (ele) {
          const videoRes = data.videoList.find(
            (video: any) => video?.uuid === ele.data?.uuid
          );
          ele.data = videoRes;
        }
      });
    };
    const fullele = () => {
      const doc: any = document;
      return (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement ||
        doc.mozFullScreenElement ||
        null
      );
    };
    const isFullScreen = () => {
      const doc: any = document;
      return !!(doc.webkitIsFullScreen || fullele());
    };
    const fullScreenType = ref(false);
    const sizeDataRef: any = ref(null);
    let interval2: any;
    let interval2Time = "8";
    const refresh = () => {
      imgType.numList.forEach((ele: any, index: number) => {
        if (imgType.videoActiveList[index]?.data.onlineStatus === "ONLINE") {
          playVideo.play[index].stopPlay(imgType.videoActiveList[index].id);
          stopV(imgType.videoActiveList[index].id);
        }
      });
      loadHistory();
    };
    onMounted(async () => {
      if (props.serverName) {
        videoApi.setInstance(props.serverName);
      }

      await getVideoData();
      loadHistory();
      window.onresize = () => {
        // 全屏下监控是否按键了ESC
        if (!isFullScreen()) {
          fullScreenType.value = false;
          sizeDataRef.value.sizeData.fullScreen = false;
        }
      };
      if (localStorage.getItem("videoFreshTime")) {
        interval2Time = localStorage.getItem("videoFreshTime")!;
      } else {
        localStorage.setItem("videoFreshTime", "8");
      }
      interval = setInterval(() => {
        updateVideoState();
      }, 10000);
      interval2 = setInterval(() => {
        refresh();
        // if (
        //   moment().format("hh:mm:ss") === "12:00:00" ||
        //   moment().format("hh:mm:ss") === "00:00:00"
        // ) {
        //   window.location.reload();
        // }
      }, parseInt(interval2Time) * 60 * 60 * 1000);
    });

    const pitchOn = (index: number) => {
      imgType.type = true;
      imgType.acitveClass = index;
    };

    const changeVideo = async (
      uuid: any,
      eventKey: any,
      index: number,
      stream?: string
    ) => {
      selectedKeys.value.push(uuid);
      if (
        stream === undefined &&
        imgType.videoActiveList[index] &&
        imgType.videoActiveList[index].data?.uuid === uuid
      ) {
        return false;
      }

      for (let i = 0; i < imgType.videoActiveList.length; i++) {
        if (
          imgType.videoActiveList[i] &&
          imgType.videoActiveList[i].data?.uuid === uuid
        ) {
          playVideo.play[i].stopPlay(imgType.videoActiveList[i].id);
          treeItemRef.value.remoSelectValue(
            imgType.videoActiveList[i].eventKey
          );
          stopV(imgType.videoActiveList[i].id);
          imgType.videoActiveList[i] = null;
        }
      }
      if (imgType.videoActiveList[index]) {
        playVideo.play[index].stopPlay(imgType.videoActiveList[index].id);
        treeItemRef.value.remoSelectValue(
          imgType.videoActiveList[index].eventKey
        );
        stopV(imgType.videoActiveList[index].id);
        imgType.videoActiveList[index] = null;
      }

      const video = data.videoList.find((ele: any) => ele?.uuid === uuid);
      const item: any = {
        data: video,
        id: `video${index + 1}`,
        eventKey,
      };
      imgType.videoActiveList[index] = item;
      const videoList = {
        tempArr: imgType.videoActiveList,
      };
      localStorage.setItem("videoDataList", JSON.stringify(videoList));

      videoPlay(item.data, stream || item.data.streamType, item.id, index);
      playVideo.play[index].p_player
        .then((res: any) => {
          imgType.type = false;
        })
        .catch((err: any) => {
          // message.error(`${item.data.name}相机已离线，请重新选择。`);
        });

      return true;
    };

    const closeVideo = (index: any, e?: any) => {
      if (e) {
        e.stopPropagation();
      }
      if (imgType.videoActiveList[index]) {
      }
      treeItemRef.value.remoSelectValue(
        imgType.videoActiveList[index].eventKey
      );
      if (imgType.videoActiveList[index].data.onlineStatus === "ONLINE") {
        playVideo.play[index].stopPlay(imgType.videoActiveList[index].id);
        stopV(imgType.videoActiveList[index].id);
      }

      imgType.videoActiveList[index] = null;
      const videoList = {
        tempArr: imgType.videoActiveList,
      };
      const arr: any[] = [];
      imgType.videoActiveList.forEach((ele: any) => {
        if (ele) {
          arr.push(ele.eventKey);
        }
      });
      selectedKeys.value.length = 0;
      selectedKeys.value = arr;
      localStorage.setItem("videoDataList", JSON.stringify(videoList));
    };

    const videoMove = async (e: any, index: number, direction: number) => {
      e.stopPropagation();
      const res: any = await videoApi.setDirection({
        uuid: imgType.videoActiveList[index].data?.uuid,
        direction,
      });
      message.success("下发成功");
    };

    const videoFull = (e: any, id: any) => {
      e.stopPropagation();
      const elm: any = document.getElementById(id);
      if (elm.requestFullScreen) {
        elm.requestFullScreen();
      } else if (elm.mozRequestFullScreen) {
        elm.mozRequestFullScreen();
      } else if (elm.webkitRequestFullScreen) {
        elm.webkitRequestFullScreen();
      }
    };

    const titleChange = () => {
      for (const i of imgType.videoActiveList) {
        if (i) {
          treeItemRef.value.addSelectValue(i.eventKey);
        }
      }
    };
    const overVideo = () => {
      for (let i = 0; i < 16; i++) {
        if (imgType.videoActiveList[i]) {
          playVideo.play[i].stopPlay(imgType.videoActiveList[i].id);
          stopV(imgType.videoActiveList[i].id);
        }
      }
      imgType.videoActiveList = [];
    };
    onBeforeUnmount(() => {
      clearInterval(interval);
      clearInterval(interval2);
      socket.closeSocket();
      overVideo();
    });

    const followRef: any = ref(null);
    const getFollow = () => {
      followRef.value.getConcern();
    };

    const fullType = (type: any) => {
      fullScreenType.value = type;
    };
    const activeKey = ref("1");

    const hideLeft = ref(false);
    const tabValue = ref("1");
    const shrinkBtn = ref(false);
    const dragNode: any = ref({});
    const treeDrag = (node: any) => {
      dragNode.value = node;
    };
    const state = reactive({
      http: `http://${window.location.host}`,
      path: "/vmsWebsocket/previewWebsocket",
      timer: 5000,
    });
    const alarmList = ref<Array<videoInfo>>([]);

    watch(
      () => data.alarm,
      (e) => {
        if (e === true) {
          socket.initSocket(
            state.http,
            state.path,
            state.timer,
            "1",
            (val) => {
              if (val && val !== 1) {
                alarmList.value = [...alarmList.value, ...val];
              }
            },
            (err) => {
              //
            }
          );
        } else {
          socket.closeSocket();
        }
      },
      {
        immediate: true,
      }
    );
    let timer!: NodeJS.Timer;
    const videoBtns = [
      [
        {
          text: "lup",
          signal: 25,
        },
        {
          text: "up",
          signal: 21,
        },
        {
          text: "rup",
          signal: 26,
        },
      ],
      [
        {
          text: "left",
          signal: 23,
        },
        {
          text: "right",
          signal: 24,
        },
      ],
      [
        {
          text: "ldown",
          signal: 27,
        },
        {
          text: "down",
          signal: 22,
        },
        {
          text: "rdown",
          signal: 28,
        },
      ],
    ];
    watch(
      () => alarmList.value,
      (e) => {
        if (e && e.length > 0) {
          alarmLinkageVisible.value = true;
          timer = setTimeout(() => {
            alarmList.value.splice(0, 1);
          }, 10000);
        } else {
          clearTimeout(timer);
          alarmLinkageVisible.value = false;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return () => (
      <div class="preview flex ">
        <div
          class={["stretch", hideLeft.value ? "pack" : ""]}
          onClick={() => {
            hideLeft.value = !hideLeft.value;
          }}
        >
          {hideLeft.value ? (
            <RightOutlined></RightOutlined>
          ) : (
            <LeftOutlined></LeftOutlined>
          )}
        </div>
        <div class={["photoList", hideLeft.value ? "hide" : ""]}>
          <a-tabs
            v-model={[tabValue.value, "activeKey"]}
            onChange={(key: string) => {}}
          >
            <a-tab-pane key="1" tab="选择相机"></a-tab-pane>
            {route.params.pad === "pad" ? (
              ""
            ) : (
              <a-tab-pane key="2" tab="我的关注"></a-tab-pane>
            )}
          </a-tabs>

          {tabValue.value === "1" ? (
            <tree-item
              onGetFollow={getFollow}
              onTitleChange={titleChange}
              ref={treeItemRef}
              onDragTree={treeDrag}
              onStopVideo={(uuid: string, key: string) => {
                changeVideo(uuid, key, imgType.acitveClass);
              }}
              class="photoTree"
              domType={imgType.type}
            />
          ) : (
            <followItem
              domType={imgType.type}
              onStopVideo={(uuid: string, key: string) => {
                changeVideo(uuid, key, imgType.acitveClass);
              }}
              ref={followRef}
            />
          )}
        </div>
        <div
          class={[
            "video-min",
            "flex1",
            fullScreenType.value ? "video-min-active" : "",
          ]}
        >
          <div
            class={[
              "toggle-big",
              fullScreenType.value ? "hide" : "",
              shrinkBtn.value ? "hover" : "",
            ]}
          >
            <div class="toggle-min">
              <div class="alarm">
                <a-switch v-model={[data.alarm, "checked"]} />
                报警联动
              </div>
              <div v-show={!fullScreenType.value && route.params.pad !== "pad"}>
                <a-dropdown
                  v-slots={{
                    overlay: () => (
                      <div class="menu-min flex1">
                        {imgList.map((item: any) => {
                          return (
                            <img
                              onClick={() => setImgType(item.id)}
                              src={item.img}
                              alt=""
                            />
                          );
                        })}
                      </div>
                    ),
                  }}
                >
                  <div class="fgfs-min">
                    <PicLeftOutlined class="fgfs-img" />
                    <span>分割方式</span>
                  </div>
                </a-dropdown>
              </div>
              <fullScreen ref={sizeDataRef} onFullType={fullType} />
            </div>
          </div>

          <div
            class={`flex6 previewGrid`}
            id={imgType.num}
            onClick={() => {
              shrinkBtn.value = !shrinkBtn.value;
            }}
          >
            {imgType.numList.map((item: any, index: number) => {
              const rectData = imgType.videoActiveList[index];
              const streams = JSON.parse(
                rectData?.data?.brandTypePo?.streamTypeDict || "[]"
              );
              const renderRectVideo = () => {
                return (
                  <div>
                    {rectData?.data?.onlineStatus === "ONLINE" ? (
                      <video
                        id={item.id}
                        class="videoPlayer"
                        disablePictureInPicture
                        style="width: 100%;object-fit: fill;background:#000;"
                        muted={true}
                        autoplay
                      ></video>
                    ) : (
                      ""
                    )}
                    <div class="footer-min">
                      <div class="name-min">
                        <span>{rectData.data.name}</span>
                        {rectData?.data?.onlineStatus !== "ONLINE" ? (
                          <span>：已离线</span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <a-popover
                          title="切换码流"
                          content={
                            <div>
                              {streams.map((stream: any) => {
                                return (
                                  <div
                                    class="btn"
                                    onClick={() => {
                                      changeVideo(
                                        rectData.data?.uuid,
                                        rectData.eventKey,
                                        index,
                                        stream.code
                                      );
                                    }}
                                  >
                                    {stream.name}
                                  </div>
                                );
                              })}
                            </div>
                          }
                        >
                          <img src={"/micro-assets/inl/video/stream.png"} />
                        </a-popover>
                        <a-popover
                          title="控制器"
                          content={
                            <div class="videoControls">
                              <div class="videoControl">
                                <img
                                  class="bg"
                                  src={
                                    "/micro-assets/inl/video/controls/circle.png"
                                  }
                                />
                                {videoBtns.map((ele: any) => {
                                  return (
                                    <div>
                                      {ele.map((btn: any) => {
                                        return (
                                          <img
                                            class={btn.text}
                                            src={
                                              "/micro-assets/inl/video/controls/up.svg"
                                            }
                                            onClick={(e: any) =>
                                              videoMove(e, index, btn.signal)
                                            }
                                          />
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                              <div class="flex">
                                <div class="flex1 btns">
                                  <img
                                    src="/micro-assets/inl/video/controls/smaller.svg"
                                    onClick={(e: any) =>
                                      videoMove(e, index, 16)
                                    }
                                  />
                                  <img
                                    src="/micro-assets/inl/video/controls/bigger.svg"
                                    onClick={(e: any) =>
                                      videoMove(e, index, 15)
                                    }
                                  />
                                </div>
                                <div class="flex1 btns">
                                  <img
                                    src="/micro-assets/inl/video/controls/go.svg"
                                    onClick={(e: any) =>
                                      videoMove(e, index, 14)
                                    }
                                  />
                                  <img
                                    src="/micro-assets/inl/video/controls/back.svg"
                                    onClick={(e: any) =>
                                      videoMove(e, index, 13)
                                    }
                                  />
                                </div>
                              </div>
                              <div class="flex">
                                <div class="flex1 btns">
                                  <img
                                    src="/micro-assets/inl/video/controls/light.svg"
                                    onClick={(e: any) => videoMove(e, index, 2)}
                                  />
                                  <img
                                    src="/micro-assets/inl/video/controls/rain.svg"
                                    onClick={(e: any) => videoMove(e, index, 3)}
                                  />
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <img src={"/micro-assets/inl/video/control.png"} />
                        </a-popover>

                        {rectData?.data?.onlineStatus === "ONLINE" ? (
                          <img
                            onClick={(e: any) => videoFull(e, item.id)}
                            src={"/micro-assets/inl/video/putUp.png"}
                          />
                        ) : (
                          ""
                        )}
                        <img
                          onClick={(e: any) => closeVideo(index, e)}
                          src={"/micro-assets/inl/video/close.png"}
                        />
                      </div>
                    </div>
                  </div>
                );
              };
              return (
                <div
                  onClick={() => pitchOn(index)}
                  onDragover={(e: any) => {
                    e.preventDefault();
                  }}
                  onDrop={() => {
                    changeVideo(
                      dragNode.value?.uuid,
                      dragNode.value.eventKey,
                      index
                    );
                  }}
                  class={[
                    "video",
                    item.id,
                    imgType.acitveClass === index && imgType.type
                      ? "active"
                      : "",
                  ]}
                >
                  {rectData ? renderRectVideo() : ""}
                </div>
              );
            })}
          </div>
        </div>
        <alarmLinkageModal
          v-model={[alarmLinkageVisible.value, "visible"]}
          camera={alarmList.value[0]}
          titleName="报警联动"
        ></alarmLinkageModal>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-preview");
