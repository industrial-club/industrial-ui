const defaultColor = require("./theme/default");
const darkColor = require("./theme/dark");
const createFile = require("./createFile");

createFile("./dist/default/const.less", defaultColor, () => {});
createFile("./dist/dark/const.less", darkColor, () => {});
