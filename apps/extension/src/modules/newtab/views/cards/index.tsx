import { CheckInCard } from './check-in/index';

/** 右侧卡片区域只组合卡片，具体内容与操作由各自目录持有。 */
export function NewtabCards() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <CheckInCard />
    </div>
  );
}
