import {CHROME} from './chrome';
import {SCENARIOS} from './scenarios';
import type {Lang, ScenarioId} from './types';

const LANGS: Lang[] = ['en', 'es'];
const SCENARIO_IDS: ScenarioId[] = ['off-by-one', 'wrong-range'];

export interface ResolvedContent {
  lang: Lang;
  chrome: (typeof CHROME)[Lang];
  scenario: (typeof SCENARIOS)[ScenarioId];
  /** True when `?scenario` asked for a bug nobody wrote in this language. */
  fellBack: boolean;
}

/**
 * `?lang` and `?scenario` are independent axes, but only two of the four
 * cells were ever authored: English teaches the off-by-one loop, Spanish the
 * shifted-range loop. Asking for an unwritten pair gets the scenario that
 * does exist in the requested language, plus a note saying so — never a
 * machine translation of copy a curriculum author has not seen.
 */
export function resolveContent(search: string): ResolvedContent {
  const params = new URLSearchParams(search);

  const requestedLang = params.get('lang') as Lang | null;
  const lang = requestedLang && LANGS.includes(requestedLang) ? requestedLang : 'en';

  const requestedScenario = params.get('scenario') as ScenarioId | null;
  const requested =
    requestedScenario && SCENARIO_IDS.includes(requestedScenario) ? requestedScenario : null;
  const authoredInLang = SCENARIO_IDS.find(id => SCENARIOS[id].lang === lang)!;
  const scenarioId = requested && SCENARIOS[requested].lang === lang ? requested : authoredInLang;

  return {
    lang,
    chrome: CHROME[lang],
    scenario: SCENARIOS[scenarioId],
    fellBack: requested !== null && requested !== scenarioId,
  };
}
