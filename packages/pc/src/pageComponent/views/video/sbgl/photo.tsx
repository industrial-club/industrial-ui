import { defineComponent, reactive, ref, onMounted, provide } from "vue";
import {
  InfoCircleFilled,
  InboxOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { WebRtcMt } from "../utils/video";
import videoApi from "@/api/video";
import CheckDialog from "./components/CheckDialog";
import "../assets/styles/video/photo.less";
import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  setup() {
    let play: WebRtcMt;

    const data: any = reactive({
      dataSource: [],
      columns: [
        {
          title: "相机名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "品牌",
          dataIndex: "brandName",
          key: "brandName",
        },
        {
          title: "IP地址",
          dataIndex: "ip",
          key: "ip",
        },
        {
          title: "是否在线",
          dataIndex: "onlineStatus",
          key: "onlineStatus",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
        },
      ],

      dialog: false,

      param: {
        nameStr: "",
        ipStr: "",
        pageNo: 1,
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
      },
      formState: {
        name: "",
        brandTypeCode: "",
        ip: "",
        rtspPort: "",
        user: "",
        pass: "",
        channel: "",
        streamType: "",
        mediaServerUuid: "",
        nvrUuid: "",
        nvrChannel: "",
        rtspTemplate: "",
        uuid: "",
        hikIndexCode: "",
      },
    });
    const checkDia = ref(false);
    provide("checkDia", checkDia);
    const formRef = ref();
    const previewVideoType = ref(false);
    let videoBrandList: any = reactive([]);
    let mediaAllList: any = reactive([]);
    let nvrAllList: any = reactive([]);
    let haikangList: any = reactive([]);
    let codeStreamList: any = reactive([]);
    let releaseUrl = "";
    const batchType = ref(false);
    const rules = {
      name: [{ required: true, message: "此项必填" }],
      brandTypeCode: [{ required: true, message: "此项必填" }],
      ip: [{ required: true, message: "此项必填" }],
      rtspPort: [{ required: true, message: "此项必填" }],
      user: [{ required: true, message: "此项必填" }],
      pass: [{ required: true, message: "此项必填" }],
      channel: [{ required: true, message: "此项必填" }],
      streamType: [{ required: true, message: "此项必填" }],
      rtspTemplate: [{ required: true, message: "此项必填" }],
    };
    const propChange = (code: any) => {
      const list = videoBrandList.find((val: any) => {
        return code === val.code;
      });
      if (list && list.streamTypeDictList) {
        codeStreamList = list.streamTypeDictList;
      } else {
        codeStreamList = [];
      }
    };

    const handleChange = (val: any) => {
      data.formState.streamType = val !== null && val !== "" ? val : undefined;
    };
    const handleSearch = (val: any) => {
      if (val) {
        handleChange(val);
      }
    };
    const handleBlur = (val: any) => {
      if (val.target.value) {
        data.formState.streamType = val.target.value;
      }
    };
    const selectedRow: any = reactive({
      selectedRowKeys: [],
      selectedRows: [],
    });

    const getData = async () => {
      selectedRow.selectedRows = [];
      selectedRow.selectedRowKeys = [];
      data.param.pageNo = data.param.current;
      const res = await videoApi.getVideoList(data.param);
      data.param.total = res.data.total;
      data.dataSource = res.data.list;
    };
    const getVideoBrand = async () => {
      const res = await videoApi.findByProdType("IPC");
      videoBrandList = res.data;
    };
    const getMediaAll = async () => {
      const res = await videoApi.getMediaAll();
      mediaAllList = res.data;
    };
    const getNvrAll = async () => {
      const res = await videoApi.getNvrAll();
      nvrAllList = res.data;
    };
    const getHaiKang = async () => {
      const res = await videoApi.getHaikang();
      haikangList = res.data;
    };
    const eval2 = (fn: any) => {
      var Fun = Function;
      return new Fun(`return ${fn}`)();
    };

    const videoPlay = (values: any) => {
      previewVideoType.value = true;
      const video: any = values.record;
      const { channel, streamType } = video;
      let url = video.webrtcTemplateMerged;
      url = url.replaceAll("${channel}", channel);
      url = url.replaceAll("${streamType}", streamType);
      releaseUrl = video.webrtcTemplateMergedDel;
      releaseUrl = releaseUrl.replaceAll("${channel}", channel);
      releaseUrl = releaseUrl.replaceAll("${streamType}", streamType);
      let newmediaServerPo: any = null;
      if (video.mediaServerPo.$ref) {
        // newmediaServerPo = eval(
        //   video.mediaServerPo.$ref.replaceAll('$.data.list', ''),
        // );
        const str: any = video.mediaServerPo.$ref;
        const inde: any =
          data.dataSource[str.slice(str.indexOf("[") + 1, str.indexOf("]"))];
        newmediaServerPo = inde.mediaServerPo;
      }

      play = new WebRtcMt({
        plays: {
          videoElm: "video0",
          mediaServerAddr: !video.mediaServerPo.$ref
            ? video.mediaServerPo.url
            : newmediaServerPo?.url,
          cameraUserName: video.user,
          cameraPwd: video.pass,
          cameraIp: video.ip,
          cameraRtspPort: video.rtspPort,
          cameraChannel: video.channel,
          cameraStream: video.streamType,
          addRtspProxyUrl: url,
        },
      });
    };
    const editAlarm = (param: any) => {
      data.formState = { ...param.record };
      propChange(data.formState.brandTypeCode);
      data.dialog = true;
    };
    const deleteAlarm = async (param: any) => {
      const res = await videoApi.deleteVideo(param.record);
      getData();
    };
    const tableSlot = () => {
      const obj: any = {};
      obj.bodyCell = (param: any) => {
        if (param.column.dataIndex === "onlineStatus") {
          return param.text === "ONLINE" ? (
            <span style="color:#22CC83">在线</span>
          ) : (
            <span style="color:#EA5858">离线</span>
          );
        }
        if (param.column.dataIndex === "operation") {
          return (
            <div class="flex tableOpera">
              <a
                onClick={() => {
                  videoPlay(param);
                }}
              >
                预览
              </a>
              <a
                onClick={() => {
                  editAlarm(param);
                }}
              >
                编辑
              </a>
              <a-popconfirm
                title="确定删除？"
                onConfirm={() => {
                  deleteAlarm(param);
                }}
              >
                <a>删除</a>
              </a-popconfirm>
            </div>
          );
        }
        return true;
      };

      return obj;
    };

    const newAlarm = () => {
      data.formState = {
        name: "",
        brandTypeCode: "",
        ip: "",
        rtspPort: "",
        user: "",
        pass: "",
        channel: "",
        streamType: "",
        mediaServerUuid: "",
        nvrUuid: "",
        nvrChannel: "",
        rtspTemplate: "",
        uuid: "",
        hikIndexCode: "",
      };
      data.dialog = true;
    };

    const saveSetting = () => {
      formRef.value
        .validate()
        .then(async () => {
          const res = await videoApi.saveVideo(data.formState);
          if (res.data === "repeat") {
            message.error("数据重复，保存失败");
            return;
          }
          data.formState.nvrBo = undefined;
          getData();
          formRef.value.resetFields();

          data.dialog = false;
        })
        .catch((error: any) => {});
    };
    const pageChange = (page: any) => {
      data.param = { ...data.param, ...page };
      getData();
    };

    const closeVideo = () => {
      if (play) {
        play.stopPlay("video0");
      }
      previewVideoType.value = false;
    };
    const batchImport = (type: boolean) => {
      batchType.value = type;
    };
    const exportFun = async (attr: any, all?: boolean) => {
      let res;
      if (all) {
        res = await videoApi.cameraExportAll();
      } else {
        res = await videoApi.cameraExport(attr);
      }

      const blob = new Blob([res], {
        type: "text/html;charset=UTF-8",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "相机数据.xls";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    const fileList = ref([]);
    const fileChange = async (info: any) => {
      const { status } = info.file;

      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        batchImport(false);
        fileList.value = [];
        getData();
      } else if (status === "error") {
        // console.log('上传失败');
      }
    };
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      selectedRow.selectedRowKeys = selectedRowKeys;
      selectedRow.selectedRows = selectedRows;
    };
    const exportFunItem = () => {
      const attr: any = [];
      for (const i of selectedRow.selectedRows) {
        attr.push(i.id);
      }
      exportFun(attr);
      selectedRow.selectedRows = [];
      selectedRow.selectedRowKeys = [];
    };
    const filterOption = (input: string, option: any) => {
      return option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const release = async () => {
      const res = await axios.get(releaseUrl);
      message.success("下发成功");
    };
    const advancedShow = ref(false);
    let userInfo: any;
    onMounted(() => {
      getData();
      getVideoBrand();
      getMediaAll();
      getNvrAll();
      getHaiKang();
      userInfo = JSON.parse(localStorage.getItem("userinfo") || "");
    });
    return () => (
      <div class="photoPage">
        <CheckDialog />
        <a-modal
          v-model={[batchType.value, "visible"]}
          title="批量导入"
          class="batchDia"
          width="544px"
          centered={true}
          footer={null}
          onCancel={() => {
            batchImport(false);
          }}
        >
          <div class="batch-min">
            <div class="confirm-min">
              <div class="text-min">
                <InfoCircleFilled class="icons" />
                <span class="span">请先下载模版，修改后导入</span>
              </div>
              <a-button onClick={() => exportFun([])} type="link">
                下载模板
              </a-button>
            </div>
            {/* {batchType.value ? ( */}
            <div class="file-min">
              <a-upload-dragger
                v-model={[fileList.value, "fileList"]}
                onChange={fileChange}
                name="file"
                action="/api/vms/v1/camera/import"
                headers={{
                  token: localStorage.getItem("token"),
                  userId: userInfo.userId,
                }}
              >
                <p class="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p class="ant-upload-hint">支持格式：xls/xlsx</p>
              </a-upload-dragger>
            </div>

            {/* <a-button type='primary'>批量导入</a-button> */}
          </div>
        </a-modal>
        <a-modal
          v-model={[previewVideoType.value, "visible"]}
          title="实时预览"
          class="alarmDia"
          width="1100px"
          centered={true}
          footer={null}
          onCancel={() => {
            closeVideo();
          }}
        >
          <video
            id="video0"
            style="width: 100%; height: 100%; object-fit: fill; background:transparent "
            muted
            autoplay
          ></video>
          <div class="center">
            <a-button
              type="primary"
              onClick={() => {
                release();
              }}
            >
              释放流
            </a-button>
          </div>
        </a-modal>
        <a-modal
          v-model={[data.dialog, "visible"]}
          style="width:700px"
          title="相机设置"
          class="alarmDia photoDia"
          centered={true}
          onOk={() => {
            saveSetting();
          }}
          onCancel={() => {
            formRef.value.resetFields();
            getData();
            data.dialog = false;
          }}
        >
          <a-form
            ref={formRef}
            labelCol={{ span: 10 }}
            model={data.formState}
            rules={rules}
          >
            <a-formItem label="相机名称" name="name">
              <a-input v-model={[data.formState.name, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="相机品牌" name="brandTypeCode">
              <a-select
                onChange={propChange}
                class="param"
                v-model={[data.formState.brandTypeCode, "value"]}
              >
                {videoBrandList.map((item: any) => {
                  return (
                    <a-selectOption value={item.code}>
                      {item.name}
                    </a-selectOption>
                  );
                })}
              </a-select>
            </a-formItem>
            {data.formState.brandTypeCode === "X" ? (
              <a-formItem label="RSTP模板" name="rtspTemplate">
                <a-input
                  v-model={[data.formState.rtspTemplate, "value"]}
                ></a-input>
              </a-formItem>
            ) : (
              ""
            )}
            <a-formItem label="IP地址" name="ip">
              <a-input v-model={[data.formState.ip, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="RTSP端口" name="rtspPort">
              <a-input v-model={[data.formState.rtspPort, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="用户名" name="user">
              <a-input v-model={[data.formState.user, "value"]}></a-input>
            </a-formItem>
            <a-formItem label="密码" name="pass">
              <a-input v-model={[data.formState.pass, "value"]}></a-input>
            </a-formItem>
            {data.formState.brandTypeCode === "HIK" ? (
              <a-formItem label="通道号" name="channel">
                <a-input v-model={[data.formState.channel, "value"]}></a-input>
              </a-formItem>
            ) : (
              ""
            )}
            <a-formItem label="默认码流" name="streamType">
              {/* <a-input v-model={[data.formState.streamType, 'value']}></a-input> */}
              <a-select
                onSearch={handleSearch}
                onChange={handleChange}
                onBlur={handleBlur}
                class="param"
                showSearch={true}
                not-found-content={null}
                filter-option={filterOption}
                allowClear={true}
                v-model={[data.formState.streamType, "value"]}
              >
                {codeStreamList.map((item: any) => {
                  return (
                    <a-select-option value={item.code}>
                      {item.name}({item.code})
                    </a-select-option>
                  );
                })}
              </a-select>
            </a-formItem>
            <a-formItem label="流媒体服务器">
              <a-select
                class="param"
                v-model={[data.formState.mediaServerUuid, "value"]}
              >
                {mediaAllList.map((item: any) => {
                  return (
                    <a-selectOption value={item.uuid}>
                      {item.url}
                    </a-selectOption>
                  );
                })}
              </a-select>
            </a-formItem>
            <a-formItem label="关联NVR">
              <a-select
                class="param"
                v-model={[data.formState.nvrUuid, "value"]}
              >
                {/* <SelectOption value={0}>暂无</SelectOption> */}
                {nvrAllList.map((item: any) => {
                  return (
                    <a-selectOption value={item.uuid}>{item.ip}</a-selectOption>
                  );
                })}
              </a-select>
            </a-formItem>
            <a-formItem label="NVR通道号">
              <a-input v-model={[data.formState.nvrChannel, "value"]}></a-input>
            </a-formItem>
            <div
              class="advanced"
              onClick={() => {
                advancedShow.value = !advancedShow.value;
              }}
            >
              高级
              {advancedShow.value ? <UpOutlined /> : <DownOutlined />}
            </div>

            <a-formItem label="uuid" class={advancedShow.value ? "" : "hide"}>
              <a-input v-model={[data.formState.uuid, "value"]}></a-input>
            </a-formItem>
            <a-formItem
              label="关联海康平台indexCode"
              class={advancedShow.value ? "" : "hide"}
            >
              <a-select
                class="param"
                v-model={[data.formState.hikIndexCode, "value"]}
              >
                {haikangList.map((item: any) => {
                  return (
                    <a-selectOption value={item.indexCode}>
                      {item.name}
                    </a-selectOption>
                  );
                })}
              </a-select>
            </a-formItem>
          </a-form>
        </a-modal>
        <div class="header flex">
          <div class="flex flex1">
            <span class="lable">名称</span>
            <a-input
              class="param"
              v-model={[data.param.nameStr, "value"]}
              placeholder="请输入名称"
            ></a-input>
          </div>

          <div class="flex flex1">
            <span class="lable">IP地址</span>
            <a-input
              class="param"
              v-model={[data.param.ipStr, "value"]}
              placeholder="请输入IP地址"
            ></a-input>
          </div>
          <div class="flex2 btns">
            <a-button
              type="primary"
              onClick={() => {
                data.param.current = 1;
                getData();
              }}
            >
              查询
            </a-button>
            <a-button
              onClick={() => {
                data.param.nameStr = "";
                data.param.ipStr = "";
                data.param.current = 1;
                getData();
              }}
            >
              重置
            </a-button>
          </div>
        </div>
        <div class="headerLine2">
          <a-button
            type="primary"
            onClick={() => {
              newAlarm();
            }}
          >
            新建
          </a-button>
          <a-button onClick={() => batchImport(true)} type="primary" ghost>
            批量导入
          </a-button>
          <a-button
            onClick={() => exportFunItem()}
            type="primary"
            ghost
            disabled={selectedRow.selectedRowKeys.length === 0}
          >
            导出
          </a-button>
          <a-button onClick={() => exportFun([], true)} type="primary" ghost>
            全部导出
          </a-button>
          <a-button
            onClick={() => {
              checkDia.value = true;
            }}
            type="primary"
            ghost
          >
            相机诊断
          </a-button>
        </div>
        <div class="body">
          <a-table
            class="alarmTable"
            dataSource={data.dataSource}
            columns={data.columns}
            v-slots={tableSlot()}
            pagination={data.param}
            show-size-changer
            onChange={pageChange}
            rowSelection={{
              onChange: onSelectChange,
              selectedRowKeys: selectedRow.selectedRowKeys,
            }}
            rowKey="id"
          ></a-table>
        </div>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-photo");
