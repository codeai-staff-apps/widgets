import type {ReactNode} from 'react';

import {SECTIONS, type Section} from './sections';

/**
 * The "Solar Explorer" sample site. Only its structure is pedagogy — nav,
 * hero, gallery, footer — so it is drawn with plain CSS and inline SVG rather
 * than recreated pixel for pixel. The original's five photographs 404 in
 * production; the planets here are two-tone discs, which costs nothing and
 * cannot break.
 *
 * Each region is one real `<button>` whose contents are decorative: the
 * sample's own text carries no headings and no links, so it adds nothing to
 * the page outline and no nested controls to the tab order.
 */

const PLANETS = [
  {name: 'Mercury', description: 'The smallest planet, closest to the Sun.', base: '#B7A79A', shade: '#6E6058'},
  {name: 'Venus', description: 'The hottest planet, wrapped in thick clouds.', base: '#E8C07A', shade: '#A9743A'},
  {name: 'Earth', description: 'The only known planet with life.', base: '#5AA9E6', shade: '#2E6B4F'},
  {name: 'Mars', description: 'Home to the tallest volcano in the solar system.', base: '#D2694A', shade: '#8A3A22'},
];

function PlanetDisc({base, shade}: {base: string; shade: string}) {
  return (
    <svg viewBox="0 0 100 100" className="planet-disc">
      <circle cx="50" cy="50" r="42" fill={base} />
      <path d="M8 50a42 42 0 0 0 84 0Z" fill={shade} opacity="0.55" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
    </svg>
  );
}

interface HotspotProps {
  section: Section;
  explored: boolean;
  active: boolean;
  onActivate: () => void;
  children: ReactNode;
}

function Hotspot({section, explored, active, onActivate, children}: HotspotProps) {
  return (
    <button
      type="button"
      className="hotspot"
      data-region={section.key}
      data-active={active}
      aria-label={`${section.title}, ${explored ? 'explored' : 'not yet explored'}, click to learn its job`}
      onClick={onActivate}
    >
      <span className="hotspot-tag" aria-hidden="true">
        {section.label}
      </span>
      <span aria-hidden="true">{children}</span>
    </button>
  );
}

export interface SampleSiteProps {
  explored: ReadonlySet<string>;
  activeKey: string | null;
  onActivate: (section: Section) => void;
}

export default function SampleSite({explored, activeKey, onActivate}: SampleSiteProps) {
  const hotspot = (key: string) => {
    const section = SECTIONS.find(s => s.key === key)!;
    return {
      section,
      explored: explored.has(key),
      active: activeKey === key,
      onActivate: () => onActivate(section),
    };
  };

  return (
    <div className="site-frame">
      <Hotspot {...hotspot('nav')}>
        <span className="site-nav">
          <span className="logo">Solar Explorer</span>
          <span className="links">
            <span>Home</span>
            <span>Planets</span>
            <span>Missions</span>
            <span>About</span>
          </span>
        </span>
      </Hotspot>

      <Hotspot {...hotspot('hero')}>
        <span className="site-hero">
          <span className="hero-heading">Explore Our Solar System</span>
          <span className="hero-body">
            Journey through eight planets, countless moons, and the mysteries of space.
          </span>
          <span className="hero-cta">Start Exploring</span>
        </span>
      </Hotspot>

      <Hotspot {...hotspot('gallery')}>
        <span className="site-gallery">
          {PLANETS.map(planet => (
            <span className="planet-card" key={planet.name}>
              <PlanetDisc base={planet.base} shade={planet.shade} />
              <span className="planet-name">{planet.name}</span>
              <span className="planet-text">{planet.description}</span>
            </span>
          ))}
        </span>
      </Hotspot>

      <Hotspot {...hotspot('footer')}>
        <span className="site-footer">
          <span>© Solar Explorer</span>
          <span className="links">
            <span>Missions</span>
            <span>Contact</span>
            <span>Privacy</span>
          </span>
        </span>
      </Hotspot>
    </div>
  );
}
