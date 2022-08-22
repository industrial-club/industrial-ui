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
    height: 170,
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
      text: "吨煤介耗(kg/t)\n\n\n",
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
        console.log(item);
        const items = res.filter((d) => d.type === item.value);
        return `${items[items.length - 1].value}(kg/t)`;
      },
      style: (item, index) => {
        return {
          fill: item.name === "块煤介质" ? "#ab49f0" : "#d67981",
        };
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
