import { defineComponent } from "vue";

import logoBig from "../assets/img/logoBig.png";
import loginPicBig from "../assets/img/loginPicBig.png";
import platformLogo from "../assets/img/platformLogo.png";
import ms from "../assets/img/ms.png";

const BaseDemo = defineComponent({
  setup() {
    return () => (
      <div class="user" style={{ padding: "16px" }}>
        {/* ====== 关于系统 ====== */}
        {/* <inl-about
          summary="系统简介"
          hardware={{ version: "1.1.1", summary: "我是硬件版本" }}
          software={{ version: "1.1.2", summary: "我是软件版本" }}
          database={{ version: "1.1.3", summary: "我是数据库版本" }}
          manualUrl="http://www.baidu.com"
        ></inl-about> */}
        {/* ====== 关于系统 -新====== */}
        {/* <inl-about-new
          summary="美腾工业物联平台是基于工业物联网技术架构实现的工业智能管理一体化平台。可实现工业场景下智能采集、智能感知、智能预警、智能执行、智能分析、智能决策、专家系统的全覆盖智能化管理平台。该平台包含美腾工业数据管理平台与美腾工业AI智能算法平台子平台，可以实现工业大数据管理、大数据分析决策、深度学习、机器学习、模型训练等一系列AI智能管理能力。平台内置大量工业场景算法，可以支持常用工业场景AI智能识别处理。"
          softwareList={[
            "软件版本：TLS-SW-V 1.0.0.1",
            "数据库版本：TLS-DB-V 1.0.0.1",
          ]}
          companyInfo={[
            {
              label: "地址",
              value: "天津市南开区时代奥城商业广场国际写字楼C6南4层&7层",
            },
            { label: "手机", value: "185 2235 6042" },
            {
              label: "电话",
              value: "022-23477172",
            },
            {
              label: "邮箱",
              value: "market@tjmeiteng.com",
            },
            {
              label: "网址",
              value: "www.tjmeiteng.com",
            },
          ]}
        ></inl-about-new> */}
        {/* ====== 日志管理 ====== */}
        {/* <inl-log-manager></inl-log-manager> */}
        {/* ====== 参数管理 ====== */}
        {/* <inl-param-manager
          prefix="/user/"
          serverName="abc/bcd"
        ></inl-param-manager> */}
        {/* ====== 个人设置 ====== */}
        {/* <inl-personal-setting></inl-personal-setting> */}
        {/* ====== 权限管理 ====== */}
        {/* 用户管理 */}
        {/* <inl-user-manager></inl-user-manager> */}
        {/* 角色管理 */}
        {/* <inl-role-manager></inl-role-manager> */}
        {/* 菜单管理 */}
        {/* <inl-menu-manager></inl-menu-manager> */}
        {/* ====== 组织管理 ====== */}
        {/* 岗位管理 */}
        {/* <inl-post-manager></inl-post-manager> */}
        {/* 班组管理 */}
        {/* <inl-team-manager></inl-team-manager> */}
        {/* 部门管理 */}
        {/* <inl-dep-manager></inl-dep-manager> */}
        {/* <inl-login-page
          loginMainImg={loginPicBig}
          titleLogo={logoBig}
          systemLogo={platformLogo}
          ms={ms}
          status="platform" // platform system
          systemName="智能压滤系统"
          systemDescribe=""
          projectName="工业物联平台"
          copyright="天津美腾科技股份有限公司 Tianjin Meiteng Technology Co.,Itd"
        ></inl-login-page> */}
        {/* 停送电列表 */}
        <inl-pss-list />
      </div>
    );
  },
});

export default BaseDemo;
