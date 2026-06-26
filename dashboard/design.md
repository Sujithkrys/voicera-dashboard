# Design Rules — Databolt Contact Dashboard

This document is the single source of truth for all visual and structural decisions in this application. Every rule here reflects the exact reference design. Do not deviate without updating this file.

---

## 1. Color Palette

| Role | Value | Usage |
|---|---|---|
| Page background | `#fafafa` | `<main>` and root container |
| Card / surface background | `#ffffff` | Metric cards, data table |
| Body text | system default / Tailwind `foreground` | Names, values |
| Muted text | `#6b7280` (gray-500) | Metric labels, table secondary cells |
| Subtler muted text | `#9ca3af` (gray-400) | Metric subtitles (e.g. "94%", "Normal") |
| Line chart stroke | `#9ca3af` | Recharts `<Line>` stroke |
| Stem chart color | `#d1d5db` (gray-300) | StemChart bar fill |
| Border | Tailwind `border` token | Table wrapper, sidebar dividers |

---

## 2. Layout

### Root structure
- `SidebarProvider` wraps the entire app.
- A flex row contains the sidebar and `<main>`.
- Both the outer div and `<main>` carry `bg-[#fafafa]`.
- `<main>` is `flex-1 overflow-auto`.

### Content area
- Single column, padded with `p-6`.
- Vertical rhythm between sections: `space-y-6`.
- Sections in order: **Header → Metrics → Filters → Table → Pagination**.

---

## 3. Sidebar

| Element | Rule |
|---|---|
| Brand icon | `<Database>` from lucide-react, `size-6` |
| Brand name | "Databolt", `font-semibold text-base` |
| Header | `border-b px-4 py-4` |
| Active nav item | `isActive` prop on `SidebarMenuButton` |
| Contacts item | Collapsible, shows chevron; default open (`useState(true)`) |
| Sub-items | All, Dashboard, Email, Analytics, Reports & reports, Documents |
| Team management | Section label + collapsible "Entity Data" item (default closed) |
| Footer | User avatar initials "ED" in a `rounded-full bg-primary/10` circle, label "Entity Data" |

**Navigation items (in order):** Dashboard, Quick actions, My hub, Contacts *(collapsible)*, Members, Tasks.

---

## 4. Page Header

- Left side: `<h1>` "Default" (`text-xl font-semibold`) + ghost buttons "Edit properties" and "+".
- Right side: outline button "Add contact".
- Layout: `flex items-center justify-between`.

---

## 5. Metric Cards

### Grid
- `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4`
- Exactly **5 cards**, one per metric below.

### Card shell
- `bg-white shadow-sm border-0` — no visible border, only shadow.
- `CardContent` padding: `pt-6 pb-4 px-4`.

### Card anatomy (top to bottom)
1. **Label row** — metric name in `text-xs text-[#6b7280] font-normal` + a right-chevron SVG icon (`w-3 h-3`) beside it.
2. **Value row** — primary value at `text-[28px] font-semibold leading-none`. If a subtitle exists, it appears inline at `text-xs text-[#9ca3af] font-normal`.
3. **Chart area** — `h-12`, negative margins `-mx-4 -mb-4 mt-3` so the chart bleeds to card edges.

### The 5 metrics (exact values)

| # | Label | Value | Subtitle | Chart type |
|---|---|---|---|---|
| 1 | Total contacts | 936 | — | Line chart |
| 2 | Active contacts | 856 | 94% | Line chart |
| 3 | Forgotten | 80 | 6% | Stem chart |
| 4 | Contact velocity | 1:42 | Normal | Stem chart |
| 5 | Data health | 82% | — | Stem chart |

---

## 6. Chart Types

### Line chart (metrics 1 & 2)
- Component: Recharts `<LineChart>` inside `<ResponsiveContainer width="100%" height="100%">`.
- `<Line type="monotone" dataKey="value" stroke="#9ca3af" strokeWidth={1} dot={false}>`
- No axes, no grid, no tooltip.
- Data shape: 10 `{ value: number }` points showing an upward trend.

### Stem chart (metrics 3, 4, 5)
- Component: `src/app/components/StemChart.tsx` (custom, not Recharts).
- Renders ~60 data points as **individual 1 px wide vertical lines** aligned to the bottom of the container.
- Gap between stems: `2px`.
- Each stem height is proportional to its value relative to the dataset's min/max range, minimum rendered height 2 px.
- Stem color: `#d1d5db`.
- Container: `flex items-end px-3 w-full h-full`.
- Data is generated randomly at render time (`Math.random()`); stems are decorative, not data-precise.

**Critical distinction:** Stem charts use 1 px thin vertical tick marks. They are NOT bar charts. Do not use Recharts `<BarChart>` for these.

---

## 7. Filter Bar

- Layout: `flex items-center gap-2`.
- Search input: `max-w-sm`, left-padded (`pl-9`) with a `<Search>` icon absolutely positioned.
- "Filters" button: outline variant, `size="sm"`, `<Filter>` icon.
- "Customize" button: outline variant, `size="sm"`, `<Settings>` icon, pushed to the right with `ml-auto`.

---

## 8. Data Table

### Wrapper
- `border rounded-lg bg-white shadow-sm` — rounded white card with border.

### Columns (in order)
| Column | Notes |
|---|---|
| Checkbox | `w-12`, selects/deselects the row |
| Name | `font-medium text-sm` |
| Job title | `text-sm text-muted-foreground` |
| Email | `text-sm text-muted-foreground` |
| Department | `text-sm text-muted-foreground` |
| Location | `text-sm text-muted-foreground` |
| Current status | Badge component (see §9) |
| Actions | `w-12` column, `<MoreHorizontal>` ghost button |

### Header row
- All column headers: `text-xs font-medium`.
- First column has the "select all" checkbox.

### Row data — all 13 contacts (exact order)

| # | Name | Job title | Email | Department | Location | Status |
|---|---|---|---|---|---|---|
| 1 | Amelia Evans | Glacé & Glam | LH Researcher | Napolje Falls | Active | active |
| 2 | Isabella Carter | Agua Coral | Project Manager | Louisville | Active | active |
| 3 | Benjamin Taylor | Extra Media | Software Developer | Troy | Active | active |
| 4 | Ava Williams | Unidesk | Customer Success Specialist | Unqualified | Unqualified | unqualified |
| 5 | Emma Collins | TrendForce | Project Manager | Bradeview | Active | active |
| 6 | Jacob Anderson | Lightware | Operations Coordinator | Erica Forks | Active | active |
| 7 | Isabella Stewart | LaraCore | Marketing Coordinator | Birgittalyn | Active | active |
| 8 | Ava Parker | Creative Edge | Lead Analyst | Rochester | New | new |
| 9 | Liam Parker | Sports Edge | Lead Analyst | Rochester | New | new |
| 10 | Mia Johnson | Vera Loops | Product Developer | Lake Ricardo | Active | active |
| 11 | Mason Brooks | Embler Solutions | Data Analyst | Shermandale | Active | active |
| 12 | Noah Wilson | Enrichment Systems | Product Owner | West Rancho | Unqualified | unqualified |
| 13 | Oliver Sutton | Neuralflow | Product Owner | West Rancho | Unqualified | unqualified |

### Row selection
- `useState<string[]>([])` tracks selected row IDs.
- `toggleRow(id)` adds/removes a single ID.
- `toggleAll()` selects all or clears all.

---

## 9. Status Badges

Defined via `cva` variants in `src/app/components/ui/badge.tsx`.

| Variant | Background | Text color | Usage |
|---|---|---|---|
| `active` | `#e8f5e9` (light green) | `#2e7d32` (dark green) | Active contacts |
| `new` | `#e3f2fd` (light blue) | `#1565c0` (dark blue) | New contacts |
| `unqualified` | `#ede7f6` (light purple) | `#5e35b1` (dark purple) | Unqualified contacts |

- All custom variants use `border-transparent` (no visible border).
- Base badge styles: `rounded-md px-2 py-0.5 text-xs font-medium`.
- The `variant` prop on `<Badge>` accepts `"active" | "new" | "unqualified"` in addition to the default shadcn variants.

---

## 10. Pagination

- Left side: `text-sm text-muted-foreground` label — "Contacts 1-10 of 195".
- Right side: shadcn `<Pagination>` component.
- Pages shown: Previous · 1 (active) · 2 · 3 · … · Next.
- Layout: `flex items-center justify-between`.

---

## 11. Typography

- No custom Google Fonts loaded; system font stack via Tailwind defaults.
- Font weights in use: `font-normal` (labels, muted), `font-medium` (table headers, names), `font-semibold` (brand name, page title, metric values).
- Metric value size: `text-[28px]` (not a standard Tailwind step — use the arbitrary value exactly).

---

## 12. Component File Map

| File | Purpose |
|---|---|
| `src/app/App.tsx` | Root layout, sidebar, metrics, filters, table, pagination |
| `src/app/components/StemChart.tsx` | Custom stem/tick-mark chart for metrics 3–5 |
| `src/app/components/ui/badge.tsx` | Badge with custom `active`, `new`, `unqualified` variants |
| `src/styles/theme.css` | Tailwind design tokens — do not break existing token names |
| `src/styles/fonts.css` | Google Fonts imports (currently empty) |

---

## 13. Do-Nots

- Do not use `<BarChart>` from Recharts for stem charts.
- Do not add a CSS reset (`* { margin: 0; padding: 0 }`) — Tailwind's base layer already resets.
- Do not change the Tailwind token names in `theme.css` (`--background`, `--foreground`, `--border`, etc.).
- Do not add tooltip, axis, or grid to any chart in the metric cards.
- Do not use inline styles for layout — use Tailwind classes.
- Do not add features, extra nav items, or metrics beyond those specified.
