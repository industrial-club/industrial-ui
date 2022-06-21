import { defineComponent, ref } from "vue";
import { gradeColumns } from "../../config/systemConfig";

const options = [
  { label: "平台", value: "platform" },
  { label: "智信", value: "zhixin" },
  { label: "行动中心", value: "actionCenter" },
  { label: "短信", value: "shortMessage" },
  { label: "公众号", value: "officialAccount" },
  { label: "电话", value: "telephone" },
];
export default defineComponent({
  name: "NoticeGrade",
  setup() {
    const dataSource = ref([
      {
        grade: "非常紧急",
        isUse: true,
        mode: ["platform"],
      },
      {
        grade: "紧急",
        isUse: true,
        mode: ["platform"],
      },
      {
        grade: "重要",
        isUse: true,
        mode: ["platform"],
      },
      {
        grade: "中等",
        isUse: true,
        mode: ["platform"],
      },
      {
        grade: "一般",
        isUse: true,
        mode: ["platform"],
      },
    ]);
    return () => (
      <div class="noticeGrade">
        <div class="noticeGrade-content">
          <a-table
            dataSource={dataSource.value}
            columns={gradeColumns}
            pagination={false}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.dataIndex === "isUse") {
                  return <a-switch v-model={[record.isUse, "checked"]} />;
                }
                if (column.dataIndex === "mode") {
                  return (
                    <a-checkbox-group
                      v-model={[record.mode, "value"]}
                      options={options}
                    />
                  );
                }
              },
            }}
          ></a-table>
        </div>
      </div>
    );
  },
});
