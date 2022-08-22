// eslint-disable-next-line import/no-extraneous-dependencies
import { Chart } from "@antv/g2";
import { state } from "@/utils/interface/productionTime";

export default function chartInit(id: string, data: Array<state>) {
  const chart = new Chart({
    container: id,
    autoFit: true,
    height: 500,
  });

  chart.data(data);

  chart.axis("timeString", {
    tickLine: null,
    line: {
      style: { stroke: "#6B7DAF", lineWidth: 1, opacity: 0.2 },
    },
    label: {
      style: {
        fill: "#546A91",
      },
    },
  });
  chart.legend(false);
  chart.axis("time", {
    grid: {
      line: {
        style: {
          stroke: "#999",
          opacity: 0.2,
          cursor: "pointer",
        },
      },
    },
    title: {
      text: "时/h\n\n\n",
      style: { fill: "#546A91" },
      position: "end",
      autoRotate: false,
      offset: 0,
    },
  });

  chart.tooltip({
    shared: true,
    showMarkers: false,
  });

  chart
    .interval()
    .position("timeString*time")
    .color("state", [
      "l(90) 0:#fff 1:rgba(192, 195, 102,0.2)",
      "l(90) 0:#c24662 1:#671f30",
      "l(90) 0:#0bd5a1 1:#0f695b",
      "l(90) 0:#c1b02a 1:#483e21",
    ])
    .adjust("stack");

  chart.interaction("active-region");
  chart.render();

  return chart;
}
