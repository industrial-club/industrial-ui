import { defineComponent, ref, reactive, PropType } from "vue";
import { Card } from "ant-design-vue";
import utils from "@/utils";

const AboutNew = defineComponent({
  props: {
    // 产品简介
    summary: {
      type: String,
      default:
        "美腾工业物联平台是基于工业物联网技术架构实现的工业智能管理一体化平台。可实现工业场景下智能采集、智能感知、智能预警、智能执行、智能分析、智能决策、专家系统的全覆盖智能化管理平台。该平台包含美腾工业数据管理平台与美腾工业AI智能算法平台子平台，可以实现工业大数据管理、大数据分析决策、深度学习、机器学习、模型训练等一系列AI智能管理能力。平台内置大量工业场景算法，可以支持常用工业场景AI智能识别处理。",
    },
    // 版本详情
    softwareList: {
      type: Array,
      default: () => [
        "软件版本：TLS-SW-V 1.0.0.1",
        "数据库版本：TLS-DB-V 1.0.0.1",
      ],
    },
    // 公司信息
    companyInfo: {
      type: Array,
      default: () => [
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
      ],
    },
  },
  setup(prop, context) {
    return () => (
      <div class="aboutNew" id="aboutNew">
        <div class="flex-center logoLine">
          <img class="logo" src="/micro-assets/inl/logo/logo_big.png" />
        </div>

        <div class="titleLine">
          <div class="title">产品简介</div>
        </div>
        <Card class="card">
          <span class="summary">{prop.summary}</span>
        </Card>

        <div class="titleLine">
          <div class="title">版本详情</div>
        </div>

        <Card class="card">
          {prop.softwareList.map((software: any) => (
            <div class="software">{software}</div>
          ))}
        </Card>

        <div class="bottom_line flex-center">
          <img class="QRcode" src="/micro-assets/inl/logo/QRcode.png" />

          <div class="companyInfo">
            {prop.companyInfo.map((info: any) => (
              <div class="infoLine flex-center">
                <div class="label">{info.label}：</div>
                <div class="value">{info.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});

export default utils.installComponent(AboutNew, "about-new");
