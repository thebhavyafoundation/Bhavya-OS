# BHAVYA OS — REPEATABLE WORKFLOW SPECIFICATION

Workflows in Bhavya OS are classified into six institutional operational domains. Every workflow follows a deterministic step-by-step pipeline.

## Classified Workflows

### 1. Development Workflows
- `dev.feature_branch`: Feature planning → Component generator → Implementation → Local test suite → PR creation.
- `dev.code_review`: Automated linting → Typecheck → BAR architecture check → PR approval.

### 2. Operations Workflows
- `ops.platform_boot`: AI Gateway start → Environment validation → Agent registration → Dashboard start.
- `ops.registry_refresh`: Codebase scan → Manifest generation → Schema validation → Registry publish (`pnpm registry:generate`).

### 3. Governance Workflows
- `gov.adr_proposal`: Context definition → Alternative evaluation → ADR document drafting → Founder review → ADR-XXXX commitment.
- `gov.policy_audit`: Policy verification against code → Compliance report → Violation alert.

### 4. Release Workflows
- `rel.version_bump`: Quality gates run (`pnpm build`, `pnpm typecheck`, `pnpm lint`) → Changeset consume → Tag release → Snapshot archive → Changelog update.

### 5. Incident Workflows
- `inc.gateway_failover`: Detect provider endpoint failure → Route to backup provider → Emit `system.alert` event → Log incident.

### 6. Knowledge Workflows
- `know.mdx_ingestion`: MDX parse → Index generation → Document manifest update → Knowledge base sync.
