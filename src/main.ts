import { createApp } from "vue";
import App from "@/App.vue";
//引入Element-plus插件
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//配置element的国际化
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 引入elementplus黑暗模式
import "element-plus/theme-chalk/dark/css-vars.css";
//svg配置代码
// @ts-ignore
import "virtual:svg-icons-register";
const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn, //国际化设置
});
//引入自定义插件对象：注册整个项目全局组件
import gloalComponent from "@/components/index";
//安装自定义插件
app.use(gloalComponent);
//引入模板的全局样式
import "@/styles/index.scss";
//引入仓库
import pinia from "@/store";
app.use(pinia);
//引入路由
import router from "@/router";
app.use(router);
// 引入自定义指令文件
import { isHasButton } from './directive/has'
isHasButton(app)
// 引入路由鉴权文件
import "@/permission";
app.mount("#app");
