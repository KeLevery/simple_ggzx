<script setup lang='ts'>
import { reactive, ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
const attrArr = ref<Attr[]>([]);
// 定义card组件内容切换变量
let scene = ref<number>(0);
// 准备一个数组：将来存储对应的组件实例el-input
const inputArr = ref<any>([])

// 收集新增的属性的数据
let attrParams = reactive<Attr>({
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
})



// 监听仓库三级分类id变化 
watch(() => categoryStore.c3Id, () => {
    // 保证三级分类得有
    if (!categoryStore.c3Id) {
        attrArr.value = []
        return
    }
    // 获取分类id
    getArr()
})


const getArr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore;
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    console.log(result);
    if (result.code === 200) {
        attrArr.value = result.data
    }
}
// 添加属性按钮的回调
const addAttr = () => {
    // 每一次点击的时候，先清空一下数据再收集数据
    Object.assign(attrParams, {
        attrName: '', // 新增的属性的名字
        attrValueList: [
            // 新增的属性值数组
        ],
        categoryId: categoryStore.c3Id, // 三级分类ID
        categoryLevel: 3, // 代表的是三级分类
    })
    // 切换为添加与修改属性的结构
    scene.value = 1
}
// table表格修改已有属性按钮的回调
const updateAttr = (row: any) => {
    scene.value = 1
    // 解决浅拷贝问题
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消按钮的回调
const cancel = () => {
    scene.value = 0
}

// 添加属性周按钮的回调
const addAttrValue = () => {
    // 点击添加属性值按钮的时候，向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName: '',
        flag: true, //控制每一个属性值编辑模式与展示模式的切换
    })
    // 获取最后el-input组件进行聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}

// 保存按钮的回调
const save = async () => {
    // 发请求
    const result: any = await reqAddOrUpdateAttr(attrParams)
    // 添加属性｜修改已有的属性已经成功
    if (result.code === 200) {
        // 切换场景
        scene.value = 0
        // 提示信息
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功',
        })
        // 获取全部已有的属性雨属性值
        getArr()
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败',
        })
    }
}

// 属性值表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
    // 非法情况判断1
    if (row.valueName.trim() === '') {
        // 删除调用对应属性为空的元素
        attrParams.attrValueList.splice($index, 1)
        // 提示信息
        ElMessage({
            type: 'error',
            message: '属性值不能为空',
        })
        return
    }

    // 非法情况判断2
    let repeat = attrParams.attrValueList.find((item) => {
        // 切记把当前失去焦点属性值对象从当前数组中排除
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        // 删除重复对象
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能重复',
        })
        return
    }

    // 相应的属性值对象flag变为false，展示div
    row.flag = false
}

// 属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
    // 相应的属性值对象flag变为true，展示input
    row.flag = true

    // nextTick：响应式数据发生变化，获取更新DOM（组件实例）
    nextTick(() => {
        console.log(inputArr.value[$index])
        inputArr.value[$index].focus()
    })
}

// 删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
    const result: any = await reqRemoveAttr(attrId)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        // 获取一次已有的属性与属性值
        getArr()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
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
        <!-- 三级分类全局组件 -->
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0;">
            <div v-show="scene == 0">
                <el-button @click="addAttr" type="primary" size="default" icon="Plus"
                    :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
                <el-table border style="margin: 10px 0;" :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                    <el-table-column label="属性名称" width="120" prop="attrName">
                    </el-table-column>
                    <el-table-column label="属性值" prop="attrValueList">
                        <template #="{ row, $index }">
                            <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)">修改</el-button>
                            <!-- <el-button type="danger" size="small" icon="Delete"
                                @click="deleteAttr(row.id)">删除</el-button> -->
                            <el-popconfirm :title="`确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene == 1">
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" size="default" @click="addAttrValue" icon="Plus"
                    :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-input :ref="(vc: any) => (inputArr[$index] = vc)" v-if="row.flag"
                                @blur="toLook(row, $index)" placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
                            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{ row, $index }">
                            <el-button type="danger" size="small" icon="Delete"
                                @click="attrParams.attrValueList.splice($index, 1)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" size="default" @click="save" icon="Plus"
                    :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>
<style scoped lang='scss'></style>