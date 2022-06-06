import { defineComponent, inject } from 'vue';

export default defineComponent({
  setup(props, ctx) {
    const img = inject<string>('productLogo');
    const title = inject<string>('leftTitle');
    const text = inject<string>('leftText');
    return () => (
      <div class={'left'}>
        <img class='left' src={img} alt='' />
        <div>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      </div>
    );
  },
  props: {
    text: String,
    img: String,
    title: String,
  },
});
