import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import utils from "@/utils";
import parameter from "@/pageComponent/components/pressureFiltration/numberOfPlates";
import alarmList from "@/pageComponent/components/pressureFiltration/alarmList";
import pressureFiltrationHomeApi from "@/api/pressureFiltration/pressureFiltrationHome";
import shiftChange from "@/pageComponent/components/pressureFiltration/shiftChange";
import { Modal } from "ant-design-vue";

const props = {
  pressureFiltrationPng: String,
};
interface popButtonItem {
  buttonName: string;
  buttonType: string;
  buttonContent: string;
}
interface info {
  corpId: string;
  id: string;
  moduleId: string;
  parentPopType: string;
  popButtonList: Array<popButtonItem>;
  popContent: string;
  popNotificationRecordTime: string;
  popTitle: string;
  popType: string;
  userId: string;
}
const pressureFiltrationHome = defineComponent({
  components: {
    parameter,
    alarmList,
    shiftChange,
  },
  props,
  emits: ["goRoute"],
  setup(_props, _context) {
    // 板数数据
    const parameterData = ref([]);

    // 带料数据
    const shiftChangeData = ref([]);

    // 通知数据
    const infoList = ref<Array<info>>([]);

    // 生产状态
    const currentState = ref("");

    // 报警信息
    const filterAlarmList = ref([]);

    // 带料弹窗显示隐藏
    const visible = ref(false);

    // 定时器实例
    let timerOut: NodeJS.Timeout | null;

    // 获取板数数据
    const http = async () => {
      const res = await pressureFiltrationHomeApi.getPlateCountInfo();
      parameterData.value = res.data;
    };

    // 获取是否带料数据
    const getFilterFeedingStatusList = async () => {
      const res = await pressureFiltrationHomeApi.getFilterFeedingStatusList();
      shiftChangeData.value = res.data;
    };

    // 获取生产状态
    const getCurrentState = async () => {
      const res = await pressureFiltrationHomeApi.getCurrentState();
      currentState.value = res.data;
    };

    // 获取报警信息
    const getFilterAlarmList = async () => {
      const res = await pressureFiltrationHomeApi.getFilterAlarmList();
      filterAlarmList.value = res.data;
    };

    // 处理通知弹窗数据
    const shaixuan = (data: Array<info>) => {
      const result: Array<info> = [];
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        const { id } = obj;
        let isExist = false;
        for (let j = 0; j < infoList.value.length; j++) {
          const aj = infoList.value[j];
          const n = aj.id;
          if (n === id) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          result.push(obj);
        }
      }
      return result;
    };

    // 获取通知弹窗
    const getQuery = async () => {
      const res = await pressureFiltrationHomeApi.queryPopNotificationListAll();
      const { data } = res;
      if (data instanceof Array) {
        if (infoList.value.length > 0) {
          if (shaixuan(data).length > 0) {
            infoList.value = [...shaixuan(data)];
          } else {
            return false;
          }
        } else {
          infoList.value = data;
        }
      } else {
        return false;
      }
      infoList.value.forEach((item: info, index: number) => {
        timerOut = setTimeout(() => {
          Modal.info({
            class: "info",
            title: () => (
              <div style={{ textAlign: "center" }}>{item.popTitle}</div>
            ),
            content: () => item.popContent,
            icon: () => "",
            okText: () => item.popButtonList[0].buttonName,
            onOk: async () => {
              const resp =
                await pressureFiltrationHomeApi.queryCancelPopNotificationListAll();
              if (resp.data) {
                infoList.value.splice(index, 1);
              }
            },
          });
        }, index * 500);
      });
      return infoList.value;
    };

    // 轮询定时器
    const timer = setInterval(() => {
      http();
      getQuery();
      getCurrentState();
      getFilterAlarmList();
    }, 3000);

    onMounted(() => {
      http();
      getQuery();
      getCurrentState();
      getFilterAlarmList();
    });

    // 卸载页面清除定时器
    onUnmounted(() => {
      window.clearInterval(timer);
      window.clearTimeout(Number(timerOut));
      timerOut = null;
    });
    return () => (
      <div class="pressureFiltrationHome">
        <div class="pressureFiltrationHome-left">
          <img
            src={_props.pressureFiltrationPng}
            style={{ width: "100%", height: "100%" }}
            alt=""
          />
        </div>
        <div class="pressureFiltrationHome-right">
          <div class="pressureFiltrationHome-right-control">
            <div class="state">{currentState.value}</div>
            <a-button
              block
              class="but"
              onClick={() => {
                visible.value = true;
                getFilterFeedingStatusList();
              }}
            >
              班次交接
            </a-button>
            <a-button
              block
              class="but"
              onClick={() => {
                _context.emit("goRoute", "/configuration");
              }}
            >
              压滤配置
            </a-button>
            <a-button
              block
              class="but"
              onClick={() => {
                _context.emit("goRoute", "/pressureFiltrationJournal");
              }}
            >
              压滤记录
            </a-button>
          </div>
          <parameter data={parameterData.value}></parameter>
          <alarmList data={filterAlarmList.value}></alarmList>
        </div>
        <a-modal
          v-model={[visible.value, "visible"]}
          title="交接班次"
          centered
          footer={false}
        >
          <shiftChange
            onClose={() => {
              visible.value = false;
            }}
            data={shiftChangeData.value}
          ></shiftChange>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(
  pressureFiltrationHome,
  "pressureFiltrationHome"
);
