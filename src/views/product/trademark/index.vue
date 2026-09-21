<script setup lang='ts'>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark/index'
import type { Records, TradeMarkResponseData, Trademark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const limit = ref<number>(3);
let total = ref<number>(0)
const trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<Trademark>({
    id: undefined,
    tmName: '',
    logoUrl: ''
})

// el-upload 上传 http 请求头，携带 Token 
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
import { el } from 'element-plus/es/locales.mjs'
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }
// 获取 el-form 组件实例
let formRef = ref()
// 获取数据
const getHasTrademark = async () => {
    const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (result.code === 200) {
        total.value = result.data.total
        trademarkArr.value = result.data.records
    } else {
        console.error('获取数据失败', result.message)
    }
}
onMounted(() => {
    getHasTrademark()
})

const addTrademark = () => {
    // 重置表单
    // trademarkParams.tmName = ''
    // trademarkParams.logoUrl = ''
    // trademarkParams.id = undefined
    Object.assign(trademarkParams, { tmName: '', logoUrl: '', id: undefined })
    // 方法1
    formRef.value?.resetFields()
    // 方法2
    // nextTick(() => {
    //     formRef.value.clearValidate()
    // })
    dialogFormVisible.value = true
}

const updateTrademark = (row: Trademark) => {
    dialogFormVisible.value = true
    nextTick(() => {
        formRef.value.clearValidate()
    })
    // 方法一
    // trademarkParams = { tmName: row.tmName, logoUrl: row.logoUrl, id: row.id }
    // 方法二
    Object.assign(trademarkParams, row)
}

// 品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
    // 自定义校验规则
    if (value.trim().length >= 2) {
        callBack()
    } else {
        // 校验未通过返回的错误提示信息
        callBack(new Error('品牌名称位数小于两位'))
    }
}
// 品牌LOGO图片的自定义校验规则
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    // 如果图片上传
    if (value) {
        callBack()
    } else {
        callBack(new Error('LOGO图片务必上传'))
    }
}

// 表单校验规则对象
const rules = {
    tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
    logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}

const confirm = async () => {
    // 表单校验
    await formRef.value.validate() // 调用这个方法进行表单校验，如果校验全部通过，再执行后续的代码
    let result: any = await reqAddOrUpdateTrademark(trademarkParams)
    // 添加成功 || 修改成功
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
        })
        dialogFormVisible.value = false
        // 重新获取数据
        getHasTrademark()
    } else {
        ElMessage({
            type: 'error',
            message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
        })
    }
    dialogFormVisible.value = false
}

// 上传图片组件 -> 上传图片成功以后触发的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    // response:即为当前这次上传图片post请求服务器返回的数据
    // 收集上传图片地址，添加一个新的品牌时候带给服务器
    trademarkParams.logoUrl = response.data
    ElMessage.success('上传成功')
    formRef.value.clearValidate('logoUrl')
}

// 上传图片组件 -> 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 要求：上传文件格式 png|jpg|gif 4M
    if (
        rawFile.type === 'image/png' ||
        rawFile.type === 'image/jpeg' ||
        rawFile.type === 'image/gif'
    ) {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件大小必须小于 4M',
            })
            return false
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传的文件类型需要为：png、jpg、gif',
        })
        return false
    }
}

const removeTrademark = async (id: number) => {
    let result = await reqDeleteTrademark(id)
    if (result.code === 200) {
        ElMessage.success('删除品牌成功')
        // 重新获取数据
        getHasTrademark()
    } else {
        ElMessage.error('删除品牌失败')
    }
}
</script>
<template>
    <div>
        <el-card>
            <el-button type="primary" size="default" @click="addTrademark" 
            icon="Plus" v-has="`btn.Trademark.add`">添加品牌</el-button>
            <!-- 表格组件，展示数据 -->
            <!-- 
        table
        ---border：可以设置表格纵向是否有边框
        table-column
        ---label: 某一列的表头
        ---width：这一这列的宽度
        ---align：这一列文本对其方式
        -->
            <el-table style="margin: 10px 0;" border :data="trademarkArr">
                <el-table-column label="序号" width="80px" align="center" type="index">
                </el-table-column>
                <!-- <el-table-column label="自定义列的品牌名称">
                <template #="{ row, $index }">
                    <pre>{{ row.tmName }}</pre>
                </template>
</el-table-column> -->
                <el-table-column label="品牌名称" prop="tmName">
                </el-table-column>
                <!-- 自定义列 -->
                <el-table-column>
                    <template #="{ row, $index }">
                        <img :src="row.logoUrl" alt="" style="width: 50px; height: 50px;" />
                    </template>
                </el-table-column>
                <!-- 自定义列 -->
                <el-table-column>
                    <template #="{ row, $index }">
                        <el-button type="primary" size="default" @click="updateTrademark(row)"
                            icon="Edit">编辑</el-button>
                        <el-popconfirm :title="`确定删除${row.tmName}？`" width="auto" icon="Delete"
                            @confirm="removeTrademark(row.id)">
                            <template #reference>
                                <el-button type="primary" size="default" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm> </template>
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
                <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[1, 3, 5, 7]"
                    @current-change="getHasTrademark" @size-change="getHasTrademark" :background="true"
                    layout=" prev, pager, next, jumper,->,sizes,total" :total="total" />
            </div>
        </el-card>
        <el-dialog :title="trademarkParams.id ? '修改品牌' : '添加品牌'" v-model="dialogFormVisible" width="500">
            <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirm">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang='scss'>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

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