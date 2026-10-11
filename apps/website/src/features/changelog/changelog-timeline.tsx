import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { changelogEntries } from './changelog-data';

const entriesByYear = new Map<string, typeof changelogEntries>();
for (const entry of changelogEntries) {
  const year = entry.date.slice(0, 4);
  entriesByYear.set(year, [...(entriesByYear.get(year) ?? []), entry]);
}

export function ChangelogTimeline() {
  return (
    <div aria-label="更新时间线" className="space-y-6">
      {Array.from(entriesByYear, ([year, entries]) => (
        <section key={year} aria-labelledby={`changelog-year-${year}`} className="sm:grid sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-x-5">
          <h2 id={`changelog-year-${year}`} className="mb-6 text-xl leading-8 font-medium text-muted-foreground sm:mb-0">
            <Button asChild variant="ghost" className="-ml-2 h-10 px-2 text-xl font-medium text-muted-foreground active:scale-95 active:bg-accent">
              <a href={`#changelog-${entries[0].id}`} aria-label={`返回 ${year} 年第一条更新`}>
                {year}
              </a>
            </Button>
          </h2>
          <ol aria-label={`${year} 年更新`} className="m-0 list-none p-0">
            {entries.map((entry, index) => (
              <li key={entry.id} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[64px_20px_minmax(0,1fr)] sm:gap-x-5">
                <time dateTime={entry.date} className="col-start-2 row-start-1 mb-2 text-[13px] leading-6 text-muted-foreground tabular-nums sm:col-start-1 sm:mb-0 sm:pt-1.5">
                  {entry.date.slice(5).replace('-', ' / ')}
                </time>
                <div aria-hidden="true" className="relative col-start-1 row-span-2 row-start-1 flex justify-center sm:col-start-2 sm:row-span-1">
                  {index < entries.length - 1 && (
                    <span className="absolute top-[11px] -bottom-[11px] w-px bg-border sm:top-[17px] sm:-bottom-[17px]" />
                  )}
                  <span className={`relative mt-[7px] size-2.5 rounded-full border-2 sm:mt-[13px] ${entry.id === changelogEntries[0]?.id ? 'border-primary bg-primary' : 'border-border bg-background'}`} />
                </div>
                <article aria-labelledby={`changelog-${entry.id}`} className="col-start-2 row-start-2 pb-12 sm:col-start-3 sm:row-start-1 sm:pb-16">
                  <h3 id={`changelog-${entry.id}`} className="mb-2.5 scroll-mt-6 text-xl leading-[1.6] font-semibold tracking-[-0.025em]">
                    {entry.title}
                  </h3>
                  <ul aria-label="涉及平台" className="mb-4 flex list-none flex-wrap gap-1.5 p-0">
                    {entry.platforms.map((platform) => (
                      <li key={platform}><Badge className="rounded-md px-2 text-[11px]">{platform}</Badge></li>
                    ))}
                  </ul>
                  <ul className="list-disc space-y-1.5 pl-[18px] text-sm leading-[1.8] text-foreground/75 marker:text-muted-foreground/70">
                    {entry.changes.map((change) => <li key={change} className="pl-0.5">{change}</li>)}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
