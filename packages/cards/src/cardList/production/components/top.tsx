import { defineComponent, reactive, onUnmounted } from "vue";
import { production } from "@/api/production";
import {
  dataObj,
  listItem,
  datasItem,
  itemFace,
} from "@/utils/interface/production";

const props = {
  code: String,
};
export default defineComponent({
  name: "Production",
  props,
  setup(_props, _context) {
    const topData = reactive<{
      list: Array<dataObj>;
    }>({
      list: [],
    });
    const bottomData = reactive<{
      list: Array<itemFace>;
    }>({
      list: [],
    });
    let _topList: Array<dataObj> = [];
    let _bottomList: Array<itemFace> = [];
    /**
     * UndergroundCoal 矿下提煤
     * WashingVolume 入洗量
     * SelectedQuantity 入选量
     * BlockCleanCoal 精块煤
     * Gangue 矸石
     * EndCoal 末煤
     * Slime 煤泥
     * */
    const http = async () => {
      const res = await production(_props.code || "");

      const { cardParams } = res.data;
      for (const key in cardParams.data) {
        if (key === "Selected" || key === "Wash") {
          _topList.push(cardParams.data[key]);
          topData.list = _topList;
        } else if (
          key === "BlockCoal" ||
          key === "CleanCoal" ||
          key === "Gangue" ||
          key === "MixCoal"
        ) {
          _bottomList.push(cardParams.data[key]);
          bottomData.list = _bottomList;
        }
      }
    };
    http();
    const timer = setInterval(() => {
      _topList = [];
      _bottomList = [];
      http();
    }, 3000);
    onUnmounted(() => {
      clearInterval(timer);
    });
    const valueItem = (val: listItem) => {
      return (
        <li>
          <div class={"num"}>{val.value}</div>
          <div class={"name"}>
            {val.name}({val.unit})
          </div>
        </li>
      );
    };
    // 渲染上部分
    const itemMap = (data: dataObj) => {
      return (
        <div class="production_top">
          <div class="production_top_t">
            <div class="title">
              <div>
                {data.cardParamName === "入洗量" ? (
                  <img
                    class={"totalEnrollmentImg"}
                    src="/micro-assets/card-center/totalEnrollment.png"
                    alt=""
                  />
                ) : (
                  <img
                    class={"totalWashingVolumeImg"}
                    src="/micro-assets/card-center/totalWashingVolume.png"
                    alt=""
                  />
                )}
                <img
                  class={"spotImg"}
                  src="/micro-assets/card-center/spot.png"
                  alt=""
                />
                <span class={"name"}>{data.cardParamName}</span>
                <span class={"num"}>{data.totalVolume.value}</span>
                <span class={"unit"}>{data.totalVolume.unit}</span>
                <img
                  class={"spotImg"}
                  src="/micro-assets/card-center/spot.png"
                  alt=""
                />
              </div>
              <span class={"tcName"}>{data.totalVolume.title}</span>
            </div>
            <ul class={"content"}>
              {data.totalVolume.list.map((item) => valueItem(item))}
            </ul>
          </div>
        </div>
      );
    };
    // 底部渲染
    return () => (
      <div class="production_top">
        <div class={"production_top_box"}>
          {topData.list.map((item) => itemMap(item))}
        </div>
        <ul class="production_top_b">
          {bottomData.list.map((item) => (
            <li>
              <div class="name">
                <div>{item.cardParamName}</div>
                {item.cardParamName === "块煤" && <div>(30-80mm)</div>}
                {item.cardParamName === "精煤" && <div>(0-30mm)</div>}
                {item.cardParamName === "混煤" && <div>(0-13mm)</div>}
                {item.cardParamName === "矸石" && (
                  <div style="height:0.875rem"></div>
                )}
              </div>
              <div class="val">
                <div>
                  <span class="num">{item.hourlyTon?.value}</span>
                  <span class="unit">{item.hourlyTon?.unit}</span>
                </div>
                <div>
                  <span class="num">{item.dayKiloton?.value}</span>
                  <span class="unit">{item.dayKiloton?.unit}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});
