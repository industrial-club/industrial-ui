import { defineComponent, onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";

import rotationApi from "@/api/rotation";
import videoApi from "@/api/video";
import PlayVideos from "./PlayVideos";
import "../assets/styles/video/rotation.less";
import utils from "@/utils";

const com = defineComponent({
  props: {
    serverName: {
      type: String,
      default: "",
    },
  },
  components: {
    PlayVideos,
  },
  setup(props, context) {
    const data: any = reactive({
      dialog: false,
      dialog2: false,
      list: [] as any,
      formState: {
        pollingInterval: 15,
        pollingGroupName: "",
        splicingConfigId: "",
      },
      rules: {
        pollingGroupName: [{ required: true, message: "此项必填" }],
        pollingInterval: [{ required: true, message: "此项必填" }],
        splicingConfigId: [{ required: true, message: "此项必填" }],
      },
    });
    const groupList: any = ref([]);
    const groupVal: any = ref("");
    const treeData: any = ref();
    const checkTree: any = ref([]);

    const sortData = (sort: any, goalArr: any, method: any) => {
      // sort: 当前顺序， goalArr: 目标数组， method： up or down
      if (sort === 0 && method === "up") return goalArr;
      if (sort === goalArr.length - 1 && method === "down") {
        return goalArr;
      }
      const goal = goalArr[sort]; // 当前元素
      const index = method === "up" ? sort - 1 : sort + 1;
      // index:元素需要放置的位置索引，从0开始
      if (method === "up") {
        goalArr.splice(index, 0, goal);
        goalArr.splice(sort + 1, 1);
      } else {
        goalArr.splice(index + 1, 0, goal);
        goalArr.splice(sort, 1);
      }
      return goalArr;
    };

    const tree: any = ref([]);

    const diaData: any = reactive({
      dataSource: [],
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          customRender: ({ index }: any) => {
            return <div class="center">{index + 1}</div>;
          },
        },
        {
          title: "相机名称",
          dataIndex: "title",
        },
        {
          title: "预置位",
          dataIndex: "sort",
          slots: { customRender: "preset" },
        },
        {
          title: "操作",
          dataIndex: "name",
          customRender: ({ index, record }: any) => {
            return (
              <div class="center">
                <span
                  onClick={() => {
                    diaData.dataSource.splice(index, 1);
                    const idx = checkTree.value.findIndex(
                      (el: any) => el === record.uuid
                    );
                    checkTree.value.splice(idx, 1);
                    tree.value.splice(idx, 1);
                  }}
                >
                  删除
                </span>
                <span
                  v-show={index !== 0}
                  onClick={() => {
                    diaData.dataSource = sortData(
                      index,
                      diaData.dataSource,
                      "up"
                    );
                  }}
                >
                  上移
                </span>
                <span
                  v-show={index !== diaData.dataSource.length - 1}
                  onClick={() => {
                    diaData.dataSource = sortData(
                      index,
                      diaData.dataSource,
                      "down"
                    );
                  }}
                >
                  下移
                </span>
              </div>
            );
          },
        },
      ],
      pointList: [] as any[],
      selectedKeys: [],
      targetKeys: [],
      treeData: [],
    });
    const customRender = () => {
      const ren: any = {};
      ren.preset = (params: any) => {
        return (
          <a-input
            style="width:200px"
            v-model={[diaData.dataSource[params.index].preset, "value"]}
          />
        );
      };
      return ren;
    };
    const formRef = ref();
    const sortGroup: any = ref([]); // 拼接方式
    const treeRef = ref(null);
    const computedTree = (arr: any) => {
      arr.forEach((item: any) => {
        if (item.nodeType === "G") {
          item.disableCheckbox = true;
        } else {
          item.disableCheckbox = false; // 只能选相机
        }
        item.key = `${item.parentUuid}-${item.uuid}`;
        if (item.children) {
          computedTree(item.children);
        }
      });
      return arr;
    };
    const getQueryGroup = async () => {
      const res = await videoApi.getQueryGroup({ uuid: groupVal.value });
      treeData.value = computedTree(res.data);
    };

    const getGroup = async () => {
      const res = await videoApi.getGroup();
      groupList.value = [];
      if (res.code === "M0000") {
        groupList.value = res?.data;
        groupVal.value = res?.data[0].uuid;
        getQueryGroup();
      }
    };
    const getSort = async () => {
      const res = await rotationApi.getSort();
      sortGroup.value = res.data || [];
      if (data.formState.splicingConfigId === "") {
        data.formState.splicingConfigId = res.data[0].id;
      }
    };
    const getData = async () => {
      const res = await rotationApi.getList();
      data.list = res.data.map((item: any) => {
        item.sort = Number(item.sort);
        return item;
      });
    };
    const flatten = (list: any[] = []) => {
      list.forEach((item) => {
        diaData.pointList.push(item);
        flatten(item.children);
      });
    };
    const activityIdx: any = ref(null);
    const editId: any = ref(null);
    const groupSort = async (type: any) => {
      if (activityIdx.value !== null) {
        const { id } = data.list[activityIdx.value];
        const res = await rotationApi.updateSort({ id, type });
        if (res.code === "M0000") {
          getData();
        }
      }
    };
    const deleteEvery = async () => {
      const obj: any = data.list[activityIdx.value];
      if (obj) {
        const res = await rotationApi.delete({ id: obj.id });
        if (res.code === "M0000") {
          if (res.data) {
            getData();
          } else {
            message.error("移动失败");
          }
        }
      }
    };
    const chooseEvery = (item: any, idx: any) => {
      activityIdx.value = idx;
    };

    const changeStatus = async (obj: any) => {
      const status = obj.inuse === true ? "1" : "0";
      const res = await rotationApi.updateStatus({ id: obj.id, status });
      if (res.code === "M0000") {
        getData();
      }
    };
    const checkCount = () => {
      let res = true;
      const showType = sortGroup.value.find(
        (item: any) => data.formState.splicingConfigId === item.id
      );
      const num = showType.amount ? Number(showType.amount) : 0;
      if (checkTree.value.length > num) {
        message.warning(`最多${num}路视频，请减少相机数量或更改拼接方式`);
        res = false;
      } else {
        res = true;
      }
      return res;
    };
    const addTree = () => {
      if (!checkCount()) {
        return;
      }
      diaData.dataSource = tree.value.concat([]);
      data.dialog2 = false;
    };

    const chooseTree = (val: any, item: any) => {
      if (item.checked) {
        const system = groupList.value.find(
          (ele: any) => ele.uuid === groupVal.value
        );

        tree.value.push({ ...item.node, system: system.name });
      } else {
        const idx = tree.value.findIndex(
          (ele: any) => ele.uuid === item.node.uuid
        );
        if (idx > -1) {
          tree.value.splice(idx, 1);
        }
      }
      checkTree.value = val.checked;
    };

    const tableSelectedKeys = ref([]);

    const onTableSelectChange = (val: any) => {
      tableSelectedKeys.value = val;
    };

    const deletePoint = () => {
      tableSelectedKeys.value.forEach((item: any) => {
        const index = diaData.dataSource.filter(
          (ele: any) => ele.uuid === item
        );
        diaData.dataSource.splice(index, 1);
        const idx = checkTree.value.findIndex((el: any) => el === item);
        checkTree.value.splice(idx, 1);
        tree.value.splice(idx, 1);
      });
    };

    const clear = () => {
      checkTree.value = [];
      diaData.dataSource = [];
      tree.value = [];
      data.formState.pollingGroupName = "";
      data.dialog = false;
      editId.value = null;
    };

    const commit = async () => {
      let params: any = {
        monitorPointPoList: [],
        ...data.formState,
      };
      if (editId.value) {
        params = { ...params, ...editId.value };
      }
      params.monitorPointPoList = diaData.dataSource.map(
        (item: any, idx: any) => {
          return {
            cameraUuid: item.uuid,
            sort: idx + 1,
            preset: item.preset,
          };
        }
      );
      const res = await rotationApi.save(params);
      clear();
      getData();
    };

    const addGroup = async () => {
      if (!checkCount()) {
        return;
      }
      formRef.value
        .validate()
        .then(() => {
          commit();
        })
        .catch(() => {
          // message.warn('请将正确填写表单信息');
        });
    };

    const editGroup = () => {
      if (activityIdx.value !== null) {
        getSort();
        tree.value = [];
        diaData.dataSource = data.list[
          activityIdx.value
        ]?.monitorPointPoList.map((item: any) => {
          item.uuid = item.cameraUuid;
          item.system = groupList.value.find(
            (ele: any) => ele.uuid === item.pollingGroupUuid
          )?.name;
          item.title = item.name;
          // const key = item.cameraUuid;
          checkTree.value.push(item.cameraUuid);
          tree.value.push(item);
          return item;
        });
        const {
          pollingGroupName,
          pollingInterval,
          splicingConfigId,
          id,
          uuid,
        } = data.list[activityIdx.value];
        data.formState = {
          pollingGroupName,
          pollingInterval,
          splicingConfigId: Number(splicingConfigId),
        };
        editId.value = { id, uuid };
        data.dialog = true;
      }
    };
    const addPoint = () => {
      const type = sortGroup.value.find(
        (way: any) => way.id === data.formState.splicingConfigId
      );
      if (diaData.dataSource.length >= type.amount) {
        message.error("控制点已满");
        return;
      }
      getGroup();
      data.dialog2 = true;
    };

    onMounted(() => {
      if (props.serverName) {
        videoApi.setInstance(props.serverName);
      }
      getData();
      getGroup();
      flatten(JSON.parse(JSON.stringify(diaData.treeData)));
    });
    return () => (
      <div class="rotation flex">
        <div class="teamOperation">
          <div class="title">轮巡分组</div>
          <div class="btns">
            <span
              onClick={() => {
                getSort();
                data.dialog = true;
              }}
            >
              <img
                src={
                  "http://192.168.5.211/micro-assets/inl/video/video/add.svg"
                }
              />
            </span>
            <span onClick={() => editGroup()}>
              <img
                src={
                  "http://192.168.5.211/micro-assets/inl/video/video/edit.svg"
                }
              />
            </span>
            <span onClick={() => deleteEvery()}>
              <img
                src={
                  "http://192.168.5.211/micro-assets/inl/video/video/delete.svg"
                }
              />
            </span>
            <span onClick={() => groupSort(0)}>
              <img
                src={"http://192.168.5.211/micro-assets/inl/video/video/up.svg"}
              />
            </span>
            <span onClick={() => groupSort(1)}>
              <img
                src={
                  "http://192.168.5.211/micro-assets/inl/video/video/down.svg"
                }
              />
            </span>
          </div>
          <div class="teams">
            {data.list.map((team: any, idx: any) => {
              team.inuse = team.enabled === "1";
              return (
                <div
                  class={[
                    "team flex",
                    activityIdx.value === idx ? "active" : "",
                  ]}
                  onClick={() => chooseEvery(team, idx)}
                >
                  <div class="flex1">{team.pollingGroupName}</div>
                  <a-switch
                    v-model={[team.inuse, "checked"]}
                    checked-children="启用"
                    un-checked-children="禁用"
                    onChange={() => changeStatus(team)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <PlayVideos class="flex4" teams={data.list} />
        <a-modal
          title="轮巡分组"
          width="1100px"
          v-model={[data.dialog, "visible"]}
          class="rotationDia"
          onOk={addGroup}
          onCancel={clear}
        >
          <a-form
            ref={formRef}
            labelCol={{ span: 8 }}
            model={data.formState}
            rules={data.rules}
            layout="inline"
          >
            <a-form-item label="分组名称" name="pollingGroupName">
              <a-input
                v-model={[data.formState.pollingGroupName, "value"]}
              ></a-input>
            </a-form-item>
            <a-form-item label="轮巡间隔" name="pollingInterval">
              <a-input
                addon-after="s"
                v-model={[data.formState.pollingInterval, "value"]}
              ></a-input>
            </a-form-item>
            <a-form-item label="拼接方式" name="name">
              <a-select
                v-model={[data.formState.splicingConfigId, "value"]}
                onChange={() => {}}
              >
                {sortGroup.value.map((item: any) => {
                  return (
                    <a-select-option value={item.id}>
                      {item.splicingName}
                    </a-select-option>
                  );
                })}
              </a-select>
            </a-form-item>
          </a-form>
          <div>
            <div class="title">轮巡监控点</div>
            <div class="btns">
              <a-button
                type="primary"
                ghost
                size={"small"}
                onClick={() => {
                  addPoint();
                }}
              >
                添加控制点
              </a-button>
              <a-button size={"small"} onClick={() => deletePoint()}>
                删除
              </a-button>
            </div>
          </div>
          <a-table
            class="alarmTable"
            dataSource={diaData.dataSource}
            columns={diaData.columns}
            childrenColumnName="child"
            pagination={false}
            vSlots={customRender()}
            rowSelection={{
              selectedRowKeys: tableSelectedKeys.value,
              onChange: onTableSelectChange,
            }}
          ></a-table>
        </a-modal>
        <a-modal
          width="800px"
          v-model={[data.dialog2, "visible"]}
          title="添加轮巡监控点"
          class="addPointdialog"
          closable={false}
          onOk={addTree}
          onCancel={() => {
            // diaData.dataSource = [];
            tree.value = [];
            checkTree.value = [];
            data.dialog2 = false;
          }}
        >
          <a-select
            v-model={[groupVal.value, "value"]}
            onChange={() => getQueryGroup()}
          >
            {groupList.value.map((item: any) => {
              return (
                <a-select-option value={item.uuid}>{item.name}</a-select-option>
              );
            })}
          </a-select>
          <a-tree
            ref={treeRef}
            class="videoTree"
            blockNode
            checkable
            checkStrictly
            defaultExpandAll
            fieldNames={{
              children: "children",
              title: "title",
              key: "uuid",
            }}
            treeData={treeData.value}
            checkedKeys={checkTree.value}
            onCheck={chooseTree}
          ></a-tree>
        </a-modal>
      </div>
    );
  },
});

export default utils.installComponent(com, "video-rotation");
