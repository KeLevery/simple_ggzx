<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="tabbar_right">
            <Setting></Setting>
        </div>
    </div>
</template>
<script lang="ts" setup name="Tabbar">
import Breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Setting from '@/layout/tabbar/setting/index.vue'
</script>
<script lang="ts">
export default {
    name: "Tabbar"
}
</script>
<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    border-bottom: solid 1px;

    .tabbar_left {
        display: flex;
        align-items: center;
        margin-left: 10px;
    }

    .tabbar_right {
        display: flex;
        align-items: center;
        margin-right: 10px;
    }
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>
