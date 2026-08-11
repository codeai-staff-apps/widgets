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
    <main className="console">
      <Typography semanticTag="h1" visualAppearance="heading-lg" className="title">
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
        <Typography semanticTag="p" visualAppearance="body-two" className="count">
          {matches.length} {matches.length === 1 ? 'song' : 'songs'}
        </Typography>
      </div>

      {matches.length === 0 ? (
        <div className="songGrid">
          <Typography
            semanticTag="p"
            visualAppearance="body-two"
            className="noResults"
          >
            No songs match your filters.
          </Typography>
        </div>
      ) : (
        <ul className="songGrid">
          {matches.map(song => (
            <li key={song.title}>
              <Card
                variant="outlined"
                sx={{
                  width: '100%',
                  minWidth: 160,
                  aspectRatio: '1',
                  borderRadius: '50%',
                  border: '2px solid #00ffff',
                  boxShadow: '0 0 10px #00ff00',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  '@media (prefers-reduced-motion: no-preference)': {
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 20px #ff00ff',
                    },
                  },
                }}
              >
                <CardContent>
                  <Typography
                    semanticTag="h2"
                    visualAppearance="heading-xs"
                    className="songTitle"
                  >
                    {song.title}
                  </Typography>
                  <Typography
                    semanticTag="p"
                    visualAppearance="body-two"
                    noMargin
                    className="artistName"
                  >
                    {song.artist}
                  </Typography>
                  <Typography
                    semanticTag="p"
                    visualAppearance="body-three"
                    noMargin
                    className="genreMood"
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
