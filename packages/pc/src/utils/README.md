# util 工具
> ui 工具类

1. 自动识别主题并修改
   ``` tsx
    import inl from 'inl-ui';

    const { theme } = inl.utils;

    // 用于接口处理成功后注册到内存，该方法会自动更新主题
    theme.set(themeName)；

    // 用于页面加载前注册主题使用，该方法会自动更新主题
    theme.settingTheme(themeName?: string);
   ```