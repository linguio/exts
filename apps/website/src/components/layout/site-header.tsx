import { site } from '@/config/site';
import { Button } from '@/components/ui/button';
import githubIcon from '@/assets/github.svg';
import { History } from 'lucide-react';

export function SiteHeader({ currentPage }: { currentPage?: 'changelog' }) {
  return (
    <header className="site-header">
      <div className="site-container site-header-content">
        <a href="/" aria-label="Exts 首页" className="flex items-center gap-2.5 text-xl leading-7 font-semibold tracking-[-0.04em]">
          <img src="/exts.svg" alt="" aria-hidden="true" width="28" height="28" className="size-7" />
          {site.name}
        </a>
        <nav aria-label="主导航" className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="size-10">
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
      </div>
    </header>
  );
}
