export interface Card {
  id: string;
  text: string;
  /** setTimeout delay in the shown code. 0 means the line runs synchronously. */
  delay: number;
}

/** One run of syntax-highlighted code. Plain segments carry no `cls`. */
export interface CodeSegment {
  text: string;
  cls?: 'c-fn' | 'c-str' | 'c-kw' | 'c-num' | 'c-obj' | 'c-cmt';
}

export interface Challenge {
  id: string;
  eyebrow: string;
  heading: string;
  desc: string;
  codeSegments: CodeSegment[];
  cards: Card[];
  correctOrder: string[];
  /** Fixed scramble: every student starts from the same board, every time. */
  scrambledOrder: string[];
  /** Screen time as a fraction of the real delay. Classroom pacing only. */
  timeScale: number;
  /** Gap between a synchronous line and the next one. */
  stepMs: number;
  /** Gap between the last line and the result. */
  gradeMs: number;
  resultExplanation: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'sync',
    eyebrow: 'Blocking code',
    heading: 'The Synchronous Kitchen',
    desc: 'This code runs top to bottom with no delays. Drag the tickets into the order you predict, then run the routine to check.',
    codeSegments: [
      {text: 'runBtn', cls: 'c-obj'},
      {text: '.'},
      {text: 'addEventListener', cls: 'c-fn'},
      {text: '('},
      {text: "'click'", cls: 'c-str'},
      {text: ', () => {\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Chef grabs the order ticket."', cls: 'c-str'},
      {text: ');\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Heating up the pan..."', cls: 'c-str'},
      {text: ');\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Cracking and whisking the eggs."', cls: 'c-str'},
      {text: ');\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Pouring mixture into pan and cooking."', cls: 'c-str'},
      {text: ');\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Sliding omelette onto plate. Order served!"', cls: 'c-str'},
      {text: ');\n});'},
    ],
    cards: [
      {id: 's1', text: 'Chef grabs the order ticket.', delay: 0},
      {id: 's2', text: 'Heating up the pan...', delay: 0},
      {id: 's3', text: 'Cracking and whisking the eggs.', delay: 0},
      {id: 's4', text: 'Pouring mixture into pan and cooking.', delay: 0},
      {id: 's5', text: 'Sliding omelette onto plate. Order served!', delay: 0},
    ],
    correctOrder: ['s1', 's2', 's3', 's4', 's5'],
    scrambledOrder: ['s4', 's1', 's5', 's2', 's3'],
    timeScale: 1,
    stepMs: 350,
    gradeMs: 350,
    resultExplanation:
      'Blocking code always runs top to bottom, one line finishes fully before the next one starts, even inside the loop.',
  },
  {
    id: 'async',
    eyebrow: 'Non-blocking code',
    heading: 'The Asynchronous Kitchen',
    desc: 'This code uses setTimeout, so some tasks wait before finishing. Drag the tickets into the order you predict they will finish in, then run the routine and watch the timers race.',
    codeSegments: [
      {text: 'runBtn', cls: 'c-obj'},
      {text: '.'},
      {text: 'addEventListener', cls: 'c-fn'},
      {text: '('},
      {text: "'click'", cls: 'c-str'},
      {text: ', () => {\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Order started..."', cls: 'c-str'},
      {text: ');\n\n    '},
      {text: 'setTimeout', cls: 'c-fn'},
      {text: '(() => {\n        '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Coffee is brewed!"', cls: 'c-str'},
      {text: ');\n    }, '},
      {text: '5000', cls: 'c-num'},
      {text: ');\n\n    '},
      {text: 'setTimeout', cls: 'c-fn'},
      {text: '(() => {\n        '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Eggs are fried!"', cls: 'c-str'},
      {text: ');\n    }, '},
      {text: '3000', cls: 'c-num'},
      {text: ');\n\n    '},
      {text: 'setTimeout', cls: 'c-fn'},
      {text: '(() => {\n        '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Toast popped!"', cls: 'c-str'},
      {text: ');\n    }, '},
      {text: '2000', cls: 'c-num'},
      {text: ');\n\n    '},
      {text: 'addLog', cls: 'c-fn'},
      {text: '('},
      {text: '"Pouring OJ and placing ticket on counter."', cls: 'c-str'},
      {text: ');\n});'},
    ],
    cards: [
      {id: 'a1', text: 'Order started...', delay: 0},
      {id: 'a2', text: 'Pouring OJ and placing ticket on counter.', delay: 0},
      {id: 'a3', text: 'Toast popped!', delay: 2000},
      {id: 'a4', text: 'Eggs are fried!', delay: 3000},
      {id: 'a5', text: 'Coffee is brewed!', delay: 5000},
    ],
    correctOrder: ['a1', 'a2', 'a3', 'a4', 'a5'],
    scrambledOrder: ['a5', 'a3', 'a1', 'a4', 'a2'],
    timeScale: 0.5,
    stepMs: 300,
    gradeMs: 400,
    resultExplanation:
      'setTimeout does not pause the code. JavaScript keeps running the lines below it immediately, then comes back for each timer once its own wait is over, shortest wait first.',
  },
];

/** When each card prints, in the real run — never in the student's predicted order. */
export function runSchedule(challenge: Challenge): {id: string; at: number}[] {
  let step = 0;
  return challenge.cards.map(card => ({
    id: card.id,
    at: card.delay === 0 ? challenge.stepMs * step++ : card.delay * challenge.timeScale,
  }));
}

export const timerRows = (challenge: Challenge) =>
  challenge.cards.filter(card => card.delay > 0).sort((a, b) => a.delay - b.delay);

export const timerLabel = (card: Card) =>
  `${card.text.replace(/!$/, '')} (${card.delay}ms)`;
