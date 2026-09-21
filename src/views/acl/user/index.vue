<template>
    <div>
        <el-card style="margin: 10px 0px">
            <el-form :inline="true" style="display: flex; justify-content: space-between; align-items: center;">
                <el-form-item label="用户名:" prop="username" size="default">
                    <el-input style="width: 200px" v-model="keyword" placeholder="请输入用户名"></el-input>
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
            <el-button type="primary" size="default" @click="addUser">添加</el-button>
            <el-button type="danger" size="default" @click="deleteSelectUser"
                :disabled="selectIdArr.length ? false : true">批量删除</el-button>
            <el-table border @selection-change="selectChange" style="margin: 20px 0" :data="userArr">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" label="#" width="120px" align="center" />
                <el-table-column label="ID" width="120px" align="center" prop="id" />
                <el-table-column label="用户名字" width="120px" align="center" prop="username" />
                <el-table-column label="用户名称" width="120px" align="center" prop="name" />
                <el-table-column label="用户角色" width="120px" align="center" prop="roleName" />
                <el-table-column label="创建时间" width="120px" align="center" prop="createTime" />
                <el-table-column label="更新时间" width="120px" align="center" prop="updateTime" />
                <el-table-column label="操作" align="center">
                    <template #default="{ row, $index }">
                        <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                        <el-popconfirm @confirm="deleteUser(row.id)">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-sizes="[1, 3, 5, 7]" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                background v-model:current-page="pageNo" v-model:page-size="pageSize" @current-change="getHasUser"
                @size-change="handleSizeChange" />
        </el-card>
        <el-drawer title="添加用户" v-model="drawer">
            <!-- 头部标题：文字内容是动态的 -->
            <template #header>
                <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
            </template>
            <template #default>
                <el-form ref="form" :inline="false" size="default">
                    <el-form-item label="用户姓名" required>
                        <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名称" required>
                        <el-input placeholder="请输入用户名称" v-model="userParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" required v-if="!userParams.id">
                        <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save">立即创建</el-button>
                        <el-button type="danger" @click="">取消</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-drawer>
        <el-drawer title="分配角色" v-model="drawer1">
            <template #default>
                <el-form>
                    <el-form-item label="用户姓名">
                        <el-input v-model="userParams.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="角色列表">
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                            全选
                        </el-checkbox>

                    </el-form-item>
                    <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
                        <el-checkbox v-for="item in allRole" :key="item.id" :label="item.roleName" :value="item">{{
                            item.roleName }}</el-checkbox>
                    </el-checkbox-group>
                    <el-form-item>
                        <template #default="{ row, $index }">
                            <el-button type="primary" @click="confirmClick">分配角色</el-button>
                            <el-button type="danger" @click="drawer1 = false">取消</el-button>
                        </template>
                    </el-form-item>
                </el-form>
            </template>
        </el-drawer>
    </div>
</template>
<script setup lang='ts'>
import { reqAddOrUpdateUser, reqAllRole, reqRemoveBatchUser, reqRemoveUser, reqSetUserRole, reqUserList } from '@/api/acl/user';
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
//存储全部用户的数组
let userArr = ref<any>([]);
// 抽屉开关
const drawer = ref<boolean>(false)
const drawer1 = ref<boolean>(false)
// 收集用户信息数据
let userParams = reactive<any>({
    username: '',
    name: '',
    password: '',
})
// 存储批量删除用户的ID
let selectIdArr = ref<any[]>([])
// 全选
let checkAll = ref<boolean>(false)
// 未全选
let isIndeterminate = ref<boolean>(false)
// 存储全部角色
let allRole = ref<any>([])
// 存储现有角色
let checkedRole = ref<any>([])

//获取全部已有的用户信息
const getHasUser = async () => {
    const result = await reqUserList(pageNo.value, pageSize.value, keyword.value)
    userArr.value = result.data.records
    total.value = result.data.total
}

// 分页器下拉菜单自定义事const drawer1 = ref<boolean>(false)件回调

const handleSizeChange = () => {
    getHasUser()
}

// 搜索按钮事件
const search = () => {
    getHasUser()
}

// 重置按钮事件
const reset = () => {
    keyword.value = ''
    getHasUser()
}

const addUser = () => {
    const drawer1 = ref<boolean>(false)
    drawer.value = true

    // 清空数据
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: '',
    })
    console.log(userParams);
}

// 添加用户
const save = async () => {
    const result = await reqAddOrUpdateUser(userParams)
    if (result.code === 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功',
        })
        getHasUser()
    } else {
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败',
        })
    }
    console.log(result);
}

// 更新用户
const updateUser = (row: any) => {
    drawer.value = true
    Object.assign(userParams, row)
}

// 删除用户
const deleteUser = async (id: number) => {
    const result = await reqRemoveUser(id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasUser()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
}

// table 复选框勾选触发事件
const selectChange = (value: any) => {
    selectIdArr.value = value
}

// 批量删除用户
const deleteSelectUser = async () => {
    // 整理批量删除的参数
    const idsList: number[] = selectIdArr.value.map((item) => {
        return item.id as number
    })

    // 批量删除
    const result: any = await reqRemoveBatchUser(idsList)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasUser()
    }
}

// 分配角色
const setRole = async (row: any) => {
    Object.assign(userParams, row)
    drawer1.value = true
    const result: any = await reqAllRole(userParams.id as number)
    if (result.code == 200) {
        allRole.value = result.data.allRolesList
        checkedRole.value = result.data.assignRoles
        checkAll.value = checkedRole.value.length === allRole.value.length
        isIndeterminate.value = checkedRole.value.length > 0 && checkedRole.value.length < allRole.value.length
    }
}

const handleCheckAllChange = (val: any) => {
    checkedRole.value = val ? allRole.value : []
    isIndeterminate.value = false
}

const handleCheckedRoleChange = (value: any) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

const confirmClick = async () => {
    let data = {
        userId: userParams.id as number,
        roleIdList: checkedRole.value.map((item: any) => {
            return item.id as number
        }),
    }
    const result: any = await reqSetUserRole(data)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '分配角色成功',
        })
        drawer1.value = false
        // 获取更新完毕用户信息，根系完毕留在当前页
        getHasUser()
    }

}

onMounted(() => {
    getHasUser();

})
</script>
