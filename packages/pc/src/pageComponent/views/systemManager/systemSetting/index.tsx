import {
  defineComponent,
  reactive,
  CSSProperties,
  ref,
  onMounted,
  watch,
} from "vue";
import { message, Select, Input } from "ant-design-vue";
import type { UploadChangeParam, UploadProps } from "ant-design-vue";
import utils from "@/utils";
import {
  saveSysConfig,
  cancelEditing,
  searchImage,
  uploadImage,
  getSysConfig,
  getCustomerList,
  getProjectList,
  getSystemList,
} from "@/api/systemSetting";
import { systemConfig, picList } from "./data";

const aInput = Input;
const aSelect = Select;
interface OptionItem {
  name: string;
  id: string;
}
const props: any = {
  customer: {
    type: Boolean,
    default: true,
  },
  project: {
    type: Boolean,
    default: true,
  },
  product: {
    type: Boolean,
    default: true,
  },
  loginSysDesc: {
    type: Boolean,
    default: true,
  },
  loginCopyright: {
    type: Boolean,
    default: true,
  },
  homepageCopyright: {
    type: Boolean,
    default: true,
  },
  loginPageSystemTitle: {
    type: Boolean,
    default: true,
  },
  loginMainPic: {
    type: Boolean,
    default: true,
  },
  loginSystemLogo: {
    type: Boolean,
    default: true,
  },
  mainPageLogo: {
    type: Boolean,
    default: true,
  },
  versions: {
    type: String,
    default: "platform", //platform system
  },
};

const SystemSetting = defineComponent({
  props,
  emits: ["setTheme"],
  setup(_props, _context) {
    const versions = ref("A");
    watch(
      () => _props.versions,
      (e) => {
        versions.value = e === "platform" ? "AB" : "A";
      },
      { immediate: true }
    );
    const renderClass = (item: any) => {
      const width =
        versions.value == "A"
          ? item.width
          : item.name === "loginMainPic"
          ? "370px"
          : item.width;
      const height =
        versions.value == "A"
          ? item.height
          : item.name === "loginMainPic"
          ? "250px"
          : item.height;
      const styleBox: CSSProperties = {
        width,
        marginBottom: "15px",
        height: height,
        marginRight: item.wrap ? "10px" : "",
        lineHeight: item.wrap ? "" : item.height,
        borderRadius: "4px",
        textAlign: "center",
        position: item.position,
        top: versions.value == "A" ? "80px" : "20px",
        left: versions.value == "A" ? "100px" : "30px",
      };
      return styleBox;
    };
    const data = reactive<any>({
      form: {
        customerName: "", // 客户名称
        customerId: "",
        projectName: "", // 项目名称
        projectId: "",
        productName: "", // 系统名称
        productid: "",
        loginSysDesc: "", // 登陆系统描述
        loginCopyright: "", // 登陆版权信息
        homepageCopyright: "", // 主页版权信息
      },
      loginPageSystemTitlefileList: [], // 登陆页系统标题
      loginPageSystemTitle: "",
      loginMainPicfileList: [], // 登录页主图
      loginMainPic: "",
      loginSystemLogofileList: [], // 登陆页系统logo
      loginSystemLogo: "",
      mainPageLogofileList: [],
      mainPageLogo: "",
      customerOption: [],
      projectOption: [],
      productOption: [],
    });
    const themes = ref("dark");
    const themescopy = ref("");
    const edit = ref(false);
    // 转base64
    const getBase64 = (img: any, callback: (base64Url: string) => void) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result as string));
      reader.readAsDataURL(img);
    };
    // 上传状态变化
    const handleLoginPageSystemTitle = (info: UploadChangeParam, item: any) => {
      if (info.file.status === "uploading") {
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, (base64Url: string) => {
          data[`${item.name}`] = base64Url;
        });
      }
      if (info.file.status === "error") {
        message.error("上传失败");
      }
      data[`${item.name}fileList`] = info.fileList;
    };
    // 自定义上传
    const customRequest = (options: any, item: any) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append("file", file as any);
      uploadImage(item.imgType, formData).then((res: any) => {
        if (res.code === "M0000") {
          onSuccess("response", file);
        } else {
          onError("error", file);
        }
      });
    };
    // 上传图片尺寸限制
    const checkImageWH = (file: any, initwidth: number, initheight: number) => {
      const width = Number(initwidth);
      const height = Number(initheight);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img: HTMLImageElement = document.createElement("img");
          img.src = reader.result as string;
          img.onload = () => {
            if (img.naturalWidth > width || img.naturalHeight > height) {
              message.error(
                initwidth
                  ? `上传尺寸最大${initwidth}px * ${initheight}px!`
                  : `上传尺寸最大高度 ${initheight}px!`
              );
              reject();
            } else {
              resolve("上传失败");
            }
          };
        };
      });
    };
    // 上传前的回调 UploadProps["fileList"][number]
    const beforeUpload = (file: any, item: any) => {
      const isJpgOrPng =
        file.type === "image/bmp" ||
        file.type === "image/psd" ||
        file.type === "image/jpeg" ||
        file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("请上传正确格式的图片!");
        return false;
      }
      return isJpgOrPng && checkImageWH(file, item.initwidth, item.initheight);
    };
    window.select = (item: { [key: string]: string }) => {
      return (
        <>
          {_props[`${item.name}`] ? (
            <div class="systemConfig_form">
              <span class="label">{item.label}</span>
              <a-select
                v-model={[data.form[`${item.name}Id`], "value"]}
                disabled={!edit.value}
              >
                {data[`${item.name}Option`].map((val: OptionItem) => (
                  <a-select-option value={val.id}>{val.name}</a-select-option>
                ))}
              </a-select>
            </div>
          ) : (
            ""
          )}
        </>
      );
    };
    window.input = (item: { [key: string]: string }) => {
      return (
        <>
          {_props[`${item.name}`] ? (
            <div class="systemConfig_vertical">
              <div class="label">{item.label}</div>
              <div class="item">
                <aInput
                  placeholder=""
                  v-model={[data.form[`${item.name}`], "value"]}
                  class="input"
                  disabled={!edit.value}
                ></aInput>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      );
    };
    window.img = (item: { [key: string]: string }) => {
      return (
        <div class="systemConfig_vertical">
          <div class="label">{item.label}</div>
          <div class="item">
            <a-upload
              disabled={!edit.value}
              class="avatar-uploader"
              v-model={[data[`${item.name}fileList`], "file-list"]}
              customRequest={(e: any) => customRequest(e, item)}
              show-upload-list={false}
              onChange={(e: UploadChangeParam) => {
                handleLoginPageSystemTitle(e, item);
              }}
              before-upload={(e: any) => beforeUpload(e, item)}
            >
              <a-image
                width={`${item.width}px`}
                height={`${item.height}px`}
                src={data[`${item.name}`]}
                preview={false}
              />
              <a-button type="primary" class="btn" disabled={!edit.value}>
                {item.btn}
              </a-button>
            </a-upload>
            <span class="annotation">{item.annotation}</span>
          </div>
        </div>
      );
    };

    const renderItem = (item: any) => {
      return <>{((window as any)[item?.type] || function empty() {})(item)}</>;
    };

    // 顾客信息
    const getCustomer = async () => {
      const res = await getCustomerList();
      data.customerOption = res.data ? res.data : [];
    };
    const getProject = async () => {
      const res = await getProjectList();
      data.projectOption = res.data ? res.data : [];
    };
    const getSystem = async () => {
      const res = await getSystemList();
      data.systemOption = res.data ? res.data : [];
    };

    const http = async () => {
      // 获取系统配置信息
      const res = await getSysConfig();
      Object.keys(data.form).forEach((item) => {
        data.form[item] = res.data[item];
      });
      res.data.style === 1
        ? (themes.value = "dark")
        : (themes.value = "default");
      _context.emit("setTheme", themes.value);
      // 获取图片
      const arr: any = {
        loginPageSystemTitle: "",
        loginMainPic: "",
        loginSystemLogo: "",
        mainPageLogo: "",
      };
      Object.keys(arr).forEach(async (item, index) => {
        const res = (arr[`${item}`] = await searchImage(index + 1, 1));
        data[`${item}`] = window.URL.createObjectURL(arr[`${item}`]);
      });
      sessionStorage.setItem("homepageCopyright", data.form.homepageCopyright);
      getCustomer();
      getProject();
      getSystem();
    };
    const handleSave = async () => {
      themes.value = themescopy.value;
      const list = {
        ...data.form,
        style: themes.value === "dark" ? 1 : 2, // 风格：1-深色系，2-浅色系
      };
      const res = await saveSysConfig(list);
      if ((res as any).code === "M0000") {
        message.success("保存成功");
        edit.value = !edit.value;
      } else {
        message.error("保存失败");
      }
    };
    const handleCancle = () => {
      edit.value = !edit.value;
      cancelEditing();
      http();
    };
    onMounted(() => {
      http();
    });

    return () => (
      <div class="systemConfig">
        <div class="systemConfig_left">
          <div class="systemConfig_info">
            <div class="systemConfig_title">项目信息</div>
            <div class="systemConfig_body">
              {systemConfig.projectInfo.map((item) => {
                return renderItem(item);
              })}
            </div>
          </div>
          <div class="systemConfig_info">
            <div class="systemConfig_title">界面信息</div>
            <div class="systemConfig_body">
              {systemConfig.InterfaceInfo.map((item) => {
                return (
                  <>
                    {renderItem(item)}
                    {item.label === "主页版权信息" ? (
                      <div>
                        <span style="margin-right:10px">风格</span>
                        <inl-change-theme-select
                          disabled={!edit.value}
                          onChange={(e: any) => {
                            themescopy.value = e;
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
              <div class="systemConfig_btm">
                {edit.value ? (
                  <>
                    <a-button type="primary" class="save" onClick={handleSave}>
                      保存
                    </a-button>
                    <a-button onClick={handleCancle}>取消</a-button>
                  </>
                ) : (
                  <a-button
                    type="primary"
                    class="save"
                    onClick={() => {
                      edit.value = !edit.value;
                    }}
                  >
                    编辑
                  </a-button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div class="systemConfig_right">
          <div class="box" style="zoom:0.85">
            <div class="left">
              {picList.left.map((item) => (
                <>
                  {item.versions.includes(versions.value) ? (
                    <>
                      {item.type === "img" ? (
                        <>
                          {data[`${item.name}`] ? (
                            <img
                              style={renderClass(item)}
                              src={data[`${item.name}`]}
                              alt=""
                            />
                          ) : (
                            <div
                              style={renderClass(item)}
                              class={`${item.color}`}
                            >
                              {item.label}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {data.form[`${item.name}`] ? (
                            <div
                              style={renderClass(item)}
                              class={`${item.color}`}
                            >
                              {data.form[`${item.name}`]}
                            </div>
                          ) : (
                            <div
                              style={renderClass(item)}
                              class={`${item.color}`}
                            >
                              {item.label}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </>
              ))}
            </div>
            <div class="right">
              <div class="loginBox">
                {versions.value === "A" ? (
                  <div class="top">
                    {picList.right.map((item) => (
                      <>
                        {item.type === "img" ? (
                          <>
                            {data[`${item.name}`] ? (
                              <img
                                style={renderClass(item)}
                                src={data[`${item.name}`]}
                                alt=""
                              />
                            ) : (
                              <div
                                style={renderClass(item)}
                                class={`${item.color}`}
                              >
                                {item.label}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {data.form[`${item.name}`] ? (
                              <div
                                style={renderClass(item)}
                                class={`${item.color}`}
                              >
                                {data.form[`${item.name}`]}
                              </div>
                            ) : (
                              <div
                                style={renderClass(item)}
                                class={`${item.color}`}
                              >
                                {item.label}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <span class="name">登陆框</span>
              </div>
            </div>
            <div class="bot">
              {data.form.loginCopyright
                ? data.form.loginCopyright
                : "登陆页版权信息"}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
export default utils.installComponent(SystemSetting, "system-setting");
