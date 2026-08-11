import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useState} from 'react';

import {CRITERIA, INSTRUCTIONS, LEVELS, MAX_SCORE} from './rubricData';
import {useAnnounce, visuallyHidden} from './shared';
import './rubric.css';

type Selections = (number | null)[];

const criterionHeadingId = (rowIdx: number) => `criterion-${rowIdx}`;

const pointsLabel = (levelIdx: number) =>
  `${levelIdx + 1} pt${levelIdx === 0 ? '' : 's'}`;

export default function App() {
  const [selections, setSelections] = useState<Selections>(() =>
    CRITERIA.map(() => null),
  );
  const announce = useAnnounce();

  const total = selections.reduce<number>((sum, points) => sum + (points ?? 0), 0);
  const answered = selections.filter(points => points !== null).length;

  const selectScore = (rowIdx: number, levelIdx: number) => {
    const points = levelIdx + 1;
    const next = selections.map((prev, i) => (i === rowIdx ? points : prev));
    setSelections(next);

    const newTotal = next.reduce<number>((sum, p) => sum + (p ?? 0), 0);
    announce(
      `${CRITERIA[rowIdx].name} set to ${LEVELS[levelIdx]}, ${points} points. ` +
        `Total is now ${newTotal} out of ${MAX_SCORE}.`,
    );
  };

  const reset = () => {
    setSelections(CRITERIA.map(() => null));
    announce('Rubric reset. No selections yet.');
  };

  return (
    <main className="page">
      <Paper
        sx={{
          borderRadius: '18px',
          boxShadow: '0 10px 40px rgba(31,25,118,0.12)',
          p: '28px 28px 32px',
          bgcolor: 'var(--background-neutral-primary)',
        }}
      >
        <Chip
          label="Grading Practice"
          sx={{
            bgcolor: '#4C42CF',
            color: '#fff',
            borderRadius: '100px',
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            fontFamily: 'var(--font-family-heading)',
            fontWeight: 600,
            fontSize: 12,
            mb: 1.5,
          }}
        />
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          Capstone Project Rubric
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-two">
          {INSTRUCTIONS}
        </Typography>

        <TableContainer
          tabIndex={0}
          role="region"
          aria-label="Rubric"
        >
          <Table className="rubricTable">
            <caption style={visuallyHidden}>
              Capstone Project Rubric. Five criteria by four evidence levels;
              select one evidence level per criterion.
            </caption>
            <TableHead>
              <TableRow>
                <TableCell
                  component="th"
                  scope="col"
                  sx={{
                    bgcolor: '#1F1976',
                    color: '#fff',
                    fontFamily: 'var(--font-family-heading)',
                    position: 'sticky',
                    top: 0,
                    minWidth: 170,
                  }}
                >
                  Criterion
                </TableCell>
                {LEVELS.map((level, levelIdx) => (
                  <TableCell
                    key={level}
                    component="th"
                    scope="col"
                    sx={{
                      bgcolor: '#1F1976',
                      color: '#fff',
                      fontFamily: 'var(--font-family-heading)',
                      position: 'sticky',
                      top: 0,
                    }}
                  >
                    {level}
                    <span className="pts">{pointsLabel(levelIdx)}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& tr:nth-of-type(even) td': {bgcolor: '#faf9ff'},
                '& td': {borderLeft: '1px solid #eeecfa', verticalAlign: 'top'},
              }}
            >
              {CRITERIA.map((criterion, rowIdx) => (
                <TableRow key={criterion.name}>
                  <TableCell
                    component="th"
                    scope="row"
                    id={criterionHeadingId(rowIdx)}
                    sx={{
                      bgcolor: '#E4E2F8',
                      color: '#1F1976',
                      fontFamily: 'var(--font-family-heading)',
                      minWidth: 170,
                      verticalAlign: 'top',
                    }}
                  >
                    {criterion.name}
                  </TableCell>
                  {LEVELS.map((level, levelIdx) => {
                    const selected = selections[rowIdx] === levelIdx + 1;
                    return (
                      <TableCell key={level}>
                        <Button
                          type="tertiary"
                          color="black"
                          className={`scoreBtn${selected ? ' scoreBtnSelected' : ''}`}
                          text={criterion.levels[level]}
                          aria-pressed={selected}
                          aria-describedby={criterionHeadingId(rowIdx)}
                          onClick={() => selectScore(rowIdx, levelIdx)}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper
        sx={{
          position: 'sticky',
          bottom: 0,
          mt: '22px',
          bgcolor: '#1F1976',
          color: '#fff',
          borderRadius: '14px',
          p: '16px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Typography
            semanticTag="p"
            visualAppearance="heading-sm"
            noMargin
            style={{color: '#fff'}}
          >
            {total} / {MAX_SCORE} pts
          </Typography>
          <Typography
            semanticTag="p"
            visualAppearance="body-three"
            noMargin
            style={{color: 'rgba(255,255,255,.85)'}}
          >
            {answered === 0
              ? 'No selections yet'
              : answered === CRITERIA.length
                ? `All ${CRITERIA.length} criteria scored`
                : `${answered} of ${CRITERIA.length} criteria scored`}
          </Typography>
        </div>
        <Button
          type="secondary"
          color="black"
          text="Reset"
          onClick={reset}
          /* A ghost button on the indigo bar: the DS secondary variant paints
             a white background, which white label text would vanish into. */
          style={{
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.5)',
            color: '#fff',
          }}
        />
      </Paper>
    </main>
  );
}
