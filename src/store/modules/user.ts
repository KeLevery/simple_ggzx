//创建用户相关的小仓库
import { defineStore } from "pinia";
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
// 引入数据类型
import type { loginFormData, loginResponseData } from "@/api/user/type";
import type { userState } from "./types/type";
import { GET_TOKEN, removeToken, SET_TOKEN } from "@/utils/token";
import { constantRoute, asyncRoute, anyRoute } from "@/router/router";
import router from "@/router";
// 引入深拷贝方法
//@ts-expect-error 没有ts类型
import cloneDeep from "lodash/cloneDeep";

// 过滤权限
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}
//创建用户小仓库
let useUserStore = defineStore("User", {
  state: (): userState => {
    return {
      token: GET_TOKEN(),
      // menuRoutes: constantRoute, // 仓库存储生成菜单需要的数组（路由）
      menuRoutes: constantRoute as [],
      username: "",
      avatar: "",
      // 存储当前用户是否包含某一个按钮
      buttons: [],
    };
  },
  //异步方法
  actions: {
    //用户登录方法
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        //由于pinia|vuex存储数据其实是利用js对象
        this.token = result.data as string;
        // 本地存储持久化存储一部分
        SET_TOKEN(this.token);
        //能保证当前async函数返回一个成功的promise
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 获取用户信息方法
    async userInfo() {
      let result = await reqUserInfo();
      //获取用户信息成功
      if (result.code === 200) {
        //将用户信息保存到仓库中
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        // 计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        );
        // 菜单的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        // 目前路由器管理的只有常量路由，用户计算完毕的异步路由和任意路由需要动态添加
        const newRoutes = [...userAsyncRoute, ...anyRoute];
        newRoutes.forEach((route: any) => {
          router.addRoute(route);
        });
        //返回用户信息
        return "ok";
      } else {
        return Promise.reject("获取用户信息失败");
      }
    },
    // 退出登录
    async userLogout() {
      const result: any = await reqLogout();
      if (result.code == 200) {
        // 目前咩有 mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = "";
        this.username = "";
        this.avatar = "";
        removeToken();
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
  },
  getters: {},
});

export default useUserStore;
