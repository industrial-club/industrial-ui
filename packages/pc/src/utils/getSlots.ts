import { Plugin, SetupContext, Slot } from "vue";

export default (_context: SetupContext) => {
  const slots = _context.slots;
  const useSlots: Record<string, () => Slot | Plugin> = {};

  for (let i in slots) {
    useSlots[i] = slots[i] as unknown as () => Slot | Plugin;
  }

  if (!useSlots.default) {
    useSlots.default = () => {
      return "" as unknown as Slot | Plugin;
    };
  }

  return useSlots;
};
