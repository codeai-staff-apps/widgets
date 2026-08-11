import type {ReactNode} from 'react';

/**
 * The activity's "char area": a photo, an uppercase name, and a speech
 * bubble whose corner mirrors depending on who is talking — the original's
 * cue for who is speaking, at a glance. Exactly one of these is ever shown
 * for a given check; `answer()` in the original replaces this area's
 * contents rather than appending to them.
 */
export default function CharacterBubble({
  variant,
  name,
  avatarSrc,
  avatarAlt,
  children,
}: {
  variant: 'teacher' | 'student';
  name: string;
  avatarSrc: string;
  avatarAlt: string;
  children: ReactNode;
}) {
  return (
    <div className="charRow">
      <img className="charImg" src={avatarSrc} alt={avatarAlt} />
      <div>
        <p className={`charName charName--${variant}`}>{name}</p>
        <blockquote className={`charBubble charBubble--${variant}`}>{children}</blockquote>
      </div>
    </div>
  );
}
