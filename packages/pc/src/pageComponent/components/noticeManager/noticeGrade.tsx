import {
  defineComponent,
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
} from "vue";
import { message } from "ant-design-vue";
import noticeCenterApi from "@/api/noticeCenter";
import getEnumList from "@/api/enumList";
import { gradeColumns } from "../../config/systemConfig";

const props = {
  formData: Object,
};

export default defineComponent({
  name: "NoticeGrade",
  props,
  setup(_props, _context) {
    // 列表数据
    const dataSource = ref([]);

    // 通道数据
    const data = reactive<{
      id?: number;
      corpId?: string;
      channelName?: string;
      available?: boolean;
      notificationChannelConfigList?: null;
    }>({});

    // 通知方式数据
    const options = ref([]);

    // 是否编辑
    const isEdit = ref(false);

    // 获取通知方式
    const enumList = async () => {
      const res = await noticeCenterApi.getEnumList("PlatformEnum");
      options.value = res.data.map((item) => ({
        label: item.name,
        value: item.code,
      }));
    };

    // 获取列表数据
    const http = async () => {
      const res = await noticeCenterApi.getChannelDetail(data.id);
      dataSource.value = res.data;
    };

    // 保存
    const save = async () => {
      const res = await noticeCenterApi.getChannelDetailAdd(dataSource.value);
      if (res.data) {
        message.success("保存成功");
        isEdit.value = false;
      }
    };

    watch(
      () => _props.formData,
      (e) => {
        if (e) {
          for (const key in e) {
            data[key] = e[key];
          }
          nextTick(() => {
            http();
          });
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(() => {
      enumList();
    });
    return () => (
      <div class="noticeGrade">
        <div class="noticeGrade-top">
          {!isEdit.value ? (
            <a-button
              type="primary"
              onClick={() => {
                isEdit.value = true;
              }}
            >
              编辑
            </a-button>
          ) : (
            <div>
              <a-button
                type="primary"
                style={{ marginRight: "20px" }}
                onClick={save}
              >
                保存
              </a-button>
              <a-button
                onClick={() => {
                  isEdit.value = false;
                  http();
                }}
              >
                取消
              </a-button>
            </div>
          )}
        </div>
        <div class="noticeGrade-content">
          <a-table
            dataSource={dataSource.value}
            columns={gradeColumns}
            pagination={false}
            v-slots={{
              bodyCell: ({ column, record, index }: any) => {
                if (column.key === "isUse") {
                  return (
                    <a-switch
                      disabled={!isEdit.value}
                      v-model={[record.available, "checked"]}
                    />
                  );
                }
                if (column.key === "mode") {
                  return (
                    <a-checkbox-group
                      v-model={[record.platformList, "value"]}
                      options={options.value}
                      disabled={!isEdit.value}
                      onChange={() => {
                        record.platforms = record.platformList.join(",");
                      }}
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
