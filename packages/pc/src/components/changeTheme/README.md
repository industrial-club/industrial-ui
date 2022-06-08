# inl-change-theme-select（修改主题按钮）
> 用于在平台系统内 对主题进行修改

## 使用方式
``` tsx
import { defineComponent, ref, watch } from "vue";
import { themeName} from 'inl-ui';

export default defineComponent({
  setup() {
    return () => (
        <inl-change-theme-select onChange={(e) => {}} />
    );
  },
  components: {},
});

```


