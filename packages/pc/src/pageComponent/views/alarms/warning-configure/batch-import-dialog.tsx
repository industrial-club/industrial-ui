import { computed, defineComponent, ref, watch, inject } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";
import { batchUploadConfigure } from "@/api/alarm/warningConfigure";

import { message } from "ant-design-vue";
import { InboxOutlined, FileExcelTwoTone } from "@ant-design/icons-vue";
import { IUrlObj } from "./index";

const BatchImportDialog = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onRefresh: {
      type: Function,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const urlObj = inject<IUrlObj>("urlObj")!;
    const isVisible = useVModel(props, "visible", emit);

    const fileList = ref<any[]>([]);

    const isLoding = ref(false);

    const handleUpload = async () => {
      isLoding.value = true;
      try {
        await batchUploadConfigure(urlObj.updateRule)(fileList.value[0]);
        message.success("导入成功");
        props.onRefresh?.();
        isVisible.value = false;
      } finally {
        isLoding.value = false;
      }
    };

    // 关闭后清空上传列表
    watch(isVisible, (val) => {
      if (!val) fileList.value = [];
    });

    return () => (
      <div class="batch-import-dialog">
        <a-modal
          title="批量导入"
          footer={null}
          v-model={[isVisible.value, "visible"]}
        >
          {/* 提示框 */}
          <a-alert showIcon type="warning">
            {{
              message: () => (
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#915B28" }}>
                    请先下载报警信息模板，修改后导入
                  </span>
                  <a
                    target="_BLANK"
                    href="/api/alarmlite/v1/rule/template/download"
                  >
                    下载模板
                  </a>
                </span>
              ),
            }}
          </a-alert>
          {/* 拖拽上传 */}
          <a-upload-dragger
            style={{ margin: "16px 0" }}
            showUploadList={false}
            beforeUpload={() => false}
            multiple={false}
            onChange={({ file }) => (fileList.value = [file])}
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            v-model={[fileList.value, "fileList"]}
          >
            {fileList.value.length ? (
              <>
                <p class="ant-upload-drag-icon">
                  <FileExcelTwoTone twoToneColor="#00C090" />
                </p>
                <p class="ant-upload-text">{fileList.value[0].name}</p>
                <p class="ant-upload-hint">
                  <a-button>重新上传</a-button>
                </p>
              </>
            ) : (
              <>
                <p class="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p class="ant-upload-hint">支持格式: xls/xlsx</p>
              </>
            )}
          </a-upload-dragger>
          <div class="operation" style={{ textAlign: "center" }}>
            <a-button
              class="btn-import"
              style={{ width: "300px" }}
              loading={isLoding.value}
              disabled={!fileList.value.length}
              type="primary"
              onClick={handleUpload}
            >
              批量导入
            </a-button>
          </div>
        </a-modal>
      </div>
    );
  },
});

export default BatchImportDialog;
