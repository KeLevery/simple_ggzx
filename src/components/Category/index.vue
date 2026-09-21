<script setup lang='ts'>
// 引入分类接口方法
import { reqC1 } from '@/api/product/attr';
// 引入使命周期函数钩子
import { onMounted, ref } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category';
const c1Id = ref('')

const categoryStore = useCategoryStore()
onMounted(() => {
    // 获取一级分类
    getC1()
})

// 通知仓库获取一级分类的方法
const getC1 = async () => {
    categoryStore.getC1()
}

const handle1:any = async ()=>{
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Arr = []
    await categoryStore.getC2()
}

const handle2:any = async ()=>{
    categoryStore.c3Id = ''
    await categoryStore.getC3()
}

const handle3:any = async ()=>{

}

// 接受父组件
defineProps(['scene'])
</script>
<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <el-form-item label="一級分類">
                    <el-select :disabled="scene==0 ? false : true" style="width: 200px;" v-model="categoryStore.c1Id" @change="handle1">
                        <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="index" :label="c1.name"
                            :value="c1.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二級分類">
                    <el-select :disabled="scene==0 ? false : true" style="width: 200px;" v-model="categoryStore.c2Id" @change="handle2">
                        <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="index" :label="c2.name"
                            :value="c2.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三級分類">
                    <el-select :disabled="scene==0 ? false : true" style="width: 200px;" v-model="categoryStore.c3Id" @change="">
                        <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="index" :label="c3.name"
                            :value="c3.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<style scoped lang='scss'></style>