import { defineComponent, onMounted } from "vue";
import renderCabinet from "@/pageComponent/components/pss-cabinet/cabinetRender";
import { getCabinetRoomDetails } from "@/api/tupu";
import { elcRoomFilter } from "@/pageComponent/utils/filter";
import { message } from "ant-design-vue";
import dayjs from "dayjs";

const props = {
  name: String,
  roomId: Number,
};
const unix = dayjs().valueOf();
export default defineComponent({
  name: "ElcRoomHt",
  props,
  setup(_props, _context) {
    let allCabinetData: any;
    const handleTagName = (name: any, maxLength?: any) => {
      if (maxLength) {
        return `${name.slice(0, maxLength)}${
          name.length > maxLength ? "…" : ""
        }`;
      }

      return name;
    };
    const handleCabinetData = (data: any) => {
      const allRowData: any[] = [];
      const composeData: any = {
        name: data.roomName,
        id: data.roomId,
        child: [],
      };

      if (data.child) {
        // 所有配电柜
        data.child.forEach((cabinet: any) => {
          const rowIndex = Number(cabinet.row) - 1;
          const colIndex = Number(cabinet.col) - 1;
          const rowData = allRowData[rowIndex];
          const loopData = cabinet.child.reverse().map((loop: any) => {
            return {
              // name: handleTagName(loop.loopName, 5),
              // id: loop.loopId,
              state: loop.loopStatus,
              cards: loop.powerOffPlateCount,
            };
          });
          const colData = {
            name: handleTagName(
              `${cabinet.cabinetCode || ""} ${cabinet.cabinetName}`,
              10
            ),
            // id: cabinet.cabinetId,
            child: loopData,
          };

          // 处理排
          if (!rowData) {
            allRowData[rowIndex] = {
              name: `第${cabinet.row}排`,
              id: rowIndex + 1,
              cards: cabinet.prepareOffAndOnCount,
              child: [],
            };
          }

          allRowData[rowIndex].child[colIndex] = colData;
        });
      }
      composeData.child = allRowData;

      return composeData;
    };
    onMounted(async () => {
      new ht.DataModel();
      const tupuCanvas = document.getElementById("tupu");
      const res = await getCabinetRoomDetails(_props.roomId);
      if (res.data) {
        const data = {
          roomId: _props.roomId,
          roomName: _props.name,
          child: elcRoomFilter(res.data),
        };
        allCabinetData = handleCabinetData(data);
        const obj: any = {
          data: allCabinetData,
          renderState: "group",
        };
        const cabinet = new renderCabinet({
          domId: `tupu${unix}`,
          ...obj,
        });
      } else {
        message.error("无数据");
      }

      // (window as any).cabinetLoopClick = this.loopClick;
      // (window as any).rowClick = this.rowClick;

      // this.$nextTick(() => {
      //   const tupuCanvas = document.getElementById(this.tupuId);

      //   tupuCanvas.onmousedown = () => {
      //     this.visible = false;
      //   };

      //   tupuCanvas.onwheel = () => {
      //     this.visible = false;
      //   };
      // });
    });
    return () => <div id={`tupu${unix}`}></div>;
  },
});
