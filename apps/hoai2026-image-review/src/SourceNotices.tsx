import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import {formatTime} from './format';

const SKELETON_COUNT = 6;

/** A failed load with nothing to fall back on. */
export function LoadError({message, onRetry}: {message: string; onRetry: () => void}) {
  return (
    <div className="notice">
      <Alert
        type="danger"
        text={`The review data could not be loaded. ${message}`}
        isImmediateImportance
      />
      <div>
        <Button text="Retry" type="secondary" color="black" onClick={onRetry} />
      </div>
    </div>
  );
}

/** Live loading failed, so the page is showing the snapshot saved with the app. */
export function SnapshotNotice({
  generatedAt,
  reason,
  onRetry,
}: {
  generatedAt: string;
  reason?: string;
  onRetry: () => void;
}) {
  return (
    <div className="notice">
      <Alert
        type="warning"
        isImmediateImportance={false}
        text={`Showing the manifest snapshot saved with this app (generated ${formatTime(generatedAt)}), not live data. ${
          reason ? `Live request failed: ${reason}. ` : ''
        }Images load from the S3 host, so they may be unavailable too.`}
      />
      <div>
        <Button text="Retry live data" type="secondary" color="black" onClick={onRetry} />
      </div>
    </div>
  );
}

export function LoadingGrid({label}: {label: string}) {
  return (
    <div>
      <div role="status">
        <Typography semanticTag="p" visualAppearance="body-two">
          {label}
        </Typography>
      </div>
      <ul className="grid" aria-hidden="true">
        {Array.from({length: SKELETON_COUNT}, (_, i) => (
          <Card key={i} variant="outlined" component="li">
            <CardContent>
              <Skeleton width="50%" />
              <Skeleton variant="rectangular" height={120} />
              <Skeleton width="80%" />
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
}
