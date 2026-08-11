import type {Chrome, CodeLine, CodeSegment, Post, Step, Summary} from './types';

export const CHROME: Chrome = {
  documentTitle: 'The Stylist — Push Protocol',
  unitTag: 'Unit 3 · Arrays & JavaScript',
  introTitle: 'The Stylist:',
  introTitleAccent: 'Incoming Booking!',
  introSub: 'A new client just booked a shoot. Follow the 5-step protocol to guide Isabella through adding it to the feed using .push().',
  notifIcon: '📸',
  notifTitle: 'Update 1: Incoming Booking!',
  notifDetails: [
    {text: 'A client booked a '},
    {text: 'Streetwear Shoot', emphasis: true},
    {text: ' for the end of the week! Isabella needs to push it to the schedule.'},
  ],
  notifItems: [
    {text: 'Title: '},
    {text: '"Streetwear Shoot"', emphasis: true},
    {text: ' · Content: '},
    {text: '"Sneak peek at the new collection!"', emphasis: true},
    {text: ' · Image: '},
    {text: 'street.jpg', emphasis: true},
  ],
  studentName: 'Isabella',
  teacherName: 'Ms. Rivera',
  introTeacherLine: "Isabella just got a new booking notification — but she's frozen staring at the code. Let's use the 5-step protocol to slow her down and build this together.",
  stepsPreview: [
    '1. Understand',
    '2. Locate',
    '3. Plan',
    '4. Prompt',
    '5. Test',
  ],
  startBtn: 'Start the Protocol →',
  codeSummary: 'Code editor showing The Stylist script.js file',
  consoleSummary: 'Console output panel',
  consoleLabel: '▸ Console',
  consoleInitial: '// Ready — follow the steps',
  progressOf: 'Step {n} of 5',
  dotDoneLabel: 'Step {n}: complete',
  dotActiveLabel: 'Step {n}: current',
  dotPendingLabel: 'Step {n}: not yet started',
  btnNext: 'Next Step →',
  btnFinish: 'See Summary →',
  phoneTitle: 'My Feed',
  phoneSub: 'Weekly Planner',
  stepDone: 'Correct first time',
  stepRetry: 'Answered incorrectly',
};

const kw = (text: string): CodeSegment => ({text, tok: 'kw'});
const fn = (text: string): CodeSegment => ({text, tok: 'fn'});
const str = (text: string): CodeSegment => ({text, tok: 'str'});
const num = (text: string): CodeSegment => ({text, tok: 'num'});
const cm = (text: string): CodeSegment => ({text, tok: 'cm'});
const op = (text: string): CodeSegment => ({text, tok: 'op'});
const plain = (text: string): CodeSegment => ({text});

/**
 * script.js as the learner sees it. The source drew these with Catppuccin
 * syntax spans inside a fake editor; the rebuild keeps the same token
 * boundaries so the differentiation the exercise depends on (step 1 is
 * "read this code") survives.
 */
export const CODE_LINES: CodeLine[] = [
  {segments: [cm('// DOM ELEMENTS')]},
  {
    segments: [
      kw('let'),
      plain(' '),
      plain('post1Title'),
      plain(' '),
      op('='),
      plain(' '),
      plain('document'),
      plain('.'),
      fn('querySelector'),
      plain('('),
      str('"#post1-title"'),
      plain(');'),
    ],
  },
  {
    segments: [
      kw('let'),
      plain(' '),
      plain('post1Content'),
      plain(' '),
      op('='),
      plain(' '),
      plain('document'),
      plain('.'),
      fn('querySelector'),
      plain('('),
      str('"#post1-content"'),
      plain(');'),
    ],
  },
  {segments: [cm('// ... post2 through post5 ...')]},
  {segments: [plain('')]},
  {segments: [cm('// DATA LISTS (Parallel Arrays)')]},
  {segments: [cm('// Index 0 = Monday, Index 1 = Tuesday, etc.')]},
  {
    id: 'line-a3',
    segments: [
      kw('let'),
      plain(' titles '),
      op('='),
      plain(' ['),
      str('"Motivation Monday"'),
      plain(', '),
      str('"Tip Tuesday"'),
      plain(', '),
      str('"Work in Progress"'),
      plain(', '),
      str('"Throwback Thursday"'),
      plain(', '),
      str('"Fashion Friday"'),
      plain('];'),
    ],
  },
  {
    id: 'line-a4',
    segments: [
      kw('let'),
      plain(' contents '),
      op('='),
      plain(' ['),
      str('"Start strong!"'),
      plain(', '),
      str('"Mix metals."'),
      plain(', '),
      str('"Sewing a hem."'),
      plain(', '),
      str('"Old style."'),
      plain(', '),
      str('"Weekend vibes."'),
      plain('];'),
    ],
  },
  {
    id: 'line-a5',
    segments: [
      kw('let'),
      plain(' images '),
      op('='),
      plain(' ['),
      str('"/images/one.png"'),
      plain(', '),
      str('"/images/two.png"'),
      plain(', '),
      str('"/images/three.png"'),
      plain(', '),
      str('"/images/four.png"'),
      plain(', '),
      str('"/images/five.png"'),
      plain('];'),
    ],
  },
  {segments: [plain('')]},
  {segments: [cm('// DISPLAY LOGIC')]},
  {segments: [kw('function'), plain(' '), fn('renderFeed'), plain('() {')]},
  {segments: [plain('  '), cm('// Monday Slot (Index 0)')]},
  {
    segments: [
      plain('  post1Title.textContent '),
      op('='),
      plain(' titles['),
      num('0'),
      plain('];'),
    ],
  },
  {
    segments: [
      plain('  post1Content.textContent '),
      op('='),
      plain(' contents['),
      num('0'),
      plain('];'),
    ],
  },
  {segments: [plain('  '), cm('// ... Tuesday through Friday ...')]},
  {segments: [plain('}')]},
  {segments: [plain('')]},
  {segments: [cm('// START APP')]},
  {id: 'line-call', segments: [cm('// addBooking(); ← will go here')]},
  {id: 'line-render', segments: [fn('renderFeed'), plain('();')]},
  {segments: [plain('')]},
  {segments: [cm('// ─────────────────────────────')]},
  {
    id: 'line-todo',
    segments: [{text: '// HELPER FUNCTIONS — add new ones below', tok: 'todo'}],
  },
  {segments: [plain('')]},
  {
    id: 'line-helper-placeholder',
    segments: [cm('// ← addBooking() will be written here')],
    visibility: 'beforeReveal',
  },
  {
    id: 'line-helper-fn',
    segments: [kw('function'), plain(' '), fn('addBooking'), plain('() {')],
    visibility: 'afterReveal',
  },
  {
    id: 'line-helper-1',
    segments: [plain('  titles.'), fn('push'), plain('('), str('"Streetwear Shoot"'), plain(');')],
    visibility: 'afterReveal',
  },
  {
    id: 'line-helper-2',
    segments: [
      plain('  contents.'),
      fn('push'),
      plain('('),
      str('"Sneak peek at the new collection!"'),
      plain(');'),
    ],
    visibility: 'afterReveal',
  },
  {
    id: 'line-helper-3',
    segments: [plain('  images.'), fn('push'), plain('('), str('"street.jpg"'), plain(');')],
    visibility: 'afterReveal',
  },
  {id: 'line-helper-4', segments: [plain('}')], visibility: 'afterReveal'},
];

/** What `line-call` becomes once the helper function exists. */
export const CALL_REVEALED_SEGMENTS: CodeSegment[] = [fn('addBooking'), plain('();')];

export const STEPS: Step[] = [
  {
    icon: '🔍',
    title: 'Understand the Starter Code',
    instruction: 'Before touching anything, Isabella needs to understand what the code is doing. Look at the script.js file. Click the answer that best describes what the parallel arrays are doing.',
    teacherLine: 'Isabella, before you write a single line — tell me what these three arrays are doing. Point to them in the code.',
    studentLine: "I see titles, contents, and images... but I don't know what they have to do with each other.",
    highlightLines: [
      'line-a3',
      'line-a4',
      'line-a5',
    ],
    passResult: "✅ Exactly! Each index position represents one day's post. titles[0], contents[0], and images[0] all belong to Monday. That's the parallel array pattern.",
    failResult: "Not quite — look at the comments in the code. Each index maps to a day of the week. titles[0] + contents[0] + images[0] = Monday's post.",
    studentReaction: 'Oh! So index 0 is Monday, index 1 is Tuesday... they all line up together!',
    interaction: {
      type: 'concept',
      question: 'What do the three parallel arrays (titles, contents, images) represent?',
      options: [
        {
          text: 'Three separate lists that happen to have the same length',
          correct: false,
        },
        {
          text: 'One post per index — index 0 = Monday, index 1 = Tuesday, etc.',
          correct: true,
        },
        {
          text: 'The HTML, CSS, and JS files for the project',
          correct: false,
        },
        {
          text: 'A loop that runs through each post automatically',
          correct: false,
        },
      ],
    },
  },
  {
    icon: '📌',
    title: 'Locate the TODO',
    instruction: 'Isabella needs to find exactly where the new helper function should go. Click the correct line in the code where the helper function should be added.',
    teacherLine: "Don't start coding yet. First — where does the code tell you to add the new function? Find it.",
    studentLine: "There's a comment that says HELPER FUNCTIONS at the bottom... is that where I go?",
    highlightLines: [],
    passResult: "✅ That's it! The // HELPER FUNCTIONS comment at line 25 is exactly where the new addBooking() function should be written. The TODO is built into the structure.",
    failResult: 'Keep looking — the code has a section specifically for helper functions. Check the comments near the bottom of the file.',
    studentReaction: 'The comment is like a signpost! The code was already telling me where to go.',
    consoleMsg: '// TODO found on line 25',
    interaction: {
      type: 'clickline',
      target: 'line-todo',
      hint: '👆 Click the correct line in the code panel.',
    },
  },
  {
    icon: '🧠',
    title: 'Plan in Words',
    instruction: 'Before writing any code, Isabella should describe what needs to happen in plain English. Put these 4 steps in the correct order by clicking them 1 → 4.',
    teacherLine: 'Close the laptop lid for a second. Tell me in plain English — what does this function need to do? No code words.',
    studentLine: "Umm... add the new post? But I don't know where to start explaining it.",
    highlightLines: [],
    passResult: '✅ Perfect plan! Create the function first, then push to each of the three arrays in order: title → content → image. Now Isabella can write a clear AI prompt.',
    failResult: 'Almost — remember: you need to create the function before pushing anything. The function wraps all three push() calls.',
    studentReaction: 'Writing it out like that actually makes it so much easier! Now I know exactly what to ask the AI.',
    consoleMsg: '// Plan confirmed — ready to prompt AI',
    interaction: {
      type: 'sequence',
      items: [
        {
          id: 's1',
          text: 'Push the new title to the titles array',
          correct: 2,
        },
        {
          id: 's2',
          text: 'Create a function called addBooking',
          correct: 1,
        },
        {
          id: 's3',
          text: 'Push the new image filename to images array',
          correct: 4,
        },
        {
          id: 's4',
          text: 'Push the new caption to the contents array',
          correct: 3,
        },
      ],
    },
  },
  {
    icon: '🤖',
    title: 'Prompt the AI',
    instruction: 'Isabella has two AI prompts she could send. Which one will give the AI enough context to write the right helper function?',
    teacherLine: 'This is the PAIR step — Prompt the AI. But a vague prompt gets vague code. Which prompt gives the AI everything it needs?',
    studentLine: "I just want to type 'fix my code' and hope for the best...",
    highlightLines: [],
    passResult: "✅ Great choice! Prompt B gives the AI the array names, function name, and exact data. That's Context + Goal + Constraints = a useful AI response.",
    failResult: "Prompt A is too vague — the AI doesn't know your array names, your function name, or what data to push. Try Prompt B instead.",
    studentReaction: "I never thought about giving the AI so much detail. It's like giving directions to someone who's never been to your house!",
    consoleMsg: '// Great prompt! AI can generate the right code.',
    interaction: {
      type: 'promptchoice',
      wrongConsoleMsg: '// Vague prompt — AI may give the wrong result.',
      options: [
        {
          label: 'Prompt Option A',
          text: 'Help me add a new post to my app.',
          isGood: false,
          teacherBranch: "That prompt is too vague — the AI doesn't know what kind of app, what arrays exist, or what data to push. It might give you completely different code.",
          studentBranch: 'Oh... so the AI would just guess? That could break everything.',
        },
        {
          label: 'Prompt Option B',
          text: 'I have a JavaScript app with three parallel arrays: titles, contents, and images. Write a helper function called addBooking() that uses push() to add a new post: title "Streetwear Shoot", content "Sneak peek at the new collection!", image "street.jpg".',
          isGood: true,
          teacherBranch: "That's the PAIR approach — Context, Goal, Constraints, Output. The AI now knows the array names, the function name, and the exact data. Much better result!",
          studentBranch: 'Wow, giving it more detail actually makes it smarter about my specific code!',
        },
      ],
    },
  },
  {
    icon: '✅',
    title: 'Test and Refine',
    instruction: 'The AI generated the addBooking() function and Isabella added it to script.js. Now she calls it before renderFeed(). Does the phone feed update correctly?',
    teacherLine: 'Last step — always test before you move on. Look at the phone. Does the new post appear at the end of the feed?',
    studentLine: "It's showing! I can see Streetwear Shoot at the bottom! It worked!",
    highlightLines: [
      'line-call',
      'line-render',
    ],
    passResult: '✅ It works! The push() added all three values to the correct arrays, renderFeed() picked them up, and the 6th post is now displaying. Protocol complete!',
    failResult: 'Check the order — addBooking() must be called BEFORE renderFeed(). The push() needs to happen first so the array has the new data when renderFeed() runs.',
    studentReaction: "I can't believe I built that! And I actually understand every single line of what it's doing.",
    consoleMsg: "// addBooking() called → push() succeeded!\n// Feed updated: 6 posts loaded.",
    interaction: {
      type: 'testconfirm',
      question: "Does the phone show 6 posts with 'Streetwear Shoot' at the bottom?",
      yesLabel: '✓ Yes, it works!',
      noLabel: '✗ Something looks wrong',
    },
  },
];

export const POSTS: Post[] = [
  {
    day: 'MONDAY',
    title: 'Motivation Monday',
    content: 'Start strong!',
    imageFile: 'one.png',
    swatchColor: '#c0392b',
  },
  {
    day: 'TUESDAY',
    title: 'Tip Tuesday',
    content: 'Mix metals.',
    imageFile: 'two.png',
    swatchColor: '#8e44ad',
  },
  {
    day: 'WEDNESDAY',
    title: 'Work in Progress',
    content: 'Sewing a hem.',
    imageFile: 'three.png',
    swatchColor: '#2980b9',
  },
  {
    day: 'THURSDAY',
    title: 'Throwback Thursday',
    content: 'Old style.',
    imageFile: 'four.png',
    swatchColor: '#9b1a5a',
  },
  {
    day: 'FRIDAY',
    title: 'Fashion Friday',
    content: 'Weekend vibes.',
    imageFile: 'five.png',
    swatchColor: '#7d3c98',
  },
  {
    day: 'SATURDAY',
    title: 'Streetwear Shoot',
    content: 'Sneak peek at the new collection!',
    imageFile: 'street.jpg',
    swatchColor: '#12112a',
  },
];

export const SUMMARY: Summary = {
  title: '🎉 Protocol Complete!',
  sub: 'Isabella successfully added the Streetwear Shoot booking to The Stylist feed.',
  teacherLine: "That's exactly how we want students to work — understand before you code, plan before you prompt, test before you move on. The protocol works!",
  steps: [
    {
      icon: '🔍',
      name: 'Understand',
      note: 'Identified the parallel array pattern — one index per day',
    },
    {
      icon: '📌',
      name: 'Locate',
      note: 'Found the // HELPER FUNCTIONS TODO in script.js',
    },
    {
      icon: '🧠',
      name: 'Plan',
      note: 'Sequenced the logic in plain English before coding',
    },
    {
      icon: '🤖',
      name: 'Prompt',
      note: 'Used Context + Goal + Constraints for a precise AI prompt',
    },
    {
      icon: '✅',
      name: 'Test',
      note: 'Confirmed 6th post appeared correctly in the feed',
    },
  ],
  takeawayLead: 'Key takeaway for your classroom:',
  takeaway: "When students say they're 'stuck', they're usually skipping step 1 or 3 — they haven't understood what exists or planned what they need. The protocol redirects that impulse.",
  btnRestart: '↺ Run the Protocol Again',
};
