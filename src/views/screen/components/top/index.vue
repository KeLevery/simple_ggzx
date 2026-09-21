<script setup lang='ts'>
import moment from 'moment';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const goHome = () => {
    window.location.href = '/';
}

let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
let timer = ref(0)

// 组件挂载完毕更新当前的时间
onMounted(() => {
    timer.value = setInterval(() => {
        time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
    }, 1000)
})
// 销毁定时器
onBeforeUnmount(() => {
    clearInterval(timer.value)
})

</script>
<template>
    <div class="box">
        <div class="left">
            <span class="lbtn" @click="goHome">首页</span>
        </div>
        <div class="center">
            <div class="title">智慧旅游可视化大数据展示平台</div>
        </div>
        <div class="right">
            <div class="rbtn" @click="goHome">退出</div>
            <span class="time">当前时间：{{ time }}</span>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.box {
    display: flex;
    width: 100%;
    height: 100%;

    .left {
        flex: 1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;

        .lbtn {
            width: 130px;
            height: 40px;
            float: right;
            background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 40px;
            color: #29fcff;
            font-size: 20px;
            cursor: pointer;
        }
    }

    .center {
        flex: 2;
        background: url();

        .title {
            width: 100%;
            height: 74px;
            font-size: 30px;
            text-align: center;
            line-height: 74px;
            background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }


    .right {
        flex: 1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .rbtn {
            width: 130px;
            height: 40px;
            float: left;
            background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 40px;
            color: #29fcff;
            font-size: 20px;
            cursor: pointer;
        }

        .time {
            color: #29fcff;
            margin-right: 10px;
            font-size: 20px;
        }
    }

}
</style>