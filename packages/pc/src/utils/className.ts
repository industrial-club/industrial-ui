import conf from "./config";

const { prefix } = conf;

export default (classNames: string | Array<string>) => {
  const ty = typeof classNames;

  if (ty === "object") {
    return (classNames as Array<string>).map((item) => {
      if (item === "") return "";
      return `${prefix}-${item}`;
    });
  }

  return `${prefix}-${classNames}`;
};
