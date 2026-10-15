import { site } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-content">
        <p>{site.copyright}</p>
      </div>
    </footer>
  );
}
