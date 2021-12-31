export default () => {
  return {
    text: "inl-pc-ui",
    children: [
      { text: "快速上手", link: "/pc/started" },
      { text: "更新日志", link: "/pc/log" },
      {
        text: "组件",
        children: [{ text: "button(按钮)", link: "/pc/button" }],
      },
    ],
    sidebarDepth: 1,
  };
};
