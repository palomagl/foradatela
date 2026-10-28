import { test as base, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Optional offline transport for the exact production HTML, JS, CSS and assets.
// No substitute UI or mocked React logic: only the HTTP transport is replaced.
// This allows browser QA where listening on localhost is unavailable.
export const test = base.extend({
  page: async ({ page }, use) => {
    if (process.env.PLAYWRIGHT_OFFLINE === '1') {
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'foradatela.test') {
          await route.abort();
          return;
        }
        const pathname = decodeURIComponent(url.pathname);
        const root = pathname.startsWith('/_next/static/') ? path.resolve('.next/static') : path.resolve('public');
        const relative = pathname.startsWith('/_next/static/') ? pathname.slice('/_next/static/'.length) : pathname.slice(1);
        const file = pathname === '/' ? path.resolve('.next/server/app/index.html') : path.resolve(root, relative);
        if (pathname !== '/' && !file.startsWith(root + path.sep)) { await route.abort(); return; }
        const type: Record<string,string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
        try { await route.fulfill({status:200,contentType:type[path.extname(file)] || 'application/octet-stream',body:await readFile(file)}); }
        catch { await route.fulfill({status:404,body:'Not found'}); }
      });
    }
    await use(page);
  },
});
export { expect };
