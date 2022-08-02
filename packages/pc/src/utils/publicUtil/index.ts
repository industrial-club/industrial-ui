import changeTheme from "./changeTheme";
import login from "./login";
import systemSetting from "./systemConfig";

const theme = changeTheme;

//
/**
 *
 * @param opt
 * @param opt.fontSize 基础字体大小
 * @param opt.designSize 设计稿基数
 */
const setRem = (opt: { fontSize?: number; designSize?: number }) => {
  const fontSize = opt.fontSize || 14;
  const designSize = opt.designSize || 1920;
  const scale = document.documentElement.clientWidth / designSize;
  document.documentElement.style.fontSize = `${
    fontSize * Math.min(scale, 2)
  }px`;
};

export { theme, login, systemSetting, setRem };
export default { theme, login, systemSetting, setRem };
