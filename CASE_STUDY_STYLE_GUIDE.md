# Case Study Style Guide
**Nandor Tamas Portfolio — nandor@stungmedia.com**
*Reference for building and maintaining case studies consistently across the site.*

---

## Page Shell

Case studies render inside a full-screen slide-out panel. The panel has its own background, header, and scroll container — the content component is dropped in as a child.

| Property | Value |
|---|---|
| Panel background | `#0e0018` (page root dark) |
| Content max-width | `1400px`, centered with `margin: 0 auto` |
| Content padding | `80px 48px` (desktop) / `48px 24px` (mobile) |
| Header height | `56px` (desktop + mobile) |
| Header background | `rgba(97,1,116,0.2)` + `backdrop-filter: blur(10px)` |
| Header border | `1px solid rgba(117,6,140,0.35)` |

---

## Color Tokens

These are the only colors used across the case study content. Don't introduce new ones.

| Name | Hex / Value | Usage |
|---|---|---|
| White | `#ffffff` | Section titles, subheads, bold callouts |
| Body text | `#f7ceff` | All body copy |
| Accent / highlight | `#ee99ff` | Eyebrows, bullet dots, chart labels, numbers in phase steps |
| Accent muted | `rgba(247,206,255,0.3)` | Strikethrough "from" values in metric cards |
| Purple deep | `#610174` | Divider lines, header background base |
| Purple mid | `#75068c` | Card borders, blockquote left border |
| Card background | `rgba(117,6,140,0.15–0.20)` | All card/chart/callout containers |
| Card border | `1px solid rgba(117,6,140,0.35)` | All card/chart/callout containers |
| Sub-label / meta | `#f7ceff` at 55% opacity | Metric card sub-text, chart meta-text |

---

## Typography

The site uses **Helvetica Neue** throughout. No external fonts are loaded — this is a system font stack.

```
fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
```

### Type Scale

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| **Eyebrow** | `13px` | `500` | `#ee99ff` | All caps, `letterSpacing: 0.7px`, `margin: 0 0 20px` |
| **Section Title** (`h2`) | `clamp(28px, 3vw, 42px)` desktop / `26px` mobile | `200` | `#ffffff` | `lineHeight: 1.15`, `margin: 0 0 28px` |
| **Subhead** (`h3`) | `22px` desktop / `18px` mobile | `400` | `#ffffff` | `margin: 48px 0 16px` |
| **Body** | `24px` desktop / `18px` mobile | `400` | `#f7ceff` | `lineHeight: 1.5`, `letterSpacing: 0.48px`, `margin: 0 0 24px` |
| **Bullet text** | `18px` | `400` | `#f7ceff` | `lineHeight: 1.3`, no bottom margin between items |
| **Blockquote** | `22px` desktop / `18px` mobile | `300` | `#ffffff` | Italic, `lineHeight: 1.65` |
| **Card label** (uppercase) | `12px` | `600` | `#ee99ff` | All caps, `letterSpacing: 0.6–0.8px` |
| **Card stat** | `48px` desktop / `32px` (from value) | `200` | `#ffffff` | `lineHeight: 1` |
| **Card hero stat** | `64px` desktop / `48px` mobile | `200` | `#ffffff` | `lineHeight: 1` — used for main metric values |
| **Card sub-text** | `13px` | `400` | `#f7ceff` at 55% | `lineHeight: 1.4` |

---

## Section Structure

Every major section follows this pattern:

```
[eyebrow label]       ← always first
[h2 section title]    ← optional; skip for purely narrative bridges
[body paragraphs]
[bullets / charts / images as needed]
[hr divider]          ← separates major sections
```

**Eyebrow + title** always appear together. Never use a title without an eyebrow.

**Divider (hr):**
```tsx
<div style={{ width: "156px", height: "1px", background: "#75068c", margin: "56px 0" }} />
```

---

## Components

### Bullet List

```tsx
<ul style={{ listStyle: "none", padding: 0, margin: "16px 0 24px" }}>
  {items.map((item, i) => (
    <li key={i} style={{ display: "flex", gap: "14px", marginBottom: "2px", alignItems: "flex-start" }}>
      <span style={{ color: "#ee99ff", fontSize: "18px", lineHeight: "1.3", flexShrink: 0 }}>•</span>
      <span style={{ fontFamily: "'Helvetica Neue'...", fontSize: "18px", lineHeight: "1.3", color: "#f7ceff", fontWeight: 400, margin: 0 }}>{item}</span>
    </li>
  ))}
</ul>
```

- Bullet dot: `#ee99ff`, `18px`, `lineHeight: 1.3`
- Item text: same size and color as body but `18px` fixed (not responsive)
- Gap between dot and text: `14px`
- Bottom margin between items: `2px` only (tight, not loose)

---

### Blockquote / Pull Quote

```tsx
<blockquote style={{
  margin: "8px 0 40px",
  padding: "32px 40px",
  background: "rgba(117,6,140,0.15)",
  borderLeft: "3px solid #75068c",
  borderRadius: "0 12px 12px 0",
}}>
  <p style={{
    fontWeight: 300,
    fontSize: "22px",  // 18px mobile
    color: "#ffffff",
    lineHeight: 1.65,
    margin: 0,
    fontStyle: "italic",
  }}>
    "Quote text here."
  </p>
</blockquote>
```

Use for executive quotes, key decisions, or pivotal statements. One per section maximum.

---

### Metric Cards (Hero Stats Grid)

3-column grid (1-col on mobile). Use to lead a section with before/after numbers.

```tsx
<div style={{
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
  gap: "2px",
  margin: "48px 0",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(117,6,140,0.4)",
}}>
```

Each card:
```tsx
<div style={{ padding: isMobile ? "32px 24px" : "40px 32px", background: "rgba(117,6,140,0.18)" }}>
  {/* Label */}
  <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.8px", textTransform: "uppercase", margin: "0 0 20px" }}>{label}</p>

  {/* From value (strikethrough, optional) */}
  <p style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: 200, color: "rgba(247,206,255,0.3)", textDecoration: "line-through", textDecorationColor: "rgba(247,206,255,0.2)", lineHeight: 1, margin: 0 }}>{from}</p>

  {/* To value (hero) */}
  <p style={{ fontSize: isMobile ? "48px" : "64px", fontWeight: 200, color: "#ffffff", lineHeight: 1, margin: 0 }}>{to}</p>

  {/* Sub-text */}
  <p style={{ fontSize: "13px", color: "#f7ceff", opacity: 0.55, margin: "12px 0 0", lineHeight: 1.4 }}>{sub}</p>
</div>
```

---

### Stat Cards (Impact Grid)

Simpler 3-col grid used in Impact / Results sections. Cards have individual borders (not flush/gapped like hero cards).

```tsx
<div style={{ padding: "28px 24px", borderRadius: "12px", background: "rgba(117,6,140,0.2)", border: "1px solid rgba(117,6,140,0.35)" }}>
  <p style={{ fontSize: "48px", fontWeight: 200, color: "#ffffff", lineHeight: 1, margin: "0 0 10px" }}>{stat}</p>
  <p style={{ fontSize: "12px", fontWeight: 600, color: "#ee99ff", letterSpacing: "0.6px", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
  <p style={{ fontSize: "13px", color: "#f7ceff", opacity: 0.55, margin: 0 }}>{sub}</p>
</div>
```

---

### Horizontal Timeline

Used for mandate/milestone timelines. Desktop only — renders as a vertical stack on mobile.

**Container:**
```tsx
<div style={{
  padding: "40px 40px 48px",
  borderRadius: "16px",
  background: "rgba(117,6,140,0.15)",
  border: "1px solid rgba(117,6,140,0.35)",
  margin: "0 0 64px",
}}>
```

**Title:** `12px`, `600`, `#ee99ff`, all caps, `letterSpacing: 0.6px`, `margin: 0 0 40px`

**Track container:** `position: relative`, `height: 200px`

**Horizontal line:**
```tsx
<div style={{ position: "absolute", left: 0, right: 0, top: "100px", height: "2px", background: "linear-gradient(90deg, rgba(117,6,140,0.6) 0%, rgba(238,153,255,0.8) 100%)" }} />
```

**Tick marks:** `1px` wide, `10px` tall, `rgba(238,153,255,0.3)`, placed at intermediate % positions

**Data points:**
- Dot: `12×12px` circle, `background: #ee99ff`, `border: 2px solid rgba(117,6,140,0.9)`
- Date label: `11px`, `600`, `#ee99ff`, all caps, `letterSpacing: 0.7px`
- Event text: `13px`, `400`, `#f7ceff`, `lineHeight: 1.4`, `whiteSpace: "pre-line"` for manual line breaks
- Labels alternate above/below the line to avoid collision
- First/last labels are pinned `left: 0` / `right: 0` (no centering transform) to prevent overflow

**Mobile (vertical):** Same dot + line pattern using flexbox column. Connecting lines between dots use `rgba(117,6,140,0.5)`.

---

### Phase Stepper

Used for sequential process flows (e.g., 4-step migration journey).

**Container:** Same card style as timeline — `rgba(117,6,140,0.15)` background, `rgba(117,6,140,0.35)` border, `16px` radius, `padding: 40px 40px 48px`.

**Connecting line:** Split into 3 segments so line touches (not runs through) each circle:
- Seg 1: `left: 44px` → `right: calc(67% + 22px)`
- Seg 2: `left: calc(33% + 22px)` → `right: calc(33% + 22px)`
- Seg 3: `left: calc(67% + 22px)` → `right: 44px`
- Gradient: purple → pink across all three segments

**Circles:** `44×44px`, `border-radius: 50%`, `background: rgba(117,6,140,0.35)`, `border: 1px solid rgba(238,153,255,0.45)`

**Number labels inside circles:** `12px`, `600`, `#ee99ff`, `letterSpacing: 0.5px`

**Step labels below:** `160px` wide container
- Step name: `13px`, `600`, `#ffffff`
- Step description: `12px`, `400`, `#f7ceff` at 70% opacity, `lineHeight: 1.4`, `whiteSpace: "pre-line"` for manual breaks (keep to 3 lines)

**Mobile:** Vertical layout — circle + connecting line column + text to the right, same dot/line idiom as mobile timeline.

---

### Leadership / Role Cards

3-column grid (1-col mobile, 2-col tablet) for attribution, roles, or leadership breakdowns.

```tsx
<div style={{ padding: "28px 24px", borderRadius: "12px", background: "rgba(97,1,116,0.18)", border: "1px solid rgba(117,6,140,0.3)" }}>
  {/* Icon: 28×28px SVG, stroke="#ee99ff", strokeWidth="1.5", no fill */}
  {icon}
  <p style={{ fontSize: "16px", fontWeight: 500, color: "#ee99ff", margin: "16px 0 8px" }}>{role}</p>
  {/* BulletList with 18px text */}
</div>
```

Icons use a consistent stroke style: `stroke="#ee99ff"`, `strokeWidth="1.5"`, no fill, `viewBox="0 0 32 32"`.

---

## Images

All images live in `/public/assets/`. Reference them with `src="/assets/filename"`.

| Usage | Tag | Notes |
|---|---|---|
| Diagrams / SVGs | `<img>` (not Next.js `<Image>`) | `width: "100%"`, `borderRadius: "16px"`, `margin: "0 0 64px"`, `display: "block"` |
| Screenshots / PNGs with own rounding | `<img>` | `width: "100%"`, `height: "auto"`, **no borderRadius** — the PNG provides its own |
| Cache-busting | Add `?v=2` to src | Use when replacing an image file in place |

Add `// eslint-disable-next-line @next/next/no-img-element` comment before every `<img>` tag to suppress the Next.js lint warning.

---

## Spacing Reference

| Context | Value |
|---|---|
| Between body paragraphs | `margin: 0 0 24px` on each `<p>` |
| Before a subhead (`h3`) | `margin-top: 48px` |
| After a subhead | `margin-bottom: 16px` |
| Card/chart bottom margin | `margin: 0 0 64px` |
| Metric grid top margin | `margin-top: 48px` |
| HR divider vertical margin | `56px` top and bottom |
| Bullet list top/bottom | `margin: 16px 0 24px` |
| Between bullet items | `marginBottom: 2px` |

---

## Section Ordering Convention

The Olive → INK study uses this sequence as a reference:

1. Opening body (2–3 paragraphs, no eyebrow)
2. Hero metric cards
3. *hr*
4. Eyebrow + body + diagram image
5. *hr*
6. Eyebrow + h2 + body + bullets + image
7. *hr*
8. Eyebrow + h2 + body + blockquote + timeline chart
9. *hr*
10. Eyebrow + h2 + body + subheads + bullets + phase stepper
11. *hr*
12. Eyebrow + h2 + body + stat cards + bullets
13. *hr*
14. Leadership / role cards
15. Closing quote card

Future case studies don't need to follow this exact order, but should use the same components and color/type tokens throughout.

---

## Responsive Breakpoints

```ts
isMobile:  width < 768px
isTablet:  768px ≤ width < 1100px
isDesktop: width ≥ 1100px
```

The `useBreakpoint()` hook initializes at `1200px` (desktop) so SSR and hydration always match before the client resizes.

---

## New Case Study Checklist

- [ ] Create a new `<YourProjectContent>` component following the same prop signature: `({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean })`
- [ ] Define `body`, `eyebrow`, `sectionTitle`, `subhead`, and `hr` at the top of the component (copy from `OliveInkContent` verbatim)
- [ ] Define `BulletList` as a nested function inside the component
- [ ] Add the case study to the `CASE_STUDIES` array in `page.tsx`
- [ ] Wire the component into `CaseStudyPanel` via `study?.id === "your-id"` conditional
- [ ] Drop images into `/public/assets/` with a clear naming convention (e.g., `IMAGE1-ProjectName.png`)
- [ ] Remove `comingSoon: true` from the `CASE_STUDIES` entry when the content is ready
