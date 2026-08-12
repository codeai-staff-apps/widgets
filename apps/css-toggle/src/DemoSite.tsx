/**
 * The "Fern & Co." sample page students strip the CSS from. It is decorative
 * — a stand-in for someone else's website, not a control the app user
 * operates — so the whole thing is `aria-hidden` and its links/button are
 * pulled out of the tab order. What a screen-reader user needs to know about
 * the "off" state is spoken through the (real, non-hidden) observations list
 * in App.tsx instead.
 *
 * The markup itself must stay real `<nav>`/`<ul>`/`<a>`/`<button>` elements
 * rather than plain `<span>`s: with `demoSite.css`'s rules the page keeps its
 * brand look. Without them, the browser's own defaults are what's left to
 * see — bullets, underlined links, block-stacked sections — which is the
 * whole point of the toggle.
 */
export default function DemoSite({cssOn}: {cssOn: boolean}) {
  return (
    <div className="demo" data-css={cssOn ? 'on' : 'off'} aria-hidden="true">
      <nav className="demo-nav">
        <span className="demo-logo">Fern &amp; Co.</span>
        <ul>
          <li>
            <a href="#" tabIndex={-1}>
              Home
            </a>
          </li>
          <li>
            <a href="#" tabIndex={-1}>
              Work
            </a>
          </li>
          <li>
            <a href="#" tabIndex={-1}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <header className="demo-hero">
        <h2>We design brands people remember.</h2>
        <p>A small studio&rsquo;s project page, rebuilt for the web.</p>
        <button type="button" className="demo-cta" tabIndex={-1}>
          View our work
        </button>
      </header>
      <ul className="demo-cards">
        <li className="demo-card">
          <h3>Case Study</h3>
          <p>Riverbend Cafe rebrand</p>
        </li>
        <li className="demo-card">
          <h3>Case Study</h3>
          <p>Northline app icons</p>
        </li>
        <li className="demo-card">
          <h3>Case Study</h3>
          <p>Fernwood identity</p>
        </li>
      </ul>
    </div>
  );
}
