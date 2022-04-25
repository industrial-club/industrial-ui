// console.log(require.resolve("./src/dark.less"));
// const lessd = require.resolve("./src/dark.less");

import lessd from "./src/dark.less";

console.log(1);
console.log(lessd);
console.log(2);
export default (theme: "dark" | "light") => {
  return {
    modifyVars: {
      hack: `true;@import "${lessd}";`,
      "root-entry-name": "dark",
    },
    javascriptEnabled: true,
  };
};
