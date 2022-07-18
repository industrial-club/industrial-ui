# 顶部导航组件

> 为方便开发调试，特推出播放顶部导航组件。

## 组件名称 [inl-header-menu] 可根据引入进行自定义修改

```tsx
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const menuList = ref<Array<{ name: string; key: string }>>([
      {
        name: "智能监控",
        key: "monitor",
      },
      {
        name: "报警管理",
        key: "alarm",
      },
      {
        name: "辅助系统",
        key: "assist",
      },
      {
        name: "设备管理",
        key: "device",
      },
      {
        name: "在线监测",
        key: "online",
      },
      {
        name: "系统管理",
        key: "system",
      },
    ]);
    const active = ref("");
    return () => (
      <inl-header-menu
        v-model={[active.value, "active"]}
        title={"数据可视化大屏标题"}
        mode="center"
        menuList={menuList.value}
        onChange={(e) => {
          console.log(e);
        }}
      ></inl-header-menu>
    );
  },
});
```

## 参数

| 参数名称        | 类型           | 默认值 | 作用                                 |
| --------------- | -------------- | ------ | ------------------------------------ |
| active(v-model) | String         |        | 当前选中的菜单项 key                 |
| title           | String         |        | 标题名称                             |
| mode            | center \| left | center | 菜单类型，现在支持居中、左右模式两种 |
| menuList        | Array          |        | 菜单数组                             |

## 方法

| 方法名称 | 类型     | 返回参数            | 作用         |
| -------- | -------- | ------------------- | ------------ |
| change   | Function | (e: string) => void | 切换菜单回调 |
