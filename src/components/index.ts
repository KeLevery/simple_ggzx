import SvgIcon from "./SvgIcon/index.vue";
import Pagination from "./Pagination/index.vue";
import Category from "./Category/index.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入
//注册组件为全局对象
const allGlobalComponent = { SvgIcon, Pagination ,Category};

//对外暴露插件对象
export default {
  //插件对象必须有一个属性install
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册所有组件
      app.component(
        key,
        allGlobalComponent[key as keyof typeof allGlobalComponent]
      );
    });
    //注册element-plus图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
