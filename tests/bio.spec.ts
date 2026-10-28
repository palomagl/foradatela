import { test, expect } from './fixtures';

test('composição espacial, grade e painéis reais', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Conhecer / })).toHaveCount(9);
  await expect(page.locator('.app-icon img')).toHaveCount(7);
  await expect(page.locator('h1')).toHaveClass('sr-only');
  const scene = await page.locator('.orbital-scene').boundingBox();
  const viewport = page.viewportSize()!;
  expect(scene?.width).toBe(viewport.width);
  expect(scene?.height).toBe(viewport.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Conhecer Stopou!' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Quem vai gritar STOP primeiro?' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jogar agora' })).toHaveAttribute('href', 'https://jogostop-rabisco.vercel.app/');
  await expect(page.getByAltText('Tela real de Stopou!, 1')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Conhecer Stopou!' })).toBeFocused();
  await page.getByRole('button', { name: 'Conhecer Karoane' }).click();
  await expect(page.getByRole('heading', { name: 'Papelaria, bazar e muito mais.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explorar loja' })).toHaveAttribute('href', 'https://karoane.vercel.app/');
  await page.getByRole('button', { name: 'Fechar projeto' }).click();
  expect(errors).toEqual([]);
});

test('tema segue o sistema e persiste após recarregar', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Tema: sistema/ })).toBeVisible();
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme)).toBe('dark');
  await page.getByRole('button', { name: /Tema:/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: /Tema:/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /Tema:/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'system');
  for (const img of await page.locator('.app-icon img').all()) {
    await expect(img).toBeVisible();
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test('fallback preserva a Terra quando WebGL está indisponível', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.locator('.orbital-scene')).toHaveCSS('background-image', /earth-orbit.webp/);
  await page.getByRole('button', { name: 'Conhecer Stopou!' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});


