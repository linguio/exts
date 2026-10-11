import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { cn } from '@/lib/utils';

interface SiteLayoutProps {
  children: ReactNode;
  currentPage?: 'features' | 'changelog';
  mainClassName?: string;
}

export function SiteLayout({ children, currentPage, mainClassName }: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <SiteHeader currentPage={currentPage} />
      <main className={cn('site-container site-main', mainClassName)}>{children}</main>
      <SiteFooter />
    </div>
  );
}
