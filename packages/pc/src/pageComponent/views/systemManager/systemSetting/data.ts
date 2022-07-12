const systemConfig = {
  projectInfo: [
    { name: "customer", label: "客户名称", type: "select" },
    {
      name: "project",
      label: "项目名称",
      type: "select",
    },
  ],
  InterfaceInfo: [
    {
      label: "登录页系统标题",
      name: "loginPageSystemTitle",
      type: "img",
      width: "80",
      height: "80",
      initheight: "54",
      annotation: "请上传高度为54px，格式为PNG的图片。",
      btn: "+ 上传图片",
      imgType: 1,
    },
    {
      label: "登录页主图",
      name: "loginMainPic",
      type: "img",
      width: "132",
      height: "100",
      initwidth: "920",
      initheight: "700",
      annotation: "请上传尺寸920*700px，格式为PNG的图片。",
      btn: "+ 上传图片",
      imgType: 2,
    },
    {
      label: "登陆页版权信息",
      type: "input",
      name: "loginCopyright",
    },
    {
      label: "主页logo",
      name: "mainPageLogo",
      type: "img",
      width: "80",
      height: "80",
      initheight: "54",
      annotation: "请上传高度为54px，格式为PNG的图片。",
      btn: "+ 上传logo",
      imgType: 4,
    },
    {
      label: "主页版权信息",
      type: "input",
      name: "homepageCopyright",
    },
  ],
};

export { systemConfig };
