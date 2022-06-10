/**
 * convert dark.less into js vars
 *
 * const darkVars = require('./dark-vars');
 */
const fs = require("fs");
const path = require("path");
const lessToJs = require("less-vars-to-js");

const stylePath = path.join(__dirname, "..", "style");
const lightLess = fs.readFileSync(
  path.join(stylePath, "themes", "var-default.less"),
  "utf8"
);

// 注册变量，过滤其他内容
const lightPaletteLess = lessToJs(lightLess, {
  stripPrefix: true,
  resolveVariables: false,
});

module.exports = lightPaletteLess;
