# ICM Workspace Onboarding Questionnaire

**Run once per machine.** Configures the factory (Layer 3), not the product.
Answers populate `_config/`, `shared/`, and stage references.
Flat, all-at-once, system-level only. Derive, don't ask.

---

## Instructions

Answer all questions in a single message. Use defaults where you don't have preferences.
The agent will replace placeholders across the workspace and verify no `{{PLACEHOLDERS}}` remain.

---

## 1. Identity

### 1.1 Organization Name

**Default:** `Bhavya Foundation`
**Your answer:**

### 1.2 Workspace Name

**Default:** `Bhavya OS`
**Your answer:**

### 1.3 Canonical App Name

**Default:** `ai-institute`
**Your answer:**

---

## 2. Brand & Design

### 2.1 Primary Brand Color (Forest)

**Default:** `#1B3A2F` (from `packages/platform-ui/src/styles/tokens.css`)
**Your answer:**

### 2.2 Accent Color (Gold)

**Default:** `#C8A951`
**Your answer:**

### 2.3 Background Color (Ivory)

**Default:** `#F5F0E8`
**Your answer:**

### 2.4 Display Font

**Default:** `Playfair Display`
**Your answer:**

### 2.5 Sans Font

**Default:** `Inter`
**Your answer:**

---

## 3. Development Environment

### 3.1 Package Manager

**Default:** `pnpm`
**Options:** `pnpm` | `npm` | `yarn`
**Your answer:**

### 3.2 Node Version

**Default:** `20.x` (LTS)
**Your answer:**

### 3.3 TypeScript Strict Mode

**Default:** `true`
**Your answer:**

### 3.4 ESLint Config

**Default:** `@bhavya/eslint-config` (workspace package)
**Your answer:**

### 3.5 Prettier Config

**Default:** `@bhavya/prettier-config` (workspace package)
**Your answer:**

---

## 4. Verification Gates

### 4.1 Required Gates (comma-separated)

**Default:** `typecheck,lint,test,build,antislop,tokens:check,file-map:check,registry:check,drift:check`
**Your answer:**

### 4.2 Local Gates (run before commit)

**Default:** `typecheck,lint,antislop,tokens:check,file-map:check,drift:check,git`
**Your answer:**

### 4.3 CI Gates (run on GitHub Actions)

**Default:** `antislop,lint,typecheck,test,secret-scan,build`
**Your answer:**

---

## 5. Git & GitHub

### 5.1 Default Branch

**Default:** `master` (CI target)
**Your answer:**

### 5.2 Production Branch

**Default:** `main` (deploy target)
**Your answer:**

### 5.3 Commit Convention

**Default:** `Conventional Commits` (feat/fix/refactor/docs/chore/test/build/ci)
**Your answer:**

### 5.4 PR Template

**Default:** `.github/PULL_REQUEST_TEMPLATE.md`
**Your answer:**

---

## 6. Deployment

### 6.1 Platform

**Default:** `Vercel`
**Your answer:**

### 6.2 Preview Deployments

**Default:** `enabled` (every PR)
**Your answer:**

### 6.3 Production Domain

**Default:** `bhavya-foundation.vercel.app`
**Your answer:**

### 6.4 Visual Verification

**Default:** `Playwright MCP on deployed URL`
**Your answer:**

---

## 7. Skills & Tools

### 7.1 Bundled Skills (from .opencode/skills/)

**Default:** `all 16 installed skills`
**List:** `bhavya-architecture`, `bhavya-design-system`, `bhavya-content-truth`, `bhavya-data-model`, `bhavya-route-audit`, `bhavya-ui-verification`, `bhavya-security`, `bhavya-github-workflow`, `bhavya-production-verification`, `bhavya-ai-development`, `bhavya-spec`, `bhavya-reasons-canvas`, `bhavya-capability-research`, `impeccable`, `apple-design`, `design-taste-frontend`
**Your answer (comma-separated, or "all"):**

### 7.2 External Skills to Bundle

**Default:** `none`
**Your answer (GitHub URLs or "none"):**

### 7.3 Playwright MCP

**Default:** `enabled` (`.playwright-mcp/`)
**Your answer:**

---

## 8. Workflow Preferences

### 8.1 Default Workflow Stages

**Default:** `discovery,specification,implementation,verification,deployment`
**Your answer:**

### 8.2 Checkpoint Style

**Default:** `present options, human chooses`
**Options:** `present options` | `present draft` | `present diff`
**Your answer:**

### 8.3 Audit Strictness

**Default:** `strict` (all audits must pass)
**Options:** `strict` | `warn-only`
**Your answer:**

### 8.4 Value Types (for validation)

**Default:** `CORRECT,USABLE,MAINTAINABLE,SECURE,ACCESSIBLE`
**Your answer (comma-separated):**

---

## 9. Paths & Conventions

### 9.1 Apps Directory

**Default:** `apps/`
**Your answer:**

### 9.2 Packages Directory

**Default:** `packages/`
**Your answer:**

### 9.3 Docs Directory

**Default:** `docs/`
**Your answer:**

### 9.4 Specs Directory

**Default:** `specs/`
**Your answer:**

### 9.5 RFCs Directory

**Default:** `rfcs/`
**Your answer:**

---

## 10. Derived Fields (Agent Fills Automatically)

_Do not answer — the agent derives these from above._

| Field                               | Derived From                        |
| ----------------------------------- | ----------------------------------- |
| `_config/brand-rules.md`            | Section 2                           |
| `_config/design-tokens.md`          | Section 2 + `packages/platform-ui/` |
| `_config/build-conventions.md`      | Sections 3, 4, 5, 6                 |
| `shared/constants/design-tokens.ts` | Section 2                           |
| `shared/constants/api-constants.ts` | Section 9                           |
| `skills/` symlink                   | Section 7.1                         |
| Stage `references/` files           | Sections 2, 3, 4, 7                 |

---

## Verification

After answering, the agent will:

1. Replace all `{{PLACEHOLDERS}}` in workspace files
2. Create `skills/` symlink to `.opencode/skills/`
3. Run `pnpm tokens:check` to verify design tokens
4. Run `pnpm typecheck` to verify TypeScript constants
5. Report: "Setup complete — no placeholders remain"
