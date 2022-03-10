const fontSize = [
  {
    name: "main",
    color: "#31363C",
    assist: "#C9CFD8", // 辅助色
    partition: "#E7E7E7", // 分割线颜色
  },
  {
    name: "usual",
    color: "#5D616B",
    assist: "#E0E4E8",
    partition: "#F9FAFB",
  },
  {
    name: "minor",
    color: "#8F959E",
    assist: "#EFF2F6",
    partition: "#F4F6F8",
  },
];

let fontColor = "// 文字颜色 \n";
for (let i of fontSize) {
  fontColor += `@color_font_${i.name}: ${i.color};\n`;
  fontColor += `@color_font_${i.name}_assist: ${i.assist};\n`;
  fontColor += `@color_font_${i.name}_partition: ${i.partition};\n`;
}

module.exports = fontColor;
