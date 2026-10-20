import { site } from '@/config/site';

export function QuickStart() {
  return (
    <>
      <article>
        <h2 className="site-section-title">Extension</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-foreground">
          <li>
            <a href={site.chromeDownloadUrl} className="site-resource-link">下载浏览器扩展 ZIP</a>，解压到一个固定文件夹。
          </li>
          <li>在 Chrome 地址栏输入 <code>chrome://extensions</code>。</li>
          <li>开启“开发者模式”，点击“加载已解压的扩展程序”。</li>
          <li>打开新标签页，开始使用 Exts。</li>
        </ol>
        <p className="mt-3 text-sm leading-6 text-foreground">安装后请保留解压文件夹，移动或删除它会影响扩展加载；开发者模式也需保持开启。</p>
      </article>
      <article>
        <h2 className="site-section-title">Desktop</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-foreground">
          <li><a href={site.macDownloadUrl} className="site-resource-link">下载 macOS DMG</a>，双击打开安装镜像。</li>
          <li>将 Exts 拖入 Applications（应用程序），等待复制完成。</li>
          <li>从“应用程序”中打开 Exts，安装完成后可推出磁盘镜像。</li>
        </ol>
        <h3 className="mb-2 mt-4 text-sm font-medium leading-6 text-foreground">首次打开授权</h3>
        <p className="text-sm leading-6 text-foreground">这是我个人开发的应用，未进行应用公证。首次打开时需要手动允许。</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-foreground">
          <li>先尝试打开 Exts，再进入“系统设置 → 隐私与安全性”。</li>
          <li>向下找到 Exts 的拦截提示，点击“仍要打开”，按系统提示完成授权并确认“打开”。</li>
        </ol>
      </article>
    </>
  );
}
