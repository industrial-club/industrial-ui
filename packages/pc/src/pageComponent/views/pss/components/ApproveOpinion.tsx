import { defineComponent, onMounted, reactive } from "vue";
import useVModel from "@/pageComponent/hooks/useVModel";

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      default: "",
    },
    isAgree: {
      type: Boolean,
      default: true,
    },
    showOpinion: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      default: "",
    },
  },

  emits: [
    "update:showOpinion",
    "update:comment",
    "toProcessApproval",
    "toProcessAttempt",
    "toOverhaulStop",
    "toProcessApproval_Batch",
  ],

  setup(props, context) {
    const isComment = useVModel(props, "comment", context.emit);

    onMounted(() => {});

    const close = () => {
      context.emit("update:showOpinion", false);
      isComment.value = "";
    };

    return () => (
      <div class="ApproveOpinion">
        <a-modal
          v-model={[props.showOpinion, "visible"]}
          title={props.detail.taskName}
          wrapClassName="ApproveOpinionModal"
          onCancel={close}
          v-slots={{
            footer: () => (
              <div class="modal_footer">
                <a-button onClick={close}>取消</a-button>

                {/* 停电审批 Approval_stop */}
                {props.detail.taskDefKey === "Approval_stop" &&
                  (props.isAgree ? (
                    <a-button
                      type="primary"
                      onClick={() => {
                        context.emit("toProcessApproval");
                      }}
                    >
                      确认同意
                    </a-button>
                  ) : (
                    <a-button
                      type="primary"
                      class="red"
                      onClick={() => {
                        context.emit("toProcessApproval");
                      }}
                    >
                      确认拒绝
                    </a-button>
                  ))}
                {/* 停电审批 Approval_stop */}

                {/* 停电试车 Attempt_stop、停电检修 Overhaul_stop、送电试车 Attempt_supply */}
                {(props.detail.taskDefKey === "Attempt_stop" ||
                  props.detail.taskDefKey === "Overhaul_stop" ||
                  props.detail.taskDefKey === "Attempt_supply") && (
                  <a-button
                    type="primary"
                    onClick={() => {
                      // 停电试车 Attempt_stop、送电试车 Attempt_supply
                      if (
                        props.detail.taskDefKey === "Attempt_stop" ||
                        props.detail.taskDefKey === "Attempt_supply"
                      ) {
                        context.emit("toProcessAttempt");
                      }
                      // 停电检修
                      if (props.detail.taskDefKey === "Overhaul_stop") {
                        context.emit("toOverhaulStop");
                      }
                    }}
                  >
                    确认{props.detail.taskName}
                  </a-button>
                )}
                {/* 停电试车 Attempt_stop、停电检修 Overhaul_stop */}

                {/* 送电审批 Approval_supply */}
                {props.detail.taskDefKey === "Approval_supply" &&
                  (props.isAgree ? (
                    <a-button
                      type="primary"
                      onClick={() => {
                        context.emit("toProcessApproval");
                      }}
                    >
                      确认同意
                    </a-button>
                  ) : (
                    <a-button
                      type="primary"
                      class="yellow"
                      onClick={() => {
                        context.emit("toProcessApproval");
                      }}
                    >
                      确认驳回
                    </a-button>
                  ))}
                {/* 送电审批 Approval_supply */}

                {/* 批量审批 Approval_stop */}
                {props.detail.taskDefKey === "batch" &&
                  (props.isAgree ? (
                    <a-button
                      type="primary"
                      onClick={() => {
                        context.emit("toProcessApproval_Batch");
                      }}
                    >
                      确认同意
                    </a-button>
                  ) : (
                    <a-button
                      type="primary"
                      class="red"
                      onClick={() => {
                        context.emit("toProcessApproval_Batch");
                      }}
                    >
                      确认拒绝
                    </a-button>
                  ))}
                {/* 停电审批 Approval_stop */}
              </div>
            ),
          }}
        >
          <div class="pageContent">
            <div>{props.label} </div>

            <a-textarea
              v-model={[isComment.value, "value"]}
              rows={4}
              show-count
              maxlength={100}
              placeholder="请填写"
            />
          </div>
        </a-modal>
      </div>
    );
  },
});
