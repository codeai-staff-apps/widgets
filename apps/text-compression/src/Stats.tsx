import Typography from '@code-dot-org/component-library/typography';

import type {CompressionResult} from './compression';
import {copy} from './copy';

function CompressionValue({result}: {result: CompressionResult}) {
  if (result.invalidEntryIndexes.size > 0) {
    return <span className="tcStatNegative">{copy.stats.errorInDictionary}</span>;
  }
  const percent = result.compressionPercent;
  if (percent === null || percent === 0) {
    return <span>{copy.stats.percentNoChange}</span>;
  }
  return percent > 0 ? (
    <span className="tcStatPositive">{copy.stats.percentSmaller(percent)}</span>
  ) : (
    <span className="tcStatNegative">{copy.stats.percentLarger(percent)}</span>
  );
}

/**
 * The size readout as a description list, so "Compressed text size" and its
 * "40 bytes" are one programmatic pair rather than two visually-adjacent
 * cells. Visually it updates on every keystroke, same as the legacy widget;
 * `App` announces a debounced summary separately so a screen reader isn't
 * read the whole panel after each character typed.
 */
export default function Stats({result}: {result: CompressionResult}) {
  return (
    <dl className="tcStats">
      <div className="tcStatRow">
        <dt>{copy.stats.compressedSize}</dt>
        <dd>{copy.stats.bytes(result.compressedSize)}</dd>
      </div>
      <div className="tcStatRow">
        <dt>{copy.stats.dictionarySize}</dt>
        <dd>{copy.stats.bytes(result.dictionarySize)}</dd>
      </div>
      <div className="tcStatRow">
        <dt>{copy.stats.totalSize}</dt>
        <dd>{copy.stats.bytes(result.totalSize)}</dd>
      </div>
      <div className="tcStatRow">
        <dt>{copy.stats.originalSize}</dt>
        <dd>{copy.stats.bytes(result.originalSize)}</dd>
      </div>
      <div className="tcStatRow">
        <dt>
          <Typography semanticTag="span" visualAppearance="strong" noMargin>
            {copy.stats.compression}
          </Typography>
        </dt>
        <dd>
          <CompressionValue result={result} />
        </dd>
      </div>
    </dl>
  );
}
