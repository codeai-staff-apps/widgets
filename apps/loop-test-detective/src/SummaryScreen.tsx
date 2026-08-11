import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import Typography from '@code-dot-org/component-library/typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MuiButton from '@mui/material/Button';

import teacherImg from './assets/teacher_veo.png';
import type {Chrome, Scenario} from './content/types';
import Dialogue from './Dialogue';
import {renderLine} from './highlightCode';
import {Screen, type ScreenMachine} from './shared';

/**
 * The recap reports what the learner actually answered. Every English source
 * variant printed a fixed answer key here regardless of the run; only the
 * Spanish ones scored, and scoring is the behaviour worth keeping.
 */
export default function SummaryScreen({
  machine,
  id,
  chrome,
  scenario,
  answers,
  onRestart,
}: {
  machine: ScreenMachine;
  id: string;
  chrome: Chrome;
  scenario: Scenario;
  answers: (boolean | null)[];
  onRestart: () => void;
}) {
  const {checks, bugCallout} = scenario;
  const score = checks.filter((check, i) => answers[i] === check.correctIsIssue).length;
  const perfect = score === checks.length;

  return (
    <Screen
      machine={machine}
      id={id}
      heading={chrome.summaryTitle}
      headingTag="h1"
      panelClassName="hero"
      eyebrow={
        chrome.summaryEyebrow && <p className="heroEyebrow">{chrome.summaryEyebrow}</p>
      }
      afterHeading={<p className="heroSub">{chrome.summarySub}</p>}
      panelEnd={
        <img
          className="heroImg"
          src={teacherImg}
          alt={chrome.summaryImgAlt ?? chrome.teacherImgAlt}
        />
      }
    >
      <p className="score" role="status">
        <span className="scoreValue">
          {score} / {checks.length}
        </span>
        <span>{chrome.scoreLabel}</span>
      </p>

      {perfect && scenario.perfectMessage && (
        <Typography semanticTag="p" visualAppearance="body-one">
          {scenario.perfectMessage}
        </Typography>
      )}
      {!perfect && scenario.bugMessage && (
        <Typography semanticTag="p" visualAppearance="body-one">
          {scenario.bugMessage}
        </Typography>
      )}

      {bugCallout && (
        <section className="card noPad">
          <Box sx={{bgcolor: '#000', color: '#fff', px: 2.25, py: 1.25}} className="blackStrip">
            <span className="blackStripLabel">{bugCallout.label}</span>
            <span className="blackStripTitle">{bugCallout.title}</span>
          </Box>
          <div className="bugCalloutBody">
            <div className="codeDark" role="group" aria-label="Code comparison: bug versus fix">
              <div className="codeDarkBody">
                <div className="codeLine">{renderLine(bugCallout.aiLabel, 'ai-label')}</div>
                <div className="codeLine bugWash">
                  {renderLine(bugCallout.aiCode, 'ai-code')} <span className="cm">{bugCallout.aiComment}</span>
                </div>
                <div className="codeLine">&nbsp;</div>
                <div className="codeLine">{renderLine(bugCallout.fixLabel, 'fix-label')}</div>
                <div className="codeLine fixWash">
                  {renderLine(bugCallout.fixCode, 'fix-code')} <span className="cm">{bugCallout.fixComment}</span>
                </div>
              </div>
            </div>
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {bugCallout.explanation}
            </Typography>
          </div>
        </section>
      )}

      {chrome.recapTitle && (
        <div className="recapHeader">
          <Typography semanticTag="h2" visualAppearance="heading-sm" noMargin>
            {chrome.recapTitle}
          </Typography>
          {chrome.issueLabel && chrome.passLabel && (
            <div className="recapLegend">
              <span className="legendItem">
                <span className="legendDot legendDotIssue" aria-hidden="true" />
                {chrome.issueLabel}
              </span>
              <span className="legendItem">
                <span className="legendDot legendDotPass" aria-hidden="true" />
                {chrome.passLabel}
              </span>
            </div>
          )}
        </div>
      )}
      <ul className="recap">
        {checks.map((check, i) => {
          const said = answers[i];
          const badge = check.correctIsIssue ? chrome.issueLabel : chrome.passLabel;
          return (
            <li key={check.title} className="card recapRow">
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  mt: '2px',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  bgcolor: check.correctIsIssue
                    ? 'var(--background-brand-purple-extra-light)'
                    : 'var(--background-neutral-secondary)',
                  color: check.correctIsIssue
                    ? 'var(--text-brand-purple-primary)'
                    : 'var(--text-neutral-tertiary)',
                }}
              >
                {i + 1}
              </Avatar>
              <div>
                <div className="recapTitleRow">
                  <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
                    {check.title}
                  </Typography>
                  {/* Sibling of the heading, not inside it — a Chip nested in
                      an <h3> would fold its own text into the heading's
                      accessible name. */}
                  {badge && (
                    <Chip
                      size="small"
                      label={badge}
                      sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.6rem',
                        bgcolor: check.correctIsIssue
                          ? 'var(--background-brand-purple-extra-light)'
                          : 'var(--background-neutral-secondary)',
                        color: check.correctIsIssue
                          ? 'var(--text-brand-purple-primary)'
                          : 'var(--text-neutral-tertiary)',
                      }}
                    />
                  )}
                </div>
                {said !== null && (
                  <p className="recapVerdict">
                    <span>{said ? chrome.youSaidIssue : chrome.youSaidPasses}</span>
                    <span>
                      {said === check.correctIsIssue
                        ? chrome.verdictCorrect
                        : chrome.verdictIncorrect}
                    </span>
                  </p>
                )}
                {check.recapNote && (
                  <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                    {check.recapNote}
                  </Typography>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {chrome.takeaway && (
        <Dialogue speaker={chrome.takeaway.name}>{chrome.takeaway.quote}</Dialogue>
      )}

      {chrome.classroom && (
        <section className="card classroomBox" role="note">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {chrome.classroom.label}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {chrome.classroom.text}
          </Typography>
        </section>
      )}

      <div>
        {/* The DSCO Button's outline treatment only exists via its deprecated
            "secondary purple" combination; a plain MUI outlined Button picks
            up the theme's indigo `primary` colour with no warning and no
            override, matching the original's transparent/indigo-border
            restart button. */}
        <MuiButton
          variant="outlined"
          color="primary"
          startIcon={<FontAwesomeV6Icon iconName="rotate-left" iconStyle="solid" />}
          onClick={onRestart}
        >
          {chrome.btnRestart}
        </MuiButton>
      </div>
      {chrome.restartNote && (
        <Typography semanticTag="p" visualAppearance="body-three">
          {chrome.restartNote}
        </Typography>
      )}
    </Screen>
  );
}
