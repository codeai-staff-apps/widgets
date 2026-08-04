import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';

import type {Artwork} from './collection';

const SKELETON_COUNT = 5;

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
      {artworks.map(artwork => {
        const artist = artwork.artistDisplayName || 'Unknown Artist';
        const name = artwork.artistDisplayName
          ? `View details for ${artwork.title}, ${artwork.artistDisplayName}`
          : `View details for ${artwork.title}`;
        return (
          <Card key={artwork.objectID} variant="outlined">
            <CardActionArea
              // The button's name carries the artist, so the picture needs no
              // second description; the original left the artist out entirely.
              aria-label={name}
              data-object-id={artwork.objectID}
              onClick={() => onOpen(artwork)}
            >
              <CardMedia
                component="img"
                src={artwork.image}
                alt=""
                loading="lazy"
                height={180}
                sx={{objectFit: 'cover'}}
              />
              <CardContent>
                <Typography semanticTag="p" visualAppearance="body-two" className="card-title">
                  {artwork.title}
                </Typography>
                <Typography semanticTag="p" visualAppearance="body-three">
                  {artist}
                </Typography>
                <Typography semanticTag="p" visualAppearance="body-three">
                  {artwork.objectDate || 'Date unknown'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
}
