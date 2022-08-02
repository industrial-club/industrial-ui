import { Vue, Component } from "vue-property-decorator";
import renderCabinet from "./cabinetRender";

@Component
export default class Create extends Vue {
  mounted() {
    const list: cabinet.item = {
      name: "所有",
      id: "1",
      cards: 2,
      child: [
        {
          name: "第一排",
          id: "1-1",
          cards: 2,
          child: [
            {
              name: "第一排_第一列",
              id: "1-1-1",
              child: [
                {
                  name: "第一排_第一列_第一个盒子",
                  id: "1-1-1-1",
                  cards: 0
                },
                {
                  name: "第一排_第一列_第二个盒子",
                  id: "1-1-1-2",
                  cards: 0
                },
                {
                  name: "第一排_第一列_第3个盒子",
                  id: "1-1-1-3",
                  cards: 0
                },
                {
                  name: "第一排_第一列_第3个盒子",
                  id: "1-1-1-4",
                  cards: 0
                }
              ]
            },
            {
              name: "第一排_第2列",
              id: "1-1-2",
              child: [
                {
                  name: "第一排_第2列_第一个盒子",
                  id: "1-1-2-1",
                  cards: 2,
                  state: "charged"
                },
                {
                  name: "第一排_第2列_第二个盒子",
                  id: "1-1-2-2",
                  cards: 0,
                  state: "unknown"
                },
                {
                  name: "第一排_第2列_第3个盒子",
                  id: "1-1-2-3",
                  cards: 0,
                  state: "blackout"
                }
              ]
            },
            {
              name: "第一排_第3列",
              id: "1-1-3",
              child: [
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                }
                // {
                //   name: "第一排_第3列_第二个盒子",
                //   id: "1-1-3-2",
                //   cards: 0
                // }
              ]
            },
            {
              name: "第一排_第3列",
              id: "1-1-3",
              child: [
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                },
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                },
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                },
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                },
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                },
                {
                  name: "第一排_第3列_第一个盒子",
                  id: "1-1-3-1",
                  cards: 0,
                  state: "blackout"
                }
                // {
                //   name: "第一排_第3列_第二个盒子",
                //   id: "1-1-3-2",
                //   cards: 0
                // }
              ]
            }
          ]
        },
        {
          name: "第二排",
          id: "1-2",
          child: [
            {
              name: "第一列",
              id: "1-2-1",
              child: [
                {
                  name: "第一个",
                  id: "1-2-1-1"
                },
                {
                  name: "第2个",
                  id: "1-2-1-2"
                }
              ]
            }
          ]
        },
        {
          name: "第二排",
          id: "1-2",
          child: [
            {
              name: "第一列",
              id: "1-2-1",
              child: [
                {
                  name: "第一个",
                  id: "1-2-1-1"
                },
                {
                  name: "第2个",
                  id: "1-2-1-2"
                }
              ]
            }
          ]
        }
      ]
    };

    const cabinet = new renderCabinet({
      data: list,
      domId: "pss_cabinet",
      renderState: "row"
    });
  }
  render() {
    return <div class="pss_cabinet" id="pss_cabinet"></div>;
  }
}
