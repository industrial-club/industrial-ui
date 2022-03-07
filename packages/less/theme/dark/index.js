const mainColor = require("./color_main");
const promptColor = require("./prompt");
const css = [mainColor, promptColor];

let str = "";
for (let i of css) {
  str += i + "\n";
}
module.exports = str;
