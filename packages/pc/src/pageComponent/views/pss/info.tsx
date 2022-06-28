import { defineComponent, onMounted, nextTick, ref, shallowRef, reactive } from "vue";
import {
  Button,
  Row,
  Col,
  Table,
  Timeline,
  TimelineItem,
  Modal,
  Input,
} from "ant-design-vue";
const { TextArea } = Input;
// import addBtn from './assets/image/addBtn.png';
// import requiredBtn from "./assets/image/required.png";

import { randomKey } from "./utils";

import {
  CheckOutlined,
 
} from "@ant-design/icons-vue";
import './assets/less/index.less';
export default defineComponent({
  components: {
    
  },
  setup() {
    onMounted(() => {});
    const modal: any = reactive({
      visible: false,
      title: '审批意见'
    });

    const transModal: any = reactive({
      visible: false,
    })

    const commonTable: any = reactive({
      columns: [
        {
          dataIndex: "column1",
          title: "工单",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "申请人",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "挂锁",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "当前操作人",
          width: "15%",
          align: "center",
        },
        {
          dataIndex: "column1",
          title: "当前状态",
          width: "15%",
          align: "center",
        },
      ],
    });
    return () => (
      <div class="pssInfo">
        <div class="info_container">
          <div class="title">任务/任务详情</div>
          <div class="content">
            <div class="content_title">
              申请低压停送电
              <span>大强</span>
              <span>创建于2022-01-10 10:15</span>
            </div>
            <div class="content_info">
              <Row gutter={24}>
                <Col span={8}>
                  <div class="label">当前状态</div>
                </Col>
                <Col span={8}>
                  <div class="label">设备名称</div>
                </Col>
                <Col span={8}>
                  <div class="label">计划停电时间</div>
                </Col>
                <Col span={8}>
                  <div class="label">计划停电时间</div>
                </Col>
                <Col span={8}>
                  <div class="label">计划停电时间</div>
                </Col>
                <Col span={8}>
                  <div class="label">计划停电时间</div>
                </Col>
              </Row>
            </div>
            <div class="content_title">控制回路（3）</div>
            <div class="loop">
              <div class="every">
                <div class="every_title">312-1旋转电机抽屉柜</div>
                <div class="every_spa">位置：块煤车间变配电集控室/31MCC-</div>
                <div class="every_state">
                  <div>
                    <span class="green"></span>
                    分闸
                  </div>
                  <div></div>
                </div>
              </div>
              <div class="cus-table">
                <Table
                  pagination={false}
                  rowKey={(record: any) => {
                    if (!record.rowKey) {
                      record.rowKey = randomKey();
                    }
                    return record.rowKey;
                  }}
                  columns={commonTable.columns}
                  loading={false}
                  scroll={{ y: "100%" }}
                  dataSource={[]}
                ></Table>
              </div>
            </div>
            <div class="content_title">工单流程</div>
            <div class="timeLine">
              <Timeline>
                <TimelineItem
                  dot={
                    <div class="complate">
                      <CheckOutlined />
                    </div>
                  }
                >
                  <div class="content">
                    <div class="label">停送电已发起</div>
                    <div class="time">08-04 13:00</div>
                  </div>
                </TimelineItem>
                <TimelineItem
                  dot={
                    <div class="active">
                      <span></span>
                    </div>
                  }
                >
                  ddd
                </TimelineItem>
              </Timeline>
            </div>
          </div>
        </div>
        <div class="info_footer">
          <Button onClick={() => (modal.visible = true)}>转交</Button>
          <Button danger>拒绝</Button>
          <Button type="primary" ghost>
            同意
          </Button>
        </div>
        <Modal
          v-model={[modal.visible, "visible"]}
          title={modal.title}
          width="480px"
          wrapClassName="pssInfo_modal"
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary">保存</Button>
                <Button>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content">
            <div class="title">同意审批意见</div>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              bordered={false}
              showCount
              maxlength={100}
              placeholder="请填写"
            />
          </div>
          <div class="transfer">
            <div class="title">
              <span>
                <img src="/micro-assets/inl/pss/required.png" />
              </span>
              转交人
            </div>
            <div class="choosePeople">
              <div class="addBtn" onClick={() => transModal.visible = true}>
                <img src="/micro-assets/inl/pss/addBtn.png" />
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          v-model={[transModal.visible, "visible"]}
          title="选择转交人"
          width="480px"
          wrapClassName="pssInfo_transModal"
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <Button type="primary">确认转交人</Button>
                <Button>取消</Button>
              </div>
            ),
          }}
        >
          <div class="modal_content">
            <Input placeholder='搜索人' class='searchInput'/>
            <div class="choosePeople">
              <div class="row">
                <div class="avater"></div>
                <div class="label">万亿</div>
                <div class="choosen">sjsjs</div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
});

