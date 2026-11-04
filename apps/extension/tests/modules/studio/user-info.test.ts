import { expect, it, vi } from 'vitest';
import { mergeUserInfo, readUserInfo } from '../../../src/modules/studio/services/user-info';

it('用户信息补上头像、昵称和邮箱，主体不一致时不覆盖', () => {
  expect(mergeUserInfo({ sub: 'user-1' }, { sub: 'user-1', name: 'Ada', email: 'ada@example.com', picture: 'https://example.com/a.png' })).toEqual({
    sub: 'user-1', name: 'Ada', email: 'ada@example.com', picture: 'https://example.com/a.png',
  });
  expect(mergeUserInfo({ sub: 'user-1', name: 'Ada' }, { sub: 'other', name: 'Eve' })).toEqual({ sub: 'user-1', name: 'Ada' });
});

it('读取用户信息时省略网页 Cookie，失败不回显访问令牌', async () => {
  const fetchImpl = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ sub: 'user-1' }), { status: 200 }));
  await readUserInfo('https://auth.example/userinfo', 'access-token-value', fetchImpl);
  const init = fetchImpl.mock.calls[0]?.[1];
  expect(init?.credentials).toBe('omit');
  expect(init?.headers).toMatchObject({ Authorization: 'Bearer access-token-value' });
  fetchImpl.mockResolvedValueOnce(new Response(null, { status: 401 }));
  await expect(readUserInfo('https://auth.example/userinfo', 'access-token-value', fetchImpl)).rejects.toThrow('无法读取用户信息');
});
