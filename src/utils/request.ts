import { ElMessage } from 'element-plus'
//进行axios的二次封装
import axios from 'axios'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
//第一步：利用axios对象的create方法，去创建axios实例
let request = axios.create({
    //配置对象
    //基础路径，发请求的时候，路径当中会出现api
    baseURL: import.meta.env.VITE_APP_BASE_API,
    //请求超时时间
    timeout: 5000,
})
//第二步:request实例添加一个请求拦截器
request.interceptors.request.use((config) => {
    //config:配置对象，对象里面有一个属性很重要，headers请求头
    let userStore = useUserStore()
    if(userStore.token){
        //给请求头添加一token值
        config.headers.token = userStore.token
    }
    //返回配置对象
    return config
})
//第三步：添加响应拦截器
request.interceptors.response.use(
    (response) => {
        //响应成功
        return response.data
    },
    (error) => {
        //响应失败
        let message=''
        //http响应状态
        let status = error.response.status
        switch (status) {
            case 401:
                message = 'token过期'
                break
            case 403:
                message = '无权访问'
                break
            case 404:
                message = '请求地址错误'
                break
            case 500:
                message = '服务器出现问题'
                break
            default:
                message = '未知错误'
        }
        //提升错误信息
        ElMessage({
            type: 'error',
            message,
        })

        return Promise.reject(error)
    }
)


//对外暴露
export default request