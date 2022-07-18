import { defineComponent, onMounted, ref, reactive } from "vue";
import utils from "@/utils";
import configuration from "@/pageComponent/components/pressureFiltration/configuration";
import filterPressConfigurationApi, {
  pageParamlistData,
} from "@/api/pressureFiltration/filterPressConfiguration";

const unloading = defineComponent({
  name: "Unloading",
  components: {
    configuration,
  },
  setup(this, _props, ctx) {
    // 页面配置项数据
    const pageParamList = reactive<pageParamlistData>({});

    // 获取页面配置项
    const http = async () => {
      const res = await filterPressConfigurationApi.getPageParamList();
      for (const key in res.data) {
        pageParamList[key] = res.data[key];
      }
    };

    onMounted(() => {
      http();
    });
    return () => (
      <div class="unloading">
        {pageParamList.unload && (
          <>
            <configuration
              title="卸料设定"
              form={pageParamList.unload.model}
              onRefresh={() => {
                http();
              }}
            ></configuration>
            <configuration
              title="卸料判断模式"
              form={pageParamList.unload.adjustModel}
              onRefresh={() => {
                http();
              }}
            ></configuration>
          </>
        )}
        {pageParamList.belt && (
          <>
            <configuration
              title="转载设备启动设置"
              form={pageParamList.belt.start}
              onRefresh={() => {
                http();
              }}
            ></configuration>
            <configuration
              title="转载设备停止设置"
              form={pageParamList.belt.stop}
              onRefresh={() => {
                http();
              }}
            ></configuration>
            <configuration
              title="生产闭锁"
              form={pageParamList.belt.lock}
              onRefresh={() => {
                http();
              }}
            ></configuration>
          </>
        )}
      </div>
    );
  },
});

export default utils.installComponent(unloading, "unloading");
