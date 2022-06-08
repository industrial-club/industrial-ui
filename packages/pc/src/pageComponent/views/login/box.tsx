import { defineComponent, reactive, ref, PropType, inject } from "vue";
import { Form, message } from "ant-design-vue";
import { getInstance } from "@/api/axios";

type LoginType = 1 | 2;

// submit 参数
export interface EventBySubmitParams {
  password: string;
  username: string;
  loginType: LoginType;
  msg?: string;
}
// loginTab 数据格式
export type LoginTab<T = LoginType> = Array<{ name: string; id: T }>;

const aForm = Form;
const formItem = Form.Item;
// props
const props = {
  serverName: {
    default: "comlite/v1/",
    type: String,
  },
  prefix: {
    default: "/api/",
    type: String,
  },
  loginTab: {
    type: Array as PropType<LoginTab>,
    default(): LoginTab {
      return [
        {
          name: "扫码登录",
          id: 1,
        },
        {
          name: "账号登录",
          id: 2,
        },
      ];
    },
  },
  logoStatus: {
    default: "platform",
    type: String as PropType<"system" | "platform">,
  },
  password: {
    default: "",
  },
  username: {
    default: "",
  },
  autoMsg: Boolean,
};

export default defineComponent({
  components: { aForm, formItem },
  props,
  emits: ["submit"],
  setup(prop, context) {
    const loginType = ref<LoginType>(2);
    const formVal = reactive({
      password: prop.password,
      username: prop.username,
    });
    const serverName = inject<string>("serverName");
    const prefix = inject<string>("prefix");
    const instance = getInstance({
      serverName,
      prefix,
    });
    const systemTitle = inject<string>("systemTitle");
    const platformLogo = inject<string>("platformLogo");
    const ms = inject<string>("ms");
    const status = inject<string>("status");

    const sendMsg = (msg: string, type: "error" | "success") => {
      if (!props.autoMsg) return;

      if (type === "error") {
        message.error(msg);
      }
      if (type === "success") {
        message.success(msg);
      }
    };

    const visible = ref<boolean>(false); // 显示隐藏
    const imgSrc = ref<string>("");
    const slideImage = ref<string>("");
    let imageToken = "";
    const slideImagePosition = ref<{ left: string; top: string }>({
      left: "0",
      top: "0",
    });
    const hkVal = ref<number>(0); // 滑块值
    const getImg = async () => {
      let res;
      try {
        res = await instance.get("auth/code/get");
      } catch (error) {
        message.error("服务端错误，请联系管理员处理.");
        loginspinning.value = false;
        spinning.value = false;
        return;
      }

      if (res.data.backImage) {
        imgSrc.value = `data:image/png;base64, ${res.data.backImage}`;
        slideImage.value = `data:image/png;base64, ${res.data.slideImage}`;
        slideImagePosition.value = {
          left: "0px",
          top: `${res.data.y}px`,
        };
        imageToken = res.data.imageToken;
        visible.value = true;
        loginspinning.value = false;
        spinning.value = false;
      }
    };
    const checkImg = async () => {
      spinning.value = true;
      spinningText.value = "正在验证...";
      let res;
      try {
        res = await instance.post("auth/code/check", {
          imageToken,
          sliderTrack: [
            {
              x: slideImagePosition.value.left.replace("px", ""),
              y: slideImagePosition.value.top.replace("px", ""),
            },
          ],
        });
      } catch (error) {
        slideImagePosition.value.left = "0px";
        hkVal.value = 0;
        spinning.value = true;
        spinningText.value = "正在更新图片验证...";
        message.error("服务端错误，请联系管理员处理.");
        return;
      }

      spinning.value = false;
      if (res && res.data === true) {
        toSunmit();
      } else {
        slideImagePosition.value.left = "0px";
        hkVal.value = 0;
        spinning.value = true;
        spinningText.value = "正在更新图片验证...";
        getImg();
        message.error("图片验证失败");
      }
    };

    const spinning = ref<boolean>(false);
    const spinningText = ref<string>("正在验证...");
    const imgModel = () => {
      return (
        <a-modal
          class="login_slider"
          closable={false}
          footer={null}
          width="460px"
          v-models={[[visible.value, "visible"]]}
        >
          <a-spin tip={spinningText.value} spinning={spinning.value}>
            <div
              class={"modal-box"}
              style={{ width: "432px", padding: "1.5rem" }}
            >
              <h2>请完成安全验证</h2>
              <div class="imgBox" style={{ width: "432px", height: "268px" }}>
                <redo-outlined
                  onClick={() => {
                    spinning.value = true;
                    spinningText.value = "正在刷新...";
                    getImg();
                  }}
                />
                {imgSrc.value ? (
                  <img
                    class={"bgImg"}
                    src={imgSrc.value}
                    style={{ width: "432px", height: "268px" }}
                  />
                ) : (
                  ""
                )}
                {slideImage.value ? (
                  <img
                    class={"slideImage"}
                    src={slideImage.value}
                    style={slideImagePosition.value}
                  />
                ) : (
                  ""
                )}
              </div>
              <a-slider
                v-models={[[hkVal.value, "value"]]}
                tooltip-visible={false}
                style={{ width: "432px" }}
                onAfterChange={() => {
                  checkImg();
                }}
                onChange={(e: number) => {
                  slideImagePosition.value.left = e + "px";
                }}
                max={432}
              />
            </div>
          </a-spin>
        </a-modal>
      );
    };

    // 验证成功后推送
    const toSunmit = () => {
      const loginInfo: EventBySubmitParams = {
        username: formVal.username,
        password: formVal.password,
        loginType: loginType.value,
      };
      hkVal.value = 0;
      visible.value = false;
      if (loginInfo.msg) {
        sendMsg(loginInfo.msg, "error");
      }
      context.emit("submit", loginInfo);
    };

    // clicl submitBtn
    const loginspinning = ref<boolean>(false);
    const subminBtnClick = () => {
      loginspinning.value = true;
      getImg();
    };
    const renderForm = () => {
      return (
        <aForm
          v-show={loginType.value === 2}
          layout="vertical"
          onSubmit={subminBtnClick}
          wrapper-col={{
            span: 24,
          }}
        >
          <formItem label="账号：" wrapper-col={{ span: 50 }}>
            <a-input v-model={[formVal.username, "value"]} />
          </formItem>
          <formItem label="密码：">
            <a-input-password v-model={[formVal.password, "value"]} />
          </formItem>

          <formItem>
            <a-button type="primary" block html-type="submit">
              登录
            </a-button>
          </formItem>
        </aForm>
      );
    };

    const renderTitleBox = () => {
      return (
        <div class="titleBox flex-center">
          <img src={platformLogo} alt="" />
          <div class="title">{systemTitle}</div>
        </div>
      );
    };

    return () => (
      <a-spin tip="登录中。。。" spinning={loginspinning.value}>
        <div class="login_box">
          {renderTitleBox()}
          {renderForm()}
          {imgModel()}
          <div style={{ textAlign: "center", margin: "2rem 0" }}>
            {status === "system" ? (
              <img src={ms} style={{ width: "232px" }} />
            ) : (
              ""
            )}
          </div>
        </div>
      </a-spin>
    );
  },
});
