/** 单个卡片的截止时间模型，不包含存储、浏览器 API 或调度。 */
export class Countdown {
  private deadline: number | null = null;
  private remainingMs = 0;

  select(minutes: number) {
    const selected = Number.isFinite(minutes) ? Math.min(60, Math.max(0, Math.round(minutes / 5) * 5)) : 0;
    this.deadline = null;
    this.remainingMs = selected * 60_000;
    return this.remainingMs;
  }

  start(minutes: number, now: number) {
    this.select(minutes);
    this.deadline = this.remainingMs > 0 ? now + this.remainingMs : null;
    return this.remainingMs;
  }

  sample(now: number) {
    if (this.deadline === null) return { remainingMs: this.remainingMs, completed: false };
    this.remainingMs = Math.max(0, this.deadline - now);
    const completed = this.remainingMs === 0;
    if (completed) this.deadline = null;
    return { remainingMs: this.remainingMs, completed };
  }
}
