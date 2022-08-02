import { defineComponent, onMounted, reactive, ref } from "vue";
import * as thingApis from "@/api/thingInstance";
import { CaretUpOutlined, CaretRightOutlined } from "@ant-design/icons-vue";
import "../less/editThing.less";

export default defineComponent({
  setup() {
    const tabKey = ref("1");
    const columns = ref([]);
    const tableList = ref([]);

    const renderTables = () => {
      return (
        <div>
          <a-tabs v-model:activeKey={[tabKey.value, "activeKey"]}>
            <a-tab-pane key="1" tab="系统包"></a-tab-pane>
            <a-tab-pane key="2" tab="系统大包"></a-tab-pane>
            <a-tab-pane key="3" tab="系统小包"></a-tab-pane>
          </a-tabs>
          <div class="tableTool">
            <a-button type="primary">新建</a-button>
            <a-button>删除</a-button>
          </div>
          <a-table
            rowKey="code"
            columns={columns.value}
            dataSource={tableList.value}
            pagination={null}
            v-slots={{
              action: (row: any) => {
                return (
                  <a-space>
                    <a
                      onClick={() => {
                        //   updateModal(row);
                      }}
                    >
                      编辑
                    </a>
                    <a onClick={() => {}}>详情</a>
                    <span
                      class="red pointer"
                      onClick={() => {
                        //   deleteThing(row);
                      }}
                    >
                      删除
                    </span>
                  </a-space>
                );
              },
            }}
          ></a-table>
        </div>
      );
    };
    const showModel = ref(false);
    const renderModal = () => {
      return (
        <div>
          <a-modal
            v-model={[showModel.value, "visible"]}
            title="关联物实例"
            class="thingRelationDia"
            width={600}
          >
            <div class="flex tools">
              <div class="inputs flex1">
                <div class="flex element">
                  <div class="name">类目</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
                <div class="flex element">
                  <div class="name">编码</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
                <div class="flex element">
                  <div class="name">名称</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
                <div class="flex element">
                  <div class="name">ID</div>
                  <div>
                    <a-input></a-input>
                  </div>
                </div>
              </div>
              <div class="btns">
                <div>
                  <a-button type="primary">搜索</a-button>
                </div>
                <div>
                  <a-button type="primary">重置</a-button>
                </div>
              </div>
            </div>
            <a-table
              rowKey="code"
              columns={columns.value}
              dataSource={tableList.value}
              pagination={null}
            ></a-table>
          </a-modal>
        </div>
      );
    };
    return () => (
      <div class="editThing">
        <div class="header flex">
          <a-page-header
            class="flex1 "
            title="返回物实例列表"
            onBack={() => {}}
          />
          <a-button type="primary">保存</a-button>
          <a-button>取消</a-button>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">基础属性</div>
            {/* <div class="fold flex">
              折叠
              <CaretUpOutlined />
            </div> */}
          </div>
          <div class="flex content">
            <div class="flex3 grid">
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
            </div>
            <div class="flex1 pic">
              <img src="https://dss2.bdstatic.com/5bVYsj_p_tVS5dKfpU_Y_D3/res/r/image/2022-8-1/0801ban.png" />
              <a-button type="primary">修改图片</a-button>
            </div>
          </div>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">动态属性</div>
            {/* <div class="fold flex">
              折叠
              <CaretUpOutlined />
            </div> */}
          </div>
          <div class="flex content">
            <div class="flex3 grid">
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
            </div>
            <div class="flex1 pic"></div>
          </div>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">报警</div>
            {/* <div class="fold flex">
              折叠
              <CaretUpOutlined />
            </div> */}
          </div>
          <div class="flex content">
            <div class="flex3 grid">
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
            </div>
            <div class="flex1 pic"></div>
          </div>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">动作</div>
            {/* <div class="fold flex">
              折叠
              <CaretUpOutlined />
            </div> */}
          </div>
          <div class="flex content">
            <div class="flex3 grid">
              <div class="flex element">
                <div class="name">名称</div>
                <div>
                  <a-input></a-input>
                </div>
              </div>
            </div>
            <div class="flex1 pic"></div>
          </div>
        </div>
        {renderTables()}
        {renderModal()}
      </div>
    );
  },
});
