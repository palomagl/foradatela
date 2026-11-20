import { test, expect } from './fixtures';

const sites: Record<string,string> = {
  'Stopou!':'https://jogostop-rabisco.vercel.app/',
  'Ritmo':'https://ritmo-tau-inky.vercel.app/',
  'Minha Rotina':'https://dashboard-three-khaki-68.vercel.app/',
  'Karoane':'https://karoane.vercel.app/',
  'Minhas Finanças':'https://minhasfinancas-steel-five.vercel.app/',
  'DOE+ RS':'https://doe-mais-rs.vercel.app/login',
  'Bruto':'https://borapedir-delivery.vercel.app/bruto',
  'ROXO':'https://roxo-acaiteria.vercel.app/roxo',
  'Vértice':'https://vertice-marmores.vercel.app/'
};

test('8 visible apps, more projects, icons and social links',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/fora da tela/})).toBeVisible();
  await expect(page.getByRole('button',{name:/^Conhecer /})).toHaveCount(8);
  await expect(page.getByRole('button',{name:'Ver mais projetos'})).toBeVisible();
  await page.getByRole('button',{name:'Ver mais projetos'}).click();
  await expect(page.getByRole('button',{name:'Conhecer Barbearia'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Conhecer Vértice'})).toBeVisible();
  await page.getByRole('button',{name:'Ver menos'}).click();
  await expect(page.locator('.app-icon img')).toHaveCount(8);
  await expect(page.getByRole('link',{name:'GitHub'})).toHaveAttribute('href','https://github.com/palomagl');
  await expect(page.getByRole('link',{name:'LinkedIn'})).toHaveAttribute('href','https://www.linkedin.com/in/palomagl');
  for(const img of await page.locator('.app-icon img').all()){
    expect(await img.evaluate((x:HTMLImageElement)=>x.complete && x.naturalWidth>0)).toBe(true);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('9 published projects open with correct destinations and presentations stay inside gallery',async({page})=>{
  test.setTimeout(90000);
  await page.goto('/');
  for(const [project,url] of Object.entries(sites)){
    if(project==='Vértice') await page.getByRole('button',{name:'Ver mais projetos'}).click();
    await page.getByRole('button',{name:'Conhecer '+project,exact:true}).click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(600); // Let the entrance transition finish before measuring image bounds.
    await expect(dialog.locator('a.cta')).toHaveAttribute('href',url);
    await expect(dialog.getByRole('link',{name:'Ver código no GitHub'})).toHaveCount(0);
    if(['Stopou!','Ritmo','Minha Rotina','Karoane','Minhas Finanças','DOE+ RS','Bruto','ROXO','Vértice'].includes(project)){
      const presentation=dialog.locator('.project-showcase img');
      await expect(presentation).toBeVisible();
      expect(await presentation.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
      const canvas=await dialog.locator('.project-showcase').boundingBox();
      const image=await presentation.boundingBox();
      expect(canvas).not.toBeNull();expect(image).not.toBeNull();
      expect(image!.x).toBeGreaterThanOrEqual(canvas!.x-1);
      expect(image!.x+image!.width).toBeLessThanOrEqual(canvas!.x+canvas!.width+1);
      await dialog.locator('.project-showcase').click();
      await expect(dialog.getByRole('region',{name:'Apresentação ampliada de '+project})).toBeVisible();
      await dialog.getByRole('button',{name:'Fechar imagem ampliada'}).click();
      await expect(dialog.getByRole('region',{name:'Apresentação ampliada de '+project})).toHaveCount(0);
    }else{
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
    }
    await page.getByRole('button',{name:'Fechar projeto'}).click();
    await expect(dialog).not.toBeVisible();
  }
});

test('unpublished apps have no dead external links',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Ver mais projetos'}).click();
  for(const project of ['Barbearia']){
    await page.getByRole('button',{name:'Conhecer '+project}).click();
    await expect(page.getByRole('dialog')).toContainText('Projeto em preparação');
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
  if (test.info().project.name === 'desktop') {
    await expect(page.locator('.fluid-scene')).toBeHidden(); // Desktop uses a static, responsive atmosphere.
  } else {
    await expect(page.locator('.fluid-scene')).toBeVisible(); // Mobile keeps the original scene.
  }
  await expect(page.locator('.fluid-blob')).toHaveCount(3);
  await expect(page.locator('.liquid-glass-canvas')).toHaveCount(1);
  await page.getByRole('button',{name:'Conhecer Stopou!'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Conhecer Stopou!'})).toBeFocused();
});


test('desktop featured CTA links straight to the selected project, mobile still uses its sheet',async({page})=>{
  await page.goto('/');
  const stopou=page.getByRole('link',{name:'Conhecer projeto Stopou! diretamente'});
  if(test.info().project.name==='desktop'){
    await expect(stopou).toBeVisible();
    await expect(stopou).toHaveAttribute('href','https://jogostop-rabisco.vercel.app/');
    await page.getByRole('button',{name:'Conhecer Karoane'}).hover();
    const karoane=page.getByRole('link',{name:'Conhecer projeto Karoane diretamente'});
    await expect(karoane).toBeVisible();
    await expect(karoane).toHaveAttribute('href','https://karoane.vercel.app/');
    const stage=page.locator('.desktop-stage-render');
    const colors=new Set<string>();
    for(const name of ['Stopou!','Ritmo','Karoane','Minhas Finanças','Bruto','ROXO']){
      await page.getByRole('button',{name:'Conhecer '+name,exact:true}).hover();
      const screens=stage.locator('.studio-device-screen img');
      await expect(screens).toHaveCount(2);
      for(const screen of await screens.all()){
        await expect(screen).toBeVisible();
        await expect.poll(()=>screen.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
      }
      colors.add(await page.locator('.studio-plinth').evaluate(e=>getComputedStyle(e).backgroundImage));
      const phones=await stage.boundingBox();
      const cta=await page.locator('.desktop-feature-direct-link').boundingBox();
      expect(phones!.y+phones!.height).toBeLessThanOrEqual(cta!.y);
      for(const device of await stage.locator('.studio-device').all()){
        const bounds=await device.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(phones!.x);
        expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(phones!.x+phones!.width);
        expect(bounds!.y).toBeGreaterThanOrEqual(phones!.y);
        expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(cta!.y);
      }
    }
    expect(colors.size).toBe(1);
    await page.getByRole('button',{name:'Ver mais projetos'}).click();
    await page.getByRole('button',{name:'Conhecer Vértice',exact:true}).hover();
    await expect(page.locator('.studio-device')).toHaveCount(2);
    await expect(page.locator('.studio-plinth')).toBeVisible();
    const verticeScreens=page.locator('.studio-device-screen img');
    await expect(verticeScreens).toHaveCount(2);
    for(const screen of await verticeScreens.all()){
      await expect.poll(()=>screen.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
    }
    await expect(page.locator('.desktop-stage-artwork')).toHaveCount(0);
    expect(await page.locator('.studio-plinth').evaluate(e=>getComputedStyle(e).backgroundImage)).toBe([...colors][0]);
    await expect(page.getByRole('link',{name:'Conhecer projeto Vértice diretamente'})).toHaveAttribute('href',sites['Vértice']);
  }else{
    await expect(stopou).toBeHidden();
    await page.getByRole('button',{name:'Conhecer Stopou!'}).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  }
});
