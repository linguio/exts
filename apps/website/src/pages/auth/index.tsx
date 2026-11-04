import { useEffect, useState } from 'react';
import { createAuthClient } from '@neon/auth';
import { BetterAuthVanillaAdapter } from '@neon/auth/vanilla';
import { Button } from '@/shared/ui/button';
import { authorizationRequest, issuer } from './requests';

const client = createAuthClient(issuer, { adapter: BetterAuthVanillaAdapter() });

/** 原始查询由 Neon 校验签名；页面只展示申请内容，不把客户端名称视为可信身份。 */
export function AuthPage() {
  const consent = location.pathname.startsWith('/auth/consent');
  const query = new URLSearchParams(location.search);
  const clientId = query.get('client_id');
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    let active = true;
    async function initialize() {
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
      location.assign(await authorizationRequest(consent ? 'consent' : 'sign-in', location.search.slice(1), location.href, accept));
    } catch {
      setError('认证请求失败，请重试；如已超时，请从插件重新发起');
      setPending(false);
    }
  }

  let destination = '';
  try { destination = new URL(query.get('redirect_uri') || '').host; } catch { /* 无效地址由初始化错误阻止操作。 */ }
  return <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 p-6">
    <h1 className="text-2xl font-semibold">{consent ? '确认授权' : '登录 Exts'}</h1>
    {consent ? <>
      <p>客户端：{clientName || clientId}</p>
      <p className="break-all">授权结果将发送至：{destination || '无效地址'}</p>
      <p className="break-all">申请权限：{query.get('scope') || '未指定'}</p>
      <p className="break-all">资源：{query.getAll('resource').join('、') || '未指定'}</p>
      <p>仅在你从可信插件发起此操作时允许。客户端名称由申请方提供。</p>
      {['localhost', '127.0.0.1', '[::1]'].some(host => destination === host || destination.startsWith(`${host}:`)) ? <p role="alert">回调位于本机地址，请确认发起授权的是你信任的应用。</p> : null}
    </> : <p>使用 GitHub 登录，完成后继续插件授权。</p>}
    {error ? <p role="alert">{error}</p> : null}
    {!ready && !error ? <p role="status">正在读取授权请求…</p> : null}
    {consent ? <div className="flex gap-3">
      <Button disabled={!ready || pending} onClick={() => { void submit(true); }}>允许</Button>
      <Button variant="outline" disabled={!ready || pending} onClick={() => { void submit(false); }}>拒绝</Button>
    </div> : <Button disabled={!ready || pending} onClick={() => { void submit(); }}>使用 GitHub 登录</Button>}
  </main>;
}
