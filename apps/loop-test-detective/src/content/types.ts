/*
 * Two independent axes. `lang` picks the chrome and dialogue language;
 * `scenario` picks the bug under test. The sources only ever authored two of
 * the four cells — the English activity teaches an off-by-one loop, the
 * Spanish one teaches a loop with a shifted range — so a scenario records the
 * one language its copy exists in and `resolve()` falls back when asked for a
 * pair nobody wrote.
 */

export type Lang = 'en' | 'es';
export type ScenarioId = 'off-by-one' | 'wrong-range';

/** The two code lines a check can point at. */
export type HighlightId = 'loop' | 'actual';

export interface Check {
  title: string;
  /** The teacher's framing line, shown before the question. */
  teacherLine: string;
  /** The student's opening line. Authored only in the English source. */
  studentLine?: string;
  question: string;
  /** True when the honest answer is "has an issue". */
  correctIsIssue: boolean;
  correctLabel: string;
  correctBody: string;
  wrongLabel: string;
  wrongBody: string;
  /** The student's reply after answering. English source only. */
  reactionCorrect?: string;
  reactionIncorrect?: string;
  /** Unattributed follow-up note. Spanish source only. */
  hint?: string;
  highlight?: HighlightId;
  /** Summary-screen note. English source only. */
  recapNote?: string;
}

export interface Scenario {
  /** The language this scenario's copy was authored in. */
  lang: Lang;
  code: {
    comment: string;
    loop: string;
    body: string;
    close: string;
    expected: string;
    actualUnknown: string;
    actualRevealed: string;
  };
  /** Console lines shown once the reveal check is answered. */
  consoleOutput: string[];
  consoleWarning: string;
  /** Index of the check that reveals the console output and the actual values. */
  revealAt: number;
  checks: Check[];
  /** Side-by-side bug comparison on the summary. English source only. */
  bugCallout?: {
    label: string;
    title: string;
    aiLabel: string;
    aiCode: string;
    aiComment: string;
    fixLabel: string;
    fixCode: string;
    fixComment: string;
    explanation: string;
  };
  /** Single-paragraph bug explanation, and its perfect-score variant. Spanish source only. */
  bugMessage?: string;
  perfectMessage?: string;
}

export interface Chrome {
  documentTitle: string;
  unitTag: string;
  eyebrow?: string;
  introTitle: string;
  introSub: string;
  introTeacherLine?: string;
  /** Alt text for the teacher photo in the hero banner. Falls back to `teacherImgAlt`. */
  heroImgAlt?: string;
  scenarioCard?: {
    label: string;
    header: string;
    studentLabel: string;
    quote: string;
    body: string;
    /** Alt text for the student photo. Falls back to `studentImgAlt`. */
    imgAlt?: string;
  };
  missionHeading: string;
  missionText: string;
  missionSteps?: string[];
  startBtn: string;
  startNote?: string;
  /** Contains `{n}`, the 1-based check number. */
  progressOf: string;
  teacherName: string;
  studentName: string;
  /** Alt text for the teacher photo in the activity's character area and takeaway. */
  teacherImgAlt: string;
  /** Alt text for the student photo in the activity's character area. */
  studentImgAlt: string;
  btnPasses: string;
  btnIssue: string;
  btnNext: string;
  btnResults: string;
  /** Shown, aria-hidden, on the buggy loop line once revealed. */
  bugTagLabel: string;
  consoleLabel: string;
  consoleInitial: string;
  youSaidPasses: string;
  youSaidIssue: string;
  verdictCorrect: string;
  verdictIncorrect: string;
  scoreLabel: string;
  summaryEyebrow?: string;
  summaryTitle: string;
  summarySub: string;
  /** Alt text for the teacher photo in the completion header. Falls back to `teacherImgAlt`. */
  summaryImgAlt?: string;
  recapTitle?: string;
  issueLabel?: string;
  passLabel?: string;
  takeaway?: {name: string; quote: string};
  classroom?: {label: string; text: string};
  btnRestart: string;
  restartNote?: string;
  /** Shown when `?scenario` names a bug this language has no copy for. */
  fallbackNote: string;
}
