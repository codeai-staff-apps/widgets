/**
 * Preset sample texts, ported verbatim from the legacy widget. Spaces are
 * pre-encoded as underscores (see `copy.spacesNote` for why): every character,
 * including whitespace, has to be available as something a dictionary pattern
 * can match. This is lesson content, not UI chrome, but still worth
 * translating along with everything in `copy.ts` — the "find a repeated
 * pattern" exercise depends on the translated text having repeats of its own.
 */
export const SAMPLE_TEXTS: readonly string[] = [
  "So_wake_me_up_when_it's_all_over_When_I'm_wiser_and_I'm_older_All_this_time_I_was_finding_myself_And_I_didn't_know_I_was_lost__Didn't_know_I_was_lost_I_didn't_know_I_was_lost_I_didn't_know_I_was_lost_I_didn't_know_(didn't_know,_didn't_know)",
  "I_Need_a_Dollar_by_Aloe_Blacc_I_need_a_dollar,_dollar_A_dollar_that's_what_I_need_Well_I_need_a_dollar,_dollar_A_dollar_that's_what_I_need_Said_I_said_I_need_dollar,_dollar_A_dollar_that's_what_I_need_And_if_I_share_with_you_my_story_would_you_share_your_dollar_with_me?",
  "The_Man_by_Aloe_Blacc_Well_you_can_tell_everybody_Yeah_you_can_tell_everybody_Go_ahead_and_tell_everybody_I'm_the_man,_I'm_the_man,_I'm_the_man_Well_you_can_tell_everybody_Yeah_you_can_tell_everybody_Go_ahead_and_tell_everybody_I'm_the_man,_I'm_the_man,_I'm_the_man_Yes_I_am,_yes_I_am,_yes_I_am_I'm_the_man,_I'm_the_man,_I'm_the_man",
  'Pitter_patter_pitter_patter_listen_to_the_rain_pitter_patter_pitter_patter_on_the_window_pane',
  'A_tutor_who_tooted_the_flute_Tried_to_tutor_two_tooters_to_toot_Said_the_two_to_their_tutor,_"Is_it_harder_to_toot_Or_to_tutor_two_tooters_to_toot?"',
  "She_sells_sea_shells_on_the_sea_shore_The_shells_that_she_sells_are_sea_shells_I'm_sure_So_if_she_sells_sea_shells_on_the_sea_shore_I'm_sure_that_the_shells_are_sea_shore_shells_",
  "I_know_an_old_lady_who_swallowed_a_bird_How_absurd!_She_swallowed_a_bird!_She_swallowed_the_bird_to_catch_the_spider_That_wriggled_and_jiggled_and_tickled_inside_her_She_swallowed_the_spider_to_catch_the_fly_I_don't_know_why_she_swallowed_a_fly_Perhaps_she'll_die",
  'Pease_porridge_hot_Pease_porridge_cold_Pease_porridge_in_the_pot_Nine_days_old._Some_like_it_hot_Some_like_it_cold_Some_like_it_in_the_pot_Nine_days_old.',
  'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
];

/** How many characters of a sample/custom text to show in the picker before truncating. */
const PREVIEW_LENGTH = 37;

/** A short, human-readable preview for a dropdown option — underscores shown back as spaces. */
export function previewLabel(text: string): string {
  return `${text.slice(0, PREVIEW_LENGTH).replace(/_/g, ' ')}…`;
}

/** Encodes spaces and newlines as underscores, so every character in the text is matchable. */
export function encodeSpaces(text: string): string {
  return text.replace(/[ \n]/g, '_');
}
