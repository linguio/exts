/** 工作台主视图，本期只承载标题与空状态。 */
export function Studio() {
  return (
    <section className="grid min-h-0 min-w-0 grid-rows-[auto_1fr] gap-6" aria-label="Studio">
      <h1 className="text-lg font-semibold">Studio</h1>
      <div className="grid min-h-0 place-items-center text-sm text-muted-foreground">
        <p>No content yet</p>
      </div>
    </section>
  );
}
