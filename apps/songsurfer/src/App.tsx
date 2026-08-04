import SimpleDropdown from '@code-dot-org/component-library/dropdown/simpleDropdown';
import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useState} from 'react';

import {FILTERS, SONGS} from './songs';
import './songsurfer.css';

type FilterState = {artist: string; genre: string; mood: string};

const NO_FILTER = '';

const EMPTY_FILTERS: FilterState = {
  artist: NO_FILTER,
  genre: NO_FILTER,
  mood: NO_FILTER,
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  // The three predicates AND together; an unset filter constrains nothing.
  const matches = SONGS.filter(
    song =>
      (!filters.artist || song.artist === filters.artist) &&
      (!filters.genre || song.genre === filters.genre) &&
      (!filters.mood || song.mood === filters.mood),
  );

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        SongSurfer
      </Typography>

      <div className="filters">
        {FILTERS.map(filter => (
          <SimpleDropdown
            key={filter.key}
            name={filter.key}
            labelText={filter.label}
            isLabelVisible
            selectedValue={filters[filter.key]}
            onChange={event =>
              setFilters({...filters, [filter.key]: event.target.value})
            }
            items={[
              {value: NO_FILTER, text: filter.allLabel},
              ...filter.values.map(value => ({value, text: value})),
            ]}
          />
        ))}
      </div>

      <div role="status" aria-live="polite">
        <Typography semanticTag="p" visualAppearance="body-two">
          {matches.length} {matches.length === 1 ? 'song' : 'songs'}
        </Typography>
      </div>

      {matches.length === 0 ? (
        <Typography semanticTag="p" visualAppearance="body-two">
          No songs match your filters.
        </Typography>
      ) : (
        <ul className="songGrid">
          {matches.map(song => (
            <li key={song.title}>
              <Card variant="outlined">
                <CardContent>
                  <Typography semanticTag="h2" visualAppearance="heading-xs">
                    {song.title}
                  </Typography>
                  <Typography semanticTag="p" visualAppearance="body-two" noMargin>
                    {song.artist}
                  </Typography>
                  <Typography
                    semanticTag="p"
                    visualAppearance="body-three"
                    noMargin
                  >
                    {song.genre} | {song.mood}
                  </Typography>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
