import { defineComponent, useSlots, ref, onMounted } from "vue";
import highlightJs from "highlight.js";

const props = {
  describe: String,
  title: String,
  html: String,
  js: String,
  ts: String,
};
export default defineComponent({
  props,
  setup(_prop, _context) {
    const { comb } = useSlots();
    const highlight = highlightJs.highlight;
    const com = ref(null);
    const opt = ref([
      {
        name: "vue",
        id: "vue",
      },
      {
        name: "tsx",
        id: "tsx",
      },
    ]);
    const optActive = ref("vue");
    const open = ref(false);

    onMounted(() => {
      highlightJs.configure({
        classPrefix: "token ",
        languages: ["undefined", "vue", "tsx", "ts"],
        ignoreUnescapedHTML: true,
      });
      setTimeout(() => {
        highlightJs.initHighlighting();
      }, 100);
    });
    return () => (
      <div class={"code-box"}>
        <div class={"code-box-demo"}>
          <comb ref={com}></comb>
        </div>
        <div class={"code-box-meta"}>
          <h4 id="内嵌菜单">{_prop.title} </h4>
          <p>{_prop.describe}</p>
          <div class={"code-box-actions"}>
            <div class={"code-expand-icon"}>
              {opt.value.map((item) => (
                <span
                  onClick={() => {
                    optActive.value = item.id;
                  }}
                  class={[optActive.value === item.id ? "active" : ""]}
                >
                  {item.name}
                </span>
              ))}
              <span
                onClick={() => {
                  open.value = !open.value;
                }}
              >{`< >`}</span>
            </div>
          </div>
        </div>

        <div class={"highlight-wrapper"} v-show={open.value}>
          <div
            class={"custom-code-box vue-code-box"}
            v-show={optActive.value === "vue"}
          >
            <div class="vue-code-box-html language-html">
              <pre>
                <code
                  v-html={
                    highlightJs.highlightAuto(_prop.html + _prop.js).value
                  }
                ></code>
              </pre>
            </div>
          </div>
          <div
            class="custom-code-box vue-tsx-box language-tsx"
            v-show={optActive.value === "tsx"}
          >
            <pre>
              <code v-html={highlightJs.highlightAuto(_prop.ts).value}></code>
            </pre>
          </div>
        </div>
      </div>
    );
  },
});
