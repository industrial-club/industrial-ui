import { defineComponent, onMounted, ref, reactive, PropType } from "vue";
// import mtLogoBig from "@/pageComponent/assets/img/mtLogoBig.png";
// import mtInfo from "@/pageComponent/assets/img/mtInfo.png";
import { Card, Button, Modal, Popconfirm } from "ant-design-vue";
import utils from "@/utils";

export interface IVersionDetail {
  // 版本号
  version: string | number;
  // 版本概述
  summary?: string;
}

const About = defineComponent({
  props: {
    // 产品简介
    summary: {
      type: String,
    },
    // 硬件版本
    hardware: {
      type: Object as PropType<IVersionDetail>,
    },
    // 软件版本
    software: {
      type: Object as PropType<IVersionDetail>,
    },
    // 数据库版本
    database: {
      type: Object as PropType<IVersionDetail>,
    },
    // 系统说明书下载链接 （不传不展示下载链接）
    manualUrl: {
      type: String,
    },
  },
  setup(prop, context) {
    const visible = ref(false);

    const state = reactive({
      showContent: false,
      loading: false,
    });

    const confirm = (e: MouseEvent) => {
      console.log(e);
      // message.success('Click on Yes');
    };

    const cancel = (e: MouseEvent) => {
      console.log(e);
      // message.error('Click on No');
    };

    const cancel2 = (e: MouseEvent) => {
      // console.log(e);
      state.loading = false;
    };

    return () => (
      <div class="about" id="about">
        <div class="flex-center logoLine">
          {/* <img class="logo" src={mtLogoBig} /> */}

          <Popconfirm
            title="发现新版本v3.0，是否立即更新?"
            ok-text="确定"
            cancel-text="取消"
            placement="bottomRight"
            onConfirm={confirm}
            onCancel={cancel}
          >
            <Button
              type="primary"
              onClick={() => {
                // visible.value = true;
              }}
            >
              检测更新
            </Button>
          </Popconfirm>

          {/* <Modal
            v-model={[visible.value, 'visible']}
            title='系统检测更新'
            width='400px'
            onCancel={cancel2}
            footer={null}
            getContainer={() => document.getElementById('about')!}
            class='update'
            mask={false}
          >
            <div>
              目前软件版本为 TFS-V1.0.0.1，最新软件版本为
              TFS-V1.0.0.2，是否更新？
            </div>

            <Button
              type='link'
              class='infoBtn'
              onClick={() => {
                state.showContent = !state.showContent;
              }}
            >
              更新内容详情{'>>'}
            </Button>

            {state.showContent && (
              <Card class='card'>
                <div>1、增加了总览页</div>
                <div>2、增加了联系方式 </div>
                <div>3、增加了版本管理</div>
                <div>4、pad新版设计</div>
              </Card>
            )}

            <div style='text-align: right'>
              <Button
                type='primary'
                onClick={() => {
                  state.loading = true;
                }}
                loading={state.loading}
              >
                更新
              </Button>
            </div>
          </Modal> */}
        </div>

        <div class="titleLine">
          <div class="title">产品简介</div>
        </div>
        <Card class="card">{prop.summary}</Card>

        <div class="titleLine">
          <div class="title">版本详情</div>
        </div>
        {prop.hardware && (
          <>
            <div class="litTitle">硬件版本：{prop.hardware.version}</div>
            <Card class="card">{prop.hardware.summary}</Card>
          </>
        )}
        {prop.software && (
          <>
            <div class="litTitle">软件版本：{prop.software.version}</div>
            <Card class="card">{prop.software.summary}</Card>
          </>
        )}

        {prop.database && (
          <>
            <div class="litTitle">数据库版本：{prop.database.version}</div>
            <Card class="card">{prop.database.summary}</Card>
          </>
        )}

        {prop.manualUrl && (
          <div class="manual">
            <div class="titleLine">
              <div class="title">系统功能说明书</div>
            </div>
            <a class="down" target="_BLANK" href={prop.manualUrl}>
              点击下载系统使用说明书&gt;&gt;
            </a>
          </div>
        )}

        {/* <img src={mtInfo} class="info" /> */}
      </div>
    );
  },
});

export default utils.installComponent(About, "about");
