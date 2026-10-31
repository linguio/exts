import { site } from '@/shared/config/site';
import { Button } from '@/shared/ui/button';
import githubIcon from '@/assets/brand/github.svg';
import { BookOpen, Cable, FileClock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

export function SiteHeader({ currentPage }: { currentPage?: 'changelog' | 'features' }) {
  return (
    <header className="site-header">
      <div className="site-container site-header-content">
        <a href="/" aria-label="Exts 首页" className="flex items-center gap-2.5 text-xl leading-7 font-semibold tracking-[-0.04em]">
          <img src="/exts.svg" alt="" aria-hidden="true" width="28" height="28" className="size-7" />
          {site.name}
        </a>
        <TooltipProvider>
          <nav aria-label="主导航" className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="size-10">
                  <a href="/features/" aria-label="产品介绍" aria-current={currentPage === 'features' ? 'page' : undefined}>
                    <BookOpen aria-hidden="true" className="size-[21px]" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">产品介绍</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="size-10">
                  <a href="/changelog/" aria-label="更新日志" aria-current={currentPage === 'changelog' ? 'page' : undefined}>
                    <FileClock aria-hidden="true" className="size-[21px]" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">更新日志</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="size-10">
                  <a href={site.apiDocsUrl} target="_blank" rel="noopener noreferrer" aria-label="在新标签页打开 API 文档">
                    <Cable aria-hidden="true" className="size-[21px]" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">API 文档</TooltipContent>
            </Tooltip>
            <Button asChild variant="ghost" size="icon" className="size-10">
              <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="在 GitHub 查看 Exts 源码">
                <img src={githubIcon} alt="" aria-hidden="true" className="size-[21px]" />
              </a>
            </Button>
          </nav>
        </TooltipProvider>
      </div>
    </header>
  );
}
