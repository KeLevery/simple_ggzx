<template>
    <div>
        <el-card style="margin: 10px 0px">
            <el-form :inline="true" style="display: flex; justify-content: space-between; align-items: center;">
                <el-form-item label="角色搜索:" prop="username" size="default">
                    <el-input style="width: 200px" v-model="keyword" placeholder="请输入搜索角色名称"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: auto;">
                    <template #default="{ row, $index }">
                        <el-button type="primary" size="default" @click="search">搜索</el-button>
                        <el-button type="primary" size="default" @click="reset">重置</el-button>
                    </template>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" size="default" @click="addRole" icon="Plus">添加角色</el-button>
            <el-table border style="margin: 20px 0" :data="allRole">
                <el-table-column type="index" label="#" width="120px" align="center" />
                <el-table-column label="ID" width="120px" align="center" prop="id" />
                <el-table-column label="角色名称" width="120px" align="center" prop="roleName" />
                <el-table-column label="创建时间" width="120px" align="center" prop="createTime" />
                <el-table-column label="更新时间" width="120px" align="center" prop="updateTime" />
                <el-table-column label="操作" align="center">
                    <template #default="{ row, $index }">
                        <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                        <el-popconfirm @confirm="deleteUser(row.id)" title="确定删除角色？">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-sizes="[1, 2, 3, 5]" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                background v-model:current-page="pageNo" v-model:page-size="pageSize" @current-change="getHasRole"
                @size-change="handleSizeChange" />
        </el-card>
        <el-dialog :title="roleParams.id ? '编辑角色' : '添加角色'" v-model="dialog">
            <template #default>
                <el-form ref="form" :inline="false" size="default">
                    <el-form-item label="角色名称" required>
                        <el-input placeholder="请输入角色名称" v-model="roleParams.roleName"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <span>
                    <el-button @click="dialog = false">取消</el-button>
                    <el-button type="primary" @click="save">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <el-drawer title="分配菜单与权限按钮" v-model="drawer">
            <template #default>
                <!-- 树形控件 -->
                <el-tree style="max-width: 600px" :data="menuArr" show-checkbox node-key="id" :default-expand-all="true"
                    :default-checked-keys="selectArr" :props="defaultProps" ref="tree" />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer = false">取消</el-button>
                    <el-button type="primary" @click="confirmClick">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>
<script setup lang='ts'>
import { reqAddOrUpdateRole, reqAllMenuList, reqAllRoleList, reqRemoveRole, reqSetPermission } from '@/api/acl/role';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';
//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(5);
//用户总个数
let total = ref<number>(50);
// 收集用户输入关键字
let keyword = ref<string>('')
// 弹窗开关
const dialog = ref<boolean>(false)
// 抽屉开关
const drawer = ref<boolean>(false)
// 收集角色数据
let roleParams = reactive<any>({
    roleName: '',
})
// 获取树
const tree = ref()
// 存储全部角色
let allRole = ref<any>([])
// 存储菜单数据
let menuArr = ref<any>([])
// 存储勾选了节点的id
let selectArr = ref<number[]>([])

const defaultProps = {
    children: 'children',
    label: 'name',
}

// 获取已有角色｜分页器页码发生变化的回调
const getHasRole = async () => {
    const result: any = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    if (result.code == 200) {
        total.value = result.data.total
        allRole.value = result.data.records
    }
}
// 分页器下拉菜单自定义事const drawer1 = ref<boolean>(false)件回调
const handleSizeChange = () => {
    getHasRole()
}

// 搜索按钮事件
const search = () => {
    getHasRole()
}

// 重置按钮事件
const reset = () => {
    keyword.value = ''
    getHasRole()
}

// 添加角色
const addRole = () => {
    dialog.value = true
    // 清空数据
    Object.assign(roleParams, {
        id: 0,
        roleName: '',
    })
}

// 修改角色
const updateRole = (row: any) => {
    dialog.value = true
    Object.assign(roleParams, row)
}

// 添加用户
const save = async () => {
    let result = await reqAddOrUpdateRole(roleParams)
    if (result.code === 200) {
        dialog.value = false
        ElMessage({
            type: 'success',
            message: roleParams.id ? '更新成功' : '添加成功',
        })
        getHasRole()
    } else {
        ElMessage({
            type: 'error',
            message: roleParams.id ? '更新失败' : '添加失败',
        })
    }
    console.log(result);
}

// 删除用户
const deleteUser = async (id: number) => {
    const result = await reqRemoveRole(id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasRole()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
}

// 分配权限
const setPermission = async (row: any) => {
    // 显示抽屉
    drawer.value = true
    // 收集当前要分配权限的角色数据
    Object.assign(roleParams, row)
    // 根据角色id获取权限数据
    const result: any = await reqAllMenuList(roleParams.id as number)
    if (result.code == 200) {
        menuArr.value = result.data
        // 选取所有最低级的菜单id
        selectArr.value = filterSelectArr(menuArr.value, [])
        console.log(menuArr.value);
    }
}
let i = 0;
// 获取已选菜单
const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}

// 抽屉确定按钮回调
const confirmClick = async () => {
    // 角色ID
    const roleId = roleParams.id as number
    // 选中节点的ID
    let checkedKeys = tree.value?.getCheckedKeys()
    // 半选的id,即子节点的父节点
    let halfCheckedKeys = tree.value?.getHalfCheckedKeys()
    // 合并子节点和父节点
    let permissionId = checkedKeys?.concat(halfCheckedKeys)
    // 下发权限
    const result = await reqSetPermission(roleId, permissionId as number[])
    if (result.code == 200) {
        // 抽屉关闭
        drawer.value = false
        ElMessage({
            type: 'success',
            message: '分配权限成功',
        })
        getHasRole()
        // 页面刷新
        window.location.reload()
    } else {
        ElMessage({
            type: 'error',
            message: '分配权限失败',
        })
    }
}

onMounted(() => {
    getHasRole();
})
</script>
