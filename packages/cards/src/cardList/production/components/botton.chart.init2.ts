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
  console.log(data);
  const chart = new Chart({
    container: id,
    autoFit: true,
    height: 300,
  });
  chart.data(data);
  chart.tooltip({
    title(title, datum) {
      console.log(datum);
      return title;
    },
  });
  chart.legend({
    position: "bottom",
  });
  chart
    .interval()
    .position("timeString*value")
    .color("type", (type) => {
      const types = type as keyof typeof colorMap;
      return colorMap[types];
    })
    .tooltip("name*value", (name, value) => {
      return {
        name: name,
        value: value,
      };
    })
    .adjust([
      {
        type: "dodge",
        dodgeBy: "name", // 按照 type 字段进行分组
        marginRatio: 0, // 分组中各个柱子之间不留空隙
      },
      {
        type: "stack",
      },
    ]);

  chart.render();
  return chart;
}
