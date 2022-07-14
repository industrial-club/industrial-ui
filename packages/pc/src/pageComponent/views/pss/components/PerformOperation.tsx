import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";

import pssApi from "@/api/pss";

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    showPerform: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:showPerform", "toExecuteStop", "toExecuteSupply"],

  setup(props, context) {
    const close = () => {
      context.emit("update:showPerform", false);
    };

    const loopList = ref([]);

    const getData = async () => {
      const loopIds = props.detail.loops.map((lo: any) => lo.id);

      const resp: any = await pssApi.processPreExecute({
        loopIds,
        processTaskDefKey: props.detail.taskDefKey,
      });

      if (resp.code === "error") {
        message.error(resp.message);
        return false;
      }
      loopList.value = resp.data;
    };

    watch(
      () => props.showPerform,
      (nval, oval) => {
        if (nval) {
          getData();
        }
      }
    );

    return () => (
      <div class="PerformOperation">
        <a-modal
          v-model={[props.showPerform, "visible"]}
          title={`${props.detail.taskName}操作`}
          wrapClassName="PerformOperationModal"
          onCancel={close}
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <a-button
                  type="primary"
                  onClick={() => {
                    // 停电执行 Execute_stop
                    if (props.detail.taskDefKey === "Execute_stop") {
                      context.emit("toExecuteStop");
                    }
                    // 送电执行 Execute_supply
                    if (props.detail.taskDefKey === "Execute_supply") {
                      context.emit("toExecuteSupply");
                    }
                  }}
                >
                  确认{props.detail.taskName}
                </a-button>

                <a-button onClick={close}>取消</a-button>
              </div>
            ),
          }}
        >
          <div class="pageContent">
            <div class="line">请再次确认您的{props.detail.taskName}操作：</div>
            <div class="line title">
              {props.detail.equipId}-{props.detail.equipName}
            </div>
            <div class="line titleLine">
              <div class="name">控制回路</div>
              <div class="value">执行操作</div>
            </div>
            {loopList.value.map((loop: any) => (
              <div class="line" key={loop.loopId}>
                <div class="name">{loop.loopName}</div>
                <div class="value">{loop.lockCount}</div>
              </div>
            ))}
          </div>
        </a-modal>
      </div>
    );
  },
});
