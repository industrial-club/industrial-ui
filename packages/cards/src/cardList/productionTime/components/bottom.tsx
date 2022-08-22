import { defineComponent, watch, PropType, onMounted } from "vue";
import { state } from "@/utils/interface/productionTime";
import { Chart } from "@antv/g2";
import initChart from "./bottom.chart.init2";

const props = {
  data: {
    type: Array! as PropType<Array<state>>,
    default: [],
  },
};

export default defineComponent({
  name: "ProductionTB",
  props,
  setup(_props, _context) {
    let chart: Chart;

    onMounted(() => {
      chart = initChart("Production_t_b", _props.data);
    });
    watch(
      () => _props.data,
      (e) => {
        chart.changeData(e);
      },
      {
        deep: true,
      }
    );
    return () => <div class="production_bottom" id="Production_t_b"></div>;
  },
});
