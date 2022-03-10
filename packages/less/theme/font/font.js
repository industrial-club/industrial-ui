const fontSize = [
  { name: "m", size: "18px" },
  { name: "l", size: "22px" },
  { name: "xl", size: "24px" },
  { name: "xxl", size: "27px" },
  { name: "xxxl", size: "36px" },
  { name: "xxxxl", size: "40px" },
];

let font = "// 文字大小相关 \n";
for (let i of fontSize) {
  font += `@font_size_${i.name}: ${i.size};\n`;
}

module.exports = font;
