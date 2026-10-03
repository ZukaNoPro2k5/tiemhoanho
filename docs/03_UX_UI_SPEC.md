# UX / UI Specification

## 1. UX objective

The game must feel designed for a phone first, not like a desktop website compressed to mobile.

Primary reference viewport: **390 x 844 CSS px**.

Supported MVP width range: **360–430px**. Wider screens may center the game stage in a decorative frame/background.

## 2. Navigation model

Keep top-level navigation minimal:

- Tiệm
- Nhật ký hoa
- Bộ sưu tập / unlocks (can be merged into diary in early MVP)
- Settings via secondary button

Do not create a five-tab app shell unless content justifies it.

## 3. First-run flow

1. Logo/very short loading state.
2. Enter directly into shop scene.
3. First customer arrives.
4. Customer explains an easy request.
5. Contextual coach marks teach:
   - tap flower to add;
   - drag to adjust;
   - choose wrap;
   - deliver.
6. Reaction.
7. Player receives first diary entry.

No account wall. No long tutorial carousel.

## 4. Shop scene

The scene should convey state spatially:

- Customer near counter.
- Flower rack/table as entrance to bouquet flow.
- Cash/reputation small and unobtrusive.
- Day information compact.

Avoid large cards containing rows of KPIs.

## 5. Bouquet Designer layout

Recommended portrait structure:

```text
┌──────────────────────┐
│ Back   Request  Cost │
├──────────────────────┤
│                      │
│   BOUQUET CANVAS     │
│      ~52% height     │
│                      │
├──────────────────────┤
│ category chips       │
│ horizontal flower    │
│ tray                 │
├──────────────────────┤
│ Undo       Next      │
└──────────────────────┘
```

Key rules:

- Bouquet remains the visual focus.
- Request can expand/collapse; player must not memorize it.
- Current cost always accessible.
- Flower tray horizontally scrolls with large hit targets.
- Selected quantity must be obvious.
- Removal must be forgiving; never rely on tiny close icons.

## 6. Touch behavior

- Tap flower item: add to bouquet using assisted placement.
- Drag placed flower: reposition.
- Tap placed flower: select, reveal simple remove/rotate actions.
- Long-press is optional, never required for critical progress.
- Do not require pinch gestures in MVP.
- Drag cancellation and edge behavior must not cause page scroll fights.

Use Pointer Events and explicit touch-action management only in the bouquet manipulation area.

## 7. Finishing flow

Use a lightweight stepper or bottom-sheet flow:

`Hoa -> Gói -> Nơ -> Thiệp -> Giao`

Do not navigate to five full standalone pages.

## 8. Reaction screen

The reaction screen should be emotionally rewarding:

- Final bouquet large.
- Customer avatar/reaction.
- One short reaction line.
- Satisfaction result.
- 2–4 compact reason chips, e.g. `Đúng mood`, `Đúng ngân sách`, `Màu hợp`.
- Rewards.
- CTA: `Lưu vào nhật ký` / `Khách tiếp theo`.

## 9. Flower Diary

Grid/list with visually large bouquet thumbnails.

Entry detail:

- Bouquet.
- Custom/generated bouquet title.
- Day/date.
- Customer + occasion.
- Selected flowers/materials.
- Score/reaction.
- Share action.

The diary is a memory object, not a spreadsheet.

## 10. Feedback and motion

Use small “juicy” feedback:

- flower settles with soft spring;
- ribbon/wrap transitions;
- subtle sparkle on high satisfaction;
- tiny cash/reputation count-up.

Avoid:

- constant particle effects;
- slot-machine reward animation;
- excessive screen shake;
- blocking animations longer than ~600ms.

Honor `prefers-reduced-motion`.

## 11. Accessibility

- 44x44px minimum target.
- Color is never the only state signal.
- Visible focus states for keyboard users.
- Meaningful labels for buttons.
- Text contrast should target WCAG AA where practical without destroying the aesthetic.
- Provide non-drag alternatives for key actions when feasible (tap selection + directional/rotate controls).

## 12. Empty/error states

Always design:

- No diary entries yet.
- Save unavailable/corrupted fallback.
- Share API unavailable.
- PWA offline start after cache.
- Missing image asset placeholder.
