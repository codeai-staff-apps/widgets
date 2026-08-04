export interface Option {
  text: string;
  /** The reading the stop is teaching toward. Every option still gets feedback. */
  primary: boolean;
  feedback: string;
}

export interface Stop {
  era: string;
  question: string;
  options: readonly Option[];
}

export const STOPS: readonly Stop[] = [
  {
    era: 'Late 1990s',
    question: 'What do you notice about this page?',
    options: [
      {
        text: 'Too much text with no visual breaks',
        primary: true,
        feedback:
          "Right, walls of unbroken text force a visitor to hunt for what they need. There's no visual hierarchy guiding the eye anywhere.",
      },
      {
        text: 'The colors clash',
        primary: false,
        feedback:
          "Colors aren't really the issue here, this page barely uses any. The bigger problem is text density.",
      },
      {
        text: "There's no clear navigation",
        primary: false,
        feedback:
          "True, but the more immediate problem a visitor hits first is the wall of text before they'd even look for navigation.",
      },
      {
        text: 'There are too many images',
        primary: false,
        feedback:
          'Actually the opposite, this page has almost no imagery at all, which is part of why it feels so text-heavy.',
      },
    ],
  },
  {
    era: 'Early-to-mid 2000s',
    question: 'What do you notice about this page?',
    options: [
      {
        text: "There's no clear focal point, too many competing elements",
        primary: true,
        feedback:
          'Right, everything is shouting for attention at once, bright boxes, a sidebar, a banner, so nothing stands out as the main thing.',
      },
      {
        text: "There's too much plain text",
        primary: false,
        feedback:
          "There's actually less plain text here than the last stop, the new problem is too many competing visual elements.",
      },
      {
        text: "There's no color at all",
        primary: false,
        feedback:
          'This page has plenty of color, maybe too much of it, all fighting for attention at once.',
      },
      {
        text: 'The page loads too fast',
        primary: false,
        feedback:
          "Loading speed isn't really visible here, the issue is visual clutter, not performance.",
      },
    ],
  },
  {
    era: 'Late 2000s to 2010s',
    question: 'What do you notice about this page?',
    options: [
      {
        text: 'Too many competing calls to action',
        primary: true,
        feedback:
          "Right, there's a button pulling for attention every few inches, so a visitor doesn't know which action actually matters most.",
      },
      {
        text: "There's no text at all",
        primary: false,
        feedback:
          "There's plenty of text here, the issue is that competing buttons and an ad split a visitor's attention away from it.",
      },
      {
        text: 'Only one color is used',
        primary: false,
        feedback:
          'This page actually uses a fair number of colors on those buttons, just not consistently enough to guide the eye toward one action.',
      },
      {
        text: 'There are no links anywhere',
        primary: false,
        feedback:
          'There are links and buttons throughout, too many, in fact, without a clear sense of priority.',
      },
    ],
  },
  {
    era: 'Modern web app',
    question: 'What makes this feel easier to use than what you just saw?',
    options: [
      {
        text: 'Clear structure: a nav bar, a hero, cards, and a footer, each doing one job',
        primary: true,
        feedback:
          'Exactly. Every part of the page has one clear job, and that predictable structure is what your students will learn to recognize and build themselves.',
      },
      {
        text: 'It has more pictures than the others',
        primary: false,
        feedback:
          "There are images here, but that's not really what makes it easier to navigate, it's the structure underneath them.",
      },
      {
        text: 'It uses more colors than the others',
        primary: false,
        feedback:
          'This page actually uses fewer colors than the cluttered ones you just saw. Restraint, not more color, is doing the work.',
      },
      {
        text: 'It has less text than all the others',
        primary: false,
        feedback:
          "Text amount isn't really the differentiator here, it's how the content is organized into clear, single-purpose sections.",
      },
    ],
  },
];

export const DIRECTIONS =
  "Click through four moments in web design history. At each stop, notice what's working and what isn't for the person using the page. You can change your answer or go back at any time.";

export const TRY_AGAIN_NOTE = 'Want to compare another option? Click a different choice.';

/**
 * Hand-off to planets-site-explorer. Its four section titles are quoted here
 * verbatim; keep the two in sync if either is reworded.
 */
export const BRIDGE_NOTE =
  "These four sections, Navigation Bar, Hero Section, Gallery Cards, and Footer, are the exact structure you'll dig into next.";

/** Fisher-Yates. Option order is randomized once per page load, then held. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
