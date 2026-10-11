import { site } from '@/config/site';
import { Button } from '@/components/ui/button';
import githubIcon from '@/assets/github.svg';
import { History } from 'lucide-react';

export function SiteHeader({ currentPage }: { currentPage?: 'changelog' }) {
  return (
    <header className="flex h-24 shrink-0 items-center justify-between">
      <a href="/" aria-label="Exts 首页" className="text-[26px] font-semibold tracking-[-1.1px]">{site.name}</a>
      <nav aria-label="主导航" className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className={`size-10 ${currentPage === 'changelog' ? 'bg-accent' : ''}`}>
          <a href="/changelog/" aria-label="Changelog 更新日志" aria-current={currentPage === 'changelog' ? 'page' : undefined} title="Changelog">
            <History aria-hidden="true" className="size-[21px]" />
          </a>
        </Button>
        <Button asChild variant="ghost" size="icon" className="size-10">
          <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="在 GitHub 查看 Exts 源码">
            <img src={githubIcon} alt="" aria-hidden="true" className="size-[21px]" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
