import { site } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-content">{site.copyright}</div>
    </footer>
  );
}
