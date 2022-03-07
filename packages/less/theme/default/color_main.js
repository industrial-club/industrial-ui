const mainColor = {
  name: "main",
  color: (opacity) => {
    return `rgba(62, 126, 255, ${opacity})`;
  },
};
const mainDarkColor = {
  name: "main_dark",
  color: (opacity) => {
    return `rgba(0, 0, 0, ${opacity})`;
  },
};
const opacitys = [10, 8, 7, 6, 5, 4, 3, 2];
const darkOpacitys = [8, 6, 4];

let mainColorStr = "// 主色调 \n";

for (let i of opacitys) {
  const opacity = i / 10;
  mainColorStr += `@color_${mainColor.name}${
    opacity < 1 ? "_" + i * 10 : ""
  }: ${mainColor.color(opacity)};\n`;
}
mainColorStr += "// 主色调-暗色\n";
for (let i of darkOpacitys) {
  const opacity = i / 10;
  mainColorStr += `@color_${mainDarkColor.name}${
    "_" + i * 10
  }: ${mainDarkColor.color(opacity)};\n`;
}

module.exports = mainColorStr;
