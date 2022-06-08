import { defineComponent, ref, provide, PropType } from "vue";
import RecordTable from "./record-table";
import AlarmDetail from "@/pageComponent/views/alarms/alarmDetail";
import utils from "@/utils";
import { setInstance } from "@/pageComponent/api/alarm/alarmRecord";

export interface IUrlObj {
  // 获取参数
  getEnum: string;
  // 手动消警
  clearAlarm: string;
  // 报警记录
  alarmList: string;
  // 语音播报记录
  speechList: string;
  // 切换是否静音
  switchVoice: string;
  // 获取视频
  getVideo: string;
  // 报警详情
  alarmDetail: string;
  // 报警类型列表
  alarmTypeList: string;
  // 视频的baseUrl
  videoBaseUrl: string;
}

const WarningRecord = defineComponent({
  props: {
    url: {
      type: Object as PropType<Partial<IUrlObj>>,
      default: () => {},
    },
    prefix: String,
    serverName: String,
  },
  setup(props) {
    const urlObj = { ...props.url };
    provide("urlObj", urlObj);
    setInstance({ prefix: props.prefix, serverName: props.serverName });

    const isDetailShow = ref(false);
    const detailRecord = ref();

    const handleDetail = (record: any) => {
      detailRecord.value = record;
      isDetailShow.value = true;
    };

    return () => (
      <div class="warning-record-index">
        {isDetailShow.value ? (
          <AlarmDetail
            record={detailRecord.value}
            onClose={() => (isDetailShow.value = false)}
          />
        ) : (
          <RecordTable onShowDetail={handleDetail} />
        )}
      </div>
    );
  },
});

export default utils.installComponent(WarningRecord, "alarm-record");
