import { Chart } from "@antv/g2";
import { defineComponent, reactive, onUnmounted, onMounted } from "vue";
import { productionNumber } from "@/api/production";
import { CoalItem, lineDataItemval } from "@/utils/interface/production";
import initChart from "./botton.chart.init2";

const props = {
  code: String,
};
export default defineComponent({
  name: "Production",
  props,
  setup(_props, _context) {
    let chart: Chart;
    let data = reactive<Array<CoalItem>>([]);

    onMounted(() => {
      http().then(() => {
        chart = initChart("production_chart", data);
      });
    });
    const http = async () => {
      const res = await productionNumber(_props.code || "");
      const { cardParams } = res.data;
      data = cardParams.columnData;
    };

    const timer = setInterval(() => {
      http().then(() => {
        chart.changeData(data);
        // chart.update({
        //   tooltip: {
        //     formatter: (datum) => {
        //       return { name: datum.type, value: datum.value };
        //     },
        //   },
        // });
      });
    }, 300000);
    onUnmounted(() => {
      clearInterval(timer);
    });

    return () => <div class="production_bottom" id="production_chart"></div>;
  },
});
