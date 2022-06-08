import { defineComponent, ref } from "vue";
import ConfigureTable from "./configure-table";
import AddWarningConfig from "@/pageComponent/views/alarms/add-warning-configure";
import utils from "@/utils";

const WarningConfigure = defineComponent({
  setup(props) {
    const isAddShow = ref(false);
    const detailId = ref();

    const handleShowAdd = (record: any) => {
      detailId.value = record ? record.id : undefined;
      isAddShow.value = true;
    };

    return () => (
      <div class="index">
        {isAddShow.value ? (
          <AddWarningConfig
            id={detailId.value}
            onClose={() => (isAddShow.value = false)}
          />
        ) : (
          <ConfigureTable onShowAdd={handleShowAdd} />
        )}
      </div>
    );
  },
});

export default utils.installComponent(WarningConfigure, "alarm-configure");
