<script setup lang='ts'>
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '@/api/product/spu'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
import type { HasSpuResponseData, Records, SkuData, SkuInfoData, SpuData } from '@/api/product/spu/type'
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
let scene = ref<number>(0)
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let spu = ref<any>()
let sku = ref<any>()
let show = ref<boolean>(false)
// 存储全部的SKU数据
let skuArr = ref<SkuData[]>([])
// 存储spu数组
let records = ref<Records>([])
// 监听三级分类
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) {
        return
    }
    getHasSpu()
})

const getHasSpu = async (pager = 1) => {
    // 修改当前页码
    // pageNo.value = pager
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (result.code === 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}

const changeSize = (size: number) => {
    pageSize.value = size
    getHasSpu()
}

const addSpu = () => {
    scene.value = 1
    spu.value.initAddSpu(categoryStore.c3Id)
}


const updateSpu = (row: SpuData) => {
    scene.value = 1
    // console.log(row)
    spu.value.initHasSpuData(row)
}

// ... existing code ...

// 子组件SpuForm绑定自定义事件：目前是让子组件通知父组件切换场景为 0
const changeScene = (obj: any) => {
    // 子组件SpuForm点击取消变为场景 0
    scene.value = obj.flag
    if (obj.params === 'add') {
        // 添加跳转第一页
        getHasSpu()
    } else {
        // 更新留在当前页码
        getHasSpu(pageNo.value)
    }
}

// ... existing code ...

const addSku = (row: SpuData) => {
    scene.value = 2
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

const findSku = async (row: SpuData) => {
    let result = await reqSkuList(row.id as number)
    if (result.code === 200) {
        skuArr.value = result.data
        show.value = true
    }
}

const deleteSpu = async (id: number | string) => {
    let result = await reqRemoveSpu(id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasSpu(records.value.length > 0 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }

}

onBeforeUnmount(() => {
    // 销毁时清空数据
    categoryStore.$reset()
})
</script>
<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 10px 0;">
            <div v-show="scene == 0">
                <el-button type="primary" size="small" @click="addSpu"
                    :disabled="categoryStore.c3Id ? false : true">添加SPU</el-button>
                <el-table border style="margin: 10px 0;" :data="records">
                    <el-table-column label="序号" type="index" width="100px" align="center"> </el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"> </el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row, $index }">
                            <el-button type="primary" size="small" @click="addSku(row)" title="添加SKU"
                                icon="Plus"></el-button>
                            <el-button type="primary" size="small" @click="updateSpu(row)" title="修改SKU"
                                icon="Edit"></el-button>
                            <el-button type="primary" size="small" @click="findSku(row)" title="查看SKU列表"
                                icon="Search"></el-button>
                            <el-popconfirm title="确定删除吗？" @confirm="deleteSpu(row.id)" confirmButtonText=""
                                cancelButtonText="" confirmButtonType="primary" cancelButtonType="text"
                                icon="el-icon-question" iconColor="#f90" hideIcon="false">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器组件
        pagination
            v-model:currentPage：设置分页器当前页码
            v-model:page-size：每页展示数据的条数
            page-sizes：用于设置下拉菜单的数据
            size：分页器大小
            background：设置分页器按钮背景颜色
            layout：可以设置分页器六个子组件布局调整 
        -->
                <div class="demo-pagination-block">
                    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[1, 2, 4, 9]"
                        :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                        @current-change="getHasSpu" @size-change="changeSize"></el-pagination>
                </div>
            </div>
            <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
            <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="sku"></SkuForm>
            <el-dialog title="sku列表" v-model="show" >
                <el-table :data="skuArr" border>
                    <el-table-column label="sku名字" width="120" prop="skuName" />
                    <el-table-column label="sku价格" width="120" prop="price" />
                    <el-table-column label="sku重量" width="120" prop="weight" />
                    <el-table-column label="SKU图片">
                        <template #="{ row, $index }">
                            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

        </el-card>
    </div>
</template>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>