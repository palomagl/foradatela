export type Project = { id: string; name: string; icon?: string; headline?: string; url?: string; screenshots: string[] };
export const projects: Project[] = [
  { id: 'stopou', name: 'Stopou!', icon: '/projects/stopou.png', headline: 'Quem vai gritar STOP primeiro?', url: 'https://jogostop-rabisco.vercel.app/', screenshots: ['/projects/stopou-preview.png', '/projects/stopou-preview-2.png'] },
  { id: 'ritimo', name: 'Ritmo', icon: '/projects/ritimo.png', url: 'https://ritmo-tau-inky.vercel.app/', screenshots: ['/projects/ritimo-preview.png', '/projects/ritimo-preview-2.png'], headline: 'Uma foto. Uma estimativa de calorias.' },
  { id: 'rotina', name: 'Minha Rotina', url: 'https://dashboard-three-khaki-68.vercel.app/', icon: '/projects/rotina.png', screenshots: ['/projects/rotina-preview.png', '/projects/rotina-preview-2.png'], headline: 'Mandou no Telegram? Tá anotado.' },
  { id: 'karoane', name: 'Karoane', url: 'https://karoane.vercel.app/', icon: '/projects/karoane.png', headline: 'Papelaria, bazar e muito mais.', screenshots: ['/projects/karoane-preview.png', '/projects/karoane-preview-2.png'] },
  { id: 'financas', name: 'Minhas Finanças', url: 'https://minhas-financas-9v4l.vercel.app/', icon: '/projects/financas.png', screenshots: ['/projects/financas-preview.png', '/projects/financas-preview-2.png'], headline: 'Organizar o dinheiro pode ser simples.' },
  { id: 'doe', name: 'DOE+ RS', url: 'https://doe-mais-rs.vercel.app/login', icon: '/projects/doe.png', screenshots: ['/projects/doe-preview.png', '/projects/doe-preview-2.png'], headline: 'Doe sangue. Saiba onde começar.' },
  { id: 'bruto', name: 'Bruto', url: 'https://borapedir-delivery.vercel.app/bruto', icon: '/projects/bruto.png', screenshots: ['/projects/bruto-preview.png', '/projects/bruto-preview-2.png'], headline: 'Deu fome? Conheça o Bruto.' },
  { id: 'barbearia', name: 'Barbearia', screenshots: [], headline: 'Seu próximo corte, sem complicação.' },
  { id: 'vertice', name: 'Vértice', screenshots: [], headline: 'Seu espaço começa com uma ideia.' },
];
export const profile = { name: 'Paloma', github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/palomagl', linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL, email: process.env.NEXT_PUBLIC_EMAIL };

