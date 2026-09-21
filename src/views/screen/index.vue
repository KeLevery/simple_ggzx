<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'

import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

// 引入右侧三子组件
import Rank from './components/rank/index.vue'
import Counter from './components/counter/index.vue'
import Year from './components/year/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
let screen = ref()

onMounted(() => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

// 定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
    const ww = window.innerWidth / w
    const wh = window.innerHeight / h

    return ww < wh ? ww : wh
}

// 监听视口的变化
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
</script>
<template>
    <div class="container">
        <!-- 数据大屏展示内容区域 -->
        <div class="screen" ref="screen">
            <!-- 数据大屏顶部 -->
            <div class="top">
                <Top></Top>
            </div>
            <div class="bottom">
                <div class="left">
                    <Tourist></Tourist>
                    <Sex></Sex>
                    <Age></Age>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <Line class="line"></Line>
                </div>
                <div class="right">
                    <Rank class="rank"></Rank>
                    <Year class="year"></Year>
                    <Counter class="counter"></Counter>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.container {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;

    .screen {
        position: fixed;
        width: 1920px;
        height: 1080px;
        left: 50%;
        top: 50%;
        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .bottom {
            display: flex;

            .left {
                flex: 1.2;
                height: 1040px;
                display: flex;
                flex-direction: column;
            }

            .center {
                flex: 2;
                display: flex;
                flex-direction: column;

                .map {
                    flex: 3;
                    // background: red;
                }

                .line {
                    flex: 1;
                }
            }
        }

        .right {
            flex: 1.2;
            display: flex;
            flex-direction: column;

            .rank {
                flex: 1.5;
            }

            .year {
                flex: 1;
            }

            .counter {
                flex: 1;
            }
        }
    }
}
</style>
