/** Shapes of review/v1/index.json and review/v1/<category>/manifest.json. */

export interface ReviewIndexEntry {
  sentenceId: string;
  manifest: string;
  generatedAt: string;
  fillings: number;
  /** Variant counts by status, e.g. {published: 302, abandoned: 4, 'not drawn': 6}. */
  variants: Record<string, number>;
  /** Total rejected attempts in this category. */
  rejected: number;
}

export interface ReviewIndex {
  generatedAt: string;
  sentences: ReviewIndexEntry[];
}

export interface Word {
  id: string;
  text: string;
}

export interface Slot {
  id: string;
  label: string;
  required: boolean;
  words: Word[];
}

export interface Checks {
  azure: {verdict: string; categories: {category: string; severity: number}[]};
  judge: {verdict: string};
}

interface ImageRecord {
  seed: number;
  model: string;
  /** Frame name to image path, relative to the base URL. */
  frames: Record<string, string>;
  /** Moderation results by frame name. */
  checks: Record<string, Checks>;
  review?: unknown;
}

export interface CurrentImage extends ImageRecord {
  published: boolean;
  drawnAt: string;
}

export interface RejectedImage extends ImageRecord {
  at: string;
  reason: string;
}

export interface Variant {
  variant: number;
  /** published, abandoned, not drawn, ... */
  status: string;
  current: CurrentImage | null;
  rejected: RejectedImage[];
}

export interface Filling {
  /** One word id per slot, in slot order; '_' is an empty optional slot. */
  wordIds: string[];
  prompt: string;
  frames: string[];
  variants: Variant[];
}

export interface Manifest {
  sentenceId: string;
  generatedAt: string;
  animated: boolean;
  slots: Slot[];
  fillings: Filling[];
}
