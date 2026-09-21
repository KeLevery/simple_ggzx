<script setup lang='ts'>
import { reqAddOrUpdateMenu, reqAllPermisson, reqRemoveMenu } from '@/api/acl/menu';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';


const tableData = ref<any[]>([])
// 控制dialog
const dialog = ref(false)
// 携带的参数
let menuData = reactive<any>({
    code: '',
    level: 0,
    name: '',
    pid: 0,
})
const getData = async () => {
    const result = await reqAllPermisson()
    tableData.value = result.data
    console.log(result.data)
}

// 打开菜单
const addPermission = (row: any) => {
    dialog.value = true
    Object.assign(menuData, {
        id: 0,
        code: '',
        level: 0,
        name: '',
        pid: 0,
    })
    // 收集新增菜单的level数值
    menuData.level = row.level + 1
    // 新增的子菜单
    menuData.pid = row.id
}

// 修改菜单
const updatePermission = (row: any) => {
    dialog.value = true
    Object.assign(menuData, {
        id: row.id,
        code: row.code,
        level: row.level,
        name: row.name,
        pid: row.pid,
    })
}

// 添加或者修改菜单
const save = async () => {
    const result = await reqAddOrUpdateMenu(menuData)
    if (result.code == 200) {
        getData()
        dialog.value = false
        // 提示信息
        ElMessage({
            type: 'success',
            message: menuData.id ? '更新成功' : '添加成功',
        })
    }
}

// 删除菜单
const removeMenu = async (id: number) => {
    const result = await reqRemoveMenu(id)
    if (result.code == 200) {
        getData()
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
    }
}

onMounted(() => {
    getData()
})
</script>
<template>
    <div>
        <el-table :data="tableData" border row-key="id">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="权限值" prop="code"></el-table-column>
            <el-table-column label="修改时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作">
                <!-- row：即为已有的菜单对象｜按钮对象的数据 -->
                <template v-slot="{ row }">
                    <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false"
                        @click="addPermission(row)">
                        {{ row.level == 3 ? '添加功能' : '添加菜单' }}
                    </el-button>
                    <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false"
                        @click="updatePermission(row)">
                        编辑
                    </el-button>
                    <el-popconfirm title="确定删除？" width="260px" @confirm="removeMenu(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="menuData.id ? '编辑菜单' : '添加菜单'" v-model="dialog" width="40%">
            <el-form label-width="80px">
                <el-form-item label="菜单名称" size="default">
                    <el-input v-model="menuData.name" placeholder="请输入菜单名称" clearable />
                </el-form-item>
                <el-form-item label="权限值" size="default">
                    <el-input v-model="menuData.code" placeholder="请输入权限值" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="dialog = false">取消</el-button>
                    <el-button type="primary" @click="save">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<style scoped lang='scss'></style>