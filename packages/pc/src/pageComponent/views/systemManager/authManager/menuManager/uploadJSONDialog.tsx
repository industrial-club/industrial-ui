/*
 * @Abstract: 上传JSON文件模态框
 * @Author: wang liang
 * @Date: 2022-04-26 14:16:45
 * @LastEditors: wang liang
 * @LastEditTime: 2022-04-26 15:55:21
 */

import { defineComponent, ref, inject } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { IUrlObj } from "./index";

import { Modal, message } from "ant-design-vue";
import api from "@/api/auth/menuManager";

const UploadJSONDialog = defineComponent({
  emits: ["update:visible"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onRefresh: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const urlMap = inject<IUrlObj>("urlMap")!;

    const fileList = ref<any[]>([]);

    const isVisible = useVModel(props, "visible", emit);

    // 点击确定 上传文件
    const handleCommit = async () => {
      const file = fileList.value[0];
      if (!file) {
        return message.warn("请上传文件");
      }
      await api.uploadJSONFile(urlMap.upload)(file.originFileObj);
      message.success("上传成功");
      isVisible.value = false;
      props.onRefresh?.();
    };

    // 点击取消
    const onCancle = () => {
      fileList.value = [];
    };

    return { isVisible, handleCommit, fileList, onCancle };
  },
  render() {
    return (
      <div class="upload-json-dialog">
        <Modal
          title="上传JSON文件"
          v-model={[this.isVisible, "visible"]}
          onOk={this.handleCommit}
          onCancel={this.onCancle}
        >
          <a-upload-dragger
            accept="application/json"
            maxCount={1}
            v-model={[this.fileList, "fileList"]}
            beforeUpload={async () => false}
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">点击或把文件拖到这里上传</p>
          </a-upload-dragger>
        </Modal>
      </div>
    );
  },
});

export default UploadJSONDialog;
