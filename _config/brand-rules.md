# Brand Rules — Bhavya Foundation

**Canonical source for brand voice, palette, and typography.**
Derived from `docs/constitution/01-BRAND-CONSTITUTION.md` and `docs/constitution/05-DESIGN-SYSTEM.md`.
This file is the single reference for all stages. Do not duplicate.

---

## Voice & Tone

### Core Voice Attributes

- **Authoritative but accessible** — Expert knowledge, plain language
- **Institutional** — Speaks for the foundation, not an individual
- **Optimistic realism** — Acknowledges challenges, focuses on solutions
- **Precise** — Specific claims, traceable to evidence

### Voice Rules

- Use "we" for foundation actions, "you" for user guidance
- Avoid: "I think", "in my opinion", hedging language
- Avoid: marketing fluff ("revolutionary", "game-changing", "seamless")
- Prefer: concrete outcomes ("reduces build time 40%", "serves 10K users")

### What the Voice Is NOT

- ❌ Casual/chatty
- ❌ Self-promotional
- ❌ Vague or aspirational without evidence
- ❌ Technical jargon without explanation

---

## Color Palette

**Source of truth:** `packages/platform-ui/src/styles/tokens.css` (--color-* definitions)

| Role      | Token            | Hex (Reference) | Usage                                    |
| --------- | ---------------- | --------------- | ---------------------------------------- |
| Primary   | `--color-forest` | #1B3A2F         | Headers, primary actions, brand identity |
| Secondary | `--color-ivory`  | #F5F0E8         | Backgrounds, card surfaces               |
| Accent    | `--color-gold`   | #C8A951         | CTAs, highlights, accents                |
| Earth     | `--color-earth`  | #8B7355         | Secondary text, borders                  |
| Error     | `--color-error`  | #C0392B         | Error states, destructive actions        |

**Rule:** Never hardcode hex values. Always reference tokens: `var(--color-forest)`.

---

## Typography

**Source of truth:** `packages/platform-ui/src/styles/tokens.css` (--font-* definitions)

| Role    | Token            | Font Family               | Usage                                |
| ------- | ---------------- | ------------------------- | ------------------------------------ |
| Display | `--font-display` | "Playfair Display", serif | Headlines, hero text, major headings |
| Sans    | `--font-sans`    | "Inter", sans-serif       | Body text, UI, code, data            |

**Scale:** Use CSS custom properties for sizing (`--text-*`), not raw rem/px.

---

## Logo & Marks

- **Primary mark**: Bhavya wordmark in forest
- **Secondary**: Monogram "B" in gold on forest
- **Clear space**: 1x mark height on all sides
- **Minimum width**: 120px (wordmark), 32px (monogram)

---

## Writing Conventions

### Numbers

- 1–9: spell out (one, two, three)
- 10+: numerals (10, 100, 1000)
- Percentages: numerals + % (40%, not forty percent)
- Large numbers: 10K, 1.2M, 3.4B

### Dates

- ISO: YYYY-MM-DD (2026-10-07)
- Display: Month D, YYYY (October 7, 2026)

### Capitalization

- Sentence case for headings (not Title Case)
- Proper nouns: Bhavya Foundation, AI Institute, GitHub OS
- Technical terms: TypeScript, Next.js, SQLite, pnpm

### Acronyms

- First use: Full term (Model Context Protocol)
- Subsequent: Acronym (MCP)
- Common exceptions: API, UI, AI, OS, CLI, JSON, SQL

---

## References

- `docs/constitution/01-BRAND-CONSTITUTION.md` — Full brand constitution
- `docs/constitution/05-DESIGN-SYSTEM.md` — Design system mechanics
- `packages/platform-ui/src/styles/tokens.css` — Token implementations
- `packages/platform-ui/src/components/` — Component library
