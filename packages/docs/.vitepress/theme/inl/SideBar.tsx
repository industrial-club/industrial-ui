import { defineComponent } from "vue";
import { useData, useRouter } from "vitepress";
import { inlMenuItem } from "inl-pc-ui/dist/types/src/components/menu/index";

export default defineComponent({
  setup() {
    const { theme } = useData();
    const { sidebar } = theme.value;
    const router = useRouter();
    const menus: Array<inlMenuItem> = [];

    const setItem = (inlMI: any): inlMenuItem => ({
      name: inlMI.text,
      url: inlMI.link,
      child: [],
    });
    const activeKey = router.route.path.split(".html")[0];
    const setSub = (inlMI: any): inlMenuItem => {
      const subList: inlMenuItem = {
        name: inlMI.text,
        url: inlMI.link,
        child: [],
      };

      for (let i of inlMI.children) {
        if (i.children && i.children.length > 0) {
          subList.child.push(setSub(i));
        } else {
          subList.child.push(setItem(i));
        }
      }
      return subList;
    };
    const subkey = router.route.path.split("/")[1];
    const sidebarByKey = sidebar[`/${subkey}/`] || {};
    console.log(sidebar);
    const setMenu = () => {
      for (let n of sidebar.children) {
        if (n.children && n.children.length > 0) {
          menus.push(setSub(n));
        } else {
          menus.push(setItem(n));
        }
      }
    };

    setMenu();
    return () => (
      <inl-menu
        menus={menus}
        onChange={(item: inlMenuItem) => {
          router.go(item.url);
        }}
        allOpen
        activeKey={activeKey}
        vSlots={
          {
            // inlMenuTitle: () => <div>title</div>,
          }
        }
      />
    );
  },
});
