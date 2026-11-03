import Alert from '@code-dot-org/component-library/alert';
import Link from '@code-dot-org/component-library/link';
import Button from '@code-dot-org/component-library/button';
import {CustomDialog} from '@code-dot-org/component-library/dialog';
import Typography from '@code-dot-org/component-library/typography';

import {assetUrl} from './config';
import type {ImageDetail} from './FillingCard';
import {formatTime} from './format';
import ReviewImage from './ReviewImage';

interface DetailDialogProps {
  detail: ImageDetail;
  onClose: () => void;
}

export default function DetailDialog({detail, onClose}: DetailDialogProps) {
  const {record, path, frame} = detail;
  const rejected = 'reason' in record;
  const subject = `${detail.title}, variant ${detail.variant + 1}`;
  const state = rejected
    ? `rejected attempt ${detail.attempt!.number} of ${detail.attempt!.of}`
    : 'published';

  const rows: [string, string][] = [
    ['Prompt', detail.prompt],
    ['Frame', frame],
    [rejected ? 'Rejected at' : 'Drawn at', formatTime(rejected ? record.at : record.drawnAt)],
    ['Seed', String(record.seed)],
    ['Model', record.model],
  ];

  return (
    <CustomDialog
      className="detail-dialog"
      aria-labelledby="detail-title"
      closeLabel="Close image details"
      onClose={onClose}
    >
      <div className="detail">
        <Typography semanticTag="h2" visualAppearance="heading-sm" id="detail-title" noMargin>
          {detail.title} (variant {detail.variant + 1})
        </Typography>
        <div id="dsco-dialog-description">
          <Alert
            size="s"
            type={rejected ? 'danger' : 'success'}
            isImmediateImportance={false}
            text={
              rejected
                ? `Rejected attempt ${detail.attempt!.number} of ${detail.attempt!.of}: ${record.reason}`
                : 'Published: this is the image currently live.'
            }
          />
        </div>
        <div className="detail-image">
          <ReviewImage path={path} alt={`${subject}, ${state}`} emptyLabel={`No ${frame} frame`} />
        </div>
        {path && (
          <Link href={assetUrl(path)} external openInNewTab>
            Open original image
          </Link>
        )}
        <dl className="detail-fields">
          {rows.map(([name, value]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          {path && (
            <div>
              <dt>Path</dt>
              <dd>
                <code>{path}</code>
              </dd>
            </div>
          )}
        </dl>
        <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
          Moderation checks
        </Typography>
        <ul className="detail-checks">
          {Object.entries(record.checks).map(([name, checks]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span>Judge: {checks.judge.verdict}</span>
              <span>Azure: {checks.azure.verdict}</span>
              <span>
                Categories: {checks.azure.categories.map(c => `${c.category} ${c.severity}`).join(', ')}
              </span>
            </li>
          ))}
        </ul>
        {record.review !== undefined && (
          <>
            <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
              Manual review
            </Typography>
            <pre>{JSON.stringify(record.review, null, 2)}</pre>
          </>
        )}
        <div className="detail-actions">
          <Button text="Close" onClick={onClose} />
        </div>
      </div>
    </CustomDialog>
  );
}
