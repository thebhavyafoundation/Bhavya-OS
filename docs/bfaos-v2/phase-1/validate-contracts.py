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
    from jsonschema import Draft202012Validator
except ImportError:  # pragma: no cover - dependency missing
    print("FAIL: python 'jsonschema' is required (pip install jsonschema)")
    sys.exit(1)

HERE = pathlib.Path(__file__).resolve().parent
SCHEMA_PATH = HERE / "schemas" / "bfaos-task-contract.v1.schema.json"
FIXTURE_DIR = HERE / "fixtures"

CREDENTIAL_PATTERNS = [
    re.compile(r"sk_[A-Za-z0-9]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"ghp_[A-Za-z0-9]{36}"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"(?i)\b(?:password|secret|api[_-]?key)\s*[:=]\s*['\"][^'\"]{6,}['\"]"),
]


def load(path: pathlib.Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def expect_valid(name: str) -> bool:
    return name.startswith("valid-") or name.startswith("boundary-")


def main() -> int:
    schema = load(SCHEMA_PATH)
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)

    failures: list[str] = []
    rows: list[tuple[str, str, str]] = []

    fixtures = sorted(FIXTURE_DIR.glob("*.json"))
    if not fixtures:
        print("FAIL: no fixtures found")
        return 1

    for fixture in fixtures:
        document = load(fixture)
        errors = sorted(validator.iter_errors(document), key=lambda e: list(e.path))
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

    # Version compatibility: minor versions inside v1 are accepted, a new major
    # version is not (it requires a new schema).
    base = load(FIXTURE_DIR / "valid-L0-readonly.json")
    for version, should_pass in (("1.0.0", True), ("1.1.0", True), ("2.0.0", False)):
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

    mutations = [
        ("risk_level-unknown", mutate(l0, ["risk_level"], "L4"), False),
        ("L2-without-exclusions", mutate(l2, ["scope", "exclude"], []), False),
        ("L3-without-assignment", mutate(l3, ["assigned"], None), False),
        ("L3-without-founder-approval", mutate(l3, ["required_approval", "level"], "role"), False),
        ("founder-approval-without-independent-review", mutate(l3, ["verification", "independent_review"], "none"), False),
        ("nonzero-usd-budget", mutate(l0, ["budget", "usd"], 0.01), False),
        ("attempts-above-limit", mutate(l0, ["retry_policy", "max_attempts"], 6), False),
        ("unknown-contract-version", mutate(l0, ["contract_version"], "1.2.0"), False),
        ("extra-unknown-property", {**l0, "unexpected_field": True}, False),
        ("L3-valid-baseline", l3, True),
        ("L2-valid-baseline", l2, True),
    ]
    for name, candidate, should_pass in mutations:
        ok = validator.is_valid(candidate)
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
