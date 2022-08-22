import { Chart } from "@antv/g2";
import { defineComponent, watch, onMounted, PropType } from "vue";
import { item } from "@/utils/interface/productionTime";
import initChart from "./top.chart.init1";

const props = {
  data: {
    type: Array as PropType<Array<item>>,
  },
};
export default defineComponent({
  name: "ProductionTM",
  props,
  setup(_props, _context) {
    let chart: Chart;
    onMounted(() => {
      console.log(_props.data);
      chart = initChart("Production_t_m", _props.data || []);
    });
    watch(
      () => _props.data,
      (e) => {
        if (e) {
          console.log(e);
          chart.changeData(e);
        }
      },
      {
        deep: true,
      }
    );
    return () => <div class="production_middle" id="Production_t_m"></div>;
  },
});
