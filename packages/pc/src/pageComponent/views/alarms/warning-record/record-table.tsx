import { defineComponent, onMounted, ref, reactive, onUnmounted } from "vue";
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
// import muteSvg from "@/assets/img/mute.png";
// import voiceSvg from "@/assets/img/voice.png";
import QueryFilter from "./query-filter";
import VideoPlay from "@/pageComponent/components/video-play";

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
    customRender({ text }: any) {
      if (!text) return "-";
      return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "消警时间",
    dataIndex: "releaseTime",
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
    const router = useRouter();

    const list = ref<any[]>([]);
    const form = ref({});
    const page = reactive({
      current: 1,
      total: 0,
      size: 10,
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
        getEnum(key).then((res) => {
          enumObj[key] = res.data;
        });
      }
    };
    // 报警记录列表
    const getAlarmRecordList = async () => {
      const res = await alarmRecordList({
        pageNum: page.current,
        pageSize: page.size,
        ...form.value,
      });
      list.value = res.data.records;
      page.total = res.data.total;
    };

    // 手动消警
    const setForceClearAlarm = async (record: any) => {
      Modal.confirm({
        title: "确定消警",
        content: `确定手动消警${record.name}？`,
        async onOk() {
          const res = await forceClearAlarm({
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
        imageList.value = record.imageUrlList.map(
          (item: any) => "/usr/local/zlm/www/vmsSnap" + item
        );
      }
      isImageShow.value = true;
    };

    // 查看视频
    const videoObj = ref({});
    const isVideoShow = ref(false);
    const handleVideo = async (record: any) => {
      const { data } = await getVideo(record.id, record.instanceCode);
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
      const { data } = await getWarningSpeechList();
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
      await setVoiceEnable({
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
            onChange: (num) => {
              page.current = num;
              getAlarmRecordList();
            },
            onShowSizeChange: (current, size) => {
              page.current = 1;
              page.size = size;
              getAlarmRecordList();
            },
          }}
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
                  onClick={() => handleImage(record)}
                >
                  查看图片
                </a-button>
                <a-button
                  // 30天前不能查看视频
                  disabled={moment(record.firstAlarmTime).isBefore(
                    moment().add(-30, "days")
                  )}
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
                    {/* <img width="24" src={voiceSvg} alt="" /> */}
                  </a-button>
                ) : (
                  <a-button
                    size="small"
                    type="link"
                    onClick={() => toggleVoiceEnable(record, true)}
                  >
                    {/* <img width="24" src={muteSvg} alt="" /> */}
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
        <Modal
          title="查看视频"
          width={800}
          centered
          destroyOnClose
          footer={false}
          v-model={[isVideoShow.value, "visible"]}
        >
          <VideoPlay videoList={videoObj.value} />
        </Modal>

        {/* 图片 */}
        <Modal
          title="查看图片"
          width={800}
          centered
          destroyOnClose
          footer={false}
          v-model={[isImageShow.value, "visible"]}
        >
          {imageList.value.length ? (
            <a-carousel>
              {imageList.value.map((item) => (
                <a-image src={item}></a-image>
              ))}
            </a-carousel>
          ) : (
            <a-empty description="暂无图片" />
          )}
        </Modal>
      </div>
    );
  },
});

export default WarningRecord;
