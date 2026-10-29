export type Project = { id: string; name: string; icon?: string; headline?: string; url?: string; showcase?: string; screenshots: string[] };
export const projects: Project[] = [
  { id: 'stopou', name: 'Stopou!', icon: '/projects/stopou.png', headline: 'Quem vai gritar STOP primeiro?', showcase: '/projects/stopou/showcase.webp', url: 'https://jogostop-rabisco.vercel.app/', screenshots: ['/projects/stopou/screen-01.png', '/projects/stopou/screen-02.png'] },
  { id: 'ritimo', name: 'Ritmo', icon: '/projects/ritimo.png', showcase: '/projects/ritimo/showcase.webp', url: 'https://ritmo-tau-inky.vercel.app/', screenshots: ['/projects/ritimo/screen-01.png', '/projects/ritimo/screen-02.png'], headline: 'Uma foto. Uma estimativa de calorias.' },
  { id: 'rotina', name: 'Minha Rotina', url: 'https://dashboard-three-khaki-68.vercel.app/', icon: '/projects/rotina.png', showcase: '/projects/rotina/showcase.webp?v=approved-20261029', screenshots: ['/projects/rotina/screen-01.webp', '/projects/rotina/screen-02.webp'], headline: 'Mandou no Telegram? Tá anotado.' },
  { id: 'karoane', name: 'Karoane', url: 'https://karoane.vercel.app/', icon: '/projects/karoane.png', showcase: '/projects/karoane/showcase.webp?v=approved-20261029', headline: 'Papelaria, bazar e muito mais.', screenshots: ['/projects/karoane/screen-01.png', '/projects/karoane/screen-02.png'] },
  { id: 'financas', name: 'Minhas Finanças', url: 'https://minhasfinancas-steel-five.vercel.app/', icon: '/projects/financas.png', showcase: '/projects/financas/showcase.webp?v=verde-20261029', screenshots: ['/projects/financas/screen-01.png', '/projects/financas/screen-02.png'], headline: 'Suas despesas sob controle, sozinho ou em família.' },
  { id: 'doe', name: 'DOE+ RS', url: 'https://doe-mais-rs.vercel.app/login', icon: '/projects/doe.png', showcase: '/projects/doe/showcase.webp?v=approved-20261029', screenshots: ['/projects/doe/screen-01.png', '/projects/doe/screen-02.png'], headline: 'Doe sangue. Saiba onde começar.' },
  { id: 'bruto', name: 'Bruto', url: 'https://borapedir-delivery.vercel.app/bruto', icon: '/projects/bruto.png', showcase: '/projects/bruto/showcase.webp?v=approved-20261029', screenshots: ['/projects/bruto/screen-01.png', '/projects/bruto/screen-02.png'], headline: 'Deu fome? Conheça o Bruto.' },
  { id: 'barbearia', name: 'Barbearia', screenshots: [], headline: 'Seu próximo corte, sem complicação.' },
  { id: 'vertice', name: 'Vértice', screenshots: [], headline: 'Seu espaço começa com uma ideia.' },
];
export const profile = { name: 'Paloma', github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/palomagl', linkedin: 'https://www.linkedin.com/in/palomagl', email: process.env.NEXT_PUBLIC_EMAIL };

