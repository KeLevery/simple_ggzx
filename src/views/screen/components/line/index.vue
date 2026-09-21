<template>
  <div class="line-box">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script lang="ts" setup name="Line">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
// 获取图形图表的节点
let charts = ref()

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 设置配置项
  mycharts.setOption({
    xAxis: {
      // 分割线
      splitLine: {
        show: false,
      },
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 两侧不留白
      boundaryGap: 0,
    },
    yAxis: {
      // 分割线
      splitLine: {
        show: false,
      },
    },
    grid: {
      left: 40,
      top: 0,
      right: 0,
      bottom: 20,
    },
    series: [
      {
        type: 'line',
        data: [1, 90, 15, 80, 18, 110, 1],
        // 平滑曲线
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'skyblue'
              },
              {
                offset: 1,
                color: 'blue'
              }
            ],
          }
        }
      }
    ]
  })
})
</script>
<style scoped lang="scss">
.line-box {
  width: 96%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;
  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 17px;
    }
  }

  .charts {
    width: 100%;
    height: calc(100% - 40px);
    // background: red;
  }
}
</style>
