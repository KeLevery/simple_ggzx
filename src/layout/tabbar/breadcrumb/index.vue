<template>
    <!-- 顶部左侧静态 -->
    <el-icon style="margin-right: 10px" @click="changeIcon">
        <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight" >
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span  style="margin: 0 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script lang="ts" setup name="Bradcrumb">
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'
let layoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
    layoutSettingStore.fold = !layoutSettingStore.fold
}

// 引入路由
import { useRoute } from 'vue-router'
let $route = useRoute()
</script>
<script lang="ts">
export default {
    name: "Breadcrumb"
}
</script>
<style scoped></style>
