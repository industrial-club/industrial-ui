// eslint-disable-next-line import/no-extraneous-dependencies
import { Chart } from "@antv/g2";
import { CoalItem } from "@/utils/interface/production";

const colorMap = {
  原煤入选: "l(90) 0:#2AF6E8  1:#1EAFF0",
  块煤: "l(90) 0:#BB4EE8  1:#E156A1",
  混煤: "l(90) 0:#4F6DEA  1:#704DEB",
  精煤: "l(90) 0:#F5B837  1:#FAD93D",
};

export interface Item {
  timeString: string;
  washingProportionValue: number;
}

export default function chartInit(id: string, data: Array<CoalItem>) {
  const chart = new Chart({
    container: id,
    autoFit: true,
    height: 300,
  });
  chart.data(data);
  chart.legend({
    position: "bottom",
  });
  chart.axis("value", {
    title: {
      text: "产量(万吨)\n\n\n",
      style: { fill: "#197985" },
      autoRotate: false,
      position: "end",
      offset: 0,
    },
    label: {
      style: {
        fill: "#197985",
      },
      // 数值格式化为千分位
      formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
    // x轴网格线
    grid: {
      line: {
        type: "line",
        style: { fill: "#8993B0", lineWidth: 1 },
      },
      alignTick: true,
    },
  });
  chart.axis("timeString", {
    title: {
      text: "\r\r\r\r\r\r\r\r\r\r\r日期",
      style: { fill: "#197985" },
      position: "end",
      offset: 15,
    },
    label: {
      style: {
        fill: "#197985",
      },
    },
  });
  chart.tooltip({
    showMarkers: false,
    shared: true,
  });
  chart
    .interval()
    .position("timeString*value")
    .color("type", (type) => {
      const types = type as keyof typeof colorMap;
      return colorMap[types];
    })
    .tooltip("type*value", (type, value) => {
      return {
        name: type,
        value: value,
      };
    })
    .adjust([
      {
        type: "dodge",
        dodgeBy: "type", // 按照 type 字段进行分组
        marginRatio: 0, // 分组中各个柱子之间不留空隙
      },
      {
        type: "stack",
      },
    ]);
  chart.interaction("active-region");
  chart.render();
  return chart;
}
