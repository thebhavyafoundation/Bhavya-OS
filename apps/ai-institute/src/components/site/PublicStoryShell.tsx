import { StoryChapter } from "@/components/site/StoryChapter";
import { EditorialLink } from "@/components/editorial/EditorialLink";
import { getMissionProfile, type MissionId } from "@/data/mission-profiles";
import { CHAPTER_PHOTO, PHOTO_CREDIT } from "@/lib/photos";
import type { PhotoKey } from "@/lib/photos";
import styles from "./publicStoryShell.module.css";

/**
 * PublicStoryShell — the narrative spine of a Tier A public route.
 *
 * Why chapters rather than cards: the four missions are not a feature grid.
 * A three-card row says "here are three things"; four chapters say "here is
 * the shape of the institution". The homepage previously rendered a three-card
 * spotlight, which is the generic pattern this replaces.
 *
 * Copy discipline: every line comes from `mission-profiles`, which holds the
 * constitutional mandates verbatim. Nothing here invents a claim, and no
 * roadmap phase is presented as an achievement.
 *
 * Asset discipline: photographs come from `CHAPTER_PHOTO` (rights-cleared
 * only) and every credit comes from `PHOTO_CREDIT`, so the CC BY 4.0
 * attribution requirement travels with the image.
 *
 * Accessibility: the chapter index is a plain list of links with no
 * JavaScript, so it works before hydration and under any motion setting. The
 * chapters themselves degrade to static stacked flow under
 * prefers-reduced-motion via `StoryChapter`.
 */
const CHAPTER_ORDER: readonly MissionId[] = [
  "forest",
  "knowledge",
  "heritage",
  "community",
];

const CHAPTER_PHOTO_KEY: Record<MissionId, PhotoKey> = {
  forest: "forest",
  knowledge: "knowledgeBooks",
  heritage: "heritageStone",
  community: "communityLandscape",
};

export function PublicStoryShell() {
  const chapters = CHAPTER_ORDER.map((id) => ({
    id,
    profile: getMissionProfile(id),
    photo: CHAPTER_PHOTO[id],
    credit: PHOTO_CREDIT[CHAPTER_PHOTO_KEY[id]],
  }));

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className={styles.shell}
    >
      <div className={styles.intro}>
        <h2 id="story-heading" className={styles.title}>
          Four mandates
        </h2>
        <p className={styles.lede}>
          Each mission is written into the Foundation&rsquo;s constitution and
          carries its own page, its own sources, and an honest account of how
          far it has actually come.
        </p>

        {/*
          A no-JavaScript chapter index. On a narrow screen this becomes the
          only affordance that tells a reader how long the section is.
        */}
        <nav aria-label="Chapters" className={styles.index}>
          <ol>
            {chapters.map((chapter, position) => (
              <li key={chapter.id}>
                <a href={`#${chapter.id}`}>
                  <span className={styles.indexNumber}>
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <span>{chapter.profile.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {chapters.map((chapter, position) => (
        <StoryChapter
          key={chapter.id}
          id={chapter.id}
          index={String(position + 1).padStart(2, "0")}
          label={chapter.profile.name}
          line={chapter.profile.oneLiner}
          body={chapter.profile.statusCopy}
          href={`/missions/${chapter.id}`}
          photo={chapter.photo}
          // The alt describes the photograph, not the mission. The mission is
          // described in the heading beside it.
          alt={`${chapter.profile.name} — representative photograph`}
          credit={chapter.credit}
          flip={position % 2 === 1}
        />
      ))}

      <div className={styles.outro}>
        <EditorialLink href="/missions">See all four missions</EditorialLink>
      </div>
    </section>
  );
}
