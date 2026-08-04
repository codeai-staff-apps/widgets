export interface Section {
  key: string;
  /** Short name on the progress chip. */
  label: string;
  title: string;
  text: string;
}

/**
 * The four parts of a page, in document order. evolution-of-web-design's
 * closing bridge note names this exact set ("Navigation Bar, Hero Section,
 * Gallery Cards, and Footer"); keep the two in sync if either is reworded.
 */
export const SECTIONS: readonly Section[] = [
  {
    key: 'nav',
    label: 'Nav Bar',
    title: 'Navigation Bar',
    text: "Lets a visitor jump anywhere on the site without scrolling first. It answers where can I go, before they've read a single word.",
  },
  {
    key: 'hero',
    label: 'Hero Section',
    title: 'Hero Section',
    text: 'Makes the first impression and states what the site is about in one glance. It answers what is this, and why should I care.',
  },
  {
    key: 'gallery',
    label: 'Gallery Cards',
    title: 'Gallery Cards',
    text: 'Lets a visitor browse multiple options and pick their own path. It answers what are my choices.',
  },
  {
    key: 'footer',
    label: 'Footer',
    title: 'Footer',
    text: "Holds the secondary information visitors look for once they're done browsing: contact info, legal links, ways to learn more. It answers how do I get more, or get help.",
  },
];

export const DIRECTIONS =
  "Hover over each part of this site to see it highlighted. Click a part to find out exactly what job it's doing for the visitor.";

export const DETAIL_PLACEHOLDER =
  "Click any part of the site above to see what job it's doing.";

export const COMPLETION_NOTE =
  "You've explored all four sections. Notice how each one answers a different question for the visitor, before they've read a single word of content.";
