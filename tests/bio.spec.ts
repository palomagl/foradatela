import { test, expect } from './fixtures';

const sites: Record<string,string> = {
  'Stopou!':'https://jogostop-rabisco.vercel.app/',
  'Ritmo':'https://ritmo-tau-inky.vercel.app/',
  'Minha Rotina':'https://dashboard-three-khaki-68.vercel.app/',
  'Karoane':'https://karoane.vercel.app/',
  'Minhas Finanças':'https://minhas-financas-9v4l.vercel.app/',
  'DOE+ RS':'https://doe-mais-rs.vercel.app/login',
  'Bruto':'https://borapedir-delivery.vercel.app/bruto'
};

test('9 apps, icons and social links',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/fora da tela/})).toBeVisible();
  await expect(page.getByRole('button',{name:/^Conhecer /})).toHaveCount(9);
  await expect(page.locator('.app-icon img')).toHaveCount(7);
  await expect(page.getByRole('link',{name:'GitHub'})).toHaveAttribute('href','https://github.com/palomagl');
  await expect(page.getByRole('link',{name:'LinkedIn'})).toHaveAttribute('href','https://www.linkedin.com/in/palomagl');
  for(const img of await page.locator('.app-icon img').all()){
    expect(await img.evaluate((x:HTMLImageElement)=>x.complete && x.naturalWidth>0)).toBe(true);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('7 real projects open with correct destinations and screenshots stay inside gallery',async({page})=>{
  test.setTimeout(90000);
  await page.goto('/');
  for(const [project,url] of Object.entries(sites)){
    await page.getByRole('button',{name:'Conhecer '+project,exact:true}).click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(600); // Let the entrance transition finish before measuring image bounds.
    await expect(dialog.locator('a.cta')).toHaveAttribute('href',url);
    const area=await dialog.locator('.gallery.gallery-dual').boundingBox();
    expect(area).not.toBeNull();
    const images=dialog.locator('.gallery.gallery-dual .dual-phone img');
    await expect(images).toHaveCount(2);
    for(const img of await images.all()){
      await expect(img).toBeVisible();
      expect(await img.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
      const box=await img.boundingBox();expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(area!.x-2);
      expect(box!.x+box!.width).toBeLessThanOrEqual(area!.x+area!.width+2);
      expect(box!.y).toBeGreaterThanOrEqual(area!.y-2);
      expect(box!.y+box!.height).toBeLessThanOrEqual(area!.y+area!.height+2);
    }
    await page.getByRole('button',{name:'Fechar projeto'}).click();
    await expect(dialog).not.toBeVisible();
  }
});

test('unpublished apps have no dead external links',async({page})=>{
  await page.goto('/');
  for(const project of ['Barbearia','Vértice']){
    await page.getByRole('button',{name:'Conhecer '+project}).click();
    await expect(page.getByRole('dialog')).toContainText('Link disponível em breve');
    await expect(page.getByRole('dialog').locator('a.cta')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
});

test('device theme and manual choice persist on reload',async({page})=>{
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.goto('/');
  const toggle=page.getByRole('button',{name:'Alternar tema claro e escuro'});
  await expect(toggle).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme','system');
  expect(await page.locator('html').evaluate(x=>getComputedStyle(x).colorScheme)).toContain('dark');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.getByRole('button',{name:'Alternar tema claro e escuro'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('liquid glass fallback remains functional without WebGL',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,...args:Parameters<typeof original>){
      if(String(args[0]).includes('webgl'))return null;
      return original.apply(this,args);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.locator('.fluid-scene')).toBeVisible();
  await expect(page.locator('.fluid-blob')).toHaveCount(3);
  await expect(page.locator('.liquid-glass-canvas')).toHaveCount(1);
  await page.getByRole('button',{name:'Conhecer Stopou!'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Conhecer Stopou!'})).toBeFocused();
});
