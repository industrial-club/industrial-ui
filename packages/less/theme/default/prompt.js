const prompt = [
  {
    name: "info",
    color: (opacity = 1) => {
      return `rgba(143, 149, 158, ${opacity})`;
    },
  },
  {
    name: "success",
    color: (opacity = 1) => {
      return `rgba(34, 204, 131, ${opacity})`;
    },
  },
  {
    name: "warning",
    color: (opacity = 1) => {
      return `rgba(255, 146, 20, ${opacity})`;
    },
  },
  {
    name: "danger",
    color: (opacity = 1) => {
      return `rgba(234, 88, 88, ${opacity})`;
    },
  },
];

let promptColor = "// 提示色 \n";
const opacitys = [
  { val: 10 },
  { val: 3, name: "active" },
  { val: 1, name: "shallow" },
];
for (let i of prompt) {
  for (let n of opacitys) {
    const opacity = n.val / 10;
    promptColor += `@color_${i.name}${
      opacity < 1 ? "_" + n.name : ""
    }: ${i.color(opacity)};\n`;
  }
}

module.exports = promptColor;
