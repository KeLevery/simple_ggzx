<script setup lang='ts'>
import Logo from "@/layout/logo/index.vue";
import Menu from "@/layout/menu/index.vue";
import useUserStore from "@/store/modules/user";
import Tabbar from "@/layout/tabbar/index.vue";
import Main from "@/layout/main/index.vue";
import useLayoutSettingStore from '@/store/modules/setting'
// 获取路由对象
import { useRoute } from 'vue-router';
const $route = useRoute();
// 获取用户相关的小仓库
let userStore = useUserStore();
// 获取小仓库
let layoutSettingStore = useLayoutSettingStore();

</script>

<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" >
            <Logo></Logo>
            <!-- 展示菜单 -->
            <!-- 滚动组件 -->
            <el-scrollbar class="scrollbar">
                <!-- 保证递归时，不会反复调用el-menu组件，保证菜单缩进正常 -->
                <el-menu :collapse="layoutSettingStore.fold ? true : false" :default-active="$route.path" background-color="#001529" text-color="white">
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold ? true : false }">
            <Tabbar></Tabbar>
        </div>
        <!-- 内容展示区域 -->
        <div class="layout_main" :class="{ fold: layoutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "Layout"
}
</script>
<style scoped lang='scss'>
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        color: white;
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);

            .el-menu {
                border-right: none;
            }
        }

        &.fold {
            width: $base-menu-min-width;
        }
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;

        &.fold {
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;

        &.fold {
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>