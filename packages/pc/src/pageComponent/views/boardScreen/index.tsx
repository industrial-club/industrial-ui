import { defineComponent, onMounted, onUnmounted, reactive, ref } from "vue";
import { deepclone } from "@/pageComponent/utils/";
import tupu from "./tupu";
import room from "./room";
import { message } from "ant-design-vue";
import {
  getAllCabinetByRoomId,
  listRoomVO,
  taskJobDetail,
} from "@/api/boardScreen/powersupply";
import utils from "@/utils";
import { elcRoomFilter } from "@/pageComponent/utils/filter";

const boardScreen = defineComponent({
  components: {
    room,
    tupu,
  },
  setup(this, props, ctx) {
    const roomData = reactive<any>({});
    const powerData = ref<Array<any>>([]);
    const tupuData = ref<any>({});
    const tupuState = ref<string>("");
    const postType = ref<string>("");
    const allCabinetData = ref<any>({});
    let timer: NodeJS.Timer | null;
    const setCamera = ref<boolean>(false);

    const roomChange = async () => {
      powerData.value = [];
      postType.value = "newData";
      setCamera.value = true;
      roomData.rowValue = "all";
      // await getRowOptions();
      getTupuData();
      // getOrderData();
    };
    const rowChange = () => {
      // powerData.value = [];
      postType.value = "newData";
      setCamera.value = true;
      filterTupuData();
      // getOrderData();
    };
    const rowClick = (rowId) => {
      roomData.rowValue = rowId;
      filterTupuData();
      // getOrderData();
    };
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    // 根据配电室获取排的options
    // const getRowOptions = () => {
    //   const findCurrentRoomItem = roomData.roomOptions.find(
    //     (opt) => opt.roomId === roomData.roomValue
    //   );
    //   if (findCurrentRoomItem && findCurrentRoomItem.row) {
    //     roomData.rowOptions = new Array(Number(findCurrentRoomItem.row as any))
    //       .fill("")
    //       .map((item, index) => {
    //         return {
    //           name: `第{index + 1}排`,
    //           value: index + 1,
    //         };
    //       });
    //     if (roomData.rowOptions.length) {
    //       roomData.rowOptions.unshift({ name: "全部", value: "all" });
    //     }
    //   }
    //   if (
    //     !roomData.rowValue ||
    //     !roomData.rowOptions.some((opt) => opt.value === roomData.rowValue)
    //   ) {
    //     roomData.rowValue = roomData.rowOptions?.[0]?.value || "";
    //   }
    // };
    // 获取配电室options
    const getRoomOptions = async () => {
      const res = await listRoomVO();
      if (res.data) {
        roomData.roomOptions = res.data || [];
        if (
          !roomData.roomValue ||
          !roomData.roomOptions.some((opt) => opt.roomId === roomData.roomValue)
        ) {
          roomData.roomValue = roomData.roomOptions?.[0]?.roomId || "";
        }
      } else {
        message.error((res as any).msg);
        return;
      }
    };
    // 获取工单列表
    // const getOrderData = async () => {
    //   const res = await taskJobDetail({
    //     params: {
    //       roomId: roomData.roomValue,
    //       row: roomData.rowValue,
    //     },
    //   });
    //   if (res.data) {
    //     powerData.value = res.data || [];
    //   } else {
    //     message.error((res as any).msg);
    //   }
    // };
    const handleTagName = (name, maxLength?) => {
      if (maxLength) {
        return `${name.slice(0, maxLength)}${
          name.length > maxLength ? "…" : ""
        }`;
      }

      return name;
    };
    // 处理后台得到的所有柜子数据
    const handleCabinetData = (data) => {
      const allRowData: any = [];

      const composeData = {
        name: data.roomName,
        id: data.roomId,
        child: [],
      };

      if (data.child) {
        // 所有配电柜
        data.child.forEach((cabinet) => {
          const rowIndex = Number(cabinet.row) - 1;
          const colIndex = Number(cabinet.col) - 1;
          const rowData = allRowData[rowIndex];
          const loopData = cabinet.child.reverse().map((loop) => {
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
            id: cabinet.cabinetId,
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

    // 通过rowValue筛选每排的数据
    const filterTupuData = () => {
      const filterData = deepclone(allCabinetData);
      if (filterData._rawValue.child) {
        if (roomData.rowValue !== "all") {
          const rowList = filterData._rawValue.child.filter(
            (row: any) => row.id === roomData.rowValue
          );

          filterData._rawValue.child = rowList;
          tupuState.value = "row";
          tupuData.value = filterData._rawValue;
        } else {
          tupuState.value = "group";
          tupuData.value = filterData._rawValue;
        }
      }
    };
    // 获取图谱须要的数据
    const getTupuData = async () => {
      const res = await getAllCabinetByRoomId(roomData.roomValue);
      if (res.data) {
        for (const key in res.data) {
          powerData.value.push(res.data[key]);
        }
        const data = {
          roomId: roomData.roomValue,
          roomName: roomData.roomOptions.find(
            (n) => n.roomId === roomData.roomValue
          )!.name,
          child: elcRoomFilter(res.data),
        };
        allCabinetData.value = handleCabinetData(data);
        filterTupuData();
      } else {
        message.error((res as any).msg);
      }
    };
    const getData = async (val = true) => {
      await getRoomOptions();
      roomData.rowValue = "all";
      // await getRowOptions();
      // getOrderData();
      getTupuData();

      // setCamera.value = val;

      // if (process.env.NODE_ENV === "production") {
      //   clearTimer();

      //   timer = setTimeout(() => {
      //     getData(false);
      //   }, 1000 * 60);
      // }
    };
    onMounted(() => {
      getData();
    });
    onUnmounted(() => {
      clearTimer();
    });
    return () => (
      <div class="board-screen">
        {/* <div class="board-header">
          <span>配电室看板</span>
        </div> */}
        <div class="tupu-panel">
          <tupu
            tupuData={tupuData.value}
            onRowClick={rowClick}
            tupuState={tupuState.value}
            setCamera={setCamera.value}
          />
        </div>
        <div class="room-panel">
          <room
            roomData={roomData}
            powerData={powerData.value}
            onRoomChange={roomChange}
            onRowChange={rowChange}
          />
        </div>
      </div>
    );
  },
});

export default utils.installComponent(boardScreen, "board-screen");
