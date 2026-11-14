import { Button } from '../../../components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../components/ui/empty';
import { UiIcon } from '../../../components/custom/ui-icon';
import { LoginDialog } from './login-dialog';

interface LoginRequiredProps {
  isPending: boolean;
  onRefetch: () => Promise<void>;
}

/** 未登录时显示的独立 Studio 登录页，登录流程复用已有账户对话框。 */
export function LoginRequired({ isPending, onRefetch }: LoginRequiredProps) {
  return <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon"><UiIcon name="user-round" className="size-6" /></EmptyMedia>
      <EmptyTitle>Sign in to Studio</EmptyTitle>
      <EmptyDescription>Sign in to access your personal workspace.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent><LoginDialog isPending={isPending} refetch={onRefetch}><Button type="button">Sign in</Button></LoginDialog></EmptyContent>
  </Empty>;
}
