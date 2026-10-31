import { site } from '@/shared/config/site';

export function ApiOverview() {
  return (
    <article>
      <h2 className="site-section-title">API</h2>
      <p className="text-sm leading-6 text-foreground">API 提供后端接口与数据访问，使用 FastAPI 开发，部署在 Vercel，数据存储在 Neon PostgreSQL。推送 main 后由 Vercel 自动部署。</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-foreground">
        <li>打开<a href={site.apiDocsUrl} target="_blank" rel="noopener noreferrer" className="site-resource-link">接口文档</a>，查看接口说明与请求示例。</li>
        <li>调试受保护的接口时，在认证栏填写自己的访问令牌，再发送请求；仅填令牌值，无需 Bearer 前缀。</li>
      </ol>
      <h3 className="mb-2 mt-4 text-sm font-medium leading-6 text-foreground">本地开发</h3>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-foreground">
        <li>按照 <a href={`${site.githubUrl}/blob/main/apps/api/README.md`} target="_blank" rel="noopener noreferrer" className="site-resource-link">API README</a> 准备 Python 环境与依赖。</li>
        <li>在 <code>apps/api/.env.local</code> 中配置池化数据库连接 <code>DATABASE_URL</code> 与独立随机的 <code>API_ACCESS_TOKEN</code>，变量模板见 <code>apps/api/.env.example</code>。</li>
        <li>在仓库根目录运行 <code>pnpm api:dev</code>，打开 <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="site-resource-link">本地接口文档</a>，使用本地配置的令牌测试。</li>
      </ol>
      <p className="mt-3 text-sm leading-6 text-foreground">数据库连接与访问令牌只配置在 API 服务端，不写入官网或客户端代码。环境准备、接口验证与部署细节见 API README。</p>
    </article>
  );
}
