# 开发规范

## 技术栈约束

- shadcn-ui / Tailwind CSS / Next.js / React
- better-auth / Playwright / Drizzle
- Docker / PostgreSQL / Zustand

## 代码质量与架构

- 深入思考，保持高质量前端实现。
- React 组件保持单一职责，优先复用 `components` 目录已有能力。
- 保持简洁专业，避免重复造轮子，抽象重复逻辑。
- 代码设计需符合低耦合、高内聚原则。
- 函数长度尽量不超过 150 行。
- 单文件不超过 800 行。

## 前后端通信规范

- 前后端通信必须使用 Axios。
- 禁止使用 Fetch API（第三方库内部调用除外）。

## UI 与样式规范

- 编写前参考 shadcn-ui 与 Tailwind CSS 文档。
- 交互与布局以用户体验为中心。
- 样式使用 shadcn + Tailwind，优先语义化颜色。
- 语义化 CSS 统一放在 `src/app/globals.css` 中维护。
- 避免硬编码值。

## 状态与数据持久化

- 状态管理统一使用 Zustand。
- Store 默认存放在 `src/lib/stores`，并按业务域拆分子目录（如 `dataset/`、`model/`、`auth/`、`ui/`）。
- 命名规范：
  - 文件名统一使用 `*.store.ts`（如 `dataset.store.ts`）。
  - 导出 hook 统一使用 `useXxxStore`。
- 全局可复用状态放在 `src/lib/stores`；仅页面私有的临时表单状态可就近放在页面目录（或 `features` 子目录），避免伪全局状态。
- 单个 store 文件建议控制在 150 行以内；超出时按 `state / actions / selectors` 或 slice 拆分。
- 禁止在组件中直接写复杂状态变更逻辑；应下沉到 store action。
- 新增或重构 store 时，建议补充最小可验证用例（store 单测或关键 action 回归测试）。
- Metadata 不允许存储在 localStorage，必须持久化到数据库。

## 类型规范

- 所有 TypeScript 接口统一放在 `src/lib/types`。

## 目录规范

- 工具类函数统一放在 `@src/lib/utils`（项目目录为 `src/lib/utils`）。
- Hook 统一放在 `src/app/hooks`。
