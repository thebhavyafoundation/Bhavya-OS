# BHAVYA OS — EVENT BUS CONTRACTS

Instead of direct inter-agent calls, agents emit and consume versioned events via the Bhavya OS Event Bus.

## Event Contracts

### 1. `documentation.updated` (v1)
- **Producer**: `agent.documentation`
- **Consumers**: `agent.release`, `agent.governance`, `apps/admin` (Dashboard)
- **Payload**:
  ```json
  {
    "doc_id": "string",
    "path": "string",
    "change_type": "created | modified | deleted",
    "author": "string",
    "timestamp": "ISO-8601"
  }
  ```

### 2. `quality.gate_passed` (v1)
- **Producer**: `agent.release`
- **Consumers**: `agent.founder`, `apps/admin` (Dashboard)
- **Payload**:
  ```json
  {
    "release_tag": "string",
    "gates": ["build", "typecheck", "lint", "a11y"],
    "status": "PASSED",
    "timestamp": "ISO-8601"
  }
  ```

### 3. `adr.accepted` (v1)
- **Producer**: `agent.founder`
- **Consumers**: `agent.engineering`, `agent.documentation`, `agent.governance`
- **Payload**:
  ```json
  {
    "adr_number": "ADR-XXXX",
    "title": "string",
    "approved_by": "string",
    "timestamp": "ISO-8601"
  }
  ```

### 4. `gateway.provider_switched` (v1)
- **Producer**: `agent.engineering`
- **Consumers**: `apps/admin` (Dashboard), `agent.release`
- **Payload**:
  ```json
  {
    "previous_provider": "string",
    "new_provider": "string",
    "reason": "failover | configuration",
    "timestamp": "ISO-8601"
  }
  ```
