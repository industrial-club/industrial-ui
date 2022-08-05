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
      height: "32",
      initheight: "54",
      annotation: "请上传高度为54px，格式为PNG的图片。",
      btn: "+ 上传图片",
      imgType: 1,
    },
    {
      label: "登录页主图",
      name: "loginMainPic",
      type: "img",
      height: "100",
      initwidth: "920",
      initheight: "700",
      annotation: "请上传尺寸920*700px，格式为PNG的图片。",
      btn: "+ 上传图片",
      imgType: 2,
    },
    {
      label: "系统名称",
      type: "select",
      name: "product",
    },
    {
      label: "登陆页系统描述",
      type: "input",
      name: "loginSysDesc",
    },
    {
      label: "登陆页版权信息",
      type: "input",
      name: "loginCopyright",
    },
    {
      label: "登陆页系统logo",
      name: "loginSystemLogo",
      type: "img",
      initheight: "54",
      annotation: "请上传高度为54px，格式为PNG的图片。",
      btn: "+ 上传logo",
      imgType: 3,
    },
    {
      label: "主页logo",
      name: "mainPageLogo",
      type: "img",
      height: "54",
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
const picList = {
  left: [
    {
      label: "登陆页系统标题",
      name: "loginPageSystemTitle",
      // width: "140px",
      height: "30px",
      color: "darkBlue",
      type: "img",
      versions: "AB",
      position: "absolute",
    },
    {
      label: "登陆页主图",
      name: "loginMainPic",
      width: "280px",
      height: "205px",
      color: "blue",
      type: "img",
      versions: "AB",
    },
    {
      label: "系统名称",
      width: "280px",
      height: "30px",
      color: "green",
      name: "productName",
      type: "text",
      versions: "A",
    },
    {
      label: "登陆页系统描述",
      width: "280px",
      height: "50px",
      color: "blue",
      name: "loginSysDesc",
      type: "text",
      versions: "A",
    },
  ],
  right: [
    {
      label: "登陆页系统logo",
      width: "70px",
      height: "45px",
      color: "blue",
      wrap: true,
      name: "loginSystemLogo",
      type: "img",
    },
    {
      label: "项目名称",
      width: "150px",
      height: "45px",
      color: "blue",
      name: "projectName",
      type: "text",
    },
  ],
};
export { systemConfig, picList };
