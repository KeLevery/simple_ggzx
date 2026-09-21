<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'
import chinaJson from './china.json'
let map = ref()
echarts.registerMap('china', chinaJson as any)
onMounted(() => {
    let mychart = echarts.init(map.value)
    mychart.setOption({
        geo: {
            map: 'china',
            roam: true, // 鼠标缩放效果
            left: 10,
            top: 100,
            right: 50,
            Bottom: 50,
            // 地图上文字设置
            label: {
                show: true, // 显示文字
                color: 'white',
                // fontSize: 14,
            },
            itemStyle: {
                // 每一个多边形的样式
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'blue', // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'skyblue', // 100% 处的颜色
                        },
                    ],
                    global: false, // 缺省为 false
                },
                opacity: 0.8,
            },

            // 地图高亮效果
            emphasis: {
                itemStyle: {
                    color: 'red',
                },
                label: {
                    fontSize: 40,
                },
            },
        },
        // 布局位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
        series: [
            {
                type: 'lines',
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989], // 起点
                            [91.132212, 29.660361], // 终点
                        ],
                        // 统一样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 2,
                        },
                    },
                    {
                        coords: [
                            [116.405285, 39.904989], // 起点
                            [87.617733, 43.792818], // 终点
                        ],
                        // 统一样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5,
                        },
                    },
                ],
                // 是否显示特效
                effect: {
                    show: true,
                    symbol:
                        'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                    color: 'red',
                    symbolSize: 15,
                    trailLength: 0,
                    period: 6,
                },
                lineStyle: {
                    color: '#fff',
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2,
                },
            },
        ],
    })
})
</script>
<template>
    <div class="map-box" ref="map">

    </div>
</template>
<style scoped lang='scss'>
.map-box {
    width: 100%;
    height: 100%;
}
</style>