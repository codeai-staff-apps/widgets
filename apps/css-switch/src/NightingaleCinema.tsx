/**
 * A small mock movie-theater homepage, toggled between its real brand CSS
 * and no CSS at all. Every rule the styled look uses lives in
 * nightingale.css scoped under `.styled` — remove that one class and the
 * browser has nothing left to go on but element defaults.
 *
 * Purely illustrative: the pedagogy lives in the "what just changed" list in
 * App.tsx, so this whole block is `aria-hidden` and built only from
 * `div`/`span`/`p`/`img` — never a real heading, link, or button — so it
 * never adds a landmark, a link, or a dead tab stop to the real page.
 */

function poster(bg1: string, bg2: string, shape: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="220" viewBox="0 0 160 220">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="160" height="220" fill="url(#g)"/>${shape}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const POSTERS = [
  {
    title: 'The Long Goodbye',
    time: 'Fri–Sun · 7:30 PM',
    src: poster(
      '#3d1f28',
      '#1a0f14',
      '<circle cx="80" cy="105" r="34" fill="none" stroke="rgba(244,239,228,.4)" stroke-width="5"/>' +
        '<circle cx="80" cy="105" r="12" fill="rgba(244,239,228,.55)"/>',
    ),
  },
  {
    title: 'Spotlight Saturdays',
    time: 'Sat · 9:00 PM',
    src: poster(
      '#12162a',
      '#0a0c18',
      '<polygon points="80,40 40,170 120,170" fill="rgba(244,239,228,.16)"/>' +
        '<circle cx="80" cy="40" r="7" fill="rgba(244,239,228,.65)"/>',
    ),
  },
  {
    title: 'Midnight Reel',
    time: 'Fri · 11:30 PM',
    src: poster(
      '#0f2430',
      '#081218',
      '<circle cx="86" cy="100" r="30" fill="rgba(244,239,228,.5)"/>' +
        '<circle cx="100" cy="92" r="27" fill="#0f2430"/>',
    ),
  },
];

export default function NightingaleCinema({styled}: {styled: boolean}) {
  return (
    <div className={styled ? 'demo styled' : 'demo'} aria-hidden="true">
      <div className="demo-nav">
        <span className="demo-word">NIGHTINGALE</span>
        <div className="demo-links">
          <span>Now Showing</span>
          <span>Membership</span>
          <span>Visit</span>
        </div>
      </div>

      <div className="demo-hero">
        <p className="demo-kicker">Revival House &middot; Est. 1987</p>
        <p className="demo-heading">Now Showing</p>
        <p className="demo-feature">
          The Long Goodbye <span>&mdash; 35mm print</span>
        </p>
        <p className="demo-copy">One weekend only. Doors at 7, reels at 7:30, popcorn always.</p>
        <span className="demo-cta">Get Tickets</span>
      </div>

      <div className="demo-lineup">
        {POSTERS.map(p => (
          <div className="demo-card" key={p.title}>
            <img src={p.src} width={160} height={220} alt="" />
            <p className="demo-card-title">{p.title}</p>
            <p className="demo-card-time">{p.time}</p>
          </div>
        ))}
      </div>

      <div className="demo-footer">
        <p>412 Larkspur Ave, Unit 2 &middot; Open Wed&ndash;Sun, 5pm&ndash;close</p>
        <p>&copy; Nightingale Cinema</p>
      </div>
    </div>
  );
}
