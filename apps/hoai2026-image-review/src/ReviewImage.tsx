import {useEffect, useState} from 'react';

import {assetUrl} from './config';

/** A box that stands in for an image that is not there. */
export function ImagePlaceholder({label, path}: {label: string; path?: string}) {
  return (
    <div className="placeholder">
      <span>{label}</span>
      {path && <code>{path}</code>}
    </div>
  );
}

interface ReviewImageProps {
  /** Path relative to the base URL; absent when this frame was never drawn. */
  path?: string;
  alt: string;
  emptyLabel: string;
}

/**
 * Images are ~1 MB PNGs shown at thumbnail size, so they load lazily. A
 * missing file (S3 answers 403 XML) or a blocked host falls back to a placeholder.
 */
export default function ReviewImage({path, alt, emptyLabel}: ReviewImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [path]);

  if (!path) {
    return <ImagePlaceholder label={emptyLabel} />;
  }
  if (failed) {
    return <ImagePlaceholder label="Image unavailable" path={path} />;
  }
  return (
    <img
      src={assetUrl(path)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
