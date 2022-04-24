/**
 * convert default.less into js vars
 *
 * const darkVars = require('./default-vars');
 */
const fs = require("fs");
const path = require("path");
const lessToJs = require("less-vars-to-js");

const stylePath = path.join(__dirname, "..", "site/src", "theme");
const colorLess = fs.readFileSync(
  path.join(stylePath, "color", "colors.less"),
  "utf8"
);
const defaultLess = fs.readFileSync(
  path.join(stylePath, "", "default.less"),
  "utf8"
);

const defaultPaletteLess = lessToJs(`${colorLess}${defaultLess}`, {
  stripPrefix: true,
  resolveVariables: false,
});

module.exports = defaultPaletteLess;
