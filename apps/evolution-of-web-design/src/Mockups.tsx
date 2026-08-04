import type {ReactNode} from 'react';

/**
 * The four era mockups. These are the pedagogy — "this page looks of its
 * time and here is why it is hard to use" — so unlike the rest of the app
 * they are period-styled rather than design-system-styled.
 *
 * The whole frame is decorative: the caller marks it `aria-hidden`, and
 * nothing in here is focusable. The original shipped live `<a href="#">`
 * anchors and real `<h2>`/`<h3>` headings inside the sample, which put dead
 * tab stops and fake sections into the real page. Those are spans here.
 */

/** Clip-art placeholder, the kind that shipped with a 1990s page builder. */
function ClipArt() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <rect x="1" y="1" width="32" height="32" fill="none" stroke="#000000" strokeWidth="1" />
      <rect x="6" y="6" width="22" height="14" fill="none" stroke="#000000" strokeWidth="1" />
      <circle cx="17" cy="13" r="4" fill="none" stroke="#000000" strokeWidth="1" />
      <line x1="6" y1="26" x2="28" y2="26" stroke="#000000" strokeWidth="1" />
      <line x1="6" y1="29" x2="28" y2="29" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}

function Starburst({color}: {color: string}) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <polygon points="10,0 12,7 19,7 13,11 15,19 10,14 5,19 7,11 1,7 8,7" fill={color} />
    </svg>
  );
}

/** The generic sun-and-mountains "stock photo" of the banner-ad era. */
function StockPhoto() {
  return (
    <svg width="100%" height="46" viewBox="0 0 140 46" preserveAspectRatio="none">
      <rect width="140" height="46" fill="#DCE7F0" />
      <circle cx="112" cy="12" r="7" fill="#F2C464" />
      <polygon points="0,46 40,18 65,34 95,10 140,46" fill="#8FB89C" />
    </svg>
  );
}

function Thumb({bg, mountain, sun}: {bg: string; mountain: string; sun: string}) {
  return (
    <svg width="100%" height="40" viewBox="0 0 140 40" preserveAspectRatio="none">
      <rect width="140" height="40" fill={bg} />
      <circle cx="112" cy="10" r="6" fill={sun} />
      <polygon points="0,40 35,16 60,30 90,8 140,40" fill={mountain} />
    </svg>
  );
}

function Nineties() {
  return (
    <div className="mock mock-1990s">
      <div className="clipart-row">
        <ClipArt />
        <b>Welcome to Dave&apos;s Baseball Card Site!!</b>
      </div>
      <p>
        Hello and welcome to my website. This site is about baseball cards and my collection which I
        have been building since 1994. Please read below for information about my cards, my trades,
        and how to contact me. This site was last updated on a Tuesday. I have many cards including
        rookie cards, all star cards, and error cards. If you would like to trade please{' '}
        <span className="fake-link">click here</span> or email me. I also collect basketball cards
        but that is a different <span className="fake-link">page</span>. Thank you for visiting and
        please sign my <span className="fake-link">guestbook</span>. This page is best viewed at
        800x600 resolution. More text continues about card grading, storage tips, and my favorite
        teams growing up in the 1980s and 1990s, none of which is broken into sections.
      </p>
    </div>
  );
}

function Thousands() {
  return (
    <div className="mock mock-2000s">
      <div className="banner">
        <div className="box">
          <Starburst color="#CC0000" />
          NEW!!!
        </div>
        <div className="box green">
          <Starburst color="#009900" />
          SIGN UP NOW
        </div>
        <div className="box blue">Visitor #48213</div>
      </div>
      <div className="content">
        <div className="sidebar">
          <StockPhoto />
          <br />
          Links
          <br />
          Home
          <br />
          About
          <br />
          More Links
          <br />
          Poll of the Week
        </div>
        <div className="main">
          Welcome to the new and improved site! Check out our forums, our chat room, and our brand
          new guestbook. Click any of the flashing banners above for exciting offers.
        </div>
      </div>
    </div>
  );
}

function Tens() {
  return (
    <div className="mock mock-2010s">
      <div className="cta-row">
        <div className="cta c1">Sign Up</div>
        <div className="cta c2">Learn More</div>
        <div className="cta c3">Get Started</div>
        <div className="cta c4">Contact Us</div>
      </div>
      <div className="row">
        <div className="body-text">
          Our platform helps you do more, faster. Explore our features below and see why thousands
          of users trust us. Read more about our story, our team, and our mission on this page.
        </div>
        <div className="sidebar-ad">
          <StockPhoto />
          Special Offer! Act now for a limited time deal on premium plans.
        </div>
      </div>
    </div>
  );
}

/**
 * Deliberately the same four parts, in the same order, as the sample site in
 * planets-site-explorer: nav bar, hero, gallery cards, footer.
 */
function Modern() {
  return (
    <div className="mock mock-modern">
      <div className="nav">
        <div className="logo">Brand</div>
        <div className="links">
          <span>Shop</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="hero">
        <span className="hero-heading">Find what you&apos;re looking for</span>
        <span className="cta-btn">Get Started</span>
      </div>
      <div className="cards">
        <div className="card">
          <div className="thumb">
            <Thumb bg="#D5EFFF" mountain="#7CDB87" sun="#FFA868" />
          </div>
          Item one
        </div>
        <div className="card">
          <div className="thumb">
            <Thumb bg="#E4E2F8" mountain="#ACA8EA" sun="#4C42CF" />
          </div>
          Item two
        </div>
        <div className="card">
          <div className="thumb">
            <Thumb bg="#D5EFFF" mountain="#6FCAFF" sun="#FFA868" />
          </div>
          Item three
        </div>
      </div>
      <div className="footer">© Brand Co. | Privacy | Contact</div>
    </div>
  );
}

export const MOCKUPS: readonly ReactNode[] = [
  <Nineties key="1990s" />,
  <Thousands key="2000s" />,
  <Tens key="2010s" />,
  <Modern key="modern" />,
];
