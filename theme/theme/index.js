const less = require("less");
const defaultVars = require("./scripts/default-vars");

const dark = require("./scripts/dark-vars");
const light = require("./scripts/light-vars");

const path = require("path");
const varDark = path.join(__dirname, ".", "style");
const themeConfig = [
  {
    theme: "dark",
    htmlThemeAttr: "dark",
    modifyVars: {
      hack: `true;@import "${require.resolve(
        varDark + "/color/colorPalette.less"
      )}";@import "${require.resolve(varDark + "/themes/var-dark.less")}";`,
      ...defaultVars,
      ...dark,
      "root-entry-name": "dark",
    },
  },
  {
    theme: "light",
    htmlThemeAttr: "light",
    modifyVars: {
      // 引入除了变量外的其他内容
      hack: `true;@import "${require.resolve(
        varDark + "/color/colorPalette.less"
      )}";@import "${require.resolve(varDark + "/themes/var-default.less")}";`,
      ...defaultVars,
      ...light,
      "root-entry-name": "default",
    },
  },
];
const additionalData = async (content, filename) => {
  const themePromises = themeConfig.map(async (t) => {
    const { htmlThemeAttr, modifyVars = {} } = t;
    const options = {
      javascriptEnabled: true,
      modifyVars,
      relativeUrls: true,
      filename,
    };
    try {
      const { css } = await less.render(content, options);
      let res = "";
      if (htmlThemeAttr && css) {
        res = `
        [data-doc-theme=${htmlThemeAttr}] {
          ${css}
        }
        `;
      }
      return Promise.resolve(res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return Promise.reject(content);
    }
  });
  let res = content;
  for (const themePromise of themePromises) {
    const theme = await themePromise;
    res += theme;
  }
  return res;
};

exports.default = additionalData;
