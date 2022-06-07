import { defineComponent, inject } from 'vue';

export default defineComponent({
  setup(prop, ctx) {
    const corpLogo = inject<string>('corpLogo');
    return () => (
      <div class='topTitle'>
        <img src={corpLogo} alt='' />
      </div>
    );
  },
});
