const mainColor = {
  name: "main",
  color: "#3E7EFF",
};
const mainDarkColor = {
  name: "main_dark",
  color: "#000000",
};
const opacitys = [100, 90, 80, 70, 60, 50, 40, 30, 20];
const darkOpacitys = [100, 80, 60, 40];

let mainColorStr = "// 主色调 \n";

for (let i of opacitys) {
  const lj = i < 100 ? "_" + i : "";
  const varName = lj ? `@color_${mainColor.name}` : mainColor.color;
  mainColorStr += `@color_${mainColor.name}${lj}: fade(${varName}, ${i}%);\n`;
}
mainColorStr += "// 主色调-暗色\n";
for (let i of darkOpacitys) {
  const lj = i < 100 ? "_" + i : "";
  const varName = lj ? `@color_${mainDarkColor.name}` : mainDarkColor.color;
  mainColorStr += `@color_${mainDarkColor.name}${lj}: fade(${varName}, ${i}%);\n`;
}

module.exports = mainColorStr;
