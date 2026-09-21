<script setup lang='ts'>
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
// 获取父组件传递过来的全部路由组件
const props = defineProps(['menuList'])
// defineProps(['menuList'])


const $router = useRouter()
const goRoute = (vc: any) => {
    // 路由跳转
    console.log(vc.index)
    $router.push(vc.index)
};


</script>
<template>
    <template v-for="item in menuList" :key="item.path">
        <!-- 没有子路由 -->
        <template v-if="!item.children">
            <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title> <span>{{ item.meta.title }}</span> </template>
            </el-menu-item>
        </template>
        <!-- 有子路由但是只有一个子路由 -->
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path" @click="goRoute">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title> <span>{{ item.children[0].meta.title }}</span> </template>
            </el-menu-item>
        </template>
        <!-- 有子路由且个数大于一个 -->
        <template v-if="item.children && item.children.length > 1">
            <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <!-- 递归本组件 -->
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
    </template>
</template>
<script lang="ts">
// 此处为vue2语法，为命名组件方便调用
export default {
    name: 'Menu'
}
</script>
<style scoped lang='scss'></style>