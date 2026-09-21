// 小仓库:layout组件相关配置仓库
import { defineStore } from "pinia";

let useLayoutSettingStore = defineStore("SettingLayout", {
  state: () => {
    return {
      fold: false, //用户控制菜单折叠还是收起
      refresh: false, //控制刷新
      dark: false, // 控制黑暗模式
    };
  },
});

export default useLayoutSettingStore;
