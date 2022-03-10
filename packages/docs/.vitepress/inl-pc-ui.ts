export default () => {
  return {
    text: "inl-pc-ui",
    children: [
      { text: "快速上手", link: "/inl/pc/started" },
      { text: "更新日志", link: "/inl/pc/log" },
      {
        text: "组件",
        children: [
          { text: "button(按钮)", link: "/inl/pc/button" },
          { text: "Menu(菜单)", link: "/inl/pc/menu/" },
        ],
      },
    ],
    sidebarDepth: 1,
  };
};
