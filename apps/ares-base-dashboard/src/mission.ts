export const CHECKLIST = [
  'Life support systems checked',
  'Crew health screenings complete',
  'Rover systems calibrated',
  'Habitat modules pressure-tested',
  'Final supply manifest confirmed',
];

export type Habitat = {id: string; name: string; icon: string; detail: string};

export const HABITATS: Habitat[] = [
  {
    id: 'dome',
    name: 'Dome',
    icon: '🏙️',
    detail:
      "A large shared living space with natural light through reinforced dome panels. Spacious, but harder to insulate against Mars' temperature swings.",
  },
  {
    id: 'underground',
    name: 'Underground',
    icon: '⛏️',
    detail:
      'Built into the terrain for the best protection from radiation and stable temperatures year-round. No natural light, and it can feel cramped.',
  },
  {
    id: 'inflatable',
    name: 'Inflatable',
    icon: '⛺',
    detail:
      'Lightweight and the fastest to set up, with room to expand later. Less durable than the other two options long-term.',
  },
];

const DAY_MS = 86_400_000;

/* The original has no authored launch date: it is always seven days out at 9am local. */
export function nextLaunchDate(from: Date = new Date()): Date {
  const launch = new Date(from.getTime() + 7 * DAY_MS);
  launch.setHours(9, 0, 0, 0);
  return launch;
}

export type Remaining = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
};

export function remainingUntil(launch: Date, now: Date = new Date()): Remaining {
  const diff = Math.max(0, launch.getTime() - now.getTime());
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor(diff / 3_600_000) % 24,
    mins: Math.floor(diff / 60_000) % 60,
    secs: Math.floor(diff / 1000) % 60,
  };
}
