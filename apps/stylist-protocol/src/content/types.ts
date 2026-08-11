/*
 * Content for the five-step protocol. Each step carries one interaction; the
 * union below is what the step card switches on.
 */

/** One run of syntax-highlighted code text. Plain segments carry no `tok`. */
export interface CodeSegment {
  text: string;
  tok?: 'kw' | 'fn' | 'str' | 'num' | 'cm' | 'op' | 'todo';
}

export interface CodeLine {
  /** Present only on lines a step highlights, clicks, or rewrites. */
  id?: string;
  segments: CodeSegment[];
  /** Omitted for lines that are always on screen. */
  visibility?: 'beforeReveal' | 'afterReveal';
}

export interface ConceptInteraction {
  type: 'concept';
  question: string;
  options: {text: string; correct: boolean}[];
}

export interface ClickLineInteraction {
  type: 'clickline';
  /** Id of the one right line. Every other line is a real wrong answer. */
  target: string;
  hint: string;
}

export interface SequenceInteraction {
  type: 'sequence';
  items: {id: string; text: string; correct: number}[];
}

export interface PromptInteraction {
  type: 'promptchoice';
  /** The one wrong path with its own console line. */
  wrongConsoleMsg: string;
  options: {
    label: string;
    text: string;
    isGood: boolean;
    teacherBranch: string;
    studentBranch: string;
  }[];
}

export interface TestInteraction {
  type: 'testconfirm';
  question: string;
  yesLabel: string;
  noLabel: string;
}

export type Interaction =
  | ConceptInteraction
  | ClickLineInteraction
  | SequenceInteraction
  | PromptInteraction
  | TestInteraction;

export interface Step {
  icon: string;
  title: string;
  instruction: string;
  teacherLine: string;
  studentLine: string;
  /** Code line ids to mark while this step is on screen. */
  highlightLines: string[];
  passResult: string;
  failResult: string;
  studentReaction: string;
  /** Appended to the console when the step is answered correctly. */
  consoleMsg?: string;
  interaction: Interaction;
}

export interface Post {
  day: string;
  title: string;
  content: string;
  imageFile: string;
  /** Stands in for the post's photo — the swatch behind the filename. */
  swatchColor: string;
}

export interface Summary {
  title: string;
  sub: string;
  teacherLine: string;
  steps: {icon: string; name: string; note: string}[];
  /** The bolded lead-in of `takeaway`, e.g. "Key takeaway for your classroom:" */
  takeawayLead: string;
  takeaway: string;
  btnRestart: string;
}

/** A run of text with the data-value spans the original called out in amber. */
export interface TextSegment {
  text: string;
  emphasis?: boolean;
}

export interface Chrome {
  documentTitle: string;
  unitTag: string;
  introTitle: string;
  /** The accent-coloured second half of the intro heading. */
  introTitleAccent: string;
  introSub: string;
  notifIcon: string;
  notifTitle: string;
  notifDetails: TextSegment[];
  notifItems: TextSegment[];
  studentName: string;
  teacherName: string;
  introTeacherLine: string;
  stepsPreview: string[];
  startBtn: string;
  codeSummary: string;
  consoleSummary: string;
  consoleLabel: string;
  consoleInitial: string;
  /** Contains `{n}`, the 1-based step number. */
  progressOf: string;
  dotDoneLabel: string;
  dotActiveLabel: string;
  dotPendingLabel: string;
  btnNext: string;
  btnFinish: string;
  phoneTitle: string;
  phoneSub: string;
  stepDone: string;
  stepRetry: string;
}
