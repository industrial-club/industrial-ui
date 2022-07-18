import { defineComponent, nextTick, onMounted, reactive, ref } from "vue";
import utils from "@/utils";
import configuration from "@/pageComponent/components/pressureFiltration/configuration";
import filterPressConfigurationApi, {
  listItem,
  pageParamlistData,
} from "@/api/pressureFiltration/filterPressConfiguration";

const feeding = defineComponent({
  name: "Feeding",
  components: {
    configuration,
  },
  setup(this, props, ctx) {
    // 页面配置项数据
    const pageParamList = reactive<pageParamlistData>({});

    // 获取页面配置项
    const http = async () => {
      const res = await filterPressConfigurationApi.getPageParamList();
      const list: Array<{ list: listItem; name: string }> = [];
      const { model } = res.data.feeding;
      for (const key in res.data) {
        pageParamList[key] = res.data[key];
      }
      for (const key in res.data.feeding) {
        if (key.indexOf("tpf") > -1) {
          list.push({
            name: res.data.feeding[key][0].key,
            list: res.data.feeding[key],
          });
        }
      }
      pageParamList.feeding.model = model;
      pageParamList.feeding.parameter = list;
    };

    onMounted(() => {
      http();
    });
    return () => (
      <div class="feeding">
        {pageParamList.feeding && (
          <>
            <configuration
              title="进料模式设定"
              form={pageParamList.feeding.model}
              onRefresh={() => {
                http();
              }}
            ></configuration>
            {pageParamList.feeding.parameter &&
              pageParamList.feeding.parameter.map((item) => (
                <configuration
                  title={`${item.name}参数设定`}
                  form={item.list}
                  onRefresh={() => {
                    http();
                  }}
                ></configuration>
              ))}
          </>
        )}
      </div>
    );
  },
});

export default utils.installComponent(feeding, "feeding");
