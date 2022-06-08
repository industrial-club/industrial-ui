# 登录组件

> 为方便开发调试，特推出登录盒子模块

## 组件名称 [inl-login] 可根据引入进行自定义修改

> 该组件依赖于 antv [form、input、message]

``` tsx
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
        projectName="工业物联平台"
        bg={bg}
        copyright="天津美腾科技股份有限公司 Tianjin Meiteng Technology Co.,Itd"
      />
    );
  },
});

```

## 参数

| 参数名称       | 类型       | 默认值   | 作用                          |
| -------------- | ---------- | -------- | ----------------------------- |
| loginMainImg   | String     |          | 登录页主图                    |
| titleLogo      | String     |          | 标题logo图                    |
| systemLogo     | String     |          | 系统logo图                    |
| ms             | String     |          | 登录框下方的img               |
| status         | "platform" | "system" | platform                      | 平台/系统 |
| systemName     | String     |          | 系统名称 `status:system` 生效 |
| systemDescribe | String     |          | 系统描述 `status:system` 生效 |
| projectName    | String     |          | 项目名称                      |
| bg             | String     |          | 登录页 大背景图               |
| copyright      | String     |          | 企业认证信息                  |

## 方法

| 方法名称 | 类型     | 返回参数                         | 作用                 |
| -------- | -------- | -------------------------------- | -------------------- |
| onSubmit | Function | (e: EventBySubmitParams) => void | 用于提交表单  `弃用` |
