export default () => {
  return {
    text: "inl-app-ui",
    children: [
      { text: "工业 ui 风", link: "/" },
      { text: "快速上手", link: "/app/started" },
      { text: "更新日志", link: "/app/log" },
      {
        text: "组件",
        children: [{ text: "button(按钮1)", link: "/app/button" }],
      },
    ],
    sidebarDepth: 2,
  };
};
