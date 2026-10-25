import type { CSSProperties } from 'react';

import './binary-text.css';

/** 为首页介绍文字生成固定序列，动画由 CSS 播放一次。 */
export function BinaryText({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <span
            key={index}
            className="home-binary-character"
            style={{ '--binary-delay': `${index * 75}ms` } as CSSProperties}
          >
            <span className="home-binary-original">{character}</span>
            <span className="home-binary-strip">
              {Array.from({ length: 8 }, (_, step) => (
                <span key={step} className="home-binary-bit">
                  {(index * 7 + step * 3 + Math.floor(step / 3)) % 2}
                </span>
              ))}
              <span>{character}</span>
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
