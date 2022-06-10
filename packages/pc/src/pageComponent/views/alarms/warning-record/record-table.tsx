import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  onUnmounted,
  inject,
} from "vue";
import { message, Modal } from "ant-design-vue";
import moment, { Moment } from "moment";
import { useRouter } from "vue-router";
import { alarmLevelFilter, alarmColor } from "@/pageComponent/utils/filter";
import {
  alarmRecordList,
  forceClearAlarm,
  getWarningSpeechList,
  setVoiceEnable,
  getVideo,
} from "@/pageComponent/api/alarm/alarmRecord";
import { TransformCellTextProps } from "ant-design-vue/lib/table/interface";
import { EnumItem, getEnum } from "@/pageComponent/api/alarm/alarmRecord";
import QueryFilter from "./query-filter";
import VideoPlay from "@/pageComponent/components/video-play";
import { IUrlObj } from "./index";

interface Obj {
  level: string;
  type: string;
  status: string;
  time: Array<Moment>;
  keyword: string;
}
const columns = [
  {
    title: "报警级别",
    dataIndex: "level",
    slots: { customRender: "level" },
  },
  {
    title: "报警名称",
    dataIndex: "name",
  },
  {
    title: "报警设备",
    dataIndex: "instanceName",
  },
  {
    title: "报警时间",
    dataIndex: "firstAlarmTime",
    sorter: true,
    customRender({ text }: any) {
      if (!text) return "-";
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "消警时间",
    dataIndex: "releaseTime",
    sorter: true,
    customRender({ text }: any) {
      if (!text) return "-";
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    slots: { customRender: "operation" },
  },
];

/**
 * 报警记录
 */
const WarningRecord = defineComponent({
  props: {
    onShowDetail: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const urlObj = inject<IUrlObj>("urlObj")!;
    const router = useRouter();

    const list = ref<any[]>([]);
    const form = ref({});
    const page = reactive<any>({
      current: 1,
      total: 0,
      size: 10,
      orderType: null,
      orderField: null,
    });
    const enumObj = reactive<{
      [key: string]: Array<EnumItem>;
    }>({
      AlarmLevelEnum: [], // 报警等级
      AlarmStatusEnum: [], // 报警状态
      AlarmTypeEnum: [], // 报警类型
    });
    // 获取字典
    const http = () => {
      for (const key in enumObj) {
        getEnum(urlObj.getEnum)(key).then((res) => {
          enumObj[key] = res.data;
        });
      }
    };
    // 报警记录列表
    const getAlarmRecordList = async () => {
      const res = await alarmRecordList(urlObj.alarmList)({
        pageNum: page.current,
        pageSize: page.size,
        orderField: page.orderField,
        orderType: page.orderType,
        ...form.value,
      });
      list.value = res.data.records;
      page.total = res.data.total;
    };

    // 表格分页、排序变化 重新查询列表
    const handleTableChange = ({ current }, _, { field, order }) => {
      page.current = current;
      const newOrder =
        order === "ascend" ? "asc" : order === "descend" ? "desc" : null;
      // 排序变化 页码回到第一页
      if (field !== page.orderField || newOrder !== page.orderType) {
        page.current = 1;
      }
      page.orderField = field;
      page.orderType = newOrder;
      getAlarmRecordList();
    };

    // 手动消警
    const setForceClearAlarm = async (record: any) => {
      Modal.confirm({
        title: "确定消警",
        content: `确定手动消警${record.name}？`,
        async onOk() {
          const res = await forceClearAlarm(urlObj.clearAlarm)({
            id: record.id,
            instanceCode: record.instanceCode,
            propertyCode: record.propertyCode,
            systemCode: record.systemCode,
          });
          message.success("消警成功");
          getAlarmRecordList();
        },
      });
    };
    const search = (data: Obj) => {
      if (data) {
        form.value = {
          endTime: data.time[0] && data.time[1].endOf("day").format(),
          startTime: data.time[0] && data.time[0].startOf("day").format(),
          level: data.level ?? null,
          type: data.type ?? null,
          status: data.status ?? null,
          keyword: data.keyword ?? null,
        };
      } else {
        form.value = {};
      }
      getAlarmRecordList();
    };

    /* 报警详情 */
    const handleDetails = async (record: any) => {
      props.onShowDetail?.(record);
    };

    // 查看图片
    const imageList = ref([]);
    const isImageShow = ref(false);
    const handleImage = (record: any) => {
      if (!record.imageUrlList) {
        imageList.value = [];
      } else {
        imageList.value = record.imageUrlList.map((item: any) => "/vms" + item);
      }
      isImageShow.value = true;
    };

    // 查看视频
    const videoObj = ref({});
    const isVideoShow = ref(false);
    const handleVideo = async (record: any) => {
      const { data } = await getVideo(urlObj.getVideo)(
        record.id,
        record.instanceCode
      );
      videoObj.value = data;
      isVideoShow.value = true;
    };

    /* ===== 播放报警 ===== */
    const speech = new SpeechSynthesisUtterance();
    speech.onend = () => {
      setTimeout(() => {
        startSpeech();
      }, 2000);
    };
    // 语音播报报警内容
    const startSpeech = async () => {
      const { data } = await getWarningSpeechList(urlObj.speechList)();
      window.speechSynthesis.cancel();
      speech.text = data
        .map((item: any) => item.name.replaceAll(/[0-9]/g, "$& "))
        .join(",");
      if (speech.text) {
        window.speechSynthesis.speak(speech);
      } else {
        setTimeout(startSpeech, 2000);
      }
    };
    /* ----- 播放报警 ----- */

    // 切换是否静音
    const toggleVoiceEnable = async (record: any, enable: boolean) => {
      await setVoiceEnable(urlObj.switchVoice)({
        id: record.id,
        instanceCode: record.instanceCode,
        propertyCode: record.propertyCode,
        systemCode: record.systemCode,
        voiceAvailable: enable,
      });
      getAlarmRecordList();
    };

    onMounted(() => {
      getAlarmRecordList();
      http();
      setTimeout(startSpeech, 2000);
    });

    onUnmounted(() => {
      window.speechSynthesis.cancel();
      speech.onend = null;
    });

    return () => (
      <div class="warning-record">
        <QueryFilter onSubmit={search} enumObj={enumObj} />
        <a-table
          dataSource={list.value}
          columns={columns}
          rowKey="id"
          pagination={{
            showTotal: (total: number) => `共${total}条`,
            showQuickJumper: true,
            showSizeChanger: true,
            current: page.current,
            pageSize: page.size,
            total: page.total,
            pageSizeOptions: ["10", "20", "50", "100"],
            onShowSizeChange: (current, size) => {
              page.current = 1;
              page.size = size;
              getAlarmRecordList();
            },
          }}
          onChange={handleTableChange}
        >
          {{
            operation: ({ record }: any) => (
              <a-space>
                <a-button
                  size="small"
                  type="link"
                  onClick={() => handleDetails(record)}
                >
                  查看详情
                </a-button>
                <a-button
                  size="small"
                  type="link"
                  disabled={!record.screenshotAvailable}
                  onClick={() => handleImage(record)}
                >
                  查看图片
                </a-button>
                <a-button
                  // 30天前不能查看视频
                  disabled={
                    moment(record.firstAlarmTime).isBefore(
                      moment().add(-30, "days")
                    ) || !record.videoAvailable
                  }
                  size="small"
                  type="link"
                  onClick={() => handleVideo(record)}
                >
                  查看视频
                </a-button>
                <a-button
                  size="small"
                  type="link"
                  disabled={
                    !record.manuReleasable || record.status === "CLEAR_ALARM"
                  }
                  onClick={() => setForceClearAlarm(record)}
                >
                  手动消警
                </a-button>
                {record.voiceAvailable ? (
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => toggleVoiceEnable(record, false)}
                  >
                    <img
                      width="24"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAnRJREFUSEvdlU1IlFEUht9zHU0biqjoByOKgsCFRQai03zfSLQqBAsSyk1IbnJTUEI6399YSEbUoty1atuiVRQGM9/oaAsX7QqKjCRKMGjhavS+MaI1jjPNjAwS3e05933u+eG9gg04sgEM/HsQw2HrwgK+pwblYzkdKKmSiMOdmhgicVkUwr4jqQpCKBEb3VpjCIIdS8IKoVyIadMjMed78jAfvGAlEZvHNPEYQMuqi8sQY4AH01X4OeHKj5DN/VXEKAVe0pWnuaA1kGabWzcRHoCrAAJrXpaBEJMmcI/EeSXojLsy2RblUS14mVZoTDkym31PWvpZH1DoUEANFGpJ9ALYW7DnWe0ybLaDeKQE4bgr06bF+1qQTrrStwpiRPkMgnMlDzJnJmaUNylo9D3pCttsEOKF7+EAIFzRFMPiKIBT64U0Odwc1PhauwX1r27IvGHxy8IiTqZuy+eKQTJChsU3mugZi8nbsMUxEH3JmIxXGjIlRG8iJhOGRV+I/kRMkhWDNPWwOrgHs2nBocw6mxanqdHmD8qnP5Aon0PQvt6ZmBavADid8ORCxOZhTfi+YB9c0b8hmQA1LlKhGkQdgG4A20pZ4YjNs5p4ohSMuCPvTIt3KKjzXbm2aoVzxZpvcXdNAMMCdAF5XFohFJzD1Px23AXRSeBS0pPXoQEeqVJIKsHxuCszf4WsBNuiNBdlyVYa8tlKxOYJADNxV761OtwV0BgVYCThyUhRW8lOWB7qdRBRCIKFDNKwOQxi3vfEKcsgs5OXDfABgI58LlxsaUr6T1ZEwhbPaI0P44PyvphwSTMpR6RYblmVFBMrFP9/IL8A+YcOKRQM1G4AAAAASUVORK5CYII="
                      alt=""
                    />
                  </a-button>
                ) : (
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => toggleVoiceEnable(record, true)}
                  >
                    <img
                      width="24"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAz9JREFUSEvNlU1sVFUYhp/v3g7Upi0idQFpdKGLggkJAUXTdmYMrI2JlrghIlQlGhIXLCwyc2fuKFBEAhFRLKkaEmtitGzUhQs6d+zCEBKD0ZW60vhHrEoGx9q5r7lDp05nrJ2yaDybm3vynffJ+/2cYyzDsmVg8D+FDMjlXSsvJQN1TmRgWkigP61tjnEwn7X7bxgS9/QO4qsrhv9l1qarQv0HtJYWXjJ4BPgx8G1tPaTf08ZC1i7/G3yek2RGPWHIqKDTEY/lc3YxntIOGSMGnbMCP9RDkp7aQzEBTAS+7a8HNRbek5OAZyQyGK+UpjnWuoKDiH2AC1QgSU/dYciwC8cv5OzSVk+dK2ES43CQsbdrQQ2Qe4a0JubS5a4k1AyjJtY4xu6ZEDkOZxFdVSeJtAYEpzEeDbL2YSKlu2WMl0usnzxqV6ugCiThaUwiXtkUq4AWGS+0T3G0uJq9gI/xerHE8x2t7JzI2qmqQF9Kmx34QGU2FQ7Z9/G0zgPjgW9vzUEqNsVvC3TLZRODf4lfYi5nJdZJ7C7kbLI2Pu7pRaAUZC01625n4NsDc5DtR7Rq+hq/LtiSooxxorUDr3SVXcAhjNGi8dyljF2LzvV62uKKU4Fv90bNUw45X/Ctp3nIbKTB1yE8aSHf4DAC3I7DniBjQTKjrjDk86hWvcPqcIp8W/AtSntl2aJOai0KYZwOfPbF0zwBDGOcK7dxoKXIg3nfzkUzZS1cDHzrvjHI9VNzc9Lr6TY3ZATjToPBvG8X+jxtd0KGgpxt+6e7JIt7fAZsbPKqaBjGeFp7gGMGY7E2hv4o0j2Zsy/mtXD0k/R0c/SdCbnDMU5G9VwAOgdJetoSihNlY0cMnBDOSNzlwON53z5ugMwXlCXS7FKUc7i1DnZ94jPqkRgLQ04WcvbmwIDcnzdwUygeAo4L3ps29n+atd//8z25z9MtMTgsMWjgzMIa0rXB04ouEV0lVwLf9vZ6WueK1wzeyPs23tSj1ZfSVsd4FdhUW/iqw81nFGv/jofbpnj/o5ftz/o0NwWJDkXp+Gk9TwFP52sGrZlmaRpSFet7Vqs/OWJTzYgvUvilSCweu2Qni0s2RiwL5G9PKVMphthKKAAAAABJRU5ErkJggg=="
                      alt=""
                    />
                  </a-button>
                )}
              </a-space>
            ),
            level: ({ record }: TransformCellTextProps) => (
              <a-badge
                color={alarmColor(record.level)}
                text={alarmLevelFilter(record.level, enumObj.AlarmLevelEnum)}
              />
            ),
          }}
        </a-table>

        {/* 视频 */}
        <a-modal
          title="查看视频"
          width={800}
          centered
          destroyOnClose
          footer={false}
          v-model={[isVideoShow.value, "visible"]}
        >
          <VideoPlay videoList={videoObj.value} />
        </a-modal>

        {/* 图片 */}
        <a-modal
          wrapClassName="record-table-image-preview-modal"
          title="查看图片"
          width={800}
          centered
          destroyOnClose
          footer={false}
          v-model={[isImageShow.value, "visible"]}
        >
          {imageList.value.length ? (
            <a-carousel dots arrows>
              {imageList.value.map((item) => (
                <div>
                  <a-image height={400} preview={false} src={item}></a-image>
                </div>
              ))}
            </a-carousel>
          ) : (
            <a-empty description="暂无图片" />
          )}
        </a-modal>
      </div>
    );
  },
});

export default WarningRecord;
