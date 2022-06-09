# 公共暴露的util方法

1. 自动识别主题并修改
   ``` tsx
    import inl from 'inl-ui';

    const { theme } = inl.utils;

    // 用于接口处理成功后注册到内存，该方法会自动更新主题
    theme.set(themeName)；

    // 用于页面加载前注册主题使用，该方法会自动更新主题
    theme.settingTheme(themeName?: string);
   ```
2. 免登工具 + 登录

  + 免登使用环境
    ``` ts
        import ui from "inl-ui";
        const loginFun = new ui.utils.login();

        // 自动免登
        loginFun.getTokenByCode();
        loginFun.systemServerInfo //查看当前环境  zx-env:智信环境、mtip-app-env：平台微应用环 境、mtip-env:平台独立环境

    ```
+ 登录环境使用
``` ts
        import ui from "inl-ui";
        const loginFun = new ui.utils.login();

        // 登录
        loginFun.getTokenByCode({
            password,
            username
        });
```
