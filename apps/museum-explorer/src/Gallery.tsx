import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import {useRef, type MouseEvent} from 'react';

import type {Artwork} from './collection';

const SKELETON_COUNT = 5;
const TILT_DEGREES = 8;

// Read once, like the original's top-level `reduceMotion` snapshot.
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Skeletons() {
  return (
    <div className="grid">
      {Array.from({length: SKELETON_COUNT}, (_, index) => (
        <Card key={index} variant="outlined">
          <Skeleton variant="rectangular" height={180} />
          <CardContent>
            <Skeleton />
            <Skeleton />
            <Skeleton width="60%" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="empty">
      <Typography semanticTag="h2" visualAppearance="heading-sm">
        No pieces found
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        Try a different artist, culture, or time period.
      </Typography>
    </div>
  );
}

export interface GalleryProps {
  artworks: readonly Artwork[];
  onOpen: (artwork: Artwork) => void;
}

export default function Gallery({artworks, onOpen}: GalleryProps) {
  return (
    <div className="grid">
      {artworks.map(artwork => (
        <GalleryCard key={artwork.objectID} artwork={artwork} onOpen={onOpen} />
      ))}
    </div>
  );
}

interface GalleryCardProps {
  artwork: Artwork;
  onOpen: (artwork: Artwork) => void;
}

/**
 * The original's "move" interaction: a gentle 3D tilt that follows the
 * cursor, applied to the whole card (border and shadow included) so it tilts
 * as one piece, same as the original's single `<button class="card">`.
 * Pointer-only and purely visual, so it's skipped entirely under
 * prefers-reduced-motion rather than just de-animated.
 */
function GalleryCard({artwork, onOpen}: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform =
      `perspective(700px) rotateY(${x * TILT_DEGREES}deg) ` +
      `rotateX(${-y * TILT_DEGREES}deg) translateY(-4px)`;
  };

  const artist = artwork.artistDisplayName || 'Unknown Artist';
  const name = artwork.artistDisplayName
    ? `View details for ${artwork.title}, ${artwork.artistDisplayName}`
    : `View details for ${artwork.title}`;

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      sx={{
        borderRadius: '16px',
        border: '1px solid #E4E0F3',
        boxShadow: '0 1px 2px rgba(36,22,89,0.08)',
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.25s ease, transform 0.08s linear',
        '&:hover, &:focus-within': {
          boxShadow: '0 20px 48px rgba(36,22,89,0.22)',
        },
        '@media (prefers-reduced-motion: no-preference)': {
          '&:hover .card-media, &:focus-within .card-media': {
            transform: 'translateZ(20px) scale(1.06)',
          },
        },
      }}
    >
      <CardActionArea
        // The button's name carries the artist, so the picture needs no
        // second description; the original left the artist out entirely.
        aria-label={name}
        data-object-id={artwork.objectID}
        onClick={() => onOpen(artwork)}
        onBlur={resetTilt}
      >
        <CardMedia
          component="img"
          className="card-media"
          src={artwork.image}
          alt=""
          loading="lazy"
          sx={{
            aspectRatio: '4 / 3',
            height: 'auto',
            bgcolor: '#ECE9FB',
            objectFit: 'cover',
            transform: 'translateZ(20px)',
            transition: 'transform 0.35s ease',
          }}
        />
        <CardContent>
          <Typography semanticTag="p" visualAppearance="body-two" className="card-title">
            {artwork.title}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-three" className="card-artist">
            {artist}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-three">
            {artwork.objectDate || 'Date unknown'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
