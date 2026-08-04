import Button from '@code-dot-org/component-library/button';
import Image from '@code-dot-org/component-library/image';
import Link from '@code-dot-org/component-library/link';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useEffect, useRef} from 'react';

import type {Artwork} from './collection';

const NOT_SPECIFIED = 'Not specified';

function Field({label, value}: {label: string; value: string}) {
  const missing = !value;
  return (
    <div className="field">
      <Typography semanticTag="span" visualAppearance="overline-three" className="field-label">
        {label}
      </Typography>
      <Typography
        semanticTag="span"
        visualAppearance="body-two"
        className={missing ? 'field-value missing' : 'field-value'}
      >
        {missing ? NOT_SPECIFIED : value}
      </Typography>
    </div>
  );
}

export interface DetailProps {
  artwork: Artwork;
  onClose: () => void;
}

export default function Detail({artwork, onClose}: DetailProps) {
  const backRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    backRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const artist = artwork.artistDisplayName || 'Unknown Artist';
  const geography = [artwork.country, artwork.region].filter(Boolean).join(', ');
  const imageAlt = artwork.artistDisplayName
    ? `${artwork.title}, ${artwork.artistDisplayName}`
    : artwork.title;

  return (
    <section className="detail" aria-labelledby="detail-title">
      <Button
        ref={backRef}
        type="secondary"
        color="black"
        text="Back to gallery"
        onClick={onClose}
      />

      <div className="detail-body">
        <Image
          src={artwork.image}
          altText={imageAlt}
          hasRoundedCorners
          className="detail-image"
        />

        <div className="detail-text">
          <Typography semanticTag="h2" visualAppearance="heading-md" id="detail-title">
            {artwork.title}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-one">
            {artist}
          </Typography>
          <Tags tagsList={[{label: artwork.objectDate || 'Date unknown'}]} />

          <div className="info-cards">
            <Card variant="outlined">
              <CardContent>
                <Typography semanticTag="h3" visualAppearance="heading-xs">
                  Object Details
                </Typography>
                <Field label="Object Name" value={artwork.objectName} />
                <Field label="Date" value={artwork.objectDate} />
                <Field label="Medium" value={artwork.medium} />
                <Field label="Dimensions" value={artwork.dimensions} />
                <Field label="Classification" value={artwork.classification} />
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography semanticTag="h3" visualAppearance="heading-xs">
                  Cultural Information
                </Typography>
                <Field label="Culture" value={artwork.culture} />
                <Field label="Period" value={artwork.period} />
                <Field label="Dynasty" value={artwork.dynasty} />
                <Field label="Geography" value={geography} />
              </CardContent>
            </Card>
          </div>

          <Link
            href={artwork.objectURL}
            external
            openInNewTab
            text="View on the Met's website"
          />
        </div>
      </div>
    </section>
  );
}
