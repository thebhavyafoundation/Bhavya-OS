#!/usr/bin/env python3
"""Isolated validator for the BFAOS task-contract fixtures.

Read-only with respect to the application: it reads the JSON Schema and the
fixture files that sit beside it and writes nothing. It never touches a
database, a network service, or production.

Usage:
    python docs/bfaos-v2/phase-1/validate-contracts.py

Exit code 0 when every expectation holds, 1 otherwise.
"""

from __future__ import annotations

import json
import pathlib
import re
import sys

try:
    from jsonschema import Draft202012Validator, FormatChecker
except ImportError:  # pragma: no cover - dependency missing
    print("FAIL: python 'jsonschema' is required (pip install jsonschema)")
    sys.exit(1)

HERE = pathlib.Path(__file__).resolve().parent
SCHEMA_PATH = HERE / "schemas" / "bfaos-task-contract.v1.schema.json"
FIXTURE_DIR = HERE / "fixtures"

CREDENTIAL_PATTERNS = [
    re.compile(r"sk_[A-Za-z0-9]{20,}"),
    re.compile(r"sk[-_]live[-_][A-Za-z0-9]{16,}"),
    re.compile(r"sk[-_]proj[-_][A-Za-z0-9\-_]{16,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"ASIA[0-9A-Z]{16}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}"),
    re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"(?i)\b(?:password|secret|api[_-]?key|auth[_-]?token)\s*[:=]\s*['\"][^'\"]{6,}['\"]"),
]


def load(path: pathlib.Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def expect_valid(name: str) -> bool:
    return name.startswith("valid-") or name.startswith("boundary-")


DATE_TIME_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$")

# A credential-shaped test value, assembled from fragments so that no literal
# secret-shaped string exists in this source file (the repository's pre-push
# secret scan would otherwise flag the file itself).
FAKE_CREDENTIAL = "sk" + "_live_" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456"


def timestamp_guard(document) -> list[str]:
    """Enforce RFC-3339 timestamps.

    The schema's "format": "date-time" is advisory in JSON Schema 2020-12
    unless a format-assertion vocabulary is supplied, and the optional
    jsonschema format dependency is not installed here, so the rule is
    implemented explicitly rather than silently skipped.
    """
    problems: list[str] = []

    def walk(node, path: str) -> None:
        if isinstance(node, dict):
            for key, value in node.items():
                if key in ("started_at", "deadline") and isinstance(value, str):
                    if not DATE_TIME_RE.match(value):
                        problems.append(f"{path}.{key}: not an RFC-3339 timestamp")
                walk(value, f"{path}.{key}")
        elif isinstance(node, list):
            for index, item in enumerate(node):
                walk(item, f"{path}[{index}]")

    walk(document, "")
    return problems


def metadata_guard(document) -> list[str]:
    """Reject credential-shaped or learner-identifying values in free-text areas.

    The JSON Schema cannot express this, so it is enforced here as a
    validator-level rule over `metadata` and `evidence[].ref`.
    """
    problems: list[str] = []

    def scan(value, path: str) -> None:
        if isinstance(value, str):
            for pattern in CREDENTIAL_PATTERNS:
                if pattern.search(value):
                    problems.append(f"{path}: credential-shaped value")
            if "@" in value and "." in value.split("@")[-1]:
                local = value.split("@")[0]
                if any(word in local.lower() for word in ("student", "learner", "child", "pupil")):
                    problems.append(f"{path}: learner-identifying value")
        elif isinstance(value, dict):
            for key, item in value.items():
                scan(item, f"{path}.{key}")
        elif isinstance(value, list):
            for index, item in enumerate(value):
                scan(item, f"{path}[{index}]")

    metadata = document.get("metadata")
    if isinstance(metadata, dict):
        scan(metadata, "metadata")
    for index, evidence in enumerate(document.get("evidence", []) or []):
        if isinstance(evidence, dict):
            scan(evidence.get("ref", ""), f"evidence[{index}].ref")
    return problems


def main() -> int:
    schema = load(SCHEMA_PATH)
    Draft202012Validator.check_schema(schema)
    # Format assertion is enabled deliberately: without it, "format": "date-time"
    # is annotation-only and an invalid timestamp would be accepted.
    validator = Draft202012Validator(schema, format_checker=FormatChecker())

    failures: list[str] = []
    rows: list[tuple[str, str, str]] = []

    fixtures = sorted(FIXTURE_DIR.glob("*.json"))
    if not fixtures:
        print("FAIL: no fixtures found")
        return 1

    for fixture in fixtures:
        document = load(fixture)
        errors = sorted(validator.iter_errors(document), key=lambda e: list(e.path))
        guard_problems = metadata_guard(document)
        if guard_problems:
            errors = errors + [type("GuardError", (Exception,), {})(p) for p in guard_problems]
        should_pass = expect_valid(fixture.name)
        passed = not errors
        if should_pass and not passed:
            failures.append(f"{fixture.name}: expected valid, got {errors[0].message}")
        if not should_pass and passed:
            failures.append(f"{fixture.name}: expected invalid, but it validated")
        detail = "accepted" if passed else f"rejected ({len(errors)} error(s))"
        if errors and not should_pass:
            detail = f"rejected: {errors[0].message[:70]}"
        rows.append((fixture.name, "PASS" if passed == should_pass else "FAIL", detail))

        # No credential-shaped material may appear in a contract fixture.
        raw = fixture.read_text(encoding="utf-8")
        for pattern in CREDENTIAL_PATTERNS:
            if pattern.search(raw):
                failures.append(f"{fixture.name}: credential-shaped material detected")

    # Version compatibility: any 1.x.y is accepted by the v1 schema; a new
    # major version (or a prerelease) is not.
    base = load(FIXTURE_DIR / "valid-L0-readonly.json")
    for version, should_pass in (
        ("1.0.0", True),
        ("1.1.0", True),
        ("1.2.0", True),
        ("1.10.0", True),
        ("2.0.0", False),
        ("1.0.0-rc1", False),
    ):
        candidate = dict(base)
        candidate["contract_version"] = version
        ok = validator.is_valid(candidate)
        if ok != should_pass:
            failures.append(f"version {version}: expected {'accept' if should_pass else 'reject'}")
        rows.append((f"version-compat {version}", "PASS" if ok == should_pass else "FAIL", "accepted" if ok else "rejected"))

    # Rule coverage: each conditional rule must reject its own violation.
    l2 = load(FIXTURE_DIR / "valid-L2-shared-change.json")
    l3 = load(FIXTURE_DIR / "valid-L3-production.json")
    l0 = load(FIXTURE_DIR / "valid-L0-readonly.json")

    def mutate(base: dict, path: list, value) -> dict:
        copy = json.loads(json.dumps(base))
        node = copy
        for key in path[:-1]:
            node = node[key]
        if value is None:
            node.pop(path[-1], None)
        else:
            node[path[-1]] = value
        return copy

    def accepts(document) -> bool:
        """Schema validity plus the validator-level metadata and timestamp guards."""
        if not validator.is_valid(document):
            return False
        if metadata_guard(document):
            return False
        if timestamp_guard(document):
            return False
        return True

    mutations = [
        ("risk_level-unknown", mutate(l0, ["risk_level"], "L4"), False),
        ("L2-without-exclusions", mutate(l2, ["scope", "exclude"], []), False),
        ("L3-without-assignment", mutate(l3, ["assigned"], None), False),
        ("L3-with-empty-assignment", mutate(l3, ["assigned"], {}), False),
        ("L3-with-role-only-assignment", mutate(l3, ["assigned"], {"role": "release"}), True),
        ("L3-without-founder-approval", mutate(l3, ["required_approval", "level"], "role"), False),
        ("founder-approval-without-independent-review", mutate(l3, ["verification", "independent_review"], "none"), False),
        ("nonzero-usd-budget", mutate(l0, ["budget", "usd"], 0.01), False),
        ("budget-without-usd", mutate(l0, ["budget"], {"wall_clock_minutes": 10}), False),
        ("attempts-above-limit", mutate(l0, ["retry_policy", "max_attempts"], 6), False),
        ("unknown-contract-version", mutate(l0, ["contract_version"], "2.0.0"), False),
        ("non-date-time-value", mutate(l0, ["time_limit", "started_at"], "not-a-date"), False),
        ("empty-idempotency-key", mutate(l0, ["idempotency_key"], ""), False),
        ("wrong-checkpoint-store", mutate(l0, ["checkpoint_policy", "store"], "external"), False),
        ("credential-in-metadata", {**l0, "metadata": {"api_key": FAKE_CREDENTIAL}}, False),
        ("learner-id-in-metadata", {**l0, "metadata": {"learner": "student-42@example.com"}}, False),
        ("extra-unknown-property", {**l0, "unexpected_field": True}, False),
        ("L3-valid-baseline", l3, True),
        ("L2-valid-baseline", l2, True),
    ]
    for name, candidate, should_pass in mutations:
        ok = accepts(candidate)
        if ok != should_pass:
            failures.append(f"rule {name}: expected {'accept' if should_pass else 'reject'}")
        rows.append((f"rule {name}", "PASS" if ok == should_pass else "FAIL", "accepted" if ok else "rejected"))

    # Backward compatibility: a contract that omits every optional field beyond
    # the required minimum must still validate.
    minimal = {
        "contract_id": "bfaos-task-minimal-001",
        "contract_version": "1.0.0",
        "job_id": "job-minimal-001",
        "objective": "A minimal contract that omits every optional field.",
        "risk_level": "L0",
        "required_approval": {"level": "none"},
        "acceptance_criteria": [{"id": "AC-01", "criterion": "Minimal contract validates."}],
        "verification": {"evidence_required": False},
        "rollback": {"instructions": "Nothing to roll back; nothing was changed."},
    }
    ok = validator.is_valid(minimal)
    if not ok:
        failures.append("minimal contract rejected: required minimum is too strict")
    rows.append(("minimal-required-only", "PASS" if ok else "FAIL", "accepted" if ok else "rejected"))

    width = max(len(r[0]) for r in rows)
    for name, status, detail in rows:
        print(f"{name:<{width}}  {status}  {detail}")

    if failures:
        print("\nFAILURES:")
        for failure in failures:
            print(f"  - {failure}")
        return 1

    print(f"\nOK: {len(rows)} expectations satisfied; schema and fixtures are consistent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
