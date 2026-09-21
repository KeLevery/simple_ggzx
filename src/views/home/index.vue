<script setup lang='ts'>
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time';
const userStore = useUserStore()
const time = getTime()
</script>
<template>
    <div>
        <el-card>
            <div style="display: flex;">
                <img :src="userStore.avatar" alt=""
                    style="width: 100px;height: 100px;border-radius: 50%;margin-right: 2%;" />
                <div>
                    <h3 style="font-size: 28px;font-weight: 800;">{{ time }}{{ userStore.username }}</h3>
                    <p style="margin-top: 15px;font-style: italic;color: skyblue;">极智云商综合运营管理系统</p>
                </div>
            </div>
        </el-card>
        <div style="display: flex;justify-content: center;">
            <SvgIcon name="welcome" width="600px" height="500px"></SvgIcon>
        </div>
    </div>
</template>
<style scoped lang='scss'></style>