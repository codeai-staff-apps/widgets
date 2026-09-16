import {copy} from './copy';

/**
 * No design-system component has an "error" tint (Tags is neutral-only), so
 * this is a small hand-rolled element — styled purely with existing error
 * color tokens, never a hardcoded color. Its text is covered by the row's
 * aria-label (see OdometerRow), so it stays out of the accessibility tree.
 */
export default function OverflowBadge({visible}: {visible: boolean}) {
  if (!visible) {
    return null;
  }
  return (
    <span className="odoOverflowBadge" aria-hidden="true">
      {copy.overflowBadge}
    </span>
  );
}
