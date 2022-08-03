import { defineComponent } from "vue";

const props = {
  title: String,
  extra: String,
};

export default defineComponent({
  props,
  setup(this, _props, _ctx) {
    return () => (
      <div class="card1-outer">
        <div class="card1-outer-header">
          {!_ctx.slots.header ? (
            <div class="inner-header">
              <div class="title">{_props.title}</div>
              <div class="extra">{_props.extra}</div>
            </div>
          ) : (
            _ctx.slots.header()
          )}
        </div>
        <div class="card1-outer-content">
          <slot />
        </div>
      </div>
    );
  },
});
