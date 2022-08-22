import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  onUnmounted,
  ref,
  PropType,
} from "vue";
import energyConsume from "@/api/energy";
import { TabsItem } from "@/components/tabs";
import { Carousel } from "ant-design-vue";
import { Chart } from "@antv/g2";
import { energyItem, indicatorDatasItem } from "@/utils/interface/energy";
// import menu from "@/assets/img/menuimg/menu.svg";
import initChartDrugConsumption from "./components/init.drugChart";
import initChartCoalConsumption from "./components/init.coalChart";
import initChartWaterConsumption from "./components/init.waterChart";
import initChartelectricityConsumption from "./components/init.electricityChart";
import workShopCockpitData from "@/api/workShopCockpit";

const aCarousel = Carousel;
const props = {
  tabId: String,
  hasTabs: Boolean,
  code: {
    type: String,
    default: "index",
  },
  type: String,
};
export default defineComponent({
  name: "energy",
  cname: "能源消耗",
  developer: "前端开发组",
  components: { aCarousel },
  props,
  setup(_props, _context) {
    const carouselRef = ref();
    let lineDrug: Chart;
    let lineCoal: Chart;
    let lineWater: Chart;
    let lineElectricity: Chart;
    const data = reactive<{
      energyData: Array<energyItem>;
      electricDate: Array<indicatorDatasItem>;
      mediumDate: Array<indicatorDatasItem>;
      medicamentDate: Array<indicatorDatasItem>;
      waterDate: Array<indicatorDatasItem>;
    }>({
      energyData: [],
      electricDate: [],
      mediumDate: [],
      medicamentDate: [],
      waterDate: [],
    });

    const http = async () => {
      let res: any = null;
      if (_props.code === "index") {
        res = await energyConsume(_props.code || "");
      } else {
        res = await workShopCockpitData(_props.code || "", _props.type || "");
      }
      res.data.cardParams.energyData.forEach((item) => {
        switch (item.energyCode) {
          case "electric": {
            const electricList: Array<indicatorDatasItem> = [];
            item.energyStatisticsIndicatorDatas.forEach((val) => {
              val.indicatorDatas.forEach((e) => {
                e.value = Number(e.value);
                electricList.push(e);
              });
            });
            data.electricDate = electricList;
            break;
          }
          case "medium": {
            const mediumList: Array<indicatorDatasItem> = [];
            item.energyStatisticsIndicatorDatas.forEach((val) => {
              val.indicatorDatas.forEach((e) => {
                e.value = Number(e.value);
                mediumList.push(e);
              });
            });
            data.mediumDate = mediumList;
            break;
          }
          case "medicament": {
            const medicamentList: Array<indicatorDatasItem> = [];
            item.energyStatisticsIndicatorDatas.forEach((val) => {
              val.indicatorDatas.forEach((e) => {
                e.value = Number(e.value);
                medicamentList.push(e);
              });
            });
            data.medicamentDate = medicamentList;
            break;
          }
          case "water": {
            const waterList: Array<indicatorDatasItem> = [];
            item.energyStatisticsIndicatorDatas.forEach((val) => {
              val.indicatorDatas.forEach((e) => {
                e.value = Number(e.value);
                waterList.push(e);
              });
            });
            data.waterDate = waterList;
            break;
          }
          default:
            break;
        }
      });
    };
    onMounted(() => {
      carouselRef.value.goTo(Number(_props.tabId));
      http().then(() => {
        lineDrug = initChartDrugConsumption(
          data.medicamentDate,
          ["#655EE1", "#09DCE3"],
          "energy_1"
        );
        lineCoal = initChartCoalConsumption(
          data.mediumDate,
          ["#B348F5", "#F9898D"],
          "energy_2"
        );
        lineWater = initChartWaterConsumption(
          data.waterDate,
          ["#75DB48", "#A8EE22"],
          "energy_3"
        );
        lineElectricity = initChartelectricityConsumption(
          data.electricDate,
          ["#47F090", "#47DEF0"],
          "energy_4"
        );
      });
    });
    const timer = setInterval(() => {
      http().then(() => {
        lineDrug.changeData(data.medicamentDate);
        lineCoal.changeData(data.mediumDate);
        lineWater.changeData(data.waterDate);
        lineElectricity.changeData(data.electricDate);
      });
    }, 3000);
    watch(
      () => _props.tabId,
      (e) => {
        carouselRef.value.goTo(Number(e));
      }
    );
    onUnmounted(() => {
      clearInterval(timer);
    });
    const prev = () => {
      carouselRef.value.prev();
    };
    const next = () => {
      carouselRef.value.next();
    };
    return () => (
      <div class="energy">
        <div class="title">
          <span>本月吨煤消耗</span>
        </div>
        <div class="carousel">
          {/* <span onClick={prev}>
            <img src={menu} alt="" />
          </span>
          <span onClick={next}>
            <img src={menu} alt="" />
          </span> */}
          <aCarousel
            dotsClass="carouselDots"
            ref={carouselRef}
            effect="fade"
            after-change={(slideNumber: number) => {
              _context.emit("afterChange", slideNumber);
            }}
          >
            <div class="chart">
              <div id="energy_1"></div>
            </div>
            <div class="chart">
              <div id="energy_2"></div>
            </div>
            <div class="chart">
              <div id="energy_3"></div>
            </div>
            <div class="chart">
              <div id="energy_4"></div>
            </div>
          </aCarousel>
        </div>
      </div>
    );
  },
});
