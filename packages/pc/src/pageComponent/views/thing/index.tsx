import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import "./less/thingInstance.less";
import { MenuFoldOutlined, DownOutlined } from "@ant-design/icons-vue";
import useTreeSearch from "./hooks/useTreeSearch";
import useTableList from "./hooks/useTableList";
import thingModal from "./modal";
import * as thingApis from "@/api/thingInstance";
import utils from "@/utils";
import { message } from "ant-design-vue";
import editThing from "./component/editThing";
import addThing from "./component/addThing";
import thingDetail from "./component/thingDetail";

const com = defineComponent({
  components: { thingModal, editThing, thingDetail, addThing },
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
    let treeDataRecord;
    const filterTree = (arr: any[], key: string) => {
      let have: boolean = false;
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        let childHave: boolean = false;
        if (obj.child && obj.child.length != 0) {
          childHave = filterTree(obj.child, key).have;
        }
        if (obj.name.indexOf(key) !== -1 || childHave) {
          have = true;
        } else {
          arr.splice(i, 1);
          i--;
        }
      }
      return { arr, have };
    };
    watch(
      () => searchValue.value,
      (value) => {
        tree.data = filterTree(
          JSON.parse(JSON.stringify(treeDataRecord)),
          searchValue.value
        ).arr;
      }
    );
    const getTreeData = () => {
      thingApis.findAllThingForTree().then((res) => {
        refresh();
        const data = generateKey("0", res.data);
        generateList(data);
        treeDataRecord = data;
        tree.data = filterTree(
          JSON.parse(JSON.stringify(treeDataRecord)),
          searchValue.value
        ).arr;
      });
    };
    const getOpiton = async () => {
      queryOpts.value = [];
      const res: any = await thingApis.findByCode(formQuery.thingCode);
      res.data.thingPropertyList.forEach((ele: any) => {
        if (ele.queryDisplay) {
          queryOpts.value.push(ele);
        }
      });
    };
    const selectNode = (
      selectedKeys: string[] | number[],
      { selected, node }: any
    ) => {
      if (formQuery.thingCode === node.code) {
        return;
      }
      if (selected) {
        formQuery.thingCode = node.code;
      } else {
        formQuery.thingCode = "";
      }
      selectedKeyArr.value = selectedKeys;
      currPage.value = 1;
      refresh();
      getOpiton();
    };

    const expandNode = (keys: string[]) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    // table
    const queryFormRef = ref();
    const formQuery: any = reactive({});
    const getList = async () => {
      const param: any = { ...formQuery, wherePojoList: [] };

      queryOpts.value.forEach((ele: any) => {
        if (ele.value) {
          param.wherePojoList.push({
            column: ele.columnName,
            operation: ele.operation,
            valueList: [ele.value],
          });
        }
      });
      const res: any = await thingApis.indInsts({
        ...param,
        pageNum: currPage.value,
        pageSize: pageSize.value,
      });
      const resObj: any = {
        columnData: [],
        data: [],
        totalNum: res.data?.total,
      };

      const colArr = res.data?.list[0]?.thingInst.thing?.thingPropertyList;
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
      queryOpts.value.forEach((ele) => {
        ele.value = "";
        ele.operation = "";
      });
      refresh();
    };
    const pageData = reactive({
      editData: {},
      addData: {},
      thingCode: "",
    });
    // 弹框
    const modalRef = ref<any>(null);
    const toEdit = async (row?: any) => {
      const res: any = await thingApis.findThingProperties(row.record.ID);
      pageData.thingCode = row.record.THING_CODE;
      pageData.editData = res.data;
      page.value = "edit";
    };
    const toCreate = async (row?: any) => {
      const res: any = await thingApis.findByCode(formQuery.thingCode);
      pageData.thingCode = formQuery.thingCode;
      pageData.addData = res.data;
      page.value = "add";
    };
    const toDetail = async (row?: any) => {
      const res: any = await thingApis.findThingProperties(row.record.ID);
      pageData.thingCode = row.record.THING_CODE;
      pageData.editData = res.data;
      page.value = "detail";
    };
    const deleteThing = async (row) => {
      const res: any = await thingApis.deleteThing(row.record.ID.toString());
      refresh();
      if ((res.code = "M0000")) {
        message.success("删除成功");
      }
    };
    const queryOpts = ref<any[]>([]);
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
              refresh();
              page.value = "list";
            }}
          />
        ) : (
          ""
        )}
        {page.value === "add" ? (
          <addThing
            data={pageData.addData}
            onBack={() => {
              refresh();
              page.value = "list";
            }}
            onToEdit={(res) => {
              toEdit({ record: res });
            }}
          />
        ) : (
          ""
        )}
        {page.value === "detail" ? (
          <thingDetail
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
                placeholder="搜索"
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
                          <span>{name}</span>
                        </span>
                      );
                    },
                  }}
                ></a-tree>
              </div>
            </div>
          </div>
          <div class="table_wrap">
            <div class="option">
              <a-form ref={queryFormRef} model={formQuery}>
                <a-row gutter={30}>
                  {queryOpts.value.map((item: any) => {
                    return (
                      <a-col span={6}>
                        <a-form-item
                          label={item.displayLabel}
                          name={item.columnName}
                        >
                          <div class="flex">
                            <a-select
                              style="width:80px"
                              v-model={[item.operation, "value"]}
                            >
                              <a-select-option value="EQ">
                                {"="}
                              </a-select-option>
                              <a-select-option value="NE">
                                {"!="}
                              </a-select-option>
                              <a-select-option value="GT">
                                {">"}
                              </a-select-option>
                              <a-select-option value="GTE">
                                {">="}
                              </a-select-option>
                              <a-select-option value="LT">
                                {"<"}
                              </a-select-option>
                              <a-select-option value="LTE">
                                {"<="}
                              </a-select-option>
                              <a-select-option value="LIKE">
                                {"like"}
                              </a-select-option>
                            </a-select>
                            <a-input v-model={[item.value, "value"]} />
                          </div>
                        </a-form-item>
                      </a-col>
                    );
                  })}
                  <a-col
                    span={24 - (queryOpts.value.length % 4) * 6}
                    class="align-r"
                  >
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
            </div>
            <a-space size={16}>
              <a-button
                type="primary"
                onClick={() => toCreate()}
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
                            toEdit(row);
                          }}
                        >
                          编辑
                        </a>
                        <a
                          onClick={() => {
                            toDetail(row);
                          }}
                        >
                          详情
                        </a>
                        <span
                          class="red pointer"
                          onClick={() => {
                            deleteThing(row);
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
