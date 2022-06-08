import { defineComponent, ref } from "vue";
import RecordTable from "./record-table";
import AlarmDetail from "@/pageComponent/views/alarms/alarmDetail";
import utils from "@/utils";

const WarningRecord = defineComponent({
  setup() {
    const isDetailShow = ref(false);
    const detailRecord = ref();

    const handleDetail = (record: any) => {
      detailRecord.value = record;
      isDetailShow.value = true;
    };

    return () => (
      <div class="warning-record-index">
        {isDetailShow.value ? (
          <AlarmDetail
            record={detailRecord.value}
            onClose={() => (isDetailShow.value = false)}
          />
        ) : (
          <RecordTable onShowDetail={handleDetail} />
        )}
      </div>
    );
  },
});

export default utils.installComponent(WarningRecord, "alarm-record");
