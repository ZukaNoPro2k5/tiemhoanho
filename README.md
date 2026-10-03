# TiemHoaWeb — AI Development Kit

Bộ tài liệu này là **source of truth** để Claude Code, OpenAI Codex và Google Antigravity cùng phát triển TiemHoaWeb mà không lệch product/UX/architecture.

## 1. Cách dùng nhanh

Copy toàn bộ thư mục này vào root repository của dự án.

```text
TiemHoaWeb/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── docs/
├── prompts/
├── templates/
├── .agents/rules/
└── .claude/rules/
```

Sau đó agent nào làm việc cũng phải bắt đầu bằng:

1. Đọc `AGENTS.md`.
2. Đọc `docs/01_PRD_MVP.md`.
3. Đọc tài liệu domain liên quan đến task.
4. Viết/đọc plan trước khi sửa code lớn.
5. Chạy lint, typecheck, tests và kiểm tra mobile viewport trước khi kết thúc.

## 2. Product sentence

> TiemHoaWeb là một cozy mobile-first web game nơi người chơi tự tay thiết kế những bó hoa đẹp, phục vụ những câu chuyện nhỏ của khách hàng và từng bước xây dựng một tiệm hoa mang phong cách riêng.

## 3. North Star

Nếu phải hy sinh feature để bảo vệ một thứ, hãy bảo vệ:

> **Khoảnh khắc tự tay làm xong một bó hoa và thấy nó đẹp đến mức muốn lưu hoặc chia sẻ.**

Ưu tiên sản phẩm:

`UI/UX & visual delight > bouquet interaction > customer emotion > progression > management depth`

## 4. MVP

MVP tập trung vào:

- Customer request.
- Bouquet Designer.
- Wrap/ribbon/card customization.
- Transparent satisfaction scoring.
- Customer reaction.
- Cash + reputation.
- Simple day loop.
- Flower Diary.
- Shareable bouquet card.
- Local save + installable PWA.

Không có trong MVP: multiplayer, guild, gacha, energy, farming lớn, employee management, city map, backend account system.

## 5. Tài liệu cần đọc theo loại task

| Task | Đọc |
|---|---|
| Product/feature | `docs/01_PRD_MVP.md`, `docs/02_GAME_DESIGN.md` |
| UI/UX | `docs/03_UX_UI_SPEC.md`, `docs/04_DESIGN_SYSTEM.md` |
| Frontend architecture | `docs/05_TECH_ARCHITECTURE.md` |
| State/data | `docs/06_DATA_MODEL.md`, `docs/07_CONTENT_SCHEMA.md` |
| Planning | `docs/08_IMPLEMENTATION_PLAN.md`, `docs/09_TASK_BACKLOG.md` |
| QA | `docs/10_TESTING_QA.md` |
| Metrics | `docs/11_ANALYTICS.md` |
| Product decisions | `docs/12_DECISIONS.md` |
| Dùng Claude + Codex + Antigravity cùng lúc | `docs/13_MULTI_AGENT_WORKFLOW.md` |

## 6. Recommended stack for a new repo

Unless an existing repo already dictates otherwise:

- React + TypeScript + Vite.
- Tailwind CSS for layout/tokens.
- Motion for lightweight UI animation.
- Zustand for game/session state.
- Zustand persist/localStorage for MVP saves, with explicit schema version/migrations.
- Vitest + Testing Library.
- Playwright for critical mobile flows.
- vite-plugin-pwa.
- ESLint + Prettier.

Do **not** add Phaser/Pixi/Three.js in MVP unless a measured interaction/performance limitation proves DOM/SVG insufficient.

## 7. Agent workflow

Each non-trivial task follows:

```text
READ -> PLAN -> IMPLEMENT -> VERIFY -> VISUAL CHECK -> DOCUMENT
```

A task is not done merely because it compiles.

Definition of Done is in `docs/10_TESTING_QA.md`.

## 8. First prompts

- Claude: `prompts/CLAUDE_FIRST_PROMPT.md`
- Codex: `prompts/CODEX_FIRST_PROMPT.md`
- Antigravity: `prompts/ANTIGRAVITY_FIRST_PROMPT.md`

For every later feature, copy `prompts/FEATURE_TASK_TEMPLATE.md` and fill in the task.

## 9. Core rule

Do not let an AI agent silently reinterpret the product. If implementation pressure conflicts with the PRD, record the trade-off in `docs/12_DECISIONS.md` before changing product behavior.
