const setTheme = (theme: string) => {
  if (theme === "dark") {
    document
      .getElementsByTagName("html")[0]
      .setAttribute("data-doc-theme", "dark");
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "dark");
    document.getElementsByTagName("html")[0].style.colorScheme = "dark";
  } else {
    document
      .getElementsByTagName("html")[0]
      .setAttribute("data-doc-theme", "light");
    document
      .getElementsByTagName("body")[0]
      .setAttribute("data-theme", "light");
    document.getElementsByTagName("html")[0].style.colorScheme = "light";
  }
};

export default {
  set(theme: string) {
    window.localStorage.setItem("theme", theme);
    setTheme(theme);
  },
  settingTheme(theme?: string) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    theme = theme || window.localStorage.getItem("theme")! || systemTheme;
    setTheme(theme);
  },
};
