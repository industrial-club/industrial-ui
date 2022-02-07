export default {
  duration: 300,
  onBeforeEnter: (el: any) => {
    if (!el.dataset) el.dataset = {};

    el.style.height = 0;
  },
  onEnter: (el: any) => {
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + "px";
    } else {
      el.style.height = "";
    }

    el.style.overflow = "hidden";
  },
  onAfterEnter: (el: any) => {
    el.style.transition = "";
    el.style.height = "";
  },
  onBeforeLeave: (el: any) => {
    if (!el.dataset) el.dataset = {};

    el.style.height = el.scrollHeight + "px";
    el.style.overflow = "hidden";
  },
  onLeave: (el: any) => {
    if (el.scrollHeight !== 0) {
      el.style.height = 0;
    }
  },
  onAfterLeave: (el: any) => {
    el.style.transition = "";
    el.style.height = "";
  },
};
