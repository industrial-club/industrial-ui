# industrial-ui

## [inl-util](/packages/util/README.md)

## yarn site 运行 主题修改程序与demo演示


## 编译UI
> 编译UI 需要在项目根目录运行 `yarn build:pc`, 如出现错误请查看源代码是否有问题以及主题文件是否存在， 打包完成后 会在 `packages/pc`, 下出现dist文件夹，所有打包后的文件均在该文件夹下。部署至npm需在 `packages/pc` 目录下运行npm publish，注意版本号迭代. 


## 主题使用
1. 安装 inl-ul@0.03 以上版本，
``` ts
    import inlUi from 'inl-ui';
    app.use(inlUi);
```
2. vite.config.ts
``` ts

export default {
  ...,
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true;@import "${require.resolve("inl-ui/theme/dark.less")}";`,
          "root-entry-name": "dark",
        },
        javascriptEnabled: true,
      },
    },
  },
};
```
