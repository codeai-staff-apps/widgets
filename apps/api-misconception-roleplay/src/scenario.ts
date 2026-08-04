/**
 * All scenario copy, verbatim. `**bold**`, `*italic*` and `` `code` `` are the
 * only markup; see markup.tsx.
 */

/** Drives both the feedback colour and how severe the response actually was. */
export type OutcomeType = 'best' | 'ok' | 'miss';

export interface Choice {
  key: string;
  letter: string;
  text: string;
  outcome: {
    type: OutcomeType;
    label: string;
    body: string;
    reaction: string;
  };
}

export const footerNote = 'Where Data Comes From · Unit 5, Lesson 1';

export const student = {
  /** Decorative: the name is in the text beside it. */
  avatar: '👨‍🏫',
  name: 'Jordan, one of your students',
  quote: '"I found the API — it\'s just a URL, right? Like, the URL is the API?"',
};

export const intro = {
  eyebrow: 'Classroom Scenario',
  title: 'How would you respond?',
  subtitle:
    "A student just made a common connection about APIs. It's not wrong — but it's incomplete. Your response will shape how they understand the concept going forward.",
  scenarioBarLabel: 'Scenario',
  scenarioBarTitle: 'During the API Scavenger Hunt',
  scenarioContext:
    "Jordan is excited. He's been exploring the Network tab and found the endpoint his weather app calls. He's pointing at the URL in the browser and looking at you for confirmation. **He's on the right track — but the distinction matters.**",
  promptLabel: 'Your move',
  promptText:
    'Jordan made a reasonable connection. How do you respond to build on what he found without letting the misconception stick?',
  startButtonLabel: 'See the response options →',
};

export const choicesScreen = {
  title: 'How do you respond?',
  repeatedPromptLabel: 'Jordan says',
  reactionSectionLabel: 'Jordan responds',
  nextButtonLabel: 'See the teaching takeaway →',
};

export const choices: Choice[] = [
  {
    key: 'a',
    letter: 'A',
    text: '"Yes, exactly — the URL is how you access the API. Good find!"',
    outcome: {
      type: 'miss',
      label: 'This one lets the misconception stick',
      body: 'Confirming "yes, exactly" leaves Jordan thinking the URL and the API are the same thing. He\'ll carry that forward into Level 8 when he starts modifying `fetch()` parameters — and when something doesn\'t work, he won\'t know where to look. The observation deserved a "close, but" rather than a full confirm.',
      reaction: "Cool, so I just need to save the URL and I've got the API. Easy.",
    },
  },
  {
    key: 'b',
    letter: 'B',
    text: '"Close — that URL is one address you use to reach the API. But the API is the whole system of rules behind it: what requests it accepts, what format it sends data back in, what parameters you can use. The URL is the door; the API is the building."',
    outcome: {
      type: 'best',
      label: 'Strongest response — validates and extends',
      body: '"Close" is doing a lot of work here. It honours what Jordan found without confirming the incomplete version. The door-and-building analogy is concrete: students can picture a building with multiple entrances, rules about who gets in, and what they\'re allowed to take. This keeps Jordan engaged rather than corrected — and sets up the documentation exploration that follows.',
      reaction:
        "Oh so the URL is like one specific door into the building. And the API tells you what all the doors are and what you're allowed to ask for?",
    },
  },
  {
    key: 'c',
    letter: 'C',
    text: '"Not quite — an API stands for Application Programming Interface. It\'s a set of rules that allows software to communicate. The URL is just one part of how you interact with it."',
    outcome: {
      type: 'ok',
      label: 'Technically correct, but leads with the definition',
      body: 'The definition of API is accurate and worth knowing. But leading with "Application Programming Interface" when Jordan is holding a URL in his hand may not land — it\'s abstract where he needs concrete. This response corrects the misconception but doesn\'t build on what Jordan actually found. Pairing the definition with an analogy or a follow-up question would make it stronger.',
      reaction: 'Okay... so the URL is part of the interface? I think I get it. Sort of.',
    },
  },
  {
    key: 'd',
    letter: 'D',
    text: '"Good instinct. Let\'s look at what else the API gives you beyond that one URL — open the documentation and tell me what other endpoints or parameters you see."',
    outcome: {
      type: 'ok',
      label: 'Good redirect, but the misconception goes unaddressed',
      body: 'Sending Jordan into the documentation is a smart instructional move — discovery is better than explanation. But it sidesteps the misconception rather than addressing it. Jordan leaves this exchange still believing the URL is the API; the documentation exploration might resolve it, or it might not. A brief "close, but" before the redirect would make this much stronger.',
      reaction:
        'Sure! Let me look... oh wait, there are like ten different endpoints in here. So the API is all of these together?',
    },
  },
];

export const summary = {
  eyebrow: 'Teaching Takeaway',
  title: 'The URL is the door. The API is the building.',
  subtitle:
    "Jordan's instinct was right — the URL is how you reach the API. But the API is much more than any single address.",
  distinctionCard: {
    barLabel: 'The distinction',
    barTitle: 'What Jordan found vs. what the API actually is',
    columns: [
      {
        label: 'The URL Jordan found',
        text: "One specific address for one specific request — like *get weather for Seattle*. It's a way in, not the whole system.",
      },
      {
        label: 'The API',
        text: 'The full set of rules: what endpoints exist, what parameters they accept, what format data comes back in, what happens when something goes wrong.',
      },
    ],
    explanation:
      "When your students modify their `fetch()` calls to request different data — a different city, a different Pokémon stat — they're discovering that the API has rules beyond the URL they first found. That's the concept clicking into place. Jordan's \"just a URL\" moment is actually a great entry point for that conversation.",
  },
  whyBestCard: {
    barLabel: 'Why Option B worked best',
    barTitle: 'Build on what he found, then extend',
    explanation:
      'Option B starts with *"Close"* — not a correction, not a yes. It validates Jordan\'s observation (the URL is real and relevant) before expanding the picture. The "door and building" analogy is concrete and doesn\'t require Jordan to abandon what he found — it reframes it. Options C and D aren\'t wrong, but C leads with a definition that may not land without the analogy, and D redirects without actually addressing the misconception.',
  },
  classroomConnection: {
    label: 'Classroom connection',
    text: 'When students say "I found the API," they\'ve usually found one endpoint URL and stopped there. **The follow-up question that works:** "What else can that API do? Open the documentation and find two other things you could request." That sends them into the API as a system, not a single address — and the misconception resolves itself.',
  },
  restartButtonLabel: '↩ Try a different response',
};

export const announcements = {
  choices: 'Response options are now visible. Choose how you would respond to Jordan.',
  summary: 'Teaching takeaway is now visible.',
  restart: 'Scenario reset. Choose a different response.',
};

/** Jordan's reaction lands this long after the feedback banner. */
export const REACTION_DELAY_MS = 900;
/** The "next" button appears and takes focus this long after the feedback banner. */
export const NEXT_BUTTON_DELAY_MS = 1400;
