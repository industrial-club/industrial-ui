import { defineComponent, onMounted, reactive, onUnmounted } from "vue";
import weatherData from "@/api/weatherData";
import { weatherItem } from "@/utils/interface/meteorological";
import qixiangPng from "@/assets/img/qixiang.png";

const props = {
  code: String,
};
export default defineComponent({
  name: "meteorological",
  cname: "气象站环境数据",
  developer: "前端开发组",
  props,
  setup(_props, _context) {
    const data = reactive<{
      weatherData: Array<weatherItem>;
    }>({
      weatherData: [],
    });
    const http = async () => {
      const res = await weatherData(_props.code || "");
      data.weatherData = res.data.cardParams.weatherDatas;
    };
    const timer = setInterval(() => {
      http();
    }, 3000);
    onUnmounted(() => {
      clearInterval(timer);
    });
    onMounted(() => {
      http();
    });

    return () => (
      <div class="qx">
        <table>
          <tr>
            <th></th>
            <th>
              <img src={qixiangPng} alt="" />
              <span>1#气象站</span>
            </th>
            <th>
              <img src={qixiangPng} alt="" />
              <span>2#气象站</span>
            </th>
            <th>
              <img src={qixiangPng} alt="" />
              <span>3#气象站</span>
            </th>
          </tr>
          {data.weatherData.map((item: weatherItem) => (
            <tr>
              <td>{item.name}</td>
              <td>{item.STATIONS1}</td>
              <td>{item.STATIONS2}</td>
              <td>{item.STATIONS3}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  },
});
