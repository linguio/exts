import { useEffect, useState } from 'react';
import { MediaCard, TabsCard } from './showcase-cards';
import { getNextCardHead, getVisibleCardIndices } from './card-pool';
import './showcase.css';

const cards = [
  { id: 'tabs', label: 'Tabs：新标签页书签与 Dock 示意，点击置前', content: <TabsCard /> },
  { id: 'photos', label: 'Photos：iPhone 图片与视频选择下载示意，点击置前', content: <MediaCard /> },
];

export function ModuleShowcase() {
  const [head, setHead] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreferenceChange = () => setReducedMotion(preference.matches);
    const onVisibilityChange = () => setVisible(!document.hidden);
    preference.addEventListener('change', onPreferenceChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      preference.removeEventListener('change', onPreferenceChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (hovered || focused || !visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setSelected(null);
      setHead((index) => getNextCardHead(cards.length, index, selected));
    }, 3000);
    return () => window.clearInterval(timer);
  }, [head, selected, hovered, focused, visible, reducedMotion]);

  const select = (index: number) => {
    setSelected(index);
  };

  return (
    <div
      className="module-showcase"
      role="group"
      aria-label="产品模块示意，点击卡片切换到最前方"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDownCapture={() => setFocused(false)}
      onFocusCapture={(event) => setFocused(event.target.matches(':focus-visible'))}
      onKeyDownCapture={(event) => {
        if (event.key === 'Enter' || event.key === ' ') setFocused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="showcase-stack">
        {getVisibleCardIndices(cards.length, head, selected).map((index, depth) => {
          const card = cards[index];
          const layer = depth === 0 ? 'is-front' : depth === 1 ? 'is-back' : 'is-back-far';
          return (
            <button key={card.id} type="button" className={`showcase-card ${layer}`} aria-pressed={depth === 0} aria-label={card.label} onClick={() => select(index)}>
              {card.content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
