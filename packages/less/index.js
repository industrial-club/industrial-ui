const fs = require("fs");
const defaultColor = require("./theme/default");
const darkColor = require("./theme/dark");
const createFile = require("./createFile");
const fontSize = require("./theme/font/font");

// 将common目录拷贝到dist下
const files = fs.readdirSync("common");
for (let i of files) {
  createFile(`./dist/common/${i}`, fs.readFileSync(`./common/${i}`), () => {});
}

createFile("./dist/default/const.less", defaultColor, () => {});
createFile("./dist/dark/const.less", darkColor, () => {});
createFile("./dist/common/font.less", fontSize, () => {});
