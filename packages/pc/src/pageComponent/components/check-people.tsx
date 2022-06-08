import { defineComponent, ref, watch, inject } from "vue";
import useWatchOnce from "@/pageComponent/hooks/useWatchOnce";
import { debounce } from "lodash";
import { fomatDepTree } from "@/pageComponent/utils/format";
import { getDepPeopleTreeList } from "@/pageComponent/api/alarm/warningConfigure";
import { IUrlObj } from "../views/alarms/warning-configure";

import {
  UserOutlined,
  ApartmentOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

/**
 * 选择人员组建 左侧为部门树结构 右侧为选中的人员
 */
const CheckPeople = defineComponent({
  emits: ["update:value"],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const urlObj = inject<IUrlObj>("urlObj")!;
    // 树结构数据
    const treeData = ref<any[]>([]);
    const keyword = ref("");
    const getTreeData = debounce(
      async () => {
        const { data } = await getDepPeopleTreeList(urlObj.depTree)(
          keyword.value
        );
        const res = fomatDepTree(data);
        treeData.value = res;
      },
      300,
      { leading: true, trailing: true }
    );
    getTreeData();

    const isModalShow = ref(false);

    const checkedList = ref<any[]>([]);

    // 监听传入value 回显
    useWatchOnce(
      () => props.value,
      (val) => {
        checkedList.value = val;
        checkedKeys.value = val.map((item: any) => item.id);
      }
    );

    // 同步vModel
    watch(checkedList, (val) => emit("update:value", val), { deep: true });

    const handleEdit = () => (isModalShow.value = true);

    // 选择了一个人员
    function checkPeopleOfDep(dep: any, checked: boolean) {
      if (dep.subList.length) {
        dep.subList.forEach((item: any) => {
          if (item.isDep) {
            checkPeopleOfDep(item, checked);
          } else {
            if (checked) {
              if (!checkedList.value.includes(item))
                checkedList.value.push(item);
            } else {
              handleRemove(item);
            }
          }
        });
      }
    }
    const checkedKeys = ref<string[]>([]);
    const handleCheck = (keys: string[], { checked, node }: any) => {
      checkedKeys.value = keys;
      const people = node.dataRef;
      if (!people.isDep) {
        // 处理选中或清除
        if (checked) {
          if (!checkedList.value.includes(people))
            checkedList.value.push(people);
        } else {
          handleRemove(people);
        }
      } else {
        // 如果选中的是部门 则递归选择部门下的所有人员
        checkPeopleOfDep(people, checked);
      }
    };

    // 移除一个人员
    const handleRemove = (people: any) => {
      // 从已选择人员中移除
      const idx = checkedList.value.findIndex((item) => item.id === people.id);
      if (idx !== -1) checkedList.value.splice(idx, 1);
      // 从已选中key中移除
      const idx2 = checkedKeys.value.findIndex((item) => item === people.id);
      if (idx2 !== -1) checkedKeys.value.splice(idx2, 1);
      // 把对应部门从选中key中移除
      const depIdx = checkedKeys.value.findIndex((item) => {
        return item === `dep${people.depId}`;
      });
      if (depIdx !== -1) checkedKeys.value.splice(depIdx, 1);
    };

    return {
      treeData,
      keyword,
      isModalShow,
      checkedList,
      checkedKeys,
      handleEdit,
      handleRemove,
      handleCheck,
      getTreeData,
    };
  },

  render() {
    return (
      <div class="check-people">
        <div class="edit-area">
          <div class="edit-button">
            <a-button type="primary" onClick={this.handleEdit}>
              编辑
            </a-button>
            <span class="desc">
              已选择<span class="total">{this.checkedList.length}</span>人
            </span>
          </div>
          {/* 人员列表 */}
          <ul class="people-list">
            {this.checkedList.map((item) => (
              <li>{item.name}</li>
            ))}
          </ul>
        </div>

        {/* 选择的对话框 */}
        <a-modal
          wrapClassName="check-people-modal"
          title="请选择人员"
          width={800}
          centered
          cancelButtonProps={{}}
          v-model={[this.isModalShow, "visible"]}
          v-slots={{
            footer: () => (
              <a-button
                type="primary"
                onClick={() => (this.isModalShow = false)}
              >
                确定
              </a-button>
            ),
          }}
        >
          <div class="select-area">
            {/* 左侧的树结构 */}
            <div class="left-tree">
              <a-input
                allowClear
                placeholder="请输入关键字"
                v-model={[this.keyword, "value"]}
                onInput={this.getTreeData}
              />
              <a-tree
                checkable
                replaceFields={{
                  key: "id",
                  title: "name",
                  children: "subList",
                }}
                defaultExpandAll
                checkedKeys={this.checkedKeys}
                treeData={this.treeData}
                onCheck={this.handleCheck}
              >
                {{
                  title: ({ dataRef }: any) => (
                    <span>
                      {dataRef.isDep ? <ApartmentOutlined /> : <UserOutlined />}
                      <span style={{ marginLeft: "8px" }}>{dataRef.name}</span>
                    </span>
                  ),
                }}
              </a-tree>
            </div>
            <a-divider style={{ height: "100%" }} type="vertical" />
            {/* 右侧展示已选择的列表 */}
            <div class="ckecked-list">
              {this.checkedList.length > 0 ? (
                <ul>
                  {this.checkedList.map((item) => (
                    <li class="checked-list-item">
                      <span class="name">{item.name}</span>
                      <a-button
                        // class='btn-remove'
                        danger
                        type="link"
                        onClick={() => this.handleRemove(item)}
                      >
                        <CloseOutlined />
                      </a-button>
                    </li>
                  ))}
                </ul>
              ) : (
                <a-empty description="请选择" />
              )}
            </div>
          </div>
        </a-modal>
      </div>
    );
  },
});

export default CheckPeople;
