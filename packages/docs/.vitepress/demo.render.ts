const mdContainer = require("markdown-it-container");
// const { highlight } = require("vitepress/dist/node/markdown/plugins/highlight");
export const blockPlugin = (md) => {
  md.use(mdContainer, "dm", {
    validate(params) {
      return params.trim().match(/^dm\s*(.*)$/);
    },
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const propsVal = tokens[idx].info
          .split("dm")[1]
          .replace(" ", "")
          .replaceAll('"', "")
          .split(" ");
        const props = {} as any;

        for (let i of propsVal) {
          const kv = i.split("=");
          props[kv[0]] = kv[1];
        }

        const js = tokens[idx + 1].content || "";
        const html = tokens[idx + 2].content || "";
        const ts = tokens[idx + 3].content || "";
        return `<comb title="${props.title || ""}"  describe="${
          props.describe || ""
        }" html="${md.utils.escapeHtml(html)}" js="${md.utils.escapeHtml(
          js
        )}" ts="${md.utils.escapeHtml(ts)}" >`;
      }
      return "</comb>";
    },
  });
};
