import { defineComponent } from "vue";
import logoBig from "../assets/img/logoBig.png";
import loginPicBig from "../assets/img/loginPicBig.png";
import platformLogo from "../assets/img/platformLogo.png";
import ms from "../assets/img/ms.png";
import bg from "../assets/img/loginBackground.png";

export default defineComponent({
  setup() {
    return () => (
      <inl-login
        loginMainImg={loginPicBig}
        titleLogo={logoBig}
        systemLogo={platformLogo}
        ms={ms}
        status="platform" // platform system
        systemName="智能压滤系统"
        systemDescribe="66666"
        projectName="系统登录"
        bg={bg}
        copyright="天津美腾科技股份有限公司 Tianjin Meiteng Technology Co.,Itd"
      />
    );
  },
});
