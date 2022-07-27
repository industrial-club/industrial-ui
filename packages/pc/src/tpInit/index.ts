import { tp } from "vitevuu";
import { useRouter } from "vue-router";

export default async (dom: unknown, time: number) => {
  let timer: NodeJS.Timer;
  const router = useRouter();
  router.beforeEach(() => {
    clearInterval(timer);
  });
  function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  }

  const { reload, data, dm, gv } = await tp({
    callBack(a, b, c, d) {
      clearInterval(timer);
      if (time > 1000) {
        timer = setInterval(() => {
          renderSt();
        }, time);
      } else {
        renderSt();
      }
    },
    json: "displays/factory/xinjulong/filter.json",
    dom,
  });

  const renderSt = () => {
    dm?.getDataByTag("st_8033").setAttr("st.v", randomNum(53, 58).toString());
    dm?.getDataByTag("st_8034").setAttr("st.v", randomNum(65, 69).toString());
    dm?.getDataByTag("st_8035").setAttr("st.v", randomNum(40, 45).toString());
    dm?.getDataByTag("st_8036").setAttr("st.v", randomNum(69, 73).toString());
    dm?.getDataByTag("st_8036").setAttr("st.v", randomNum(69, 73).toString());
    dm?.getDataByTag("nsj_6004").setAttr("max", "28");
    dm?.getDataByTag("nsj_6004").setAttr("max", "28");
    dm?.getDataByTag("nsj_6004").setAttr("max2", "26");
    dm?.getDataByTag("nsj_6004").setAttr("max2", "28");
    dm?.getDataByTag("nsj_6003").setAttr("max", "27");
    dm?.getDataByTag("nsj_6003").setAttr("max", "30");
    dm?.getDataByTag("nsj_6003").setAttr("max2", "25");
    dm?.getDataByTag("nsj_6003").setAttr("min", "27");
    dm?.getDataByTag("ylj_8054").setAttr("min", "2.5");
    dm?.getDataByTag("ylj_8054").setAttr("max", "2.8");
    const v1 =
      dm?.getDataByTag("ylj_8054").getAttr("time") ||
      dm?.getDataByTag("ylj_8054").getAttr("t1");
    dm?.getDataByTag("ylj_8054").setAttr("time", (Number(v1) + 1).toString());

    const v2 =
      dm?.getDataByTag("ylj_8055").getAttr("time") ||
      dm?.getDataByTag("ylj_8055").getAttr("t1");
    dm?.getDataByTag("ylj_8055").setAttr("time", (Number(v2) + 1).toString());

    const v3 =
      dm?.getDataByTag("ylj_8056").getAttr("time") ||
      dm?.getDataByTag("ylj_8056").getAttr("t1");
    dm?.getDataByTag("ylj_8056").setAttr("time", (Number(v3) + 1).toString());

    dm?.getDataByTag("ylj_8054").setAttr(
      "fl",
      `${(Math.random() * (2.8 - 2.5 + 1) + 2.5).toFixed(1)}m³/h`
    );
    dm?.getDataByTag("ylj_8055").setAttr(
      "fl",
      `${(Math.random() * 1.5).toFixed(1)}m³/h`
    );
    dm?.getDataByTag("ylj_8056").setAttr(
      "fl",
      `${(Math.random() * 1.3 + 2.5).toFixed(1)}m³/h`
    );
    dm?.getDataByTag("AAAAAAA").setAttr(
      "fl",
      `${(Math.random() * 1.5).toFixed(1)}m³/h`
    );
    dm?.getDataByTag("ylj_8059").setAttr(
      "fl",
      `${(Math.random() * 1.5).toFixed(1)}m³/h`
    );
    dm?.getDataByTag("ylj_8060").setAttr(
      "fl",
      `${(Math.random() * 1.5).toFixed(1)}m³/h`
    );
  };
  return {
    reloadUrl(url: string, callBack: ht.deserializeCallBack) {
      // 更新图纸
      clearInterval(timer);
      renderSt();
      setTimeout(() => {
        reload(url, callBack);
      }, 100);
    },
    data,
    dm,
    gv,
  };
};
