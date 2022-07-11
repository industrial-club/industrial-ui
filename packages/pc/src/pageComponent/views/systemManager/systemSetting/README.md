# 系统设置 - 系统管理中的系统配置

> 根据服务器返回的菜单树结构 渲染出第一层菜单

## 组件名称 [inl-system-setting]

### 示例

```jsx
import inl from "inl-ui";
const { theme } = inl.utils;

const setTheme = (theme: string) => {
  theme.set(theme);
};
<inl-system-setting onSetTheme={setTheme} />;
```

### 属性说明

| 属性名称             | 类型    | 默认值 | 说明                                         |
| -------------------- | ------- | ------ | -------------------------------------------- |
| customer             | boolean | true   | 客户名称                                     |
| project              | boolean | true   | 项目名称                                     |
| product              | boolean | true   | 系统名称                                     |
| loginSysDesc         | boolean | true   | 登陆系统描述                                 |
| loginCopyright       | boolean | true   | 登陆版权信息                                 |
| homepageCopyright    | boolean | true   | 主页版权信息                                 |
| loginPageSystemTitle | boolean | true   | 登陆页系统标题                               |
| loginMainPic         | boolean | true   | 登录页主图                                   |
| loginSystemLogo      | boolean | true   | 登陆页系统 logo                              |
| mainPageLogo         | boolean | true   | 主页 logo                                    |
| versions             | string  | "platform"    | 右侧图片是简版还是复杂版 平台版 platform，系统版 system  |

### 事件

| 事件名     | 参数  | 说明     |
| ---------- | ----- | -------- |
| onSetTheme | theme | 主题颜色 |
