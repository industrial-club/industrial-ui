import { defineComponent, onMounted, reactive, ref } from "vue";
import "./less/thingInstance.less";
import { MenuFoldOutlined, DownOutlined } from "@ant-design/icons-vue";
import useTreeSearch from "./hooks/useTreeSearch";
import useTableList from "./hooks/useTableList";
import thingModal from "./modal";
import * as thingApis from "@/api/thingInstance";
import utils from "@/utils";
import { message } from "ant-design-vue";
import editThing from "./component/editThing";

const com = defineComponent({
  components: { thingModal, editThing },
  setup() {
    // 模型树
    const {
      tree,
      searchValue,
      expandedKeys,
      autoExpandParent,
      selectedKeyArr,
      fieldNames,
      generateKey,
      generateList,
    } = useTreeSearch({
      title: "name",
      children: "child",
    });
    const getTreeData = () => {
      thingApis.findAllThingForTree().then((res) => {
        refresh();
        const data = generateKey("0", res.data);
        generateList(data);
        tree.data = data;
      });
    };
    const selectNode = (
      selectedKeys: string[] | number[],
      { selected, node }: any
    ) => {
      if (selected) {
        formQuery.thingCode = node.code;
      } else {
        formQuery.thingCode = "";
      }
      selectedKeyArr.value = selectedKeys;
      refresh();
    };

    const expandNode = (keys: string[]) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    // table
    const queryFormRef = ref();
    const formQuery = reactive({
      name: "",
      thingCode: "",
      code: "",
      catalogCode: "",
      factoryCode: "",
      brandCode: "",
      modelCode: "",
    });
    const getList = async () => {
      const res: any = await thingApis.indInsts({
        ...formQuery,
        pageNum: currPage.value,
        pageSize: pageSize.value,
      });
      const resObj: any = {
        columnData: [],
        data: [],
        totalNum: res.data?.total,
      };

      const colArr = res.data?.list[0]?.thingInst.thing.thingPropertyList;
      colArr?.forEach((element) => {
        if (element.listDisplay) {
          resObj.columnData.push({
            title: element.name,
            dataIndex: element.code,
            key: element.code,
          });
        }
      });
      resObj.columnData.push({
        title: "操作",
        dataIndex: "action",
        key: "action",
        slots: { customRender: "action" },
      });
      res.data?.list.forEach((ele: any) => {
        resObj.data.push(ele.staticMap.map);
      });
      return resObj;
    };
    const state = reactive<{
      selectedRowKeys: string[];
      modalVisible: boolean;
    }>({
      selectedRowKeys: [],
      modalVisible: true,
    });
    const onSelectChange = (selectedRowKeys: string[]) => {
      state.selectedRowKeys = selectedRowKeys;
    };
    const {
      isLoading,
      columns,
      tableList,
      pagination,
      refresh,
      currPage,
      pageSize,
    } = useTableList(getList, "list", "total");
    const reset = () => {
      queryFormRef.value.resetFields();
    };
    const pageData = reactive({
      editData: {},
      thingCode: "",
    });
    // 弹框
    const modalRef = ref<any>(null);
    const updateModal = async (row?: any) => {
      const res: any = await thingApis.findThingProperties(row.record.id);
      pageData.thingCode = row.record.thing_code;
      pageData.editData = res.data;
      page.value = "edit";
    };
    const deleteThing = async (row) => {
      const res: any = await thingApis.deleteThing(row.record.id);
      if ((res.code = "M0000")) {
        message.success("删除成功");
      }
    };
    onMounted(() => {
      getTreeData();
    });
    const page = ref("list");
    return () => (
      <div class="thingApp">
        {page.value === "edit" ? (
          <editThing
            data={pageData.editData}
            onBack={() => {
              page.value = "list";
            }}
          />
        ) : (
          ""
        )}
        <div
          class="thingInstance flex"
          style={page.value !== "list" ? "display:none" : ""}
        >
          <div class="left_wrap">
            <div class="flex_lr_c">
              <span>物模型</span>
              <MenuFoldOutlined />
            </div>

            <div class="tree_data">
              <a-input-search
                v-model={[searchValue.value, "value"]}
                style="margin-bottom: 8px"
                placeholder="Search"
              />
              <div class="mar-t-20 tree_wrap">
                <a-tree
                  show-line
                  blockNode={true}
                  tree-data={tree.data}
                  field-names={fieldNames}
                  onSelect={selectNode}
                  onExpand={expandNode}
                  selectedKeys={selectedKeyArr.value}
                  expanded-keys={expandedKeys.value}
                  auto-expand-parent={autoExpandParent.value}
                  v-slots={{
                    title: ({ name }: any) => {
                      return (
                        <span class="tree-node-title">
                          {name.indexOf(searchValue.value) > -1 ? (
                            <span>
                              {name.substr(0, name.indexOf(searchValue.value))}
                              <span style={{ color: "#f50" }}>
                                {searchValue.value}
                              </span>
                              {name.substr(
                                name.indexOf(searchValue.value) +
                                  searchValue.value.length
                              )}
                            </span>
                          ) : (
                            <span>{name}</span>
                          )}
                        </span>
                      );
                    },
                  }}
                ></a-tree>
              </div>
            </div>
          </div>
          <div class="table_wrap">
            {/* <div class="option">
              <a-form ref={queryFormRef} model={formQuery}>
                <a-row gutter={30}>
                  {queryOpts.map((item) => {
                    return (
                      <a-col span={6}>
                        <a-form-item label={item.name} name={item.prop}>
                          <a-input v-model={[formQuery[item.prop], "value"]} />
                        </a-form-item>
                      </a-col>
                    );
                  })}
                  <a-col span={24 - (queryOpts.length % 4) * 6} class="align-r">
                    <a-space size={16}>
                      <a-button type="primary" onClick={refresh}>
                        查询
                      </a-button>
                      <a-button onClick={reset}>重置</a-button>
                      <a-space size={5}>
                        <span>更多</span>
                        <DownOutlined />
                      </a-space>
                    </a-space>
                  </a-col>
                </a-row>
              </a-form>
            </div> */}
            <a-space size={16}>
              <a-button
                type="primary"
                onClick={() => updateModal(null)}
                disabled={!formQuery.thingCode}
              >
                新增
              </a-button>
              <a-button type="primary" ghost>
                批量导入
              </a-button>
              <a-button type="primary" ghost>
                导出全部
              </a-button>
              <a-button
                type="primary"
                disabled={state.selectedRowKeys.length == 0}
              >
                导出选中
              </a-button>
              <a-button
                type="danger"
                disabled={state.selectedRowKeys.length == 0}
              >
                删除选中
              </a-button>
            </a-space>
            <div class="mar-t-20">
              <a-table
                rowKey="code"
                columns={columns.value}
                row-selection={{
                  selectedRowKeys: state.selectedRowKeys,
                  onChange: onSelectChange,
                }}
                dataSource={tableList.value}
                loading={isLoading.value}
                pagination={pagination}
                v-slots={{
                  action: (row: any) => {
                    return (
                      <a-space>
                        <a
                          onClick={() => {
                            updateModal(row);
                          }}
                        >
                          编辑
                        </a>
                        <a onClick={() => {}}>详情</a>
                        <span
                          class="red pointer"
                          onClick={() => {
                            // deleteThing(row);
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
          </div>
          <thing-modal ref={modalRef} />
        </div>
      </div>
    );
  },
});
export default utils.installComponent(com, "thing");
