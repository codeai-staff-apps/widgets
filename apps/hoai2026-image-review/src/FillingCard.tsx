import Button from '@code-dot-org/component-library/button';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useState} from 'react';

import {capitalize, summarizeChecks} from './format';
import type {FillingView} from './filters';
import ReviewImage from './ReviewImage';
import type {CurrentImage, RejectedImage, Variant} from './types';

/** Variants with many rejected attempts show this many until expanded. */
const COLLAPSED_ATTEMPTS = 2;

/** Everything the detail dialog shows about one image. */
export interface ImageDetail {
  title: string;
  prompt: string;
  variant: number;
  frame: string;
  path?: string;
  /** Rejected attempts are numbered within their variant. */
  attempt?: {number: number; of: number};
  record: CurrentImage | RejectedImage;
}

interface FillingCardProps {
  view: FillingView;
  /** The frame to show; `single` for images that are not animated. */
  frame: string;
  onOpen: (detail: ImageDetail) => void;
}

export default function FillingCard({view, frame, onOpen}: FillingCardProps) {
  const {filling, title, published, rejected, neverDrawn} = view;
  const missing = published === 0;

  const open = (variant: Variant, record: CurrentImage | RejectedImage, attempt?: number) =>
    onOpen({
      title,
      prompt: filling.prompt,
      variant: variant.variant,
      frame,
      path: record.frames[frame],
      attempt: attempt === undefined ? undefined : {number: attempt, of: variant.rejected.length},
      record,
    });

  return (
    <Card variant="outlined" className={missing ? 'card card-missing' : 'card'} component="li">
      <CardContent className="card-content">
        <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
          {title}
        </Typography>
        <Tags
          size="s"
          tagsList={[
            {label: `${published} of ${filling.variants.length} published`},
            ...(rejected
              ? [
                  {
                    label: `${rejected} rejected`,
                    icon: {iconName: 'ban', iconStyle: 'solid' as const, placement: 'left' as const},
                  },
                ]
              : []),
            ...(missing
              ? [
                  {
                    label: neverDrawn ? 'Not drawn yet' : 'No published image',
                    icon: {
                      iconName: 'triangle-exclamation',
                      iconStyle: 'solid' as const,
                      placement: 'left' as const,
                    },
                  },
                ]
              : []),
          ]}
        />
        <div className="variants">
          {filling.variants.map(variant => (
            <VariantColumn
              key={variant.variant}
              title={title}
              variant={variant}
              frame={frame}
              onOpen={record => open(variant, record)}
              onOpenAttempt={(record, number) => open(variant, record, number)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface VariantColumnProps {
  title: string;
  variant: Variant;
  frame: string;
  onOpen: (record: CurrentImage) => void;
  onOpenAttempt: (record: RejectedImage, number: number) => void;
}

function VariantColumn({title, variant, frame, onOpen, onOpenAttempt}: VariantColumnProps) {
  const {current} = variant;
  const [expanded, setExpanded] = useState(false);
  const hidden = expanded ? 0 : Math.max(0, variant.rejected.length - COLLAPSED_ATTEMPTS);
  const label = `${title}, variant ${variant.variant + 1}`;
  const isPublished = current?.published === true;
  const statusLabel = isPublished ? 'Published' : capitalize(variant.status);

  return (
    <div className="variant">
      <Typography semanticTag="h4" visualAppearance="overline-three" noMargin>
        Variant {variant.variant + 1}
      </Typography>
      {current ? (
        <button
          type="button"
          className={isPublished ? 'tile tile-published' : 'tile'}
          aria-label={`Open details: ${label}, ${statusLabel.toLowerCase()}`}
          onClick={() => onOpen(current)}
        >
          <ReviewImage
            path={current.frames[frame]}
            alt={`${label}, ${statusLabel.toLowerCase()}`}
            emptyLabel={`No ${frame} frame`}
          />
        </button>
      ) : (
        <div className="tile tile-empty">
          <ReviewImage alt="" emptyLabel={statusLabel} />
        </div>
      )}
      <Tags
        size="s"
        tagsList={[
          isPublished
            ? {
                label: 'Published',
                icon: {iconName: 'check', iconStyle: 'solid', placement: 'left'},
              }
            : {label: statusLabel},
        ]}
      />
      {variant.rejected.length > 0 && (
        <ul className="attempts" aria-label={`Rejected attempts, variant ${variant.variant + 1}`}>
          {variant.rejected.slice(0, variant.rejected.length - hidden).map((attempt, i) => {
            const alt = `${label}, rejected attempt ${i + 1} of ${variant.rejected.length}: ${attempt.reason}`;
            return (
              <li key={attempt.at + i} className="attempt">
                <button
                  type="button"
                  className="tile tile-rejected"
                  aria-label={`Open details: ${alt}`}
                  onClick={() => onOpenAttempt(attempt, i + 1)}
                >
                  <ReviewImage path={attempt.frames[frame]} alt={alt} emptyLabel={`No ${frame} frame`} />
                </button>
                <div className="attempt-text">
                  <Tags
                    size="s"
                    tagsList={[
                      {
                        label: 'Rejected',
                        icon: {iconName: 'ban', iconStyle: 'solid', placement: 'left'},
                      },
                    ]}
                  />
                  <span>{attempt.reason}</span>
                  <span className="attempt-checks">
                    {summarizeChecks(attempt.checks[frame] ?? Object.values(attempt.checks)[0])}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {variant.rejected.length > COLLAPSED_ATTEMPTS && (
        <Button
          type="tertiary"
          size="xs"
          text={expanded ? 'Show fewer' : `Show ${hidden} more rejected`}
          ariaLabel={`${expanded ? 'Show fewer' : `Show ${hidden} more`} rejected attempts, variant ${variant.variant + 1}`}
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </div>
  );
}
