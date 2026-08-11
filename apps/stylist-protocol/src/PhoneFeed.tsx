import Typography from '@code-dot-org/component-library/typography';
import {useId} from 'react';

import {CHROME, POSTS} from './content/content';

/**
 * The feed the code renders — a light card opposed to the dark IDE, since
 * that opposition (what the code does vs. what the learner sees happen) is
 * the point of step 5. The original drew this as a 180px phone with 5-7px
 * type; that's a WCAG 1.4.4 failure, so this keeps the pink header and the
 * per-post colour swatch but renders the content at normal DS body sizes in
 * a wider panel instead of faking a device bezel.
 */
export default function PhoneFeed({withNewPost}: {withNewPost: boolean}) {
  const headingId = useId();
  const posts = withNewPost ? POSTS : POSTS.slice(0, -1);

  return (
    <section className="phonePanel" aria-labelledby={headingId}>
      <div className="phoneHeader">
        <Typography semanticTag="h2" visualAppearance="heading-xs" id={headingId} noMargin>
          {CHROME.phoneTitle}
        </Typography>
        <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
          {CHROME.phoneSub}
        </Typography>
      </div>
      <ol className="feed" aria-label="Social media feed posts">
        {posts.map((post, i) => (
          <li
            key={post.day}
            className={withNewPost && i === posts.length - 1 ? 'feedItem isNew' : 'feedItem'}
            role="article"
            aria-label={`${post.title} post`}
          >
            <span className="feedSwatch" aria-hidden="true" style={{background: post.swatchColor}}>
              {post.imageFile}
            </span>
            <div>
              <span className="feedDay">{post.day}</span>
              <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
                {post.title}
              </Typography>
              <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                {post.content}
              </Typography>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
