<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到极智云商</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" class="login_btn" @click="login">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang='ts'>
import { User, Lock } from "@element-plus/icons-vue"
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
//引入用户相关的小仓库
import useUserStore from "@/store/modules/user"
//引入时间
import { getTime } from "@/utils/time";
import { ElNotification } from "element-plus";
let useStore = useUserStore();
//获取路由器
let $router = useRouter()
let $route = useRoute()
//定义变量控制按钮加载效果
let loading = ref(false)
// 获取el-form组件
const loginForms = ref()
// 收集账号和密码数据
const loginForm = reactive<{ username: string, password: string }>({ username: 'admin', password: '111111' })
// 登录按钮回调
const login = async () => {
    //保证全部表单先校验通过再发请求
    await loginForms.value.validate();

    // 开始加载效果
    loading.value = true
    try {
        // 可以书写.then方法
        // 保证登录成功
        await useStore.userLogin(loginForm)
        if ($route.query.redirect) {
            $router.push($route.query.redirect as string)
        } else {
            $router.push('/')
        }
        //登录成功提示信息
        ElNotification({
            title: `HI,${getTime()}`,
            message: '欢迎来到谷粒商城',
            type: 'success',
        })
        // 登录成功加载效果消失
        loading.value = false
    } catch (error) {
        console.log(error)
        // 登录失败加载效果消失
        loading.value = false
        // 登录失败提示信息
        ElNotification({
            title: '登录失败',
            message: (error as Error).message,
            type: 'error',
        })
    }
}

// 自定义校验规则函数
const validatorUsername = (rules: any, value: any, callback: any) => {
    // rule:即为校验规则
    // value:即为表单元素文本内容
    // callback:如果符合条件callBack放行通过
    // 如果不符合条件callBack方法，注入错误提示信息
    // if(/^\d{5,10}$/.test(value)){
    //     callback()
    // }else{
    //     callback(new Error('用户名长度在5到10个字符之间'))
    // }
    callback()
}

const validatorPssword = (rules: any, value: any, callback: any) => {
    if (value.length >= 6) {
        callback()
    } else {
        callback(new Error('密码长度至少是6位'))
    }
}

const rules = {
    username: [
        // { required: true, message: '请输入用户名', trigger: 'blur' },
        // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        // 自定义校验规则
        { trigger: 'blur', validator: validatorUsername },
    ],
    password: [
        // { required: true, message: '请输入密码', trigger: 'blur' },
        // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        { trigger: 'blur', validator: validatorPssword }
    ]
}
</script>
<style scoped lang='scss'>
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
}

.login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
        color: white;
        font-size: 40px;
    }

    h2 {
        color: white;
        font-size: 20px;
        margin: 20px 0;
    }
}

.login_btn {
    width: 100%;
}
</style>