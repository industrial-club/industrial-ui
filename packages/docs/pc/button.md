# button

<script setup>
    import { ref } from "vue";
    const size = ref('l');
    const sizeList = ['m','l','xl','xxl'];
    const changeSize = (item) => {
        size.value = item
    }
    const setAlert = () => {
        alert(123)
    }
    let arr = [
        {id: 1, name: '部门1', pid: 0},
        {id: 2, name: '部门2', pid: 1},
        {id: 3, name: '部门3', pid: 1},
        {id: 4, name: '部门4', pid: 3},
        {id: 5, name: '部门5', pid: 4},
    ];
</script>

> 按钮组件

:::dm title="按钮类型" describe="按钮类型"

<script></script>

<template v-slot:comb>
    <div>
        <inl-button>default</inl-button>
        <inl-button type="primary">primary</inl-button>
        <inl-button type="success">success</inl-button>
        <inl-button type="error">error</inl-button>
        <inl-button type="warning">warn</inl-button>
    </div>
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

:::dm title="按钮形状" describe="按钮形状"

<script></script>

<template v-slot:comb>
    <div>
        <inl-button shape="circle">circle</inl-button>
        <inl-button shape="circle" type="primary">primary</inl-button>
        <inl-button shape="circle" type="success">success</inl-button>
        <inl-button shape="circle" type="error">error</inl-button>
        <inl-button shape="circle" type="warning">warn</inl-button>
        <inl-button shape="round"></inl-button>
    </div>
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

:::dm title="按钮大小" describe="根据相关数据渲染菜单"

<script></script>

<template v-slot:comb>
    <div>
        <div>
            <inl-button  v-for="item in sizeList" key="item" @click="changeSize(item)">{{item}}</inl-button>
        </div>
        <div>
            <div>
                <inl-button :size="size">m</inl-button>
                <inl-button :size="size">l</inl-button>
                <inl-button :size="size">xl</inl-button>
                <inl-button :size="size">xxl</inl-button>
            </div>
        </div>
    </div>
</template>

```tsx
import { ref } from "vue";
const size = ref("l");
const sizeList = ["m", "l", "xl", "xxl"];
const changeSize = (item) => {
  size.value = item;
};
let arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
];
```

:::

::: dm

<div></div>

<template v-slot:comb>
    <div>
        <inl-button block>default</inl-button>
        <inl-button block type="primary">primary</inl-button>
        <inl-button block type="success">success</inl-button>
        <inl-button block type="error">error</inl-button>
        <inl-button block type="warning">warn</inl-button>
    </div>
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

> aa

|   参数   | 说明                 |                            类型                            | 默认值    |
| :------: | :------------------- | :--------------------------------------------------------: | --------- |
|   type   | 设置按钮类型样子     | `"default" 、 "success" 、 "error" 、 "warn"` 、 `default` |
|   size   | 设置按钮大小         |                `"m" 、 "l" 、 "xl" 、"xxl"`                | `default` |
| disabled | 设置按钮是否可以点击 |                         `Boolean`                          | `false`   |
|   icon   | 设置按钮 icon        |                          `String`                          | “”        |
|  block   | 设置按钮块           |                         `Boolean`                          | `false`   |
|  shape   | 设置按钮形状         |                `"circle" 、 "round" 、 ""`                 | “”        |
