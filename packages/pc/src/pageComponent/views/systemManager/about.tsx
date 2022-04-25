import { defineComponent, onMounted, ref, reactive } from "vue";
// import mtLogoBig from "@/pageComponent/assets/img/mtLogoBig.png";
// import mtInfo from "@/pageComponent/assets/img/mtInfo.png";
import { Card, Button, Modal, Popconfirm } from "ant-design-vue";
import utils from "@/utll";

const About = defineComponent({
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
        <Card class="card">本版本内容及功能特点概要。</Card>

        <div class="titleLine">
          <div class="title">版本详情</div>
        </div>
        <div class="litTitle">硬件版本：TLS-HW-V 1.0.0.1</div>
        <Card class="card">本版本内容及功能特点概要。</Card>
        <div class="litTitle">软件版本：TLS-SW-V 1.0.0.1</div>
        <Card class="card">本版本内容及功能特点概要。</Card>
        <div class="litTitle">数据库版本：TLS-DB-V 1.0.0.1</div>
        <Card class="card">本版本内容及功能特点概要。</Card>

        <div class="titleLine">
          <div class="title">系统功能说明书</div>
        </div>
        <a class="down">点击下载系统使用说明书{">>"}</a>
        {/* <img src={mtInfo} class="info" /> */}
      </div>
    );
  },
});

export default utils.installComponent(About, "about");
