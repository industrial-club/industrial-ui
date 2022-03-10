const prompt = [
  {
    name: "one",
    color: "#EA5858",
  },
  {
    name: "two",
    color: "#FF9214",
  },
  {
    name: "three",
    color: "#FFC414",
  },
  {
    name: "four",
    color: "#3E7EFF",
  },
];

let alarmColor = "// 报警色 \n";
const opacitys = [
  { val: 100 },
  { val: 80 },
  { val: 70 },
  { val: 60 },
  { val: 50 },
];
for (let i of prompt) {
  for (let n of opacitys) {
    const lj = n.val < 100 ? "_" + n.val : "";
    const varName = lj ? `@color_alarm_${i.name}` : i.color;
    alarmColor += `@color_alarm_${i.name}${lj}: fade(${varName}, ${n.val}%);\n`;
  }
}

module.exports = alarmColor;
