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
      </div>
    );
  },
});

export default BaseDemo;
