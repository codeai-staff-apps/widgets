import Typography from '@code-dot-org/component-library/typography';
import {useId} from 'react';

import {CHROME, POSTS} from './content/content';

/**
 * The feed the code renders. The original drew a phone: bezel, status bar,
 * coloured swatches standing in for photographs. What the exercise is about
 * is whether a sixth post appears, so the rebuild shows the posts.
 */
export default function PhoneFeed({withNewPost}: {withNewPost: boolean}) {
  const headingId = useId();
  const posts = withNewPost ? POSTS : POSTS.slice(0, -1);

  return (
    <section className="card" aria-labelledby={headingId}>
      <Typography semanticTag="h2" visualAppearance="heading-sm" id={headingId} noMargin>
        {CHROME.phoneTitle}
      </Typography>
      <Typography semanticTag="p" visualAppearance="overline-two">
        {CHROME.phoneSub}
      </Typography>
      <ol className="feed">
        {posts.map(post => (
          <li key={post.day}>
            <span className="feedDay">{post.day}</span>
            <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
              {post.title}
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              {post.content}
            </Typography>
            <span className="feedImage">{post.imageFile}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
