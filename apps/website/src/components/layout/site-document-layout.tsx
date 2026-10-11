import type { ReactNode } from 'react';
import { SiteLayout } from './site-layout';

interface SiteDocumentLayoutProps {
  children: ReactNode;
  currentPage: 'features' | 'changelog';
  title: string;
}

export function SiteDocumentLayout({ children, currentPage, title }: SiteDocumentLayoutProps) {
  return (
    <SiteLayout currentPage={currentPage}>
      <div className="site-document">
        <h1 className="site-document-title">{title}</h1>
        {children}
      </div>
    </SiteLayout>
  );
}
