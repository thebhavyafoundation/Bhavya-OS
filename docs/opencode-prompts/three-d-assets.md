# OpenCode Prompt — 3D Asset Sourcing and Optimisation

Read first:

- `/AGENTS.md`
- `/docs/architecture/PLATFORM-TRUTH.md`
- asset and licensing docs
- current Three.js/R3F implementation
- current B2 asset policy
- current GitHub Actions media/asset workflows

## Goal

Source, verify, optimise and integrate 3D assets for Bhavya Foundation public
stories and educational experiences using only approved free/open assets and
zero-budget-compatible workflows.

## Permanent constraints

- Do not use Cloudflare R2.
- Do not store large production binaries in Git.
- Do not use unverified asset licences.
- Do not download assets only because they look impressive.
- Every asset must support the information shown on the page.
- Heavy optimisation belongs in GitHub Actions, not the local i5/8 GB machine.
- Every production 3D scene needs mobile and static fallbacks.

## Approved source types

Check asset-by-asset from:

- Poly Haven
- ambientCG
- Kenney
- Khronos glTF sample assets
- Smithsonian Open Access
- Wikimedia Commons
- NASA or official science repositories
- OpenGameArt with per-item review

## Asset intake procedure

For every asset:

1. Record source URL.
2. Record creator.
3. Record exact licence and licence URL.
4. Record use case and route.
5. Checksum original.
6. Inspect geometry/materials/textures.
7. Remove unused content.
8. Create mobile and desktop variants.
9. Generate poster fallback.
10. Create manifest entry.
11. Stage for review.
12. Publish only approved derivatives.

## Storage rules

- metadata/manifests in Git
- reviewed lightweight SVG/posters may stay in Git
- large GLB/KTX2/video/audio derivatives live in B2
- use hashed immutable names
- never expose B2 credentials in browser code

## Performance rules

- lazy load 3D
- dynamic import heavy code
- mobile first
- budget initial 3D transfer tightly
- no unnecessary shadows/post-processing
- pause rendering when hidden
- dispose resources
- provide reduced-motion and no-WebGL fallback

## CI/automation rules

Use GitHub Actions only when relevant asset paths change.

Allowed cloud processing:

- glTF Transform
- mesh optimisation
- KTX2 conversion
- poster generation
- AVIF/WebP conversion
- validation scripts

Do not auto-publish to production.

## Output format

Before coding, report:

- `CONFIRMED` route and learning/story purpose
- `ASSET NEED RECORD`
- `SOURCE CANDIDATES`
- `LICENCE STATUS`
- `OPTIMISATION PLAN`
- `B2 DESTINATION`
- `FALLBACK PLAN`
- `ROLLBACK PLAN`

## Licence gate

An asset with an unverified licence is `BLOCKED`, not `PROPOSED`. It does not
enter the pipeline, does not get downloaded into the repo, and does not get
published. Record the candidate and stop.

"Free to download" is not a licence. A CC0, CC-BY and CC-BY-SA asset carry
different obligations, and CC-BY-SA can impose share-alike terms on derivative
works. State which one applies and how attribution is delivered.

## Binary budget

Decide the derivative's role before choosing its format:

| Role                    | Format                                           |
| ----------------------- | ------------------------------------------------ |
| Poster / fallback still | SVG or WebP in Git, if small                     |
| Secondary, seen once    | compressed GLB in B2                             |
| Hero, mobile            | aggressively decimated GLB or KTX2 variant in B2 |
| Video / audio           | B2 only                                          |

If a single asset would exceed the Git size budget on any route, it is a B2
asset and the manifest records the hashed name. Publishing it to
`apps/ai-institute/public/` does not make it reviewable — it makes it
unreviewable.

## Verify before claiming done

- Manifest entry exists and `pnpm` validation passes for it.
- Poster fallback renders with WebGL disabled.
- Reduced-motion path does not autoplay.
- Rendering pauses when the tab is hidden.
- Measured initial transfer reported, with mobile first.
- Licence URL recorded and re-checked, not remembered.
