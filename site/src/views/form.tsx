import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const v = ref(false);
    const textVal = ref("aaaaa");

    const dataSource = [
      {
        key: "1",
        name: "胡彦斌",
        age: 32,
        address: "西湖区湖底公园1号",
      },
      {
        key: "2",
        name: "胡彦祖",
        age: 42,
        address: "西湖区湖底公园1号",
      },
    ];
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "住址",
        dataIndex: "address",
        key: "address",
      },
    ];
    const renderTable = () => {
      return <a-table dataSource={dataSource} columns={columns} />;
    };

    return () => (
      <div class={"form-demo"}>
        <a-form
          label-col={{
            style: {
              width: "150px",
            },
          }}
          wrapper-col={{
            span: 14,
          }}
        >
          <a-form-item label="输入框：">
            <a-input vModels={[[textVal.value, "value"]]} />
            <a-input disabled vModels={[[textVal.value, "value"]]} />
          </a-form-item>

          <a-form-item label=" ">
            <a-checkbox>Remember me</a-checkbox>
          </a-form-item>
          <a-form-item label="Activity type">
            <a-checkbox-group>
              <a-checkbox value="1" name="type">
                Online
              </a-checkbox>
              <a-checkbox value="2" name="type">
                Promotion
              </a-checkbox>
              <a-checkbox value="3" name="type">
                Offline
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="开关">
            <a-switch v-models={[[v.value, "checked"]]} />
            <a-switch
              v-models={[[v.value, "checked"]]}
              checked-children="开"
              un-checked-children="关"
            />
            <a-switch v-models={[[v.value, "checked"]]} disabled />
          </a-form-item>

          <a-form-item label="下拉框">
            <a-select>
              <a-select-option value="Zhejiang">Zhejiang</a-select-option>
              <a-select-option value="Jiangsu">Jiangsu</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="时间选择">
            <a-date-picker />
          </a-form-item>

          <a-form-item label="表格">{renderTable()}</a-form-item>
        </a-form>
        <inl-about />
      </div>
    );
  },
});
