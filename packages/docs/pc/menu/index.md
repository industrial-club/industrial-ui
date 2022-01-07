# Menu（菜单）

> :tada: :100:

## 代码演示

:::dm title="数据菜单" describe="根据相关数据渲染菜单"

<script setup>
    const list = [
        {
	"name": "inl-app-ui",
	"child": [{
		"name": "工业 ui 风",
		"url": "/",
		"child": []
	}, {
		"name": "快速上手",
		"url": "/app/started",
		"child": []
	}, {
		"name": "更新日志",
		"url": "/app/log",
		"child": []
	}, {
		"name": "组件",
		"child": [{
			"name": "button(按钮1)",
			"url": "/app/button",
			"child": []
		}]
	}]
}
    ];
</script>
<template v-slot:comb>
    <inl-menu :menus="list" />
</template>

```tsx
import { defineComponent } from "vue";
import { inlMenuItem } from "inl-pc-ui/dist/types/src/components/menu/index";
export default defineComponent({
  setup() {
    const list: Array<inlMenuItem> = [];
    return <inl-menu menus={list} />;
  },
});
```

:::

## API

> 通过设置 menu 不同属性来控制 menu 样式

|  参数  | 说明                                    |                类型                 | 默认值                |
| :----: | :-------------------------------------- | :---------------------------------: | --------------------- |
| router | 设置为 `true` 后可根据 url 进行页面跳转 |              `Boolean`              | `false`               |
| menus  | 用于菜单子级渲染                        |                `[] `                | ` Array<inlMenuItem>` |
| width  | 设置菜单的占位宽度                      |              `number`               | 200                   |
|  mode  | 设置菜单的展示形式                      | `vertical` , `horizontal`, `inline` | `horizontal`          |
| theme  | 设置菜单主题                            |           `dark`,`light`            | `light`               |

## Event(事件)

| 事件名称 | 说明                 |        回调参数        |
| :------: | :------------------- | :--------------------: |
| onChange | 当 item 被点击时触发 | `(e:inlMenuItem)=>{} ` |
