export type Song = {
  title: string;
  artist: string;
  genre: string;
  mood: string;
};

export const SONGS: Song[] = [
  {title: 'Blitzkrieg Bop', artist: 'Ramones', genre: 'Punk', mood: 'Energetic'},
  {
    title: 'Cherry Bomb',
    artist: 'The Runaways',
    genre: 'Punk',
    mood: 'Rebellious',
  },
  {
    title: 'Lo-fi Study Beats',
    artist: 'Lo-fi Fruits Music',
    genre: 'Lo-fi',
    mood: 'Relaxing',
  },
  {
    title: 'Coffee Shop Jazz',
    artist: 'Chillhop Music',
    genre: 'Lo-fi',
    mood: 'Calm',
  },
];

/*
 * Options are authored, not derived from SONGS — the original ships a fixed
 * option list, and an option with no matching song is a legitimate teaching
 * case (the filter returns an empty array).
 */
export type Filter = {
  key: 'artist' | 'genre' | 'mood';
  label: string;
  allLabel: string;
  values: string[];
};

export const FILTERS: Filter[] = [
  {
    key: 'artist',
    label: 'Artist',
    allLabel: 'All Artists',
    values: ['Ramones', 'The Runaways', 'Lo-fi Fruits Music', 'Chillhop Music'],
  },
  {key: 'genre', label: 'Genre', allLabel: 'All Genres', values: ['Punk', 'Lo-fi']},
  {
    key: 'mood',
    label: 'Mood',
    allLabel: 'All Moods',
    values: ['Energetic', 'Rebellious', 'Relaxing', 'Calm'],
  },
];
