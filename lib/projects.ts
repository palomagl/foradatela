export type Project = { id: string; name: string; icon?: string; headline?: string; url?: string; screenshots: string[] };
export const projects: Project[] = [
  { id: 'stopou', name: 'Stopou!', icon: '/projects/stopou.png', headline: 'Quem vai gritar STOP primeiro?', url: 'https://jogostop-rabisco.vercel.app/', screenshots: ['/projects/stopou-preview.png'] },
  { id: 'ritimo', name: 'Ritmo', icon: '/projects/ritimo.png', url: 'https://ritmo-tau-inky.vercel.app/', screenshots: [], headline: 'Descubra o Ritmo.' },
  { id: 'rotina', name: 'Minha Rotina', url: 'https://dashboard-three-khaki-68.vercel.app/', icon: '/projects/rotina.png', screenshots: ['/projects/rotina-preview.png'], headline: 'Sua rotina, no seu ritmo.' },
  { id: 'karoane', name: 'Karoane', url: 'https://karoane.vercel.app/', icon: '/projects/karoane.png', headline: 'Papelaria, bazar e muito mais.', screenshots: ['/projects/karoane-preview.png'] },
  { id: 'financas', name: 'Minhas Finanças', url: 'https://minhas-financas-9v4l.vercel.app/', icon: '/projects/financas.png', screenshots: ['/projects/financas-preview.png'], headline: 'Suas finanças mais claras.' },
  { id: 'doe', name: 'DOE+ RS', url: 'https://doe-mais-rs.vercel.app/login', icon: '/projects/doe.png', screenshots: ['/projects/doe-preview.png'], headline: 'Uma doação faz a diferença.' },
  { id: 'bruto', name: 'Bruto', url: 'https://borapedir-delivery.vercel.app/bruto', icon: '/projects/bruto.png', screenshots: ['/projects/bruto-preview.png'], headline: 'Seu próximo pedido começa aqui.' },
  { id: 'barbearia', name: 'Barbearia', screenshots: [], headline: 'Seu próximo corte, sem complicação.' },
  { id: 'vertice', name: 'Vértice', screenshots: [], headline: 'Seu espaço começa com uma ideia.' },
];
export const profile = { name: 'Paloma', github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/palomagl', linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL, email: process.env.NEXT_PUBLIC_EMAIL };

