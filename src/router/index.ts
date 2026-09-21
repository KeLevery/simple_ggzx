// 通过vue-router插件实现模板路由设置
import { createRouter, createWebHashHistory } from "vue-router";
import { constantRoute } from "./router";
//创建路由器
let router = createRouter({
  //路由模式
  history: createWebHashHistory(),
  //映射关系
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

export default router;