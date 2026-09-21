<script setup lang='ts'>
import { reqRemoveAttr } from '@/api/product/attr';
import { reqCancelSale, reqRemoveSku, reqSaleSku, reqSkuInfo, reqSkuList } from '@/api/product/sku';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const pageSize = ref(3);
const pageNo = ref(1);
const skuArr = ref([]);
const total = ref(0);
const drawer = ref(false);
let skuInfo = ref<any>({});
const getHasSku = async () => {
    let result = await reqSkuList(pageNo.value, pageSize.value);
    console.log(result);
    if (result.code === 200) {
        skuArr.value = result.data.records;
        total.value = result.data.total;
    }
}

const handler = (val: number) => {
    pageSize.value = val;
    getHasSku();
}

const removeSku = async (skuId: number) => {
    let result = await reqRemoveSku(skuId);
    console.log(result);
    if (result.code === 200) {
        getHasSku();
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
}

// 查看商品详情
const findSku = async (sku: any) => {
    drawer.value = true;
    let result = await reqSkuInfo(sku.id);
    skuInfo.value = result.data;
}

const updateSale = async (sku: any) => {
    if (sku.isSale == 1) {
        let result = await reqCancelSale(sku.id);
        if (result.code === 200) {
            ElMessage({
                type: 'success',
                message: '下架成功',
            })
            getHasSku();
        }
    } else {
        let result = await reqSaleSku(sku.id);
        if (result.code === 200) {
            ElMessage({
                type: 'success',
                message: '上架成功',
            })
            getHasSku();
        }
    }
}


onMounted(() => {
    getHasSku();
})

</script>
<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <el-table border stripe :data="skuArr">
            <el-table-column type="index" width="120" label="序号" align="center" />
            <el-table-column label="名称" width="120" prop="skuName" />
            <el-table-column label="描述" width="120" prop="skuDesc" />
            <el-table-column label="图片" width="120" prop="skuDefaultImg">
                <template #default="{ row, $index }">
                    <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" width="120" prop="weight" />
            <el-table-column label="价格" width="120" prop="price" />
            <el-table-column label="操作">
                <template #default="{ row, $index }">
                    <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
                        @click="updateSale(row)"></el-button>
                    <el-button @click="" icon="Filter" type="primary" size="small"></el-button>
                    <el-button @click="findSku(row)" icon="InfoFilled" type="primary" size="small"></el-button>
                    <el-popconfirm title="确定删除吗？" confirmButtonText="确定" cancelButtonText="取消"
                        confirmButtonType="primary" cancelButtonType="text" icon="el-icon-question" iconColor="#f90"
                        @confirm="removeSku(row.id)">
                        <template #reference>
                            <el-button icon="Delete" type="primary" size="small"></el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 10px;">
            <el-pagination :page-sizes="[1, 2, 3, 5]" :background="true" v-model:page-size="pageSize"
                v-model:current-page="pageNo" @current-change="getHasSku" @size-change="handler"
                layout="prev, pager, next, jumper, ->, sizes, total" :total="total"></el-pagination>
        </div>
        <el-drawer v-model="drawer">
            <!-- 标题部分 -->
            <template #header>
                <h4>查看商品的详情</h4>
            </template>
            <template #default>
                <el-row style="margin:10px 0px;">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin:10px 0px;">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin:10px 0px;">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row style="margin:10px 0px;">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag style="margin:5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{
                            item.valueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0px;">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18">
                        <el-tag style="margin:5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
                            item.saleAttrValueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0px;">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" alt="" style="width:100%;height: 100%;">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>

    </el-card>
</template>
<style scoped lang='scss'></style>