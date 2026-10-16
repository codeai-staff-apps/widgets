import {getDestination, type Choice, type Copy, type DestinationId, type Selection} from './destinations';

import './samplePage.css';

/**
 * The sample page. It is built in four independent layers so each switch fills
 * in exactly one thing and they can be flipped in any order:
 *   audience -> the badge, the tagline and how roomy the page is
 *   feel     -> the colors and corner style (gray wireframe when off)
 *   parts    -> the real components (dashed gray placeholders when off)
 *   content  -> the words and numbers (gray bars when off)
 * It is a picture, not a working page, so nothing inside it is focusable; the
 * caller labels it with a text description.
 */

/** Real words when `on`, otherwise a gray bar about as wide as the words would be. */
function Txt({on, children}: {on: boolean; children: string}) {
  return on ? <>{children}</> : <span className="sp-bar" style={{width: `${children.length}ch`}} />;
}

function Wheel({items, labelled}: {items: readonly string[]; labelled: boolean}) {
  const step = 360 / items.length;
  const point = (degrees: number, radius: number) => {
    const radians = (degrees * Math.PI) / 180;
    return [100 + radius * Math.cos(radians), 100 + radius * Math.sin(radians)];
  };
  return (
    <svg className="sp-wheel" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {items.map((item, index) => {
        const middle = -90 + index * step;
        const [x0, y0] = point(middle - step / 2, 96);
        const [x1, y1] = point(middle + step / 2, 96);
        const [tx, ty] = point(middle, 62);
        return (
          <g key={item} className={index % 2 === 0 ? 'sp-wedge sp-wedge--a' : 'sp-wedge sp-wedge--b'}>
            <path d={`M100 100 L${x0} ${y0} A96 96 0 0 1 ${x1} ${y1} Z`} />
            {labelled && (
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle">
                {item}
              </text>
            )}
          </g>
        );
      })}
      <polygon className="sp-pointer" points="90,1 110,1 100,20" />
      <circle className="sp-hub" cx="100" cy="100" r="9" />
    </svg>
  );
}

interface StageProps {
  copy: Copy;
  parts: Choice | null;
  content: boolean;
}

function WheelStage({copy, parts, content}: StageProps) {
  return (
    <div className="sp-stage sp-stage--wheel">
      {parts === null ? <div className="sp-ph sp-ph--circle" /> : <Wheel items={copy.items} labelled={content} />}
      {parts === null && <div className="sp-ph sp-ph--card" />}
      {parts === 0 && (
        <div className="sp-card sp-result">
          <span className="sp-small">
            <Txt on={content}>Today's pick</Txt>
          </span>
          <strong className="sp-big">
            <Txt on={content}>{copy.items[0]}</Txt>
          </strong>
        </div>
      )}
      {parts === 1 && (
        <ul className="sp-card sp-list">
          <li className="sp-small">
            <Txt on={content}>Recent picks</Txt>
          </li>
          {copy.values.map(value => (
            <li key={value}>
              <Txt on={content}>{value}</Txt>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BakeStage({copy, parts, content}: StageProps) {
  if (parts === null) {
    return (
      <div className="sp-stage sp-cards">
        {copy.items.map(item => (
          <div key={item} className="sp-ph sp-ph--card" />
        ))}
      </div>
    );
  }
  if (parts === 0) {
    return (
      <div className="sp-stage sp-cards">
        {copy.items.map((item, index) => (
          <div key={item} className="sp-card sp-treat">
            <div className="sp-photo" />
            <strong>
              <Txt on={content}>{item}</Txt>
            </strong>
            <span className="sp-price">
              <Txt on={content}>{copy.values[index]}</Txt>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <ul className="sp-stage sp-card sp-list sp-menu">
      {copy.items.map((item, index) => (
        <li key={item}>
          <strong>
            <Txt on={content}>{item}</Txt>
          </strong>
          <span className="sp-price">
            <Txt on={content}>{copy.values[index]}</Txt>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ParkStage({copy, parts, content}: StageProps) {
  if (parts === null) {
    return (
      <div className="sp-stage sp-stack">
        <div className="sp-ph sp-ph--bar" />
        <div className="sp-ph sp-ph--card" />
      </div>
    );
  }
  if (parts === 0) {
    return (
      <div className="sp-stage sp-card sp-stack">
        <span className="sp-small">
          <Txt on={content}>{copy.values[0]}</Txt>
        </span>
        <div className="sp-track">
          <div className="sp-fill" style={{width: `${copy.pct}%`}} />
        </div>
      </div>
    );
  }
  return (
    <ul className="sp-stage sp-card sp-facts">
      {copy.items.map(item => (
        <li key={item}>
          <Txt on={content}>{item}</Txt>
        </li>
      ))}
    </ul>
  );
}

function WeatherStage({copy, parts, content}: StageProps) {
  if (parts === null) {
    return (
      <div className="sp-stage sp-stack">
        <div className="sp-ph sp-ph--bar" />
        <div className="sp-ph sp-ph--card" />
        <div className="sp-cards">
          {copy.items.map(item => (
            <div key={item} className="sp-ph sp-ph--tile" />
          ))}
        </div>
      </div>
    );
  }
  const labels = parts === 0 ? copy.items : copy.hours!;
  return (
    <div className="sp-stage sp-stack">
      <div className="sp-card sp-search">
        <Txt on={content}>{copy.city!}</Txt>
      </div>
      <div className="sp-card sp-now">
        <strong className="sp-huge">
          <Txt on={content}>{copy.lead!}</Txt>
        </strong>
      </div>
      <div className={parts === 0 ? 'sp-cards' : 'sp-strip'}>
        {labels.map((label, index) => (
          <div key={label} className="sp-card sp-tile">
            <span className="sp-small">
              <Txt on={content}>{label}</Txt>
            </span>
            <strong>
              <Txt on={content}>{copy.values[index]}</Txt>
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const STAGES = {wheel: WheelStage, bake: BakeStage, park: ParkStage, weather: WeatherStage};

export default function SamplePage({destinationId, selection}: {destinationId: DestinationId; selection: Selection}) {
  const destination = getDestination(destinationId);
  const audienceOn = selection.audience !== null;
  // While the audience switch is off, gray bars stand in for words about this long.
  const audienceText = destination.audience[selection.audience ?? 0];
  const feel = selection.feel === null ? null : destination.feel[selection.feel];
  const content = selection.content !== null;
  const copy = destination.content[selection.content ?? 0].copy;
  const Stage = STAGES[destinationId];

  return (
    <div
      className="sp"
      data-palette={feel?.palette}
      data-voice={selection.audience === null ? undefined : selection.audience === 0 ? 'friendly' : 'quick'}
    >
      <div className="sp-head">
        <span className="sp-brand">
          <Txt on={content}>{copy.brand}</Txt>
        </span>
        <span className="sp-badge">
          <Txt on={audienceOn}>{audienceText.badge}</Txt>
        </span>
      </div>
      <div className="sp-hero">
        <div className="sp-title">
          <Txt on={content}>{copy.title}</Txt>
        </div>
        <div className="sp-tagline">
          <Txt on={audienceOn}>{audienceText.tagline}</Txt>
        </div>
      </div>
      <Stage copy={copy} parts={selection.parts} content={content} />
      <div className="sp-foot">
        {selection.parts === null ? (
          <div className="sp-ph sp-ph--button" />
        ) : (
          <div className="sp-button">
            <Txt on={content}>{copy.button}</Txt>
          </div>
        )}
        <span className="sp-note">
          <Txt on={content}>{copy.note}</Txt>
        </span>
      </div>
    </div>
  );
}
