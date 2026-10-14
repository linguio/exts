import { site } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-content">
        <p>Released under the <a href={`${site.githubUrl}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">MIT License</a>.</p>
        <p>{site.copyright}</p>
      </div>
    </footer>
  );
}
