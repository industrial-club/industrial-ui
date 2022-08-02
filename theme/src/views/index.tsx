import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  setup() {
    const cards = [
      {
        name: "aa",
        componentName: "alarm",
        row: "1/3",
        col: "1/2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_2",
      },
      {
        name: "aa1",
        componentName: "card_3",
        row: "1/2",
        col: "3/2",
      },
    ];
    return () => (
      <inl-card-layout
        cards={cards}
        row={5}
        col={5}
        layout="pc"
      ></inl-card-layout>
    );
  },
  components: {},
});
