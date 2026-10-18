# Review train status — 2026-10-18

Verified against live GitHub state, not from prior summaries.

## Repository state

- `master`: `9bad2803841b60745d6a76f636c9f78bac9ef7e6`
- No direct push to `master` has been made in this session.

## Pull requests

| PR  | Branch                               | Head       | State       | Files | Dependant on #37?             |
| --- | ------------------------------------ | ---------- | ----------- | ----- | ----------------------------- |
| #37 | `fix/opennext-libsql-bundle`         | `ed5601d8` | open, ready | 6     | —                             |
| #40 | `ci/deploy-gated-on-opennext`        | `476a43c1` | open, draft | 2     | no                            |
| #41 | `feat/lesson-experience-shell`       | `15799ff2` | open, draft | 11    | **yes — contains all of #37** |
| new | `feat/curriculum-lesson-shell-clean` | `aec496c4` | —           | 6     | **no**                        |

## Branch graph

```
master 9bad2803
 ├─ #37 fix/opennext-libsql-bundle  ed5601d8   (9 commits: Turso fixes + OpenNext diagnostics)
 │   └─ #41 feat/lesson-experience-shell 15799ff2  (adds 1 UI commit ON TOP of #37)
 ├─ #40 ci/deploy-gated-on-opennext  476a43c1  (independent)
 └─ NEW feat/curriculum-lesson-shell-clean aec496c4  (independent, 2 commits)
```

## Entanglement

**PR #41 was entangled with #37.** It carried all nine of #37's commits plus one
UI commit. A reviewer wanting only the lesson UX would have had to review Turso
database fixes and the OpenNext build incident at the same time.

`feat/curriculum-lesson-shell-clean` resolves this: the UI commit was
cherry-picked onto `master`, and the lesson-registration fix added on top.
Verified independent — the diff contains no reference to `TURSO`, `libsql`,
`executeMultiple`, `open-next`, or any build script.

## #41 disposition

**Superseded by the clean branch.** Its UI work is preserved byte-identically in
`feat/curriculum-lesson-shell-clean`; its #37 content remains available in #37.
#41 can be closed.

Note: the clean branch uses CSS Modules where #41 appended to `globals.css`.
Same tokens, same visual outcome, better encapsulation and a far smaller diff.

## Blocking issue found on the clean branch

Every lesson route 404'd. Fixed on the clean branch — see
`docs/experience/lesson-shell-validation.md`. This is why #41's slice could not
have been validated: the route never rendered.

## Recommended merge order

1. **#40** (`476a43c1`) — deploy gate. Splitting build from upload and gating
   `deploy` on `needs: build` is the prerequisite for trusting any later deploy.
   Safe to merge; does not deploy.
2. **Clean curriculum branch** — independent of #37. Merging **does trigger a
   Cloudflare deploy** (any `master` push does), which will fail at the OpenNext
   build for the #37 reason and upload nothing.
3. **#37** — blocked. Do not merge until the packaging cause is understood.

### Deploy-triggering merges

Every one of #40 and the curriculum branch triggers a Cloudflare deploy run on
merge. Only #37's merge would be expected to _fix_ a deploy; the other two would
produce a red, gated run with no upload.

### Can curriculum work merge independently of #37?

**Yes.** The clean branch has no dependency on #37 in code, tests or imports. Its
CI `build` job passes on `master`'s content plus these changes. The only
interaction is that a merge triggers a deploy that will fail for #37's unrelated
reason.

## Evidence

- CI on `feat/lesson-experience-shell` @ `15799ff2`: run `39112102004`, 5/5 jobs
  green including `build`.
- Local: typecheck clean, 65/65 curriculum tests pass, Anti-Slop pass.
- Browser: lesson routes 200 at five viewports, zero horizontal overflow.
