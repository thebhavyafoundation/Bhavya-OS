import { QUOTE } from "@/data/home-v2";
import { PHOTO } from "@/lib/photos";
import { photoCredit } from "@/lib/photo-credits";

/**
 * Quote band — full-bleed landscape with forest scrim and the
 * foundation's patience line.
 */
export function QuoteBand() {
  return (
    <section
      className="home-quote"
      style={{ backgroundImage: `url(${PHOTO.communityLandscape})` }}
      aria-label="Foundation quote"
    >
      <div className="home-quote-inner">
        <blockquote className="home-quote-text">“{QUOTE.text}”</blockquote>
        <span className="home-quote-attr">— {QUOTE.attribution}</span>
        <span className="home-quote-credit">
          {photoCredit("communityLandscape")}
        </span>
      </div>
    </section>
  );
}
