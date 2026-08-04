import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
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
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        Capstone Project Rubric
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        {INSTRUCTIONS}
      </Typography>

      <TableContainer>
        <Table>
          <caption style={visuallyHidden}>
            Capstone Project Rubric. Five criteria by four evidence levels;
            select one evidence level per criterion.
          </caption>
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="col">
                Criterion
              </TableCell>
              {LEVELS.map((level, levelIdx) => (
                <TableCell key={level} component="th" scope="col">
                  {level} ({levelIdx + 1} pt)
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {CRITERIA.map((criterion, rowIdx) => (
              <TableRow key={criterion.name}>
                <TableCell
                  component="th"
                  scope="row"
                  id={criterionHeadingId(rowIdx)}
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

      <div className="totalBar">
        <Typography semanticTag="p" visualAppearance="heading-sm" noMargin>
          {total} / {MAX_SCORE} pts
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-three" noMargin>
          {answered === CRITERIA.length
            ? `All ${CRITERIA.length} criteria scored`
            : `${answered} of ${CRITERIA.length} criteria scored`}
        </Typography>
        <Button type="secondary" color="black" text="Reset" onClick={reset} />
      </div>
    </main>
  );
}
