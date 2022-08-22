import { Chart } from "@antv/g2";
import {
  indicatorDatasItem,
  energyStatisticsIndicatorDatasItem,
} from "@/utils/interface/energy";

export default (
  res: Array<indicatorDatasItem>,
  colors: Array<string>,
  id: string
) => {
  const line = new Chart({
    container: id,
    autoFit: true,
    // height: 170,
  });
  line.data(res);
  line.scale({
    month: {
      range: [0, 1],
    },
    temperature: {
      nice: true,
    },
  });

  line.tooltip(false);

  line.axis("temperature", {
    title: {
      text: "吨煤水耗(m³/t)\n\n\n",
      style: { fill: "#546A91" },
      position: "end",
      autoRotate: false,
      offset: 0,
    },
  });
  line.legend("type", {
    position: "bottom",
    itemValue: {
      formatter: (text, item) => {
        const items = res.filter((d) => d.type === item.value);
        return `${items[items.length - 1].value}(m³/t)`;
      },
      style: {
        fill: "#72db51",
      },
    },
  });
  line
    .line()
    .position("timeString*value")
    .color("type", colors)
    .shape("smooth");
  line
    .point()
    .position("timeString*value")
    .color("type", "white")
    .shape("circle");
  line.render();
  return line;
};
