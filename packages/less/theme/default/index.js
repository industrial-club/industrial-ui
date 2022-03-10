const mainColor = require("./color/color_main");
const promptColor = require("./color/prompt");
const alarmColor = require("./color/alarm");
const fontColor = require("./color/fontColor");
const css = [mainColor, promptColor, alarmColor, fontColor];

let str = "";
for (let i of css) {
  str += i + "\n";
}
module.exports = str;
