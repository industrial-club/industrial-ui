const prompt = [
  {
    name: "info",
    color: "#8F959E",
  },
  {
    name: "default",
    color: "#3E7EFF",
  },
  {
    name: "primary",
    color: "#3E7EFF",
  },
  {
    name: "success",
    color: "#22CC83",
  },
  {
    name: "warning",
    color: "#FF9214",
  },
  {
    name: "danger",
    color: "#EA5858",
  },
];

let promptColor = "// 提示色 \n";
const opacitys = [
  { val: 100 },
  { val: 30, name: "active" },
  { val: 10, name: "shallow" },
];

promptColor +=
  "@types: info, primary, success, danger, warning;\n@typeslength: length(@types) + 1;\n";
for (let i of prompt) {
  for (let n of opacitys) {
    promptColor += `@color_${i.name}${n.val < 100 ? "_" + n.name : ""}: fade(${
      i.color
    }, ${n.val}%);\n`;
  }
}

module.exports = promptColor;
