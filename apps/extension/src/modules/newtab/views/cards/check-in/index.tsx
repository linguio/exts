import { Card } from '../../../../../shared/ui/card';

/** 本期仅提供打卡卡片外框，后续内容与编辑能力在此目录内拆分。 */
export function CheckInCard() {
  return (
    <Card
      aria-label="打卡卡片占位"
      className="box-border h-[var(--size-bookmark-folder)] w-full shrink-0 rounded-[var(--radius)] p-4 shadow-none"
    />
  );
}
