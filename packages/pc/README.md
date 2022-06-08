# 工业 pc ui 库

## 编译 UI

> 编译 UI 需要在项目根目录运行 `yarn build:pc`, 如出现错误请查看源代码是否有问题以及主题文件是否存在， 打包完成后 会在 `packages/pc`, 下出现 dist 文件夹，所有打包后的文件均在该文件夹下。部署至 npm 需在 `packages/pc` 目录下运行 npm publish，注意版本号迭代.

## 组件列表与划分

### 页面组件

#### 视频组件(video)

#### 基座组件(base)

1. [登录页面组件](./src/pageComponent/views/login/README.md)

#### 报警组件(alarm)

### 功能组件

1. [修改主题的工具](./src/components/changeTheme/README.md)
2. [视频播放组件](./src/components/videoPlayer/README.md)
3. [顶部导航菜单组件](./src/components/headerMenu/README.md)

### [UI 工具类](./src/utils/README.md)
