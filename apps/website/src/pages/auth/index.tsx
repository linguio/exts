import { useEffect, useState } from 'react';
import { createAuthClient } from '@neon/auth';
import { BetterAuthVanillaAdapter } from '@neon/auth/vanilla';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { authorizationRequest, issuer, readLoginStart, readLogoutReturn } from './requests';

const client = createAuthClient(issuer, { adapter: BetterAuthVanillaAdapter() });

/** 原始查询由 Neon 校验签名；页面只展示申请内容，不把客户端名称视为可信身份。 */
export function AuthPage() {
  const consent = location.pathname.startsWith('/auth/consent');
  const signOut = location.pathname.startsWith('/auth/sign-out');
  const query = new URLSearchParams(location.search);
  const clientId = query.get('client_id');
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [clientName, setClientName] = useState('');
  const [provider, setProvider] = useState<'github' | 'google'>('github');
  const providerName = provider === 'google' ? 'Google' : 'GitHub';

  useEffect(() => {
    let active = true;
    async function initialize() {
      if (signOut) {
        const redirect = readLogoutReturn(location.hash);
        const result = await client.signOut();
        if (result.error) throw new Error('Neon 会话注销失败，请重试');
        const session = await client.getSession();
        if (session.error || session.data?.user) throw new Error('无法确认 Neon 会话已结束，请重试');
        location.replace(redirect);
        return;
      }
      if (!consent) {
        const start = readLoginStart(location.hash);
        if (start) {
          sessionStorage.setItem('exts:login-provider', start.provider);
          location.replace(start.url);
          return;
        }
        setProvider(sessionStorage.getItem('exts:login-provider') === 'google' ? 'google' : 'github');
      }
      if (!clientId || !query.get('redirect_uri')) throw new Error('请从 Exts 插件发起登录，不要直接打开此页面');
      const session = await client.getSession();
      if (session.error) throw new Error('无法读取登录状态，请重试');
      if (!active) return;
      if (!consent && session.data?.user) {
        location.assign(await authorizationRequest('continue', location.search.slice(1), location.href));
        return;
      }
      if (consent) {
        const response = await fetch(`${issuer}/oauth2/public-client?${new URLSearchParams({ client_id: clientId! })}`, { credentials: 'include', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(15_000) });
        if (!response.ok) throw new Error('无法确认申请授权的客户端，请从插件重新发起');
        const data = await response.json();
        if (active) setClientName(typeof data.client_name === 'string' ? data.client_name : clientId!);
      }
      if (active) setReady(true);
    }
    void initialize().catch(failure => { if (active) setError(failure instanceof Error ? failure.message : '无法读取授权请求'); });
    return () => { active = false; };
  }, []);

  async function submit(accept?: boolean) {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      location.assign(await authorizationRequest(consent ? 'consent' : 'sign-in', location.search.slice(1), location.href, accept, provider));
    } catch {
      setError('认证请求失败，请重试；如已超时，请从插件重新发起');
      setPending(false);
    }
  }

  let destination = '';
  try { destination = new URL(query.get('redirect_uri') || '').host; } catch { /* 无效地址由初始化错误阻止操作。 */ }
  const title = signOut ? '正在退出 Exts' : consent ? '确认授权' : '登录 Exts';
  const description = signOut ? '正在结束登录会话' : consent ? '请确认这次插件授权请求' : `使用 ${providerName} 账号继续`;
  return <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4 text-foreground">
    <section aria-labelledby="auth-title" className="flex h-[min(460px,calc(100dvh-2rem))] min-h-0 w-full max-w-[520px] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <header className="border-b border-border px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">EXTS / ACCOUNT</p>
        <h1 id="auth-title" className="mt-3 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-6 py-5 text-sm">
          {signOut ? <p role={error ? 'alert' : 'status'} className={error ? 'text-destructive' : 'text-muted-foreground'}>{error || '正在结束登录会话…'}</p> : consent ? <>
            <dl className="space-y-3 rounded-md border border-border p-4">
              <AuthDetail label="客户端" value={clientName || clientId || '未指定'} />
              <AuthDetail label="授权结果发送至" value={destination || '无效地址'} />
              <AuthDetail label="申请权限" value={query.get('scope') || '未指定'} />
              <AuthDetail label="资源" value={query.getAll('resource').join('、') || '未指定'} />
            </dl>
            <p className="text-muted-foreground">仅在你从可信插件发起此操作时允许。客户端名称由申请方提供。</p>
            {['localhost', '127.0.0.1', '[::1]'].some(host => destination === host || destination.startsWith(`${host}:`)) ? <p role="alert" className="text-destructive">回调位于本机地址，请确认发起授权的是你信任的应用。</p> : null}
          </> : <p className="text-muted-foreground">登录完成后将继续插件授权。你可以在 {providerName} 页面选择要使用的账号。</p>}
          {!signOut && error ? <p role="alert" className="text-destructive">{error}</p> : null}
          {!signOut && !ready && !error ? <p role="status" className="text-muted-foreground">正在读取授权请求…</p> : null}
        </div>
      </ScrollArea>
      {!signOut ? <footer className="flex gap-3 border-t border-border px-6 py-4">
        {consent ? <>
          <Button className="flex-1" disabled={!ready || pending} onClick={() => { void submit(true); }}>{pending ? '处理中…' : '允许'}</Button>
          <Button className="flex-1" variant="outline" disabled={!ready || pending} onClick={() => { void submit(false); }}>拒绝</Button>
        </> : <Button className="w-full" disabled={!ready || pending} onClick={() => { void submit(); }}>{pending ? '正在跳转…' : `使用 ${providerName} 登录`}</Button>}
      </footer> : null}
    </section>
  </main>;
}

function AuthDetail({ label, value }: { label: string; value: string }) {
  return <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-1 break-all font-medium">{value}</dd>
  </div>;
}
