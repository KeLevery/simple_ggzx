# KeLe-Admin 极智云商综合运营管理系统

<p align="center">
  <img src="./public/logo-admin.png" width="100" height="100" alt="KeLe-Admin Logo" />
</p>

<p align="center">
  <b>基于 Vue 3 + TypeScript + Vite + Element Plus + Pinia 构建的企业级现代化电商与权限运营管理中后台系统</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-brightgreen.svg" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/Element--Plus-2.11-409EFF.svg" alt="Element Plus" />
  <img src="https://img.shields.io/badge/Pinia-3.0-FFE162.svg" alt="Pinia" />
  <img src="https://img.shields.io/badge/ECharts-6.0-AA344D.svg" alt="ECharts" />
</p>

---

## 📖 项目简介

**KeLe-Admin（极智云商综合运营管理系统）** 是一套面向现代电商与数字化运营场景的一站式企业级中后台管理平台。项目遵循模块化与工程化标准开发，深度集成角色权限控制（RBAC）、复杂商品管理（SPU/SKU）、全屏数据可视化大屏看板与主题个性化定制，具备良好的可扩展性与代码可维护性。

---

## ✨ 核心特性

### 1. 细粒度权限控制（RBAC）
- **路由级动态权限**：区分常量路由（`constantRoute`）、异步权限路由（`asyncRoute`）与任意匹配路由（`anyRoute`），登录后依据后端接口返回的用户路由标识进行动态过滤并注入路由实例（`router.addRoute`）。
- **按钮级操作鉴权**：自定义封装 `v-has` 全局指令，针对增删改查等高危操作按钮比对用户权限集合，未授权按钮自动自 DOM 树中安全移除。
- **用户与角色分权体系**：支持用户多角色分配、角色树形菜单权限与操作按钮分配。

### 2. 复杂商品中台管理
- **品牌管理（Trademark）**：支持品牌 Logo 上传校验（格式/体积）、实时预览及增删改查分页流。
- **平台属性管理（Attr）**：三级分类联动选择器（`Category` 组件），支持平台属性名称及多种属性值的行内新增、编辑与模式切换。
- **SPU / SKU 规格体系**：完善的商品核心模型维护，支持销售属性动态配置、图片墙上传、SKU 规格组合生成及上下架状态切换。

### 3. 数据可视化大屏（Screen Dashboard）
- **多维度数据监控**：集成 ECharts 与 ECharts LiquidFill，提供实时游客量统计、男女比例、年龄阶层分布、全国销售地图定位、渠道对比及未来趋势预测。
- **大屏自适应方案**：采用视口比例缩放算法（`getScale` + `transform: scale()`），支持不同分辨率大屏及多端等比无损适配。

### 4. 架构与工程化规范
- **类型安全**：全面使用 TypeScript 编写业务模型、API 响应与 Pinia 状态类型。
- **网络层封装**：Axios 二次封装，统一处理请求 Header Token 注入、响应码校验与错误 Toast 提示。
- **个性化与交互**：支持主题色自定义拾取、明亮/暗黑（Dark）模式无缝切换、面包屑导航与全屏沉浸式体验。

---

## 🛠️ 技术栈

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | Vue 3.5 (Composition API + `<script setup>`) | 渐进式前端框架 |
| **构建工具** | Vite 7.2 | 极速冷启动与热模块替换（HMR） |
| **开发语言** | TypeScript 5.9 | 强类型静态类型检查 |
| **状态管理** | Pinia 3.0 | 模块化集中状态管理 |
| **UI 组件库** | Element Plus 2.11 | 企业级桌面端组件库 |
| **路由管理** | Vue Router 4.6 | 动态路由与路由守卫 |
| **数据可视化** | ECharts 6.0 + echarts-liquidfill | 专业图表与水球图渲染 |
| **工具库** | Axios / Lodash / Moment / NProgress | HTTP 请求、深拷贝、日期处理、加载进度条 |
| **样式预处理** | Sass (sass-embedded) | SCSS 模块化与变量管理 |

---

## 📁 目录结构

```text
simple-ggzx/
├── public/                 # 静态资源
│   ├── logo.png            # 平台 Logo
│   └── vite.svg
├── src/
│   ├── api/                # API 接口分层管理 (ACL, Product, User)
│   ├── assets/             # 静态图标与图片素材
│   ├── components/         # 全局通用业务组件 (Category, SvgIcon 等)
│   ├── directive/          # 全局自定义指令 (如 v-has 按钮鉴权)
│   ├── layout/             # 框架主布局 (Sidebar, Tabbar, Header, Main)
│   ├── router/             # 路由配置与动态路由拦截
│   ├── store/              # Pinia 状态管理模块
│   ├── styles/             # 全局与主题样式 (reset, variable, dark)
│   ├── utils/              # 核心工具库 (request, token, time)
│   └── views/              # 业务页面
│       ├── acl/            # 权限管理 (用户、角色、菜单)
│       ├── home/           # 首页工作台
│       ├── login/          # 登录页
│       ├── product/        # 商品中台 (品牌、属性、SPU、SKU)
│       └── screen/         # 数据可视化大屏
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── .env.test               # 测试环境变量
├── index.html              # HTML 入口
├── package.json
├── tsconfig.json
└── vite.config.ts          # Vite 构建配置
```

---

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone git@github.com:KeLevery/simple_ggzx.git
cd simple_ggzx
```

### 2. 安装依赖
> 推荐使用 [pnpm](https://pnpm.io/) 进行依赖安装：
```bash
pnpm install
```

### 3. 本地启动
```bash
pnpm run dev
```
启动成功后，浏览器访问终端提示的本地地址（默认 `http://localhost:5173`）即可体验。

### 4. 生产构建
```bash
pnpm run build
```

---

## 📄 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议。
