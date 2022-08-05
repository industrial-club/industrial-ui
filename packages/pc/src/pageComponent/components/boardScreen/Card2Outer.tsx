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
        <div class="card2-outer-header">
          <div class="inner-header">
            <div class="title">{_props.title}</div>
          </div>
        </div>
        <div class="card2-outer-content">
          {_ctx.slots.content ? _ctx.slots.content() : null}
        </div>
      </div>
    );
  },
});
