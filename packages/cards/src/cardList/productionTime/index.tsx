import { defineComponent, watch, PropType, reactive, onUnmounted } from "vue";
import { TabsItem } from "@/components/tabs";
import productionDuration from "@/api/productionTime";
import { item, state } from "@/utils/interface/productionTime";
import prodTTop from "./components/top";
import prodTBottom from "./components/bottom";

const props = {
  tabId: String,
  hasTabs: Boolean,
  code: String,
};

export default defineComponent({
  name: "productionTime",
  cname: "生产时长",
  developer: "前端开发组",
  components: { prodTTop, prodTBottom },
  props,
  setup(_props, _context) {
    const data = reactive<{
      list: Array<state>;
      total: number;
      totalList: Array<item>;
    }>({
      list: [],
      total: 0,
      totalList: [],
    });
    /**
     * overhaulValue  检修时长
     * produceInterrupValue	故障时长
     * productionValue	生产时长
     * startingParkingValue	启停时长
     * 检测当有 tabs 并且触发 change时的动作
     * */

    const http = async () => {
      let totalList: Array<item> = [];
      const res = await productionDuration(
        _props.tabId || "",
        _props.code || "index"
      );

      data.list = res.data.cardParams.statisticalChart;

      for (const key in res.data.cardParams.total) {
        data.total = res.data.cardParams.total.productionValue;

        if (key === "overhaulValue") {
          totalList.push({
            month: "",
            time: res.data.cardParams.total[key],
            state: "检修时长",
          });
        }
        if (key === "produceInterrupValue") {
          totalList.push({
            month: "",
            time: res.data.cardParams.total[key],
            state: "故障时长",
          });
        }
        if (key === "productionValue") {
          totalList.push({
            month: "",
            time: res.data.cardParams.total[key],
            state: "生产时长",
          });
        }
        if (key === "startingParkingValue") {
          totalList.push({
            month: "",
            time: res.data.cardParams.total[key],
            state: "启停时长",
          });
        }

        data.totalList = totalList;
      }
    };

    const timer = setInterval(() => {
      http();
    }, 3000);
    onUnmounted(() => {
      clearInterval(timer);
    });
    watch(
      () => _props.tabId,
      (e) => {
        http();
      },
      {
        immediate: true,
      }
    );
    return () => (
      <div class="productiont_box">
        <div class="production_t_top">
          累计生产时长<span class="time">{data.total}</span>{" "}
          <span class="unit">小时</span>
        </div>
        <prodTTop data={data.totalList} />
        <prodTBottom data={data.list} />
      </div>
    );
  },
});
