import { Chart, registerTheme } from "@antv/g2";
import { item } from "@/utils/interface/productionTime";

export default function chartInit(id: string, data: Array<item>) {
  console.log(data);
  const chart = new Chart({
    container: id,
    autoFit: true,
    height: 50,
  });
  chart.data(data);
  chart.scale("time", { nice: true });
  chart.axis(false);
  chart
    .interval()
    .adjust("stack")
    .position("time*month")
    .color("time")
    .label("state", {
      position: "middle",
      offsetY: 10,
      style: {
        fontSize: 9,
      },
      content: (v) => {
        if (v.time === 0) {
          return "";
        }
        return `${v.state}\n\n${v.time}小时`;
      },
    });
  // registerTheme("newTheme", {
  //   minColumnWidth: 10,
  //   maxColumnWidth: 15,
  // });
  // chart.theme("newTheme");
  chart.interaction("active-region");
  chart.render();
  return chart;
}
