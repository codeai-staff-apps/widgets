import Typography from '@code-dot-org/component-library/typography';

import './videoPlayer.css';

/**
 * Set once a clip is vendored into src/assets/ (e.g.
 * `import sampleVideo from './assets/sample-video.mp4'`). Left null renders a
 * placeholder instead of a broken player.
 */
const VIDEO_SRC: string | null = null;

export default function VideoPlayer({title}: {title: string}) {
  if (!VIDEO_SRC) {
    return (
      <div className="videoFrame videoFrame-placeholder">
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
        <Typography semanticTag="p" visualAppearance="body-two">
          {title} will appear here
        </Typography>
      </div>
    );
  }

  return (
    <video className="videoFrame" src={VIDEO_SRC} controls preload="metadata" aria-label={title}>
      Your browser does not support the video tag.
    </video>
  );
}
