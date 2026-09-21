# Copilot Instructions for KeLe-Admin Project

## Project Overview
This is a **Vue 3 + TypeScript + Vite** admin dashboard application (极智云商综合运营管理系统) with:
- Component-based architecture using Vue 3 `<script setup>`
- TypeScript strict mode enabled
- Pinia for state management
- Element Plus for UI components
- Mock API layer for development
- SVG icon system

## Architecture & Data Flow

### Core Application Flow
1. **Entry Point** (`src/main.ts`): Initializes Vue app with plugins in order:
   - Element Plus (with Chinese locale `zhCn`)
   - Custom global component plugin (`src/components/index.ts`)
   - Global styles (`src/styles/index.scss`)
   - Vue Router
   - Pinia store

2. **Routing** (`src/router/router.ts` & `src/router/index.ts`):
   - Uses hash-based history
   - Defined in `constantRoute` array (supports nested routes for layouts)
   - Layout wrapper at `/` contains child routes like `/home`, `/ceshi`
   - Login page is separate route (not wrapped in layout)
   - 404 fallback for unknown routes
   - **Pattern**: Routes use lazy loading with `() => import("@/views/...")`

3. **State Management** (`src/store/modules/user.ts`):
   - Single user store using Pinia `defineStore`
   - Stores: `token` (from localStorage), `menuRoutes` (from router config)
   - Action `userLogin()` calls API, sets token, persists to localStorage
   - Token persistence via `SET_TOKEN()` utility
   - Returns `Promise.reject()` on login failure for proper error handling

4. **API Layer** (`src/api/user/`):
   - Centralized in `index.ts` with enum `API` for endpoint URLs
   - Functions return typed axios responses using generics: `request.post<any, ResponseType>()`
   - Types defined separately in `type.ts`
   - Example: `reqLogin(data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data)`

5. **HTTP Client** (`src/utils/request.ts`):
   - Axios wrapper with `interceptors`
   - Request interceptor (currently passthrough)
   - Response interceptor handles errors with `ElMessage` notifications
   - HTTP status codes mapped to user messages (401, 403, 404, 500)
   - baseURL from `import.meta.env.VITE_APP_BASE_API`

### Layout Structure (`src/layout/index.vue`)
- Three-section layout:
  - `.layout_slider`: Left sidebar with logo + scrollable menu
  - `.layout_tabbar`: Top navigation bar
  - `.layout_main`: Content area (shows `<router-view>` implicitly through child route components)
- Accesses store via `useUserStore().menuRoutes` for menu generation

## Project-Specific Patterns

### Component Registration
**Pattern**: Global plugin system in `src/components/index.ts`
```typescript
const allGlobalComponent = { SvgIcon, Pagination };
// Install method registers all + all Element Plus icons globally
app.use(gloalComponent)
```
- Add new reusable components here: update the object, they'll auto-register
- All Element Plus icon components available globally

### SVG Icon System
- Icons stored in `src/assets/icons/`
- Vite plugin: `vite-plugin-svg-icons` converts SVGs to symbol references
- Custom `<SvgIcon>` component (`src/components/SvgIcon/index.vue`) wraps usage
- Usage: `<SvgIcon name="icon-name" color="red" width="20px" height="20px" />`
- Symbol ID format: `icon-[dir]-[name]` (e.g., `icon-system-add`)

### Type Safety Pattern
All API responses use explicit TypeScript interfaces:
```typescript
// src/api/user/type.ts
export interface loginForm { username: string; password: string; }
export interface loginResponseData { code: number; data: dataType; }
// src/api/user/index.ts
export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data)
```
**Rule**: Never use bare response types; always define `type.ts` alongside `index.ts` in API modules

### Token Management
- Stored in `localStorage` as `'TOKEN'` key
- Utilities in `src/utils/token.ts`: `SET_TOKEN()`, `GET_TOKEN()`
- Initialized on app load: `token: localStorage.getItem('TOKEN')`
- On login success, call `SET_TOKEN()` to persist

### Environment Configuration
- Env files: `.env.development`, `.env.test`, `.env.production`
- Variables must have `VITE_` prefix to be exposed to frontend
- Access via `import.meta.env.VITE_APP_BASE_API` (e.g., `/api`, `/test-api`, `/prod-api`)
- `VITE_APP_TITLE` used for page titles

### Mock API for Development
- Located in `mock/user.ts`
- Uses `vite-plugin-mock` (enabled only in dev mode: `enable: command === 'serve'`)
- Export mock endpoints as array of objects with `url`, `method`, `response`
- Example: Mocks `/api/user/login` POST and `/api/user/info` GET endpoints
- Useful for API-less development; remove or disable for production

## Build & Development Commands

```bash
pnpm dev           # Start dev server (Vite) with mock API enabled
pnpm build         # Vue type-check + Vite build (default production)
pnpm build:test    # Type-check + build for test environment
pnpm build:pro     # Type-check + build for production environment
pnpm preview       # Preview built output locally
```
- **Dev**: Includes source maps, mock APIs active, fast HMR
- **Build**: Runs `vue-tsc -b` first to catch TS errors before bundling

## TypeScript & Code Quality

### TypeScript Config (`tsconfig.app.json`)
- **Strict mode enabled**: Enforces explicit types, no implicit `any`
- **Path alias**: `@` → `src/` (already configured, use consistently)
- **Unused detection**: `noUnusedLocals: true` + `noUnusedParameters: true`
- **Build info cache**: Speeds up incremental builds

### Linting (`eslint.config.js`)
- Flat config format (ESLint 9+)
- Includes: `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`
- Applies to: `**/*.{js,mjs,cjs,ts,mts,cts,vue}`
- Vue files use TypeScript parser

### Common Issues
- ESLint error on unused variables: Always declare or use `_prefix` convention
- Type errors in `.vue` files: Ensure types are imported in script section, not just template

## Key File Locations

| Purpose | Location | Notes |
|---------|----------|-------|
| Global styles (SCSS) | `src/styles/index.scss` | Imports `reset.scss`, `variable.scss`; `$base-menu-width`, `$base-menu-background` available |
| Global components | `src/components/index.ts` | Register here for auto-availability |
| API endpoints | `src/api/{module}/index.ts` | Add new API modules in `acl/`, `product/`, `user/` |
| Store modules | `src/store/modules/*.ts` | Pinia stores; add new as separate files |
| Utilities | `src/utils/request.ts` | Axios instance; extend interceptors here |
| Route config | `src/router/router.ts` | Edit `constantRoute` for new pages |
| App settings | `src/setting.ts` | Project metadata (title, logo, etc.) |

## When Adding Features

1. **New Page**: Add to `src/views/`, create route in `constantRoute`, add menu entry in router meta
2. **New API**: Create module in `src/api/{module}/` with `index.ts` + `type.ts`
3. **New Component**: Place in `src/components/`, register in `src/components/index.ts`
4. **New Store**: Create in `src/store/modules/`, import in component with `useModuleStore()`
5. **Styling**: Use SCSS variables from `src/styles/variable.scss` for consistency
