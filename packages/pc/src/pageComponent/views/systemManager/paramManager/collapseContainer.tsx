/*
 * @Abstract: 摘要
 * @Author: wang liang
 * @Date: 2022-03-25 10:51:58
 * @LastEditors: wang liang
 * @LastEditTime: 2022-03-31 14:03:07
 */
import { defineComponent, ref } from "vue";
import { Button } from "ant-design-vue";
import { CaretUpOutlined, CaretRightOutlined } from "@ant-design/icons-vue";

const CollapseContainer = defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    defaultCollapse: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    /* 是否展开状态 */
    const isOpen = ref(props.defaultCollapse);

    return () => (
      <div class="collapse-container">
        <div class="header">
          <span class="container-title">{props.title}</span>
          <Button type="link" onClick={() => (isOpen.value = !isOpen.value)}>
            {isOpen.value ? (
              <span>
                收起 <CaretUpOutlined />
              </span>
            ) : (
              <span>
                展开 <CaretRightOutlined />
              </span>
            )}
          </Button>
        </div>
        <div
          class="default-container"
          style={{ display: isOpen.value ? "" : "none" }}
        >
          {slots.default?.()}
        </div>
      </div>
    );
  },
});

export default CollapseContainer;
