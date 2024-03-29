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
import axios from "axios";
import dayjs from "dayjs";

const com = defineComponent({
  components: { thingModal, editThing, thingDetail, addThing },
  setup() {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
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
        res.data.forEach((ele: any) => {
          ele.first = true;
        });
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
      selectedRows: any[];
      modalVisible: boolean;
    }>({
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: true,
    });
    const onSelectChange = (selectedRowKeys: string[], selectedRows: any[]) => {
      state.selectedRowKeys = selectedRowKeys;
      state.selectedRows = selectedRows;
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
    const batchDelete = async () => {
      for (const row of state.selectedRows) {
        const res: any = await thingApis.deleteThing(row.ID.toString());
      }
      refresh();
      message.success("删除成功");
    };
    const importModal = ref(false);
    onMounted(() => {
      getTreeData();
    });
    const page = ref("list");
    const file = ref();

    // 自定义上传
    const customRequest = async (options: any) => {
      console.log(options);
      const { file, onSuccess, onError } = options;
      const fileData = new FormData();
      fileData.append("file", file as any);
      const res: any = await thingApis.importExcel(fileData, headers);
      if (res.code === "M0000") {
        message.error("上传成功");
        onSuccess("response", file);
      } else {
        message.error("上传失败");
        onError("error", file);
      }
    };

    const exportFun = async () => {
      const res: any = await thingApis.exportExcelTemplate();
      const blob = new Blob([res], {
        type: "text/html;charset=UTF-8",
      });
      console.log(blob);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "物实例数据.xls";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    const handleChange = (info) => {
      console.log(info);
    };
    const fileList = ref([]);
    const renderPointModal = () => {
      return (
        <a-modal
          v-model={[importModal.value, "visible"]}
          title="批量配点"
          class="pointModal"
          width={800}
          footer={null}
          onCancel={() => {
            importModal.value = false;
          }}
        >
          <a-alert
            message="请先下载当前所有的动态属性并按要求填写信息，否则可能导入失败。上传文件后将覆盖式更新，请谨慎操作！"
            banner
          />
          <a-upload-dragger
            v-model={[file.value, "file"]}
            name="file"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            onChange={() => {}}
            onDrop={() => {}}
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">
              文件格式：PNG;JPG;JPEG;SVG;大小不超过3M
            </p>
          </a-upload-dragger>
        </a-modal>
      );
    };
    return () => (
      <div class="thingApp">
        {page.value === "edit" ? (
          <editThing
            data={pageData.editData}
            onBack={() => {
              refresh();
              page.value = "detail";
            }}
            onBackList={() => {
              refresh();
              page.value = "list";
            }}
            onToDetail={(res) => {
              toDetail({ record: res });
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
            onBackList={() => {
              refresh();
              page.value = "list";
            }}
            onToDetail={(res) => {
              toDetail({ record: res });
            }}
          />
        ) : (
          ""
        )}
        {page.value === "detail" ? (
          <thingDetail
            data={pageData.editData}
            onBack={() => {
              refresh();
              page.value = "list";
            }}
            onBackList={() => {
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
                class="search"
                v-model={[searchValue.value, "value"]}
                style="margin-bottom: 8px"
                placeholder="搜索"
                allowClear
              />
              <div
                class="mar-t-20 tree_wrap"
                style={{ height: "calc(100vh - 240px)" }}
              >
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
                    title: (ele: any) => {
                      return (
                        <span class="tree-node-title">
                          <span style={ele.first ? "font-weight:700" : ""}>
                            {ele.name}
                          </span>
                        </span>
                      );
                    },
                  }}
                ></a-tree>
              </div>
            </div>
          </div>
          <div class="table_wrap">
            {!formQuery.thingCode ? (
              <a-empty
                image="/micro-assets/platform-web/empty.png"
                image-style={{
                  height: "17.57rem",
                }}
                v-slots={{
                  description: () => (
                    <span style={{ fontSize: "1rem", color: "#354052" }}>
                      请先在左侧选择一个物规格
                    </span>
                  ),
                }}
              ></a-empty>
            ) : (
              <>
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
                                <a-input
                                  v-model={[item.value, "value"]}
                                  allowClear={true}
                                />
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
                  <a-upload
                    headers={headers}
                    showUploadList={false}
                    customRequest={(e) => customRequest(e)}
                  >
                    <a-button type="primary" ghost>
                      批量导入
                    </a-button>
                  </a-upload>
                  <a-button
                    type="primary"
                    onClick={() => {
                      exportFun();
                    }}
                    ghost
                  >
                    导出全部
                  </a-button>
                  <a-button
                    type="primary"
                    disabled={state.selectedRowKeys.length == 0}
                  >
                    导出选中
                  </a-button>
                  <a-button
                    onClick={() => {
                      batchDelete();
                    }}
                    type="danger"
                    disabled={state.selectedRowKeys.length == 0}
                  >
                    删除选中
                  </a-button>
                  {renderPointModal()}
                  {/* <a-button
                onClick={() => {
                  importModal.value = true;
                }}
                type="primary"
                ghost
              >
                批量配点
              </a-button> */}
                </a-space>
                <div class="mar-t-20">
                  <a-table
                    rowKey="ID"
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
                            <a-popconfirm
                              title="确认删除?"
                              ok-text="确定"
                              cancel-text="取消"
                              onConfirm={() => {
                                deleteThing(row);
                              }}
                            >
                              <span class="red pointer">删除</span>
                            </a-popconfirm>
                          </a-space>
                        );
                      },
                    }}
                  ></a-table>
                </div>
              </>
            )}
          </div>
          <thing-modal ref={modalRef} />
        </div>
      </div>
    );
  },
});
export default utils.installComponent(com, "thing");
