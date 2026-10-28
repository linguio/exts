import { Blocks, Download, Film, Image as ImageIcon, Settings } from 'lucide-react';
import x from '@/assets/brand/x.svg';
import bilibili from '@/assets/brand/bilibili.svg';
import youtube from '@/assets/brand/youtube.svg';
import vercel from '@/assets/brand/vercel.svg';
import npm from '@/assets/brand/npm.svg';
import linear from '@/assets/brand/linear.svg';
import notion from '@/assets/brand/notion.svg';
import github from '@/assets/brand/github.svg';
import gmail from '@/assets/brand/gmail.svg';

const bookmarks = [x, bilibili, youtube, vercel, npm, linear, notion];
const favorites = [x, github, '/exts.svg', gmail];

export function WindowTop({ name }: { name: 'Newtab' | 'Photos' }) {
  return <div className="showcase-window-top" aria-hidden="true"><strong className="showcase-window-name">{name}</strong></div>;
}

export function TabsCard() {
  return (
    <>
      <WindowTop name="Newtab" />
      <div className="showcase-bookmarks" aria-hidden="true">
        {bookmarks.map((icon) => <span key={icon} className="showcase-bookmark"><img src={icon} alt="" /></span>)}
      </div>
      <div className="showcase-dock-area" aria-hidden="true">
        <div className="showcase-dock">
          {favorites.map((icon) => <span key={icon} className="showcase-dock-icon"><img src={icon} alt="" /></span>)}
          <span className="showcase-dock-divider" />
          <span className="showcase-dock-icon"><Blocks /></span>
          <span className="showcase-dock-icon"><Download /></span>
          <span className="showcase-dock-icon"><Settings /></span>
        </div>
      </div>
    </>
  );
}

export function MediaCard() {
  return (
    <>
      <WindowTop name="Photos" />
      <div className="showcase-media" aria-hidden="true">
        <div className="showcase-media-toolbar">
          <span className="showcase-month">2026 / 10</span>
          <span className="showcase-selection">已选 2</span>
          <span className="showcase-download">下载</span>
        </div>
        <div className="showcase-media-grid">
          {['image', 'image', 'video', 'image', 'video', 'image'].map((kind, index) => (
            <span key={index} className={`showcase-thumbnail ${index === 0 || index === 4 ? 'is-selected' : ''}`}>
              {kind === 'video' ? <Film /> : <ImageIcon />}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
