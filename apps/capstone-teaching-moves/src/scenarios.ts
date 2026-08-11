/**
 * Walkthrough copy and the ten photos, extracted from the original's inline
 * base64 payloads into real files under src/assets/.
 */
import finalConfidentTeam from './assets/capstone-final-confident-team.jpg';
import introOverwhelmedTeacher from './assets/capstone-intro-overwhelmed-teacher.jpg';
import s1After from './assets/capstone-scenario-1-after-bossy-leaders-resolved.jpg';
import s1Before from './assets/capstone-scenario-1-before-bossy-leaders.jpg';
import s2After from './assets/capstone-scenario-2-after-rush-to-code-resolved.jpg';
import s2Before from './assets/capstone-scenario-2-before-rush-to-code.jpg';
import s3After from './assets/capstone-scenario-3-after-feature-creep-resolved.jpg';
import s3Before from './assets/capstone-scenario-3-before-feature-creep.jpg';
import s4After from './assets/capstone-scenario-4-after-sharing-stress-resolved.jpg';
import s4Before from './assets/capstone-scenario-4-before-sharing-stress.jpg';

export interface Choice {
  text: string;
  correct: boolean;
  /** Present on wrong answers only. */
  feedback?: string;
}

export interface Scenario {
  id: string;
  tag: string;
  title: string;
  beforeImage: string;
  beforeAlt: string;
  text: string;
  choices: Choice[];
  afterImage: string;
  afterAlt: string;
  quote: string;
  explain: string;
}

export const intro = {
  eyebrow: 'Teaching Moves',
  title: 'Facilitating Capstone Projects',
  body: "Group capstone projects are powerful — but they come with predictable challenges. You'll walk through four real classroom scenarios. For each one, choose the move you'd make as the teacher, then see how it plays out.",
  image: introOverwhelmedTeacher,
  imageAlt: 'Overwhelmed teacher in a chaotic classroom',
  startButtonLabel: 'Start the walkthrough →',
};

export const scenarios: Scenario[] = [
  {
    id: 'group-roles',
    tag: 'Scenario 1 · Group Roles',
    title: '“Bossy” Leaders',
    beforeImage: s1Before,
    beforeAlt: 'One student directing teammates who wait to be told what to do next.',
    text: 'You notice one student taking over as Project Leader—assigning tasks, correcting others, and making decisions without team input. Other students are disengaging or just waiting to be told what to do.',
    choices: [
      {
        text: 'Ask: “What does your Kanban board say you should be working on next?” — then: “How can your team use that to decide together?”',
        correct: true,
      },
      {
        text: 'Assign a different student to be the leader instead.',
        correct: false,
        feedback:
          "That swaps who holds the authority, but the team still isn't deciding together — it doesn't teach shared ownership.",
      },
      {
        text: 'Let the team work through it themselves without stepping in.',
        correct: false,
        feedback:
          'Without a nudge, the disengaged students may just keep waiting to be told what to do.',
      },
    ],
    afterImage: s1After,
    afterAlt: 'The same team gathered around a Kanban board, deciding tasks together.',
    quote: '“What does our Kanban board say we should work on next?”',
    explain:
      'This shifts leadership from authority to facilitation and keeps decisions grounded in shared planning tools — not personalities.',
  },
  {
    id: 'planning-vs-building',
    tag: 'Scenario 2 · Planning vs. Building',
    title: 'Rush to Code',
    beforeImage: s2Before,
    beforeAlt: 'Students building app screens without agreeing on how the app should work.',
    text: 'On Day 2, teams jump straight into building—designing screens, picking colors, or starting code—without clearly explaining how their app is supposed to work. When you ask questions, their ideas are vague or inconsistent.',
    choices: [
      {
        text: 'Pause the group and ask: “Walk me through one user interaction — what does the user do, and what happens next?”',
        correct: true,
      },
      {
        text: "Let them keep building — they'll figure out the logic as they go.",
        correct: false,
        feedback:
          'Building without a clear system usually leads to more rework later, not less confusion.',
      },
      {
        text: 'Tell them exactly what their app should do, step by step.',
        correct: false,
        feedback:
          'That solves it for them instead of building their own system-thinking skills.',
      },
    ],
    afterImage: s2After,
    afterAlt: 'The same students mapping out a user interaction together before building.',
    quote: '“Walk me through one user interaction — what does the user do, and what happens next?”',
    explain:
      "If they can't explain it clearly, they're not ready to build. This reinforces that planning and system thinking come before coding — not after.",
  },
  {
    id: 'scope',
    tag: 'Scenario 3 · Scope',
    title: 'Feature Creep',
    beforeImage: s3Before,
    beforeAlt: 'A team excitedly sketching extra features while their core app sits unfinished.',
    text: 'Teams keep adding new ideas—extra screens, features, or “cool” elements—but their core app is incomplete or buggy. They\'re excited, but their project is becoming scattered and unfinished.',
    choices: [
      {
        text: 'Ask: “What problem does this feature solve?” and “What testing or feedback led you to add it?”',
        correct: true,
      },
      {
        text: 'Tell them to cut every extra feature immediately.',
        correct: false,
        feedback:
          "That solves the scope problem for them — it doesn't build their own judgment about what's worth keeping.",
      },
      {
        text: "Let them keep adding features since they're motivated.",
        correct: false,
        feedback:
          'Enthusiasm is great, but without a check-in the core app risks staying unfinished.',
      },
    ],
    afterImage: s3After,
    afterAlt: 'The same team reviewing their core features together, focused and organized.',
    quote: '“What problem does this feature solve? What testing or feedback led you to add it?”',
    explain:
      'A simpler, well-explained app is stronger than a complex, unfinished one. This helps students prioritize intentional design over quantity.',
  },
  {
    id: 'expectations',
    tag: 'Scenario 4 · Expectations',
    title: 'Sharing Stress',
    beforeImage: s4Before,
    beforeAlt: 'Students looking anxious and unsure about how their project will be shared.',
    text: "Students don't know how their projects will be shared, so some overbuild while others under-prepare. At the end, expectations feel unclear or mismatched.",
    choices: [
      {
        text: "Set expectations early: tell students upfront whether they're sharing at Level 1 (in-class), Level 2 (school/community), or Level 3 (public/online).",
        correct: true,
      },
      {
        text: "Wait until it's closer to the showcase date to share the details.",
        correct: false,
        feedback: 'Waiting only shortens the time teams have to scope their work appropriately.',
      },
      {
        text: 'Have every team prepare for the largest possible audience, just in case.',
        correct: false,
        feedback:
          'That raises stress for everyone instead of scoping expectations to what\'s actually needed.',
      },
    ],
    afterImage: s4After,
    afterAlt: 'The same students presenting confidently, with clear expectations for their audience.',
    quote:
      'Level 1: in-class gallery walk. Level 2: school/community showcase. Level 3: public/online sharing.',
    explain:
      'Explain that the goal is to celebrate their thinking and decisions — not just the final product. This helps students scope their work appropriately and reduces unnecessary stress.',
  },
];

export const wrapUp = {
  eyebrow: 'Wrap-up',
  title: 'Facilitating Confident Capstones',
  introText:
    "Strong capstone projects don't happen by accident — they come from clear structures and intentional teacher moves. By guiding students to:",
  recapList: [
    'Use shared tools like the Kanban board',
    'Think before they build',
    'Focus on meaningful features',
    'Understand how their work will be shared',
  ],
  image: finalConfidentTeam,
  imageAlt: 'Confident student team presenting their capstone project',
  outroText:
    "…you help them move from confusion to clarity, and from activity to purposeful learning. Your role isn't to manage every decision — it's to create the conditions where students can collaborate, reflect, and confidently explain their thinking.",
  restartButtonLabel: '↺ Replay the walkthrough',
};

export const labels = {
  prompt: "What's your teacher move?",
  afterLabel: '✓ Teacher move',
  nextButtonLabel: 'Next scenario →',
  wrongPrefix: 'Not quite. ',
  progress: (index: number) => `Scenario ${index + 1} of ${scenarios.length}`,
};
