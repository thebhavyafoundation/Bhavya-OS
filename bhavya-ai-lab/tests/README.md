# Validation Tests

**BICM Version:** 1.0.0  
**Purpose:** Ensure workspace integrity  

## The Five Tests

### 1. Walk Test
**Question:** Can a new agent navigate using local context alone?

**Procedure:**
1. Give an agent (human or AI) this workspace
2. Remove all external context (no conversation history)
3. Ask the agent to complete a task
4. Agent must succeed using only local files

**Pass Criteria:**
- Agent finds the right folder
- Agent understands the task
- Agent completes the work
- Agent reports status correctly

### 2. Build Test
**Question:** Can the workspace generate a complete lesson from source materials?

**Procedure:**
1. Take a Knowledge Object
2. Run it through the Lesson Factory
3. Verify output includes all required sections
4. Validate output against schema

**Pass Criteria:**
- All required sections present
- Schema validation passes
- Content is accurate
- Local examples included

### 3. Offline Test
**Question:** Can it function without internet?

**Procedure:**
1. Disconnect from internet
2. Navigate the workspace
3. Read all content
4. Complete exercises
5. Take assessments

**Pass Criteria:**
- All content accessible
- No broken references
- Assessments work
- Progress tracked locally

### 4. Rebuild Test
**Question:** Can a deleted output be regenerated from source assets?

**Procedure:**
1. Note an output file (e.g., a PDF)
2. Delete the output
3. Run the appropriate factory
4. Verify regenerated output matches original

**Pass Criteria:**
- Output regenerated successfully
- Content matches original
- Version metadata preserved
- No manual intervention needed

### 5. Explainability Test
**Question:** Can the system identify exactly which knowledge objects, rules, and components were used to produce an output?

**Procedure:**
1. Take any output
2. Trace back to source Knowledge Objects
3. Identify all components used
4. List all rules applied
5. Document the compilation path

**Pass Criteria:**
- Complete source traceability
- All components identified
- All rules documented
- Compilation path clear

## Test Automation

Tests can be run with:
```bash
pnpm test:walk
pnpm test:build
pnpm test:offline
pnpm test:rebuild
pnpm test:explain
```

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial validation tests |
