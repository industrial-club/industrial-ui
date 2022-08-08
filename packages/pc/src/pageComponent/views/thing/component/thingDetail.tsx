import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import * as thingApis from "@/api/thingInstance";
import { CaretUpOutlined, CaretRightOutlined } from "@ant-design/icons-vue";
import "../less/editThing.less";
import { message } from "ant-design-vue";
import editRelation from "./editRelation";

export default defineComponent({
  components: { editRelation },
  props: {
    data: Object,
  },
  setup(props, context) {
    // 基础属性
    const basicForm = ref([]);
    // 全部属性
    const colArr = ref([]);
    // 动态表格
    const dynamicColumns = ref([
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "属性名称",
        dataIndex: "id",
      },
      {
        title: "属性编码",
        dataIndex: "thingPropertyCode",
      },
      {
        title: "preCode",
        dataIndex: "preCode",
      },
      {
        title: "prePointCode",
        dataIndex: "prePointCode",
      },
    ]);
    const dynamicTableList = ref([]);
    // 逻辑表格
    const LoginColumns = ref([]);
    const LoginTableList = ref([]);

    // 动作表格
    const actionColumns = ref([]);
    const actionCTableList = ref([]);
    watch(
      () => props.data,
      (value: any) => {
        colArr.value = JSON.parse(
          JSON.stringify(value.thingInst.thing.thingPropertyList)
        );
        basicForm.value = colArr.value.filter((ele: any) => {
          ele.value = value.staticMap.map[ele.code];
          return ele.propertyType === "property";
        });
        dynamicTableList.value = value.dynamicProperties.filter((ele: any) => {
          const pro: any = colArr.value.find((col: any) => {
            return col.code === ele.thingPropertyCode;
          });

          return pro.propertyType === "metric";
        });
      },
      {
        immediate: true,
      }
    );

    const save = async () => {
      const param: any = props.data;
      basicForm.value.forEach((element: any) => {
        param.staticMap.map[element.code] = element.value;
      });
      param.dynamicProperties.forEach((element) => {
        const dy: any = dynamicTableList.value.find((ele: any) => {
          return element.thingPropertyCode === ele.thingPropertyCode;
        });
        element.preCode = dy.preCode;
        element.prePointCode = dy.prePointCode;
      });
      const res: any = await thingApis.editThing(param);
      if (res.code === "M0000") {
        message.success("保存成功");
        context.emit("bach");
      } else {
        message.error("服务异常");
      }
    };
    return () => (
      <div class="editThing">
        <div class="header flex">
          <a-page-header
            class="flex1 "
            title="返回物实例列表"
            onBack={() => {
              context.emit("back");
            }}
          />
          <a-button
            onClick={() => {
              context.emit("back");
            }}
          >
            返回
          </a-button>
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
              {basicForm.value.map((ele: any) => {
                return (
                  <div class="flex element">
                    <div class="name">{ele.name}</div>
                    <div>
                      {ele.displayType === "text" ? (
                        <a-input
                          v-model={[ele.value, "value"]}
                          disabled={true}
                        ></a-input>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })}
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
          </div>
          <div></div>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">逻辑</div>
          </div>
          <a-table
            rowKey="code"
            columns={actionColumns.value}
            dataSource={actionCTableList.value}
            pagination={false}
          ></a-table>
        </div>
        <div class="basic">
          <div class="title flex">
            <div class="icon"></div>
            <div class="name">动作</div>
          </div>
          <a-table
            rowKey="code"
            columns={actionColumns.value}
            dataSource={actionCTableList.value}
            pagination={false}
          ></a-table>
        </div>
        <editRelation ele={props.data?.staticMap?.map} />
      </div>
    );
  },
});
