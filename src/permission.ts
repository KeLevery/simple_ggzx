// 路由鉴权：鉴权，项目当中路由能不能被访问的权限设置
import router from "@/router";
import nprogress from "nprogress"; // 引入进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式
import setting from "./setting"; // 引入项目的配置文件
nprogress.configure({ showSpinner: false });
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from "@/store/modules/user";
import pinia from "@/store";
const userStore = useUserStore(pinia);
console.log(userStore.token);

// 全局守卫：项目当中人意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 修改页面标题
  document.title = `${setting.title}-${to.meta.title}`;
  // to:可以获取到你要跳转到哪个路由信息
  // from:可以获取到你从哪个路由而来的信息
  // next:放行函数，必须调用，才能进入下一个路由
  nprogress.start(); // 开启进度条

  // 获取token，判断用户是否登录
  const token = userStore.token;

  // 获取用户名字
  const username = userStore.username;

  // 用户登录判断
  if (token) {
    // 登录成功，访问login，重定向到首页
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      // 访问其余路由
      // 有用户信息
      if (username) {
        // 放行
        next();
      } else {
        // 获取用户信息后放行
        try {
          await userStore.userInfo();
          // 放行
          // 如果刷新的时候是异步路由，有可能获取到用户信息、异步路由还没有加载完毕，出险空白效果
          next({ ...to });
        } catch (error) {
          // token 过期：获取不到用户信息了
          // 退出登录->用户相关的数据清空
          await userStore.userLogout();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    // 用户未登录
    if (to.path === "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
  // next(false)
  // next('/login')
  // next('/home')
});

// 全局后置守卫
router.afterEach((to, from) => {
  // to:可以获取到你要跳转到哪个路由信息
  // from:可以获取到你从哪个路由而来的信息
  nprogress.done(); // 关闭进度条
});
