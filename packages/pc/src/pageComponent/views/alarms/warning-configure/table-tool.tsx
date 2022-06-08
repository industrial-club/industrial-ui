import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import { debounce } from "lodash";

import { SearchOutlined } from "@ant-design/icons-vue";

const TableTool = defineComponent({
  props: {
    onImportClick: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    onAddClick: {
      type: Function,
    },
  },
  setup(_props) {
    const router = useRouter();
    const form = reactive({
      keyword: "",
    });
    /**
     * 添加报警按钮点击 跳转到添加报警页面
     */
    const handleAddClick = () => _props.onAddClick?.();

    const handleSearch = debounce((val) => {
      _props.onSubmit(form);
    }, 300);

    return () => (
      <div class="table-tool">
        <a-space>
          <a-button type="primary" onClick={handleAddClick}>
            添加报警
          </a-button>
          <a-button onClick={() => _props.onImportClick()}>批量导入</a-button>
        </a-space>
        <div class="form">
          <a-input
            prefix={<SearchOutlined />}
            placeholder="设备名称、报警设备"
            allowClear
            v-model={[form.keyword, "value"]}
            onInput={handleSearch}
          />
        </div>
      </div>
    );
  },
});

export default TableTool;
