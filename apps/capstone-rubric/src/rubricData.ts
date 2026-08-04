/*
 * Rubric content, transcribed from the original activity. Point values are
 * the column's 1-based position, not an authored per-cell field, and the max
 * score is derived from the criteria count — adding a criterion must move the
 * max without any other edit.
 */

export const INSTRUCTIONS =
  'Read the sample project, then select the evidence level that best matches ' +
  'what you see for each criterion. Tab through the cells and press Enter or ' +
  'Space to select a score. Your running total updates below as you go.';

export const LEVELS = [
  'No Evidence',
  'Limited Evidence',
  'Convincing Evidence',
  'Extensive Evidence',
] as const;

export type Level = (typeof LEVELS)[number];

export type Criterion = {name: string; levels: Record<Level, string>};

export const CRITERIA: Criterion[] = [
  {
    name: 'Project Planning & Intentional Design',
    levels: {
      'No Evidence': 'Purpose, audience, or scope is missing or incoherent.',
      'Limited Evidence':
        'Purpose or audience is vague, or scope is unclear or unrealistic. Little explanation of decisions.',
      'Convincing Evidence':
        'Purpose and audience are clear. Scope is mostly realistic, with some explanation of decisions or changes made over time.',
      'Extensive Evidence':
        "Clearly explains the project's purpose, audience, and problem. Scope decisions are realistic and intentional, with clear tradeoffs explained. Reflection shows how ideas or scope evolved over time.",
    },
  },
  {
    name: 'Functionality & Technical Implementation',
    levels: {
      'No Evidence': 'App does not run or core functionality is missing.',
      'Limited Evidence':
        'App works inconsistently or only partially. Logic is unclear or does not align well with intended behavior. Code structure is difficult to follow.',
      'Convincing Evidence':
        'App works for the main use case. Logic generally matches intended behavior and functions as expected. Code is mostly readable and organized.',
      'Extensive Evidence':
        'App runs reliably and supports its intended purpose. Logic clearly matches the intended system behavior and correctly handles user input and data. Code is organized, readable, and modular.',
    },
  },
  {
    name: 'User-Centered Design & Usability',
    levels: {
      'No Evidence': 'No clear attention to usability or user needs.',
      'Limited Evidence':
        'Design is confusing, inconsistent, or only loosely connected to user needs.',
      'Convincing Evidence':
        'Design is generally clear and usable. Some evidence of considering user needs or feedback.',
      'Extensive Evidence':
        'Design clearly supports the target audience. Interface choices improve clarity, usability, and trust. Feedback is reflected in design or interaction changes.',
    },
  },
  {
    name: 'Responsible AI & Ethical Reflection',
    levels: {
      'No Evidence': 'No meaningful documentation of AI use or ethical thinking.',
      'Limited Evidence':
        'Mentions AI use or ethics superficially, with limited reasoning.',
      'Convincing Evidence':
        'Describes how AI was used and includes some reflection on ethical or design implications.',
      'Extensive Evidence':
        'Clearly explains how AI tools were used. Reflection shows strong judgment in accepting, modifying, or rejecting AI output. Thoughtfully considers ethics, inclusion, or unintended impacts.',
    },
  },
  {
    name: 'Collaboration & Professional Practice',
    levels: {
      'No Evidence':
        'Little or no evidence of collaboration or professional process.',
      'Limited Evidence':
        'Collaboration is uneven or unclear. Limited or inconsistent use of the Project Planning Board.',
      'Convincing Evidence':
        'Demonstrates collaboration. Project Planning Board shows ongoing task tracking and iteration, with some evidence of shared ownership or communication.',
      'Extensive Evidence':
        'Demonstrates effective collaboration and shared ownership. Project Planning Board shows ongoing task tracking, prioritization, and iteration, with clear communication and coordination over time.',
    },
  },
];

export const MAX_SCORE = CRITERIA.length * LEVELS.length;
