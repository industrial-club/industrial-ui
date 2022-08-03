import { defineComponent } from "vue";

const props = {
  title: String,
  extra: String,
};

export default defineComponent({
  props,
  setup(this, _props, _ctx) {
    return () => (
      <div class="card2-outer">
        <div class="border-block-group">
          <span class="border-block left-top-block"></span>
          <span class="border-block left-bottom-block"></span>
          <span class="border-block right-bottom-block"></span>
        </div>
        <div class="card2-outer-header">
          <div class="inner-header">
            <div class="title">{_props.title}</div>
          </div>
        </div>
        <div class="card2-outer-content">
          <slot />
        </div>
      </div>
    );
  },
});
