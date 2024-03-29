import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { cloneDeep } from "lodash";
import { Chart } from "@antv/g2";
import { getAlarmTypeMap, getVideo } from "@/api/alarm/alarmRecord";
import { getVideoBaseUrl } from "@/api/alarm/alarmRecord";
import { IUrlObj } from "../warning-record";
import utils from "@/utils";

const AlarmDetail = defineComponent({
  props: {
    record: {
      type: Object,
    },
    onClose: {
      type: Function,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const urlObj = inject<IUrlObj>("urlObj")!;

    const back = () => {
      props.onClose?.();
    };

    const alarmDetail = ref<any>(cloneDeep(props.record));

    // 获取视频
    const videoBaseUrl = ref("");
    const getVideoUrl = async () => {
      videoBaseUrl.value = await getVideoBaseUrl(urlObj?.videoBaseUrl)();
    };
    getVideoUrl();
    const videoList = ref<string[]>([]);
    const getAlarmVideo = async () => {
      const { data } = await getVideo(urlObj?.getVideo)(
        alarmDetail.value.id,
        alarmDetail.value.instanceUuid
      );
      videoList.value = Object.values(data).map(
        (item: any) => item.relatedPath
      );
    };
    getAlarmVideo();

    // 图片
    const imageUrlList = ref([]);
    if (
      alarmDetail.value.imageUrlList &&
      alarmDetail.value.imageUrlList.length
    ) {
      imageUrlList.value = alarmDetail.value.imageUrlList.map(
        (item: string) => "/vms" + item
      );
    }

    // 图表
    const chartData = ref([]);
    const chartRef = ref();
    const chartIns = ref<Chart>();
    const renderChart = async () => {
      chartIns.value = new Chart({
        container: chartRef.value,
        width: 600,
        height: 300,
      });
      chartIns.value.coordinate().transpose().scale(1, -1);
      chartIns.value.scale("range", {
        type: "time",
        nice: true,
        mask: "YYYY-MM-DD HH:mm:ss",
        alias: "起始时间",
      });
      chartIns.value.tooltip({
        showMarkers: false,
      });
      chartIns.value.coordinate().transpose().scale(1, -1);
      chartIns.value.legend(false);
      chartIns.value
        .interval()
        .position("level*range")
        .color("level*levelColor", (level: string, levelColor: number) => {
          console.log(levelColor);

          const colorList = ["#EA5858", "#FF9214", "#FFC414", "#3E7EFF"];

          return colorList[levelColor];
        })
        .animate({
          appear: {
            animation: "scale-in-x",
          },
        });
      chartData.value = alarmDetail.value.alarmLifecycleList.map(
        (item: any) => {
          if (!item.endTime) {
            item.endTime = Date.now();
          }
          let level;
          switch (item.alarmLevel) {
            case 1:
              level = "一级报警";
              break;
            case 2:
              level = "二级报警";
              break;
            case 3:
              level = "三级报警";
              break;
            case 4:
              level = "四级报警";
              break;

            default:
              break;
          }
          return {
            level,
            levelColor: item.alarmLevel - 1,
            range: [item.startTime, item.endTime],
          };
        }
      );

      chartIns.value.data(chartData.value);
      chartIns.value.render();
    };
    onMounted(() => {
      if (
        alarmDetail.value.alarmLifecycleList &&
        alarmDetail.value.alarmLifecycleList.length
      ) {
        renderChart();
      }
    });

    // 报警类型
    const alarmTypeList = ref<any[]>([]);
    getAlarmTypeMap(urlObj?.alarmTypeList)().then(({ data }) => {
      alarmTypeList.value = data;
    });
    const alarmType = computed(() => {
      if (!alarmDetail.value.type) {
        return "-";
      }
      const type = alarmTypeList.value.find(
        (item) => item.code === alarmDetail.value.type
      );
      return type ? type.name : "-";
    });

    return () => (
      <div class="alarmDetail">
        {/* 页头 */}
        {props.showHeader && (
          <a-page-header
            style={{ padding: 0 }}
            title="报警详情"
            onBack={back}
          />
        )}
        {/* 详情  描述列表*/}
        <a-descriptions
          labelStyle={{ width: "120px", textAlign: "right" }}
          column={2}
        >
          <a-descriptions-item label="报警名称">
            {alarmDetail.value.name}
          </a-descriptions-item>
          <a-descriptions-item label="关联设备">
            {alarmDetail.value.alarmSource}
          </a-descriptions-item>
          <a-descriptions-item label="报警时间">
            {alarmDetail.value.firstAlarmTime
              ? moment(alarmDetail.value.firstAlarmTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"}
          </a-descriptions-item>
          <a-descriptions-item label="消警时间">
            {alarmDetail.value.releaseTime
              ? moment(alarmDetail.value.releaseTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"}
          </a-descriptions-item>
          <a-descriptions-item label="报警类型">
            {alarmType.value}
          </a-descriptions-item>
          <a-descriptions-item label="报警详情">
            {alarmDetail.value.content}
          </a-descriptions-item>
          <a-descriptions-item label="报警规则">
            {alarmDetail.value.ruleName}
          </a-descriptions-item>
          <a-descriptions-item label="报警时数据" span={2}>
            {alarmDetail.value.contentParams}
          </a-descriptions-item>

          <a-descriptions-item label="报警时刻图片" span={2}>
            <a-image-preview-group>
              {imageUrlList.value.length ? (
                imageUrlList.value.map((item) => (
                  <a-image width={300} src={item} />
                ))
              ) : (
                <a-empty description="暂无图片" />
              )}
            </a-image-preview-group>
          </a-descriptions-item>
          <a-descriptions-item label="报警视频" span={2}>
            {videoList.value.length && videoBaseUrl.value ? (
              <a-space size={16}>
                {videoList.value.map((item) => (
                  <video
                    style={{ width: "500px" }}
                    key={videoBaseUrl.value + item}
                    autoplay
                    muted
                    controls
                    loop
                    src={videoBaseUrl.value + item}
                  ></video>
                ))}
              </a-space>
            ) : (
              <a-empty description="暂无视频" />
            )}
          </a-descriptions-item>
          <a-descriptions-item
            label="报警生命周期"
            span={2}
          ></a-descriptions-item>
          <a-descriptions-item contentStyle={{ margin: "16px" }}>
            {alarmDetail.value?.alarmLifecycleList?.length ? (
              <div ref={chartRef}></div>
            ) : (
              <a-empty description="暂无生命周期" />
            )}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    );
  },
});

export default utils.installComponent(AlarmDetail, "alarm-detail") as any;
