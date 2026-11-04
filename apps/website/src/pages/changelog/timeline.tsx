import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { changelogEntries } from './data';

const entriesByYear = new Map<string, typeof changelogEntries>();
for (const entry of changelogEntries) {
  const year = entry.date.slice(0, 4);
  entriesByYear.set(year, [...(entriesByYear.get(year) ?? []), entry]);
}

function YearTimeline({ year, entries }: { year: string; entries: typeof changelogEntries }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  const [month, setMonth] = useState(entries[0]?.date.slice(5, 7) ?? '');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const top = (document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0) + 24;
      const bounds = section.getBoundingClientRect();
      setStuck(bounds.top < top && bounds.bottom > top + 40);

      let visibleMonth = entries[0]?.date.slice(5, 7) ?? '';
      for (const item of section.querySelectorAll<HTMLElement>('[data-changelog-month]')) {
        if (item.getBoundingClientRect().top > top + 64) break;
        visibleMonth = item.dataset.changelogMonth ?? visibleMonth;
      }
      setMonth(visibleMonth);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [entries]);

  return (
    <section ref={sectionRef} aria-labelledby={`changelog-year-${year}`} className="sm:grid sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-x-5">
      <h2 id={`changelog-year-${year}`} className="sticky top-[calc(var(--site-header-offset)+24px)] z-10 mb-6 w-fit self-start bg-background text-xl leading-8 font-medium text-foreground sm:mb-0">
        <Button asChild variant="ghost" className="-ml-2 h-10 px-2 text-xl leading-8 font-medium text-foreground active:scale-95 active:bg-accent">
          <a href={`#changelog-${entries[0].id}`} aria-label={`返回 ${year} 年第一条更新`}>
            {year}
          </a>
        </Button>
        <span aria-hidden={!stuck} className={`absolute left-0 top-10 block h-5 bg-background text-sm leading-5 text-muted-foreground ${stuck ? 'opacity-100' : 'opacity-0'}`}>
          {Number(month)} 月
        </span>
      </h2>
      <ol aria-label={`${year} 年更新`} className="m-0 list-none p-0">
        {entries.map((entry, index) => (
          <li key={entry.id} data-changelog-month={entry.date.slice(5, 7)} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[64px_20px_minmax(0,1fr)] sm:gap-x-5">
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
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 id={`changelog-${entry.id}`} className="site-anchor min-w-0 break-words text-xl leading-8 font-semibold tracking-[-0.025em]">
                  {entry.title}
                </h3>
                {entry.groups.map((group) => (
                  <Badge key={group.platform} className="shrink-0 rounded-md px-2 py-0.5 text-xs leading-[18px]">{group.platform}</Badge>
                ))}
              </div>
              <ul className="list-disc space-y-2 pl-[18px] text-sm leading-6 text-foreground marker:text-muted-foreground">
                {entry.groups.flatMap((group) => group.changes.map((change) => (
                  <li key={`${group.platform}-${change}`} className="pl-0.5">{change}</li>
                )))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ChangelogTimeline() {
  return (
    <div aria-label="更新时间线" className="space-y-6">
      {Array.from(entriesByYear, ([year, entries]) => <YearTimeline key={year} year={year} entries={entries} />)}
    </div>
  );
}
