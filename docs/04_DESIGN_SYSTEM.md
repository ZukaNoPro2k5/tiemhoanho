# Design System — Cozy Flower Shop

## 1. Art direction

Keywords:

- cozy
- handcrafted
- warm stationery
- soft Korean/Japanese-inspired editorial feel without copying a specific brand
- botanical
- playful but not childish

Avoid generic “AI pastel SaaS” styling: giant gradient blobs, glassmorphism everywhere, neon gradients, excessive pill cards.

## 2. Palette

Suggested starting tokens; adjust after art tests.

```css
--cream-50: #fffaf3;
--cream-100: #f8efe2;
--ink-900: #443a36;
--ink-600: #756761;
--rose-300: #eeb7bd;
--rose-500: #d77f8a;
--peach-300: #f2c1a5;
--sage-300: #b9c7a8;
--sage-500: #879b78;
--butter-300: #f0d98a;
--paper: #fffdf8;
--danger: #bd5f62;
```

Do not use every token in every screen. Large surfaces stay cream/paper; flower assets carry much of the color.

## 3. Typography

Use one friendly display face only for logo/headings and one highly readable UI face for controls/body.

Rules:

- Body minimum 14px; prefer 15–16px.
- Buttons 15–16px medium/semibold.
- Avoid ultra-light font weights.
- Vietnamese diacritics must render correctly in every chosen font.

## 4. Shape language

- Rounded, soft corners: 14–22px on cards/sheets.
- Buttons: 14–18px radius, not pill-shaped by default.
- Organic illustration shapes preferred to perfect geometric decoration.
- Borders subtle, warm gray/brown rather than cold slate.

## 5. Shadows

Use restrained soft elevation. Avoid multiple heavy shadows.

Suggested:

```css
--shadow-soft: 0 6px 20px rgba(68, 58, 54, 0.10);
--shadow-float: 0 10px 30px rgba(68, 58, 54, 0.14);
```

## 6. Spacing

Base grid: 4px.

Common spacing:

- 4, 8, 12, 16, 20, 24, 32.

## 7. Component tone

Buttons use verbs in Vietnamese:

- `Bó hoa`
- `Giao khách`
- `Lưu bó hoa`
- `Khách tiếp theo`

Avoid enterprise words like “Submit”, “Inventory Management”, “Dashboard”, “Transaction”.

## 8. Asset direction

Flower assets should be exported as transparent WebP/PNG/SVG where appropriate, with consistent lighting/perspective.

Preferred visual strategy for MVP:

- Pre-rendered illustrated flower heads/stems separated enough for layered composition.
- Consistent anchor point at bottom-center of the stem asset.
- Wrap/ribbon assets designed around the same bouquet coordinate system.

Each asset must have metadata for native dimensions and anchor if needed.

## 9. Iconography

Use one consistent icon family for UI utilities; do not mix emoji, outline icons and filled icons arbitrarily. Emoji may appear in customer copy/reactions but should not be the entire icon system.

## 10. Motion tokens

- Micro: 120–180ms.
- Standard: 220–320ms.
- Celebration: max ~600ms before interaction is available.
- Spring motion should be subtle and damped.
