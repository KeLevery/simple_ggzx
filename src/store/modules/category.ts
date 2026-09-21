import { defineStore } from "pinia";
// 商品分类全局组件的小仓库
import { reqC1, reqC3, reqC2 } from "@/api/product/attr";
import type { CategoryResponseData } from "@/api/product/attr/type";
let useCategoryStore = defineStore("category", {
  state: () => {
    return {
      c1Arr: [] as any[],
      c1Id: "" as number | string,
      c2Arr: [] as any[],
      c2Id: "" as number | string,
      c3Arr: [] as any[],
      c3Id: "" as number | string,
    };
  },
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1();
      if (result.code === 200) {
        this.c1Arr = result.data;
      }
    },

    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id);
      console.log(result);
      if (result.code === 200) {
        this.c2Arr = result.data;
      }
    },

    async getC3() {
      const result = await reqC3(this.c2Id);
      if (result.code === 200) {
        this.c3Arr = result.data;
      }
    },
  },
  getters: {},
});

export default useCategoryStore;
