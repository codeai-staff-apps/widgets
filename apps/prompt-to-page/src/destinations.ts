/**
 * Everything the app knows about each sample page. A "destination" is the kind
 * of page a student is prompting for. Each of the four prompt details (slots)
 * has two options per destination; the prompt sentence, the page's look and the
 * page's words all come from the chosen option.
 */
export const SLOTS = ['audience', 'feel', 'parts', 'content'] as const;
export type Slot = (typeof SLOTS)[number];
export type Choice = 0 | 1;
/** `null` means the switch is off: that layer of the page stays gray. */
export type Selection = Record<Slot, Choice | null>;

/** Chip text for each switch. */
export const SLOT_LABEL: Record<Slot, string> = {
  audience: "Who it's for",
  feel: 'The feel',
  parts: 'The parts',
  content: 'The content',
};

/** What each switch fills in on the sample page. */
export const SLOT_LAYER: Record<Slot, string> = {
  audience: 'Audience',
  feel: 'Colors',
  parts: 'Parts',
  content: 'Words',
};

/** What stays gray on the page while a switch is off (used in the page description). */
export const SLOT_GRAY: Record<Slot, string> = {
  audience: 'the audience details',
  feel: 'the colors and style',
  parts: 'the parts',
  content: 'the words',
};

export type Palette =
  | 'playful'
  | 'calm'
  | 'warm'
  | 'bold'
  | 'green'
  | 'serious'
  | 'sunny'
  | 'cool';

interface OptionText {
  /** Short name, used on the swap buttons and in summaries. */
  label: string;
  /** The sentence this option adds to the prompt. */
  clause: string;
}

export interface Copy {
  brand: string;
  title: string;
  button: string;
  note: string;
  /** Main list: wheel wedges (6), treats, park facts, forecast days. */
  items: string[];
  /** Secondary values: recent picks, prices, progress label, temperatures. */
  values: string[];
  /** Weather only: the hours for the hourly strip. */
  hours?: string[];
  /** Weather only: city name and the big temperature. */
  city?: string;
  lead?: string;
  /** Park only: how full the progress bar is. */
  pct?: number;
}

export type DestinationId = 'wheel' | 'bake' | 'park' | 'weather';

export interface Destination {
  id: DestinationId;
  /** Tab label. */
  label: string;
  /** Lower-case noun phrase for descriptions. */
  noun: string;
  /** The vague first sentence of the prompt. */
  base: string;
  audience: readonly [OptionText & {badge: string; tagline: string}, OptionText & {badge: string; tagline: string}];
  feel: readonly [OptionText & {palette: Palette}, OptionText & {palette: Palette}];
  parts: readonly [OptionText, OptionText];
  content: readonly [OptionText & {copy: Copy}, OptionText & {copy: Copy}];
}

export const DESTINATIONS: readonly Destination[] = [
  {
    id: 'wheel',
    label: 'Decision wheel',
    noun: 'decision wheel',
    base: 'Make a decision wheel web page.',
    audience: [
      {
        label: 'My classmates',
        clause: "It's for my classmates.",
        badge: 'For my classmates',
        tagline: "Can't decide? Spin and the whole class gets an answer.",
      },
      {
        label: 'My family',
        clause: "It's for my family.",
        badge: 'For my family',
        tagline: 'One spin ends the big family debate.',
      },
    ],
    feel: [
      {label: 'Bright & playful', clause: 'It should feel bright and playful.', palette: 'playful'},
      {label: 'Calm & clean', clause: 'It should feel calm and clean.', palette: 'calm'},
    ],
    parts: [
      {label: 'Result card', clause: 'Include a big wheel, a Spin button, and a result card.'},
      {label: 'Recent picks', clause: 'Include a big wheel, a Spin button, and a list of recent picks.'},
    ],
    content: [
      {
        label: 'Lunch ideas',
        clause: 'Use lunch ideas like Tacos, Pizza, and Salad.',
        copy: {
          brand: 'Spin & Decide',
          title: "What's for lunch?",
          button: 'Spin',
          note: 'Not happy? Spin again.',
          items: ['Tacos', 'Pizza', 'Salad', 'Sushi', 'Wraps', 'Soup'],
          values: ['Pizza', 'Wraps', 'Soup'],
        },
      },
      {
        label: 'Weekend ideas',
        clause: 'Use weekend ideas like Hike, Movie, and Bowling.',
        copy: {
          brand: 'Spin & Decide',
          title: 'What should we do?',
          button: 'Spin',
          note: 'Not happy? Spin again.',
          items: ['Hike', 'Movie', 'Bowling', 'Bake', 'Arcade', 'Picnic'],
          values: ['Movie', 'Picnic', 'Arcade'],
        },
      },
    ],
  },
  {
    id: 'bake',
    label: 'Bake sale',
    noun: 'bake sale site',
    base: 'Make a bake sale web page.',
    audience: [
      {
        label: 'Neighbors',
        clause: "It's for neighbors who walk by.",
        badge: 'Neighbors welcome',
        tagline: 'Stop by, grab a treat, and say hi!',
      },
      {
        label: 'School parents',
        clause: "It's for parents at our school.",
        badge: 'For school parents',
        tagline: 'Pre-order treats for the next school event.',
      },
    ],
    feel: [
      {label: 'Warm & cozy', clause: 'It should feel warm and cozy.', palette: 'warm'},
      {label: 'Bold & bright', clause: 'It should feel bold and bright.', palette: 'bold'},
    ],
    parts: [
      {label: 'Photo cards', clause: 'Include photo-style cards for each treat and an Order button.'},
      {label: 'Simple menu', clause: 'Include a simple menu list and an Order button.'},
    ],
    content: [
      {
        label: 'Cookies & brownies',
        clause: 'Sell cookies, brownies, and lemonade with prices.',
        copy: {
          brand: 'Maple Hall Bake Sale',
          title: 'Fresh treats, small prices',
          button: 'Order',
          note: 'Saturday, 9 to noon, in the gym',
          items: ['Cookies', 'Brownies', 'Lemonade'],
          values: ['$1', '$2', '$1'],
        },
      },
      {
        label: 'Cupcakes & bread',
        clause: 'Sell cupcakes, banana bread, and apple cider with prices.',
        copy: {
          brand: 'Eastside Bake Sale',
          title: 'Bake it forward',
          button: 'Order',
          note: 'Friday, 3 to 6, on the front lawn',
          items: ['Cupcakes', 'Banana bread', 'Apple cider'],
          values: ['$3', '$4', '$2'],
        },
      },
    ],
  },
  {
    id: 'park',
    label: 'Save the park',
    noun: 'save-the-park page',
    base: 'Make a web page to save our local park.',
    audience: [
      {
        label: 'Neighbors',
        clause: "It's for neighbors who use the park.",
        badge: 'For our neighbors',
        tagline: 'Our park needs your help. It takes one minute.',
      },
      {
        label: 'City council',
        clause: "It's for the city council.",
        badge: 'For the city council',
        tagline: 'This petition asks the council to protect the park.',
      },
    ],
    feel: [
      {label: 'Hopeful & green', clause: 'It should feel hopeful and green.', palette: 'green'},
      {label: 'Serious & clear', clause: 'It should feel serious and clear.', palette: 'serious'},
    ],
    parts: [
      {label: 'Progress bar', clause: 'Include a big headline, a progress bar, and a Sign button.'},
      {label: 'Facts list', clause: 'Include a big headline, a facts list, and a Sign button.'},
    ],
    content: [
      {
        label: 'Petition drive',
        clause: 'Ask for 500 names and mention the Saturday cleanup.',
        copy: {
          brand: 'Friends of Maple Park',
          title: 'Save Maple Park',
          button: 'Sign',
          note: 'Cleanup day: Saturday, 10 am',
          items: ['Open since 1952', '40 old oak trees', 'Free for everyone'],
          values: ['312 of 500 names'],
          pct: 62,
        },
      },
      {
        label: 'Fact sheet',
        clause: 'Share three facts about the park and the meeting date.',
        copy: {
          brand: 'Friends of Maple Park',
          title: 'Keep Maple Park open',
          button: 'Sign',
          note: 'City meeting: May 6, 7 pm',
          items: [
            '800 families visit each week',
            'The only green space on Elm Street',
            'No other playground within a mile',
          ],
          values: ['97 supporters so far'],
          pct: 30,
        },
      },
    ],
  },
  {
    id: 'weather',
    label: 'Weather checker',
    noun: 'weather checker',
    base: 'Make a weather checker web page.',
    audience: [
      {
        label: 'Students',
        clause: "It's for students checking before school.",
        badge: 'Made for students',
        tagline: 'Check before the bus comes.',
      },
      {
        label: 'Trip planners',
        clause: "It's for people planning a trip.",
        badge: 'Made for travelers',
        tagline: 'Check before you pack your bags.',
      },
    ],
    feel: [
      {label: 'Sunny & friendly', clause: 'It should feel sunny and friendly.', palette: 'sunny'},
      {label: 'Cool & techy', clause: 'It should feel cool and techy.', palette: 'cool'},
    ],
    parts: [
      {label: '3-day forecast', clause: "Include a city box, today's temperature, and a 3-day forecast."},
      {label: 'Hourly strip', clause: "Include a city box, today's temperature, and an hourly strip."},
    ],
    content: [
      {
        label: 'Seattle',
        clause: 'Show Seattle at 58°F with rain on the way.',
        copy: {
          brand: 'Weather Check',
          title: 'Do I need an umbrella?',
          button: 'Check',
          note: 'Light rain, feels like 55°',
          items: ['Tue', 'Wed', 'Thu'],
          values: ['58°', '61°', '64°'],
          hours: ['3 pm', '4 pm', '5 pm'],
          city: 'Seattle',
          lead: '58°F',
        },
      },
      {
        label: 'Phoenix',
        clause: 'Show Phoenix at 96°F and sunny.',
        copy: {
          brand: 'Weather Check',
          title: 'How hot will it be?',
          button: 'Check',
          note: 'Sunny, feels like 99°',
          items: ['Tue', 'Wed', 'Thu'],
          values: ['96°', '98°', '101°'],
          hours: ['3 pm', '4 pm', '5 pm'],
          city: 'Phoenix',
          lead: '96°F',
        },
      },
    ],
  },
];

export function getDestination(id: DestinationId): Destination {
  return DESTINATIONS.find(destination => destination.id === id)!;
}

/** The prompt as the base sentence plus one clause per switch that is on, in a fixed order. */
export function promptClauses(destination: Destination, selection: Selection) {
  return SLOTS.flatMap(slot => {
    const choice = selection[slot];
    return choice === null ? [] : [{slot, choice, text: destination[slot][choice].clause}];
  });
}

export function promptText(destination: Destination, selection: Selection): string {
  return [destination.base, ...promptClauses(destination, selection).map(clause => clause.text)].join(' ');
}

/** Short spoken/visible summary of what the sample page currently shows. */
export function describePage(destination: Destination, selection: Selection): string {
  const on = SLOTS.filter(slot => selection[slot] !== null);
  if (on.length === 0) {
    return `Gray wireframe of a ${destination.noun}. No details yet, so nothing is filled in.`;
  }
  const added = on.map(slot => destination[slot][selection[slot]!].label).join(', ');
  const gray = SLOTS.filter(slot => selection[slot] === null).map(slot => SLOT_GRAY[slot]);
  return `Sample ${destination.noun} with ${on.length} of 4 details: ${added}. ${
    gray.length ? `Still gray: ${gray.join(', ')}.` : 'Nothing is left gray.'
  }`;
}
