import {Fragment, type ReactNode} from 'react';

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

/** Renders the `**bold**`, `*italic*` and `` `code` `` runs in a copy string. */
export function rich(text: string): ReactNode {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
