export default () => {
  return [
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["meta", { name: "keywords", content: "inl ui" }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ];
};
