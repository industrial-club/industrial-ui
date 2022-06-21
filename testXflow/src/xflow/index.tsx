import React from "react";
/** 图核心组件 & 类型定义 */
import { XFlow } from "@antv/xflow";

/** 图的配置项 */
import { message } from "antd";
// import "./index.less";
import "@antv/xflow/dist/index.css";

export interface IProps {}

const Demo: React.FC<IProps> = (props) => {
  const onLoad = () => {};
  return (
    <XFlow
      className="xflow-user-container"
      //   graphData={graphData}
      graphLayout={{
        layoutType: "dagre",
        layoutOptions: {
          type: "dagre",
          rankdir: "TB",
          nodesep: 60,
          ranksep: 40,
        },
      }}
      onLoad={onLoad}
      isAutoCenter={true}
    ></XFlow>
  );
};

export default Demo;
