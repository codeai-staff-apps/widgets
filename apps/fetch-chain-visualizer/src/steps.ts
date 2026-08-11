/**
 * Every "response" here is a literal string. The page names
 * api.openweathermap.org but never calls it, and neither does this rebuild.
 *
 * `**…**` marks a highlighted token, `|cls:text|` marks a syntax colour (see
 * `highlight()` in markup.tsx), and backticks mark inline code in prose.
 */

export interface Step {
  number: number;
  heading: string;
  code: string;
  codeSummary: string;
  buttonLabel: string;
  resultLabel: string;
  initialHint: string;
  /** Console-style output revealed once the step runs. */
  result: string;
  verdictBody: string;
  announce: string;
}

export const directions = {
  heading: 'How to use this visualizer:',
  steps: [
    'Look at the full fetch() chain at the top — three lines, three steps.',
    'Run each step one at a time. Try to predict what each one produces before you click.',
    'After all three steps, a summary explains how they connect.',
  ],
};

export const fullChain = {
  heading: 'The full fetch() chain',
  code: `|fn:fetch|(**API_URL**)
  .**then**(response |op:=>| response.|fn:json|())
  .**then**(data |op:=>| |fn:updateUI|(data));`,
  summary:
    'Three-line fetch chain: fetch API URL, then convert response to JSON, then update the UI with data.',
};

export const verdictLabel = 'What just happened';

export const steps: Step[] = [
  {
    number: 1,
    heading: 'fetch(API_URL) — Send the request',
    code: '|fn:fetch|(**API_URL**) |comment:// send a request to the server|',
    codeSummary: 'Line 1: fetch called with API_URL sends a request to the server',
    buttonLabel: 'Run Step 1',
    resultLabel: 'What the server receives',
    initialHint: 'not run yet',
    result: `|dim:GET ||valS:https://api.openweathermap.org/data/2.5/weather?q=Seattle|
|hint:→ Request sent. Waiting for server response...|`,
    verdictBody:
      'Your app sent an HTTP request to the API server at `API_URL`. The server got the request and started preparing a response. Nothing has come back yet — `fetch()` kicks off the process, but the response arrives asynchronously. Your app keeps running while it waits.',
    announce:
      'Step 1 complete. The fetch request was sent to the API server. Step 2 is now available.',
  },
  {
    number: 2,
    heading: '.then(response => response.json()) — Parse the response',
    code: '.**then**(response |op:=>| response.|fn:json|()) |comment:// convert to readable JSON|',
    codeSummary:
      'Line 2: the first then converts the raw response into readable JSON',
    buttonLabel: 'Run Step 2',
    resultLabel: 'What response.json() returns',
    initialHint: 'run step 1 first',
    result: `|brace:{|
  |key:"city"|: |valS:"Seattle"|,
  |key:"temperature"|: |valN:75|,
  |key:"description"|: |valS:"Sunny"|,
  |key:"coordinates"|: [|valN:47.60|, |valN:-122.33|]
|brace:}|`,
    verdictBody:
      "The server's raw response arrived as a stream of bytes — not yet usable as JavaScript. `response.json()` reads that stream and converts it into a JavaScript object. This is why there are two `.then()` calls: receiving the response and reading it as JSON are two separate steps. Think of it as: the first `.then()` opens the package; the second one uses what's inside.",
    announce:
      'Step 2 complete. The raw response was parsed into a JavaScript object with four keys: city, temperature, description, and coordinates. Step 3 is now available.',
  },
  {
    number: 3,
    heading: '.then(data => updateUI(data)) — Use the data',
    code: ".**then**(data |op:=>| |fn:updateUI|(data)); |comment:// update what's on screen|",
    codeSummary:
      'Line 3: the second then passes the parsed data to updateUI to display it on screen',
    buttonLabel: 'Run Step 3',
    resultLabel: 'What appears on screen',
    initialHint: 'run step 2 first',
    result: `|hint:// updateUI() reads from the data object and writes to the page|
|key:City:|        |valS:Seattle|
|key:Temperature:| |valN:75°F|
|key:Conditions:|  |valS:Sunny|
|hint:// "coordinates" not displayed — the app only shows what it needs|`,
    verdictBody:
      '`data` is now the fully parsed JavaScript object from Step 2. `updateUI(data)` takes that object and writes specific values to the page — pulling `data.city`, `data.temperature`, or `data.description` and placing them into HTML elements. The JSON response had four keys; the app only displays three. That\'s why your students will see a clean UI even though the raw JSON has more in it.',
    announce:
      'Step 3 complete. The parsed data was passed to updateUI, which displayed city, temperature, and description on screen. The coordinates key was not used. The full fetch chain is now complete.',
  },
];

export const mockUi = {
  eyebrow: 'What the user sees on screen',
  city: 'Seattle',
  temperature: '75°F',
  conditions: 'Sunny',
  sideNote: '"coordinates" key not shown here',
};

export const summary = {
  label: 'The full picture',
  paragraphs: [
    'The three-line fetch chain does one complete job: ask for data, receive and parse it, display it. Each step hands its result to the next — that\'s what `.then()` means: "when this is done, do this next."',
    'When your students modify the code in Level 8 — changing a Pokémon\'s name to its height, for example — they\'re changing what `updateUI()` pulls from `data`. The fetch chain itself stays exactly the same.',
  ],
};

export const resetButtonLabel = 'Reset visualizer';
export const resetAnnounce = 'Visualizer reset. All steps ready to run again.';

/** Step N+1's button unlocks this long after step N runs. */
export const UNLOCK_DELAY_MS = 400;
/** The summary appears this long after step 3 runs. */
export const SUMMARY_DELAY_MS = 500;
/** Beat between mounting a fade-in reveal and starting its transition — a
 * CSS transition can't animate from a class an element is born with. */
export const REVEAL_DELAY_MS = 20;
